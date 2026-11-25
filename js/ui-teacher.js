/**
 * AUTOTECH ARENA - Controlador do Painel Administrativo do Professor
 * Gerencia Turmas, Cadastro/Importação de Alunos, PINs, Gráficos Pedagógicos, Ranking Ao Vivo e Relatórios.
 */
window.TeacherUI = (function () {
  let classes = [];
  let selectedClassId = null;
  let students = [];
  let attempts = [];
  let pendingImportList = [];
  let moduleChartInstance = null;
  let topStudentsChartInstance = null;

  async function initPanel() {
    bindEvents();
    await loadClasses();
  }

  function destroyPanel() {
    window.SupabaseService.unsubscribeLeaderboard();
    if (moduleChartInstance) {
      moduleChartInstance.destroy();
      moduleChartInstance = null;
    }
    if (topStudentsChartInstance) {
      topStudentsChartInstance.destroy();
      topStudentsChartInstance = null;
    }
  }

  function bindEvents() {
    // Troca de sub-abas internas do professor
    document.querySelectorAll(".teacher-tab-btn").forEach((btn) => {
      btn.onclick = () => switchTeacherTab(btn.dataset.teacherTab);
    });

    // Seletor de turma ativa
    const classSelect = document.getElementById("teacher-class-selector");
    if (classSelect) {
      classSelect.onchange = async () => {
        selectedClassId = classSelect.value;
        await loadSelectedClassData();
      };
    }

    // Criar nova turma
    const createClassForm = document.getElementById("teacher-create-class-form");
    if (createClassForm) {
      createClassForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById("new-class-name").value;
        const classCode = document.getElementById("new-class-code").value;
        const academicYear = document.getElementById("new-class-year").value;
        try {
          const created = await window.SupabaseService.createClass({
            name,
            classCode,
            academicYear
          });
          createClassForm.reset();
          window.AutoTechApp.showToast(`Turma "${created.name}" criada com sucesso!`, "success");
          await loadClasses(created.id);
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    }

    // Cadastrar aluno individual
    const addStudentForm = document.getElementById("teacher-add-student-form");
    if (addStudentForm) {
      addStudentForm.onsubmit = async (e) => {
        e.preventDefault();
        if (!selectedClassId) {
          window.AutoTechApp.showToast("Crie ou selecione uma turma primeiro.", "error");
          return;
        }
        const fullName = document.getElementById("new-student-name").value;
        const registrationCode = document.getElementById("new-student-reg").value;
        try {
          const added = await window.SupabaseService.addStudent({
            classId: selectedClassId,
            fullName,
            registrationCode
          });
          addStudentForm.reset();
          window.AutoTechApp.showToast(
            `Aluno "${added.full_name}" cadastrado! PIN: ${added.pin_code}`,
            "success"
          );
          await loadSelectedClassData();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    }

    // Upload planilha CSV/XLSX
    const fileInput = document.getElementById("teacher-import-file");
    if (fileInput) {
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          pendingImportList = await window.AutoTechReports.parseSpreadsheetFile(file);
          renderImportPreview();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    }

    // Confirmar importação em lote
    const confirmImportBtn = document.getElementById("teacher-confirm-import-btn");
    if (confirmImportBtn) {
      confirmImportBtn.onclick = async () => {
        if (!selectedClassId) {
          window.AutoTechApp.showToast("Selecione uma turma antes de importar.", "error");
          return;
        }
        try {
          const inserted = await window.SupabaseService.bulkAddStudents(
            selectedClassId,
            pendingImportList
          );
          pendingImportList = [];
          document.getElementById("teacher-import-file").value = "";
          renderImportPreview();
          window.AutoTechApp.showToast(
            `${inserted.length} aluno(s) importado(s) com PINs individuais gerados!`,
            "success"
          );
          await loadSelectedClassData();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    }

    // Filtro de busca na tabela de alunos
    const searchInput = document.getElementById("teacher-student-search");
    if (searchInput) {
      searchInput.oninput = () => renderStudentsTable();
    }

    // Exportar PINs Excel / Imprimir Cartões PIN
    document.getElementById("btn-export-pins-xlsx").onclick = () => {
      const cls = getActiveClass();
      if (!cls || students.length === 0) return;
      window.AutoTechReports.exportPinsExcel(cls, students);
    };

    document.getElementById("btn-print-pins").onclick = () => {
      const cls = getActiveClass();
      if (!cls || students.length === 0) return;
      try {
        window.AutoTechReports.printPinCards(cls, students);
      } catch (err) {
        window.AutoTechApp.showToast(err.message, "error");
      }
    };

    // Exportar Relatórios Coletivos (Excel & PDF)
    document.getElementById("btn-export-class-xlsx").onclick = () => {
      const cls = getActiveClass();
      if (!cls) return;
      window.AutoTechReports.exportClassExcel(cls, students, attempts);
    };

    document.getElementById("btn-export-class-pdf").onclick = () => {
      const cls = getActiveClass();
      if (!cls) return;
      window.AutoTechReports.exportClassPdf(cls, students, attempts);
    };

    // Exportar Relatório Individual (PDF)
    document.getElementById("btn-export-student-pdf").onclick = () => {
      const cls = getActiveClass();
      const studentId = document.getElementById("report-student-selector").value;
      const st = students.find((s) => s.id === studentId);
      if (!cls || !st) {
        window.AutoTechApp.showToast("Selecione um aluno para gerar o boletim PDF.", "error");
        return;
      }
      const stAttempts = attempts.filter((a) => a.student_id === st.id);
      window.AutoTechReports.exportStudentPdf(cls, st, stAttempts);
    };

    document.getElementById("report-student-selector").onchange = () => renderIndividualReportPreview();

    // Modo Projetor (Tela Cheia no Ranking Ao Vivo)
    const projBtn = document.getElementById("btn-toggle-projector");
    if (projBtn) {
      projBtn.onclick = () => {
        const container = document.getElementById("teacher-live-ranking-container");
        container.classList.toggle("projector-fullscreen");
        const isFull = container.classList.contains("projector-fullscreen");
        projBtn.textContent = isFull ? "✕ Sair do Modo Projetor" : "🖥️ Modo Projetor (Tela Cheia)";
      };
    }

    // Zerar pontuações da turma
    const resetBtn = document.getElementById("btn-reset-class-scores");
    if (resetBtn) {
      resetBtn.onclick = async () => {
        const cls = getActiveClass();
        if (!cls) return;
        if (
          !confirm(
            `Deseja zerar todas as pontuações e históricos da turma "${cls.name}"? Os cadastros e PINs dos alunos serão mantidos.`
          )
        ) {
          return;
        }
        try {
          await window.SupabaseService.resetClassProgress(cls.id);
          window.AutoTechApp.showToast("Pontuações da turma zeradas para nova rodada!", "success");
          await loadSelectedClassData();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    }
  }

  function switchTeacherTab(tabId) {
    document.querySelectorAll(".teacher-tab-btn").forEach((b) => {
      const active = b.dataset.teacherTab === tabId;
      b.classList.toggle("bg-cyan-600", active);
      b.classList.toggle("text-slate-950", active);
      b.classList.toggle("font-bold", active);
      b.classList.toggle("text-slate-300", !active);
    });

    document.querySelectorAll(".teacher-tab-panel").forEach((p) => {
      p.classList.toggle("hidden", p.id !== `teacher-panel-${tabId}`);
    });

    if (tabId === "overview") {
      renderCharts();
    }
  }

  function getActiveClass() {
    return classes.find((c) => c.id === selectedClassId) || null;
  }

  async function loadClasses(preferredClassId = null) {
    try {
      classes = await window.SupabaseService.getTeacherClasses();
      const selector = document.getElementById("teacher-class-selector");

      if (classes.length === 0) {
        selectedClassId = null;
        students = [];
        attempts = [];
        selector.innerHTML = `<option value="">Nenhuma turma cadastrada</option>`;
        document.getElementById("active-class-code-pill").textContent = "SEM TURMA";
        renderAllViews();
        switchTeacherTab("classes");
        return;
      }

      if (preferredClassId && classes.some((c) => c.id === preferredClassId)) {
        selectedClassId = preferredClassId;
      } else if (!selectedClassId || !classes.some((c) => c.id === selectedClassId)) {
        selectedClassId = classes[0].id;
      }

      selector.innerHTML = classes
        .map(
          (c) =>
            `<option value="${c.id}" ${c.id === selectedClassId ? "selected" : ""}>${c.name} (${c.class_code})</option>`
        )
        .join("");

      await loadSelectedClassData();
    } catch (err) {
      window.AutoTechApp.showToast(err.message, "error");
    }
  }

  async function loadSelectedClassData() {
    const cls = getActiveClass();
    if (!cls) return;

    document.getElementById("active-class-code-pill").textContent = `CÓDIGO: ${cls.class_code}`;

    try {
      const [stList, attList] = await Promise.all([
        window.SupabaseService.getStudentsForTeacher(cls.id),
        window.SupabaseService.getClassAttemptsForTeacher(cls.id)
      ]);
      students = stList;
      attempts = attList;

      renderAllViews();

      // Atualiza automaticamente via Supabase Realtime quando qualquer aluno pontuar
      window.SupabaseService.subscribeToClassLeaderboard(cls.id, async () => {
        try {
          const [updatedStudents, updatedAttempts] = await Promise.all([
            window.SupabaseService.getStudentsForTeacher(cls.id),
            window.SupabaseService.getClassAttemptsForTeacher(cls.id)
          ]);
          students = updatedStudents;
          attempts = updatedAttempts;
          renderOverviewKpis();
          renderLiveRanking(true);
          renderStudentsTable();
        } catch (e) {
          console.warn("Erro ao sincronizar Realtime no painel do professor:", e);
        }
      });
    } catch (err) {
      window.AutoTechApp.showToast(err.message, "error");
    }
  }

  function renderAllViews() {
    renderClassesList();
    renderOverviewKpis();
    renderCharts();
    renderStudentsTable();
    renderLiveRanking();
    populateReportStudentSelector();
    renderIndividualReportPreview();
  }

  function renderClassesList() {
    const container = document.getElementById("teacher-classes-list");
    if (!container) return;

    if (classes.length === 0) {
      container.innerHTML = `<p class="text-xs text-slate-400">Crie sua primeira turma ao lado para gerar um Código de Turma e cadastrar os alunos.</p>`;
      return;
    }

    container.innerHTML = classes
      .map(
        (c) => `
      <div class="p-3.5 rounded-xl border ${
        c.id === selectedClassId
          ? "border-cyan-400 bg-cyan-950/30"
          : "border-slate-700 bg-slate-900/60"
      } flex items-center justify-between gap-3">
        <div>
          <div class="font-bold text-sm text-white">${c.name}</div>
          <div class="text-xs font-mono-tech text-cyan-300 mt-0.5">
            Código: <strong>${c.class_code}</strong> • Ano: ${c.academic_year}
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" data-select-cls="${c.id}"
            class="select-cls-btn px-2.5 py-1.5 rounded bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-xs font-semibold transition cursor-pointer">
            Gerenciar
          </button>
          <button type="button" data-del-cls="${c.id}"
            class="del-cls-btn px-2 py-1.5 rounded bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white text-xs transition cursor-pointer"
            title="Excluir turma">
            ✕
          </button>
        </div>
      </div>
    `
      )
      .join("");

    container.querySelectorAll(".select-cls-btn").forEach((btn) => {
      btn.onclick = async () => {
        selectedClassId = btn.dataset.selectCls;
        document.getElementById("teacher-class-selector").value = selectedClassId;
        await loadSelectedClassData();
      };
    });

    container.querySelectorAll(".del-cls-btn").forEach((btn) => {
      btn.onclick = async () => {
        if (!confirm("Excluir esta turma e todos os alunos vinculados permanentemente?")) return;
        try {
          await window.SupabaseService.deleteClass(btn.dataset.delCls);
          window.AutoTechApp.showToast("Turma excluída.", "success");
          await loadClasses();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    });
  }

  function renderOverviewKpis() {
    const totalStudents = students.length;
    const activeCount = students.filter((s) => s.quizzes_completed > 0).length;
    const participationPct =
      totalStudents > 0 ? Math.round((activeCount / totalStudents) * 100) : 0;

    const totalCorrect = students.reduce((acc, s) => acc + (s.correct_answers || 0), 0);
    const totalAnswered = students.reduce((acc, s) => acc + (s.total_answered || 0), 0);
    const avgAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const topXp = students.length > 0 ? Math.max(...students.map((s) => s.xp_total || 0)) : 0;

    document.getElementById("kpi-total-students").textContent = totalStudents;
    document.getElementById("kpi-participation").textContent = `${participationPct}% (${activeCount}/${totalStudents})`;
    document.getElementById("kpi-avg-accuracy").textContent = `${avgAccuracy}%`;
    document.getElementById("kpi-total-attempts").textContent = attempts.length;
    document.getElementById("kpi-top-xp").textContent = `${topXp.toLocaleString("pt-BR")} XP`;
  }

  function renderCharts() {
    if (!window.Chart) return;

    // 1. Gráfico de Desempenho por Módulo Técnico
    const moduleLabels = window.AutoTechData.MODULES.map((m) => m.shortTitle);
    const moduleAccuracies = window.AutoTechData.MODULES.map((m) => {
      const modAttempts = attempts.filter((a) => a.module_id === m.id);
      if (modAttempts.length === 0) return 0;
      const sumCorrect = modAttempts.reduce((acc, a) => acc + Number(a.correct_count || 0), 0);
      const sumTotal = modAttempts.reduce((acc, a) => acc + Number(a.total_questions || 0), 0);
      return sumTotal > 0 ? Math.round((sumCorrect / sumTotal) * 100) : 0;
    });

    const ctxMod = document.getElementById("chart-modules-performance");
    if (ctxMod) {
      if (moduleChartInstance) moduleChartInstance.destroy();
      moduleChartInstance = new window.Chart(ctxMod, {
        type: "bar",
        data: {
          labels: moduleLabels,
          datasets: [
            {
              label: "Aproveitamento Médio (%)",
              data: moduleAccuracies,
              backgroundColor: "rgba(6, 182, 212, 0.65)",
              borderColor: "#06b6d4",
              borderWidth: 1.5,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, max: 100, ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
            x: { ticks: { color: "#cbd5e1", font: { size: 11 } }, grid: { display: false } }
          },
          plugins: {
            legend: { labels: { color: "#e2e8f0" } }
          }
        }
      });
    }

    // 2. Gráfico Top 10 Alunos por XP
    const top10 = [...students].sort((a, b) => b.xp_total - a.xp_total).slice(0, 10);
    const ctxTop = document.getElementById("chart-top-students");
    if (ctxTop) {
      if (topStudentsChartInstance) topStudentsChartInstance.destroy();
      topStudentsChartInstance = new window.Chart(ctxTop, {
        type: "bar",
        data: {
          labels: top10.map((s) => s.full_name.split(" ").slice(0, 2).join(" ")),
          datasets: [
            {
              label: "XP Acumulado",
              data: top10.map((s) => s.xp_total),
              backgroundColor: "rgba(16, 185, 129, 0.65)",
              borderColor: "#10b981",
              borderWidth: 1.5,
              borderRadius: 6
            }
          ]
        },
        options: {
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, ticks: { color: "#94a3b8" }, grid: { color: "#1e293b" } },
            y: { ticks: { color: "#cbd5e1", font: { size: 11 } }, grid: { display: false } }
          },
          plugins: {
            legend: { labels: { color: "#e2e8f0" } }
          }
        }
      });
    }
  }

  function renderImportPreview() {
    const box = document.getElementById("teacher-import-preview-box");
    const countEl = document.getElementById("teacher-import-count");
    if (!box) return;

    if (pendingImportList.length === 0) {
      box.classList.add("hidden");
      return;
    }

    box.classList.remove("hidden");
    countEl.textContent = `${pendingImportList.length} aluno(s) pronto(s) para importação`;
  }

  function renderStudentsTable() {
    const tbody = document.getElementById("teacher-students-tbody");
    if (!tbody) return;

    const query = (document.getElementById("teacher-student-search")?.value || "")
      .trim()
      .toLowerCase();

    const filtered = students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(query) ||
        (s.registration_code && s.registration_code.toLowerCase().includes(query)) ||
        s.pin_code.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400 text-sm">Nenhum aluno encontrado nesta turma.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((s) => {
        const acc =
          s.total_answered > 0 ? Math.round((s.correct_answers / s.total_answered) * 100) : 0;
        return `
          <tr class="border-b border-slate-800/80 hover:bg-slate-800/40 text-xs">
            <td class="py-3 px-3">
              <div class="font-semibold text-white">${s.full_name}</div>
              <div class="text-[11px] text-slate-400 font-mono-tech">RA: ${s.registration_code || "-"}</div>
            </td>
            <td class="py-3 px-3">
              <span class="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-500/40 font-mono-tech font-bold text-amber-300 tracking-wider">
                ${s.pin_code}
              </span>
            </td>
            <td class="py-3 px-3 font-mono-tech text-cyan-300">Nv. ${s.level}</td>
            <td class="py-3 px-3 font-mono-tech font-bold text-emerald-400">${s.xp_total} XP</td>
            <td class="py-3 px-3 font-mono-tech text-slate-300">${s.quizzes_completed}</td>
            <td class="py-3 px-3 font-mono-tech text-slate-300">${acc}%</td>
            <td class="py-3 px-3 text-right">
              <div class="inline-flex items-center gap-1.5">
                <button type="button" data-regen-pin="${s.id}"
                  class="regen-pin-btn px-2 py-1 rounded bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-300 transition cursor-pointer"
                  title="Gerar novo PIN">
                  ↻ PIN
                </button>
                <button type="button" data-del-student="${s.id}"
                  class="del-st-btn px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white transition cursor-pointer"
                  title="Remover aluno">
                  ✕
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    tbody.querySelectorAll(".regen-pin-btn").forEach((btn) => {
      btn.onclick = async () => {
        try {
          const updated = await window.SupabaseService.regenerateStudentPin(btn.dataset.regenPin);
          window.AutoTechApp.showToast(`Novo PIN gerado: ${updated.pin_code}`, "success");
          await loadSelectedClassData();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    });

    tbody.querySelectorAll(".del-st-btn").forEach((btn) => {
      btn.onclick = async () => {
        if (!confirm("Remover este aluno da turma?")) return;
        try {
          await window.SupabaseService.deleteStudent(btn.dataset.delStudent);
          window.AutoTechApp.showToast("Aluno removido.", "success");
          await loadSelectedClassData();
        } catch (err) {
          window.AutoTechApp.showToast(err.message, "error");
        }
      };
    });
  }

  function renderLiveRanking(animate = false) {
    const tbody = document.getElementById("teacher-live-ranking-body");
    const cls = getActiveClass();
    if (!tbody) return;

    const titleEl = document.getElementById("teacher-projector-class-title");
    if (titleEl && cls) {
      titleEl.textContent = `${cls.name} — Código de Acesso: ${cls.class_code}`;
    }

    const sorted = [...students].sort((a, b) => b.xp_total - a.xp_total);
    if (sorted.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-10 text-center text-slate-400">Nenhum aluno cadastrado nesta turma.</td></tr>`;
      return;
    }

    tbody.innerHTML = sorted
      .map((s, idx) => {
        const acc =
          s.total_answered > 0 ? Math.round((s.correct_answers / s.total_answered) * 100) : 0;
        const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
        const badgeIcons = (Array.isArray(s.badges) ? s.badges : [])
          .map((bId) => {
            const found = window.AutoTechData.BADGE_CATALOG.find((b) => b.id === bId);
            return found ? `<span title="${found.title}">${found.icon}</span>` : "";
          })
          .join(" ");

        return `
          <tr class="border-b border-slate-800 ${idx < 3 ? "bg-slate-900/80" : ""} ${
            animate ? "rank-updated" : ""
          }">
            <td class="py-3.5 px-4 font-mono-tech font-bold text-base ${
              idx < 3 ? "text-amber-400" : "text-slate-400"
            }">${medal}</td>
            <td class="py-3.5 px-4">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-slate-900 p-1 border border-slate-700">
                  ${window.AutoTechData.getAvatarSvg(s.avatar_id)}
                </div>
                <span class="font-bold text-base text-white">${s.full_name}</span>
              </div>
            </td>
            <td class="py-3.5 px-4 font-mono-tech text-sm text-cyan-300">Nível ${s.level}</td>
            <td class="py-3.5 px-4 text-base">${badgeIcons || '<span class="text-xs text-slate-500">-</span>'}</td>
            <td class="py-3.5 px-4 font-mono-tech text-sm text-slate-300">${acc}%</td>
            <td class="py-3.5 px-4 text-right font-mono-tech font-bold text-lg text-emerald-400">
              ${s.xp_total.toLocaleString("pt-BR")} XP
            </td>
          </tr>
        `;
      })
      .join("");
  }

  function populateReportStudentSelector() {
    const sel = document.getElementById("report-student-selector");
    if (!sel) return;

    if (students.length === 0) {
      sel.innerHTML = `<option value="">Nenhum aluno disponível</option>`;
      return;
    }

    sel.innerHTML = students
      .map((s) => `<option value="${s.id}">${s.full_name} (${s.xp_total} XP)</option>`)
      .join("");
  }

  function renderIndividualReportPreview() {
    const container = document.getElementById("individual-report-preview");
    const studentId = document.getElementById("report-student-selector")?.value;
    const st = students.find((s) => s.id === studentId);

    if (!container || !st) {
      if (container) container.innerHTML = "";
      return;
    }

    const stAttempts = attempts.filter((a) => a.student_id === st.id);
    const acc =
      st.total_answered > 0 ? Math.round((st.correct_answers / st.total_answered) * 100) : 0;

    container.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-700 mb-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="text-base font-bold text-white">${st.full_name}</div>
          <div class="text-xs font-mono-tech text-slate-400">
            Nível ${st.level} • ${st.xp_total} XP • Precisão: ${acc}% • Desafios: ${st.quizzes_completed}
          </div>
        </div>
        <span class="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 font-mono-tech text-xs border border-cyan-500/30">
          ${stAttempts.length} registro(s) de atividade
        </span>
      </div>
      <div class="overflow-x-auto max-h-64">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="border-b border-slate-700 text-slate-400 font-mono-tech">
              <th class="py-2 px-2">Data</th>
              <th class="py-2 px-2">Módulo</th>
              <th class="py-2 px-2">Acertos</th>
              <th class="py-2 px-2">Tempo</th>
              <th class="py-2 px-2 text-right">XP</th>
            </tr>
          </thead>
          <tbody>
            ${
              stAttempts.length > 0
                ? stAttempts
                    .map(
                      (a) => `
                <tr class="border-b border-slate-800">
                  <td class="py-2 px-2 font-mono-tech text-slate-400">${new Date(a.created_at).toLocaleDateString("pt-BR")}</td>
                  <td class="py-2 px-2 text-slate-200">${a.module_title}</td>
                  <td class="py-2 px-2 font-mono-tech text-cyan-300">${a.correct_count}/${a.total_questions} (${Math.round(a.accuracy_pct)}%)</td>
                  <td class="py-2 px-2 font-mono-tech text-slate-400">${a.duration_seconds}s</td>
                  <td class="py-2 px-2 text-right font-mono-tech text-emerald-400">+${a.xp_earned}</td>
                </tr>`
                    )
                    .join("")
                : `<tr><td colspan="5" class="py-4 text-center text-slate-500">Nenhuma atividade realizada por este aluno.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    `;
  }

  return {
    initPanel,
    destroyPanel
  };
})();
