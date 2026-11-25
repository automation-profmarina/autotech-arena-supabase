/**
 * AUTOTECH ARENA - Controlador da Área Gamificada do Aluno & Motor de Desafios SCADA
 */
window.StudentUI = (function () {
  let currentStudent = null;
  let currentClass = null;
  let currentPin = null;
  let classLeaderboard = [];
  let attemptHistory = [];

  // Estado do Desafio Ativo
  let quizState = null;
  let timerInterval = null;

  function initSession(sessionPayload) {
    currentStudent = sessionPayload.student;
    currentClass = sessionPayload.class;
    currentPin = sessionPayload.pin;

    renderProfileHeader();
    renderAvatarPicker();
    renderModulesGrid();
    renderBadgesShowcase();
    loadStudentDataAndRealtime();
  }

  function destroySession() {
    stopTimer();
    window.SupabaseService.unsubscribeLeaderboard();
    currentStudent = null;
    currentClass = null;
    currentPin = null;
    classLeaderboard = [];
    attemptHistory = [];
  }

  async function loadStudentDataAndRealtime() {
    if (!currentStudent || !currentClass) return;

    try {
      const [leaderboard, history] = await Promise.all([
        window.SupabaseService.getPublicClassLeaderboard(currentClass.id),
        window.SupabaseService.getStudentHistory(currentStudent.id, currentPin)
      ]);
      classLeaderboard = leaderboard;
      attemptHistory = history;

      // Sincroniza dados mais recentes do próprio aluno
      const meInBoard = classLeaderboard.find((s) => s.id === currentStudent.id);
      if (meInBoard) {
        currentStudent = { ...currentStudent, ...meInBoard };
      }

      renderProfileHeader();
      renderBadgesShowcase();
      renderModulesGrid();
      renderLiveLeaderboard();
      renderHistoryTable();

      // Inscreve no canal Realtime da turma
      window.SupabaseService.subscribeToClassLeaderboard(currentClass.id, async () => {
        try {
          const updated = await window.SupabaseService.getPublicClassLeaderboard(currentClass.id);
          classLeaderboard = updated;
          renderProfileHeader();
          renderLiveLeaderboard(true);
        } catch (err) {
          console.warn("Falha ao atualizar ranking ao vivo:", err);
        }
      });
    } catch (err) {
      window.AutoTechApp.showToast(err.message, "error");
    }
  }

  function renderProfileHeader() {
    if (!currentStudent || !currentClass) return;

    const avatarEl = document.getElementById("student-avatar-display");
    if (avatarEl) avatarEl.innerHTML = window.AutoTechData.getAvatarSvg(currentStudent.avatar_id);

    document.getElementById("student-name-display").textContent = currentStudent.full_name;
    document.getElementById("student-class-badge").textContent =
      `${currentClass.name} (${currentClass.class_code})`;

    const xp = currentStudent.xp_total || 0;
    const level = currentStudent.level || 1;
    const xpInCurrentLevel = xp % 500;
    const pct = Math.min(100, Math.round((xpInCurrentLevel / 500) * 100));

    document.getElementById("student-level-badge").textContent = `NÍVEL ${level}`;
    document.getElementById("student-xp-total").textContent = `${xp.toLocaleString("pt-BR")} XP`;
    document.getElementById("student-xp-progress-text").textContent = `${xpInCurrentLevel} / 500 XP`;
    document.getElementById("student-xp-bar").style.width = `${pct}%`;

    const accuracy =
      currentStudent.total_answered > 0
        ? Math.round((currentStudent.correct_answers / currentStudent.total_answered) * 100)
        : 0;
    document.getElementById("student-stat-accuracy").textContent = `${accuracy}%`;
    document.getElementById("student-stat-quizzes").textContent = currentStudent.quizzes_completed || 0;
    document.getElementById("student-stat-streak").textContent = currentStudent.streak_best || 0;

    // Posição no ranking da turma
    const rankIdx = classLeaderboard.findIndex((s) => s.id === currentStudent.id);
    document.getElementById("student-stat-rank").textContent =
      rankIdx >= 0 ? `#${rankIdx + 1} de ${classLeaderboard.length}` : "-";
  }

  function renderAvatarPicker() {
    const container = document.getElementById("student-avatar-options");
    if (!container || !currentStudent) return;

    container.innerHTML = window.AutoTechData.AVATARS.map((av) => {
      const active = av.id === currentStudent.avatar_id;
      return `
        <button type="button" data-avatar-id="${av.id}"
          class="avatar-pick-btn p-2 rounded-xl border text-center transition ${
            active
              ? "border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-500/20"
              : "border-slate-700 bg-slate-900/70 hover:border-slate-500"
          }">
          <div class="w-10 h-10 mx-auto mb-1">${av.svg}</div>
          <span class="text-[10px] font-mono-tech text-slate-300 block truncate">${av.name}</span>
        </button>
      `;
    }).join("");

    container.querySelectorAll(".avatar-pick-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const chosenId = btn.dataset.avatarId;
        if (chosenId === currentStudent.avatar_id) return;
        try {
          await window.SupabaseService.updateStudentAvatar(currentStudent.id, currentPin, chosenId);
          currentStudent.avatar_id = chosenId;
          renderProfileHeader();
          renderAvatarPicker();
          window.AutoTechApp.showToast("Avatar operacional atualizado na nuvem!", "success");
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      });
    });
  }

  function renderBadgesShowcase() {
    const grid = document.getElementById("student-badges-grid");
    if (!grid || !currentStudent) return;

    const unlocked = Array.isArray(currentStudent.badges) ? currentStudent.badges : [];
    grid.innerHTML = window.AutoTechData.BADGE_CATALOG.map((b) => {
      const isUnlocked = unlocked.includes(b.id);
      return `
        <div class="p-3 rounded-xl border ${
          isUnlocked
            ? "border-amber-400/50 bg-amber-950/20"
            : "border-slate-800 bg-slate-900/40 opacity-50 grayscale"
        }">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">${b.icon}</span>
            <div>
              <div class="text-xs font-bold ${isUnlocked ? "text-amber-300" : "text-slate-400"}">${b.title}</div>
              <div class="text-[11px] text-slate-400 leading-snug">${b.desc}</div>
            </div>
          </div>
          <div class="mt-2 text-[10px] font-mono-tech uppercase ${
            isUnlocked ? "text-emerald-400" : "text-slate-500"
          }">
            ${isUnlocked ? "✓ CONQUISTADA" : "🔒 BLOQUEADA"}
          </div>
        </div>
      `;
    }).join("");
  }

  function renderModulesGrid() {
    const grid = document.getElementById("student-modules-grid");
    if (!grid) return;

    const completedModuleIds = new Set(attemptHistory.map((a) => a.module_id));

    const moduleCards = window.AutoTechData.MODULES.map((m) => {
      const done = completedModuleIds.has(m.id);
      const bestAttempt = attemptHistory
        .filter((a) => a.module_id === m.id)
        .sort((a, b) => b.accuracy_pct - a.accuracy_pct)[0];

      return `
        <div class="scada-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="px-2.5 py-1 rounded text-xs font-mono-tech font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                ${m.tag}
              </span>
              ${
                done
                  ? `<span class="px-2 py-0.5 rounded-full text-[11px] font-mono-tech bg-emerald-950 text-emerald-300 border border-emerald-500/30">✓ Concluído (${Math.round(bestAttempt.accuracy_pct)}%)</span>`
                  : `<span class="px-2 py-0.5 rounded-full text-[11px] font-mono-tech bg-slate-800 text-slate-400">Pendente</span>`
              }
            </div>
            <h3 class="font-display text-lg font-bold text-white mb-2">${m.title}</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">${m.description}</p>
          </div>
          <div class="pt-3 border-t border-slate-700/60 flex items-center justify-between">
            <span class="text-xs font-mono-tech text-amber-400">⏱ ${m.timePerQuestion}s / questão</span>
            <button type="button" data-start-module="${m.id}"
              class="start-module-btn px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
              ${done ? "Treinar Novamente" : "Iniciar Desafio"}
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Card Especial: Maratona Industrial
    const marathonCard = `
      <div class="rounded-2xl p-5 bg-gradient-to-br from-amber-950/50 via-slate-900 to-cyan-950/40 border border-amber-500/40 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-1 rounded text-xs font-mono-tech font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
              MARATONA-SCADA
            </span>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-mono-tech bg-amber-950 text-amber-300 border border-amber-500/30">
              +250 XP Bônus
            </span>
          </div>
          <h3 class="font-display text-lg font-bold text-amber-300 mb-2">Maratona Industrial Integrada</h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-4">
            10 desafios aleatórios misturando Portas Lógicas, CLP, Sensores, Variáveis Físicas, Pneumática e Motores Elétricos. Acerte ≥ 7 para ganhar bônus extra!
          </p>
        </div>
        <div class="pt-3 border-t border-amber-500/30 flex items-center justify-between">
          <span class="text-xs font-mono-tech text-cyan-300">⚡ 10 Questões Mistas</span>
          <button type="button" data-start-module="maratona"
            class="start-module-btn px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
            Iniciar Maratona
          </button>
        </div>
      </div>
    `;

    grid.innerHTML = moduleCards + marathonCard;

    grid.querySelectorAll(".start-module-btn").forEach((btn) => {
      btn.addEventListener("click", () => startChallenge(btn.dataset.startModule));
    });
  }

  function renderLiveLeaderboard(highlightChange = false) {
    const tbody = document.getElementById("student-leaderboard-body");
    if (!tbody) return;

    if (classLeaderboard.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400 text-sm">Nenhum aluno pontuou nesta turma ainda.</td></tr>`;
      return;
    }

    tbody.innerHTML = classLeaderboard
      .map((s, idx) => {
        const isMe = currentStudent && s.id === currentStudent.id;
        const acc =
          s.total_answered > 0 ? Math.round((s.correct_answers / s.total_answered) * 100) : 0;
        const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
        const badgesCount = Array.isArray(s.badges) ? s.badges.length : 0;

        return `
          <tr class="border-b border-slate-800/80 ${
            isMe ? "bg-cyan-950/40" : "hover:bg-slate-800/40"
          } ${highlightChange ? "rank-updated" : ""}">
            <td class="py-3 px-3 font-mono-tech font-bold text-sm ${
              idx < 3 ? "text-amber-400" : "text-slate-400"
            }">${medal}</td>
            <td class="py-3 px-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-slate-900 p-1 border border-slate-700 shrink-0">
                  ${window.AutoTechData.getAvatarSvg(s.avatar_id)}
                </div>
                <div>
                  <div class="font-semibold text-sm text-white">
                    ${s.full_name}
                    ${isMe ? '<span class="ml-1.5 px-1.5 py-0.5 text-[10px] rounded bg-cyan-500/20 text-cyan-300 font-mono-tech">VOCÊ</span>' : ""}
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono-tech">${badgesCount} medalha(s)</div>
                </div>
              </div>
            </td>
            <td class="py-3 px-3 font-mono-tech text-xs text-cyan-300">Nv. ${s.level}</td>
            <td class="py-3 px-3 font-mono-tech text-xs text-slate-300">${acc}%</td>
            <td class="py-3 px-3 font-mono-tech text-xs text-slate-400">${s.quizzes_completed}</td>
            <td class="py-3 px-3 text-right font-mono-tech font-bold text-sm text-emerald-400">
              ${s.xp_total.toLocaleString("pt-BR")} XP
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function renderHistoryTable() {
    const tbody = document.getElementById("student-history-body");
    if (!tbody) return;

    if (attemptHistory.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="py-6 text-center text-slate-400 text-sm">Você ainda não concluiu nenhum desafio. Escolha um módulo acima para começar!</td></tr>`;
      return;
    }

    tbody.innerHTML = attemptHistory
      .map((a) => {
        const dt = new Date(a.created_at).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
        return `
          <tr class="border-b border-slate-800/80 text-xs">
            <td class="py-2.5 px-3 font-mono-tech text-slate-400">${dt}</td>
            <td class="py-2.5 px-3 font-medium text-slate-200">${a.module_title}</td>
            <td class="py-2.5 px-3 font-mono-tech text-cyan-300">${a.correct_count}/${a.total_questions} (${Math.round(a.accuracy_pct)}%)</td>
            <td class="py-2.5 px-3 font-mono-tech text-slate-400">${a.duration_seconds}s</td>
            <td class="py-2.5 px-3 text-right font-mono-tech font-bold text-emerald-400">+${a.xp_earned} XP</td>
          </tr>
        `;
      })
      .join("");
  }

  // ==================== MOTOR DO DESAFIO GAMIFICADO ====================
  function startChallenge(moduleId) {
    const mod =
      moduleId === "maratona"
        ? {
            id: "maratona",
            title: "Maratona Industrial Integrada",
            timePerQuestion: 28
          }
        : window.AutoTechData.MODULES.find((m) => m.id === moduleId);

    if (!mod) return;

    const questions = window.AutoTechData.buildSessionQuestions(moduleId);

    quizState = {
      module: mod,
      questions,
      currentIndex: 0,
      correctCount: 0,
      streak: 0,
      streakMax: 0,
      startTimeMs: Date.now(),
      timeLeft: mod.timePerQuestion,
      answered: false,
      inspectMode: false,
      breakdown: []
    };

    document.getElementById("student-dashboard-view").classList.add("hidden");
    document.getElementById("student-result-view").classList.add("hidden");
    document.getElementById("student-arena-view").classList.remove("hidden");

    renderCurrentQuestion();
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderCurrentQuestion() {
    if (!quizState) return;
    stopTimer();

    const q = quizState.questions[quizState.currentIndex];
    const total = quizState.questions.length;

    quizState.answered = false;
    quizState.inspectMode = false;
    quizState.timeLeft = quizState.module.timePerQuestion;

    document.getElementById("arena-module-title").textContent = quizState.module.title;
    document.getElementById("arena-question-counter").textContent =
      `DESAFIO ${quizState.currentIndex + 1} DE ${total}`;
    document.getElementById("arena-streak-badge").textContent = `🔥 COMBO: ${quizState.streak}x`;

    document.getElementById("arena-context-text").textContent = q.context;
    document.getElementById("arena-objective-text").textContent = q.objective;
    document.getElementById("arena-question-text").textContent = q.question;

    // Diagrama SVG interativo
    const svgBox = document.getElementById("arena-svg-container");
    svgBox.innerHTML = q.svgNormal;
    const inspectBtn = document.getElementById("arena-inspect-btn");
    inspectBtn.textContent = "🔍 Inspecionar / Simular Sinal";
    inspectBtn.onclick = () => {
      quizState.inspectMode = !quizState.inspectMode;
      svgBox.innerHTML = quizState.inspectMode ? q.svgInspect : q.svgNormal;
      inspectBtn.textContent = quizState.inspectMode
        ? "↩ Voltar ao Estado Inicial"
        : "🔍 Inspecionar / Simular Sinal";
      window.AutoTechApp.playTone("click");
    };

    // Alternativas embaralhadas
    const letters = ["A", "B", "C", "D"];
    const optsContainer = document.getElementById("arena-options-container");
    optsContainer.innerHTML = q.shuffledOptions
      .map(
        (opt, idx) => `
      <button type="button" data-opt-idx="${idx}"
        class="arena-opt-btn w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-900/80 hover:border-cyan-400 hover:bg-slate-800/90 transition flex items-start gap-3 cursor-pointer">
        <span class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center font-mono-tech font-bold text-xs text-cyan-300 shrink-0">
          ${letters[idx]}
        </span>
        <span class="text-sm text-slate-100 leading-snug pt-0.5">${opt.text}</span>
      </button>
    `
      )
      .join("");

    optsContainer.querySelectorAll(".arena-opt-btn").forEach((btn) => {
      btn.addEventListener("click", () => handleAnswer(Number(btn.dataset.optIdx)));
    });

    document.getElementById("arena-feedback-panel").classList.add("hidden");

    updateTimerBar();
    timerInterval = setInterval(() => {
      quizState.timeLeft -= 1;
      updateTimerBar();
      if (quizState.timeLeft <= 5 && quizState.timeLeft > 0) {
        window.AutoTechApp.playTone("tick");
      }
      if (quizState.timeLeft <= 0) {
        handleAnswer(-1); // Tempo esgotado
      }
    }, 1000);
  }

  function updateTimerBar() {
    if (!quizState) return;
    const maxTime = quizState.module.timePerQuestion;
    const pct = Math.max(0, Math.round((quizState.timeLeft / maxTime) * 100));
    const bar = document.getElementById("arena-timer-bar");
    const label = document.getElementById("arena-timer-text");

    bar.style.width = `${pct}%`;
    label.textContent = `${Math.max(0, quizState.timeLeft)}s`;

    bar.classList.remove("bg-emerald-500", "bg-amber-500", "bg-rose-500", "timer-danger");
    if (quizState.timeLeft <= 5) {
      bar.classList.add("bg-rose-500", "timer-danger");
    } else if (quizState.timeLeft <= Math.ceil(maxTime * 0.45)) {
      bar.classList.add("bg-amber-500");
    } else {
      bar.classList.add("bg-emerald-500");
    }
  }

  function handleAnswer(selectedIdx) {
    if (!quizState || quizState.answered) return;
    quizState.answered = true;
    stopTimer();

    const q = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedIdx === q.shuffledCorrectIndex;

    if (isCorrect) {
      quizState.correctCount += 1;
      quizState.streak += 1;
      quizState.streakMax = Math.max(quizState.streakMax, quizState.streak);
      window.AutoTechApp.playTone("success");
    } else {
      quizState.streak = 0;
      window.AutoTechApp.playTone("error");
    }

    quizState.breakdown.push({
      questionId: q.id,
      moduleId: q.moduleId,
      correct: isCorrect,
      timedOut: selectedIdx === -1
    });

    // Destaca alternativas corretas e incorretas
    const buttons = document.querySelectorAll(".arena-opt-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove("hover:border-cyan-400", "hover:bg-slate-800/90");
      if (idx === q.shuffledCorrectIndex) {
        btn.classList.remove("border-slate-700", "bg-slate-900/80");
        btn.classList.add("border-emerald-400", "bg-emerald-950/60");
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.remove("border-slate-700", "bg-slate-900/80");
        btn.classList.add("border-rose-500", "bg-rose-950/60");
      }
    });

    // Exibe análise técnica
    const fbPanel = document.getElementById("arena-feedback-panel");
    const fbTitle = document.getElementById("arena-feedback-title");
    const fbText = document.getElementById("arena-feedback-text");

    fbPanel.classList.remove("hidden", "border-emerald-500/40", "border-rose-500/40");
    if (isCorrect) {
      fbPanel.classList.add("border-emerald-500/40");
      fbTitle.className = "font-display font-bold text-sm text-emerald-400 mb-1";
      fbTitle.textContent = "✓ DIAGNÓSTICO CORRETO — SINAL VALIDADO";
    } else if (selectedIdx === -1) {
      fbPanel.classList.add("border-rose-500/40");
      fbTitle.className = "font-display font-bold text-sm text-rose-400 mb-1";
      fbTitle.textContent = "⏱ TEMPO ESGOTADO (TIMEOUT DE PROCESSO)";
    } else {
      fbPanel.classList.add("border-rose-500/40");
      fbTitle.className = "font-display font-bold text-sm text-rose-400 mb-1";
      fbTitle.textContent = "✕ FALHA DE DIAGNÓSTICO — VERIFIQUE A ANÁLISE TÉCNICA";
    }
    fbText.textContent = q.explanation;

    const nextBtn = document.getElementById("arena-next-btn");
    const isLast = quizState.currentIndex >= quizState.questions.length - 1;
    nextBtn.textContent = isLast ? "Finalizar & Registrar Pontuação ➔" : "Próximo Desafio ➔";
    nextBtn.onclick = () => {
      if (isLast) {
        finishChallenge();
      } else {
        quizState.currentIndex += 1;
        renderCurrentQuestion();
      }
    };
  }

  async function finishChallenge() {
    if (!quizState) return;
    stopTimer();

    const durationSeconds = Math.max(
      quizState.questions.length,
      Math.round((Date.now() - quizState.startTimeMs) / 1000)
    );

    document.getElementById("student-arena-view").classList.add("hidden");
    document.getElementById("student-result-view").classList.remove("hidden");

    const statusEl = document.getElementById("result-sync-status");
    statusEl.textContent = "Validando pontuação no servidor Supabase...";

    try {
      const res = await window.SupabaseService.submitChallengeResult({
        studentId: currentStudent.id,
        pin: currentPin,
        moduleId: quizState.module.id,
        moduleTitle: quizState.module.title,
        correctCount: quizState.correctCount,
        totalQuestions: quizState.questions.length,
        durationSeconds,
        streakMax: quizState.streakMax,
        breakdown: quizState.breakdown
      });

      const accuracy = Math.round((quizState.correctCount / quizState.questions.length) * 100);
      document.getElementById("result-module-name").textContent = quizState.module.title;
      document.getElementById("result-score-fraction").textContent =
        `${quizState.correctCount} / ${quizState.questions.length} acertos (${accuracy}%)`;
      document.getElementById("result-xp-earned").textContent = `+${res.xp_earned} XP`;
      document.getElementById("result-xp-breakdown").textContent =
        `Base: +${res.base_xp} XP • Bônus Velocidade: +${res.speed_bonus} XP` +
        (res.marathon_bonus > 0 ? ` • Bônus Maratona: +${res.marathon_bonus} XP` : "");

      statusEl.textContent = "✓ Pontuação validada e sincronizada no Ranking Ao Vivo!";

      if (Array.isArray(res.new_badges) && res.new_badges.length > 0) {
        window.AutoTechApp.showToast(
          `Nova conquista desbloqueada! (${res.new_badges.length} medalha)`,
          "success"
        );
      }

      await loadStudentDataAndRealtime();
    } catch (err) {
      statusEl.textContent = `Erro ao salvar: ${err.message}`;
      window.AutoTechApp.showToast(err.message, "error");
    }
  }

  function backToDashboard() {
    stopTimer();
    quizState = null;
    document.getElementById("student-arena-view").classList.add("hidden");
    document.getElementById("student-result-view").classList.add("hidden");
    document.getElementById("student-dashboard-view").classList.remove("hidden");
  }

  return {
    initSession,
    destroySession,
    backToDashboard
  };
})();
