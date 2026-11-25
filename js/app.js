/**
 * AUTOTECH ARENA - Controlador Principal da Aplicação
 * Gerencia Estado de Conexão Supabase, Roteamento de Perfis (Aluno / Professor), Áudio e Notificações.
 */
window.AutoTechApp = (function () {
  const STUDENT_SESSION_KEY = "autotech_student_session_v1";
  let audioCtx = null;

  function playTone(type) {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      if (type === "success") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.setValueAtTime(145, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "tick") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.07);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch (e) {
      // Ignora bloqueio de autoplay se houver
    }
  }

  function showToast(message, variant = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const colors = {
      success: "border-emerald-400 bg-emerald-950/95 text-emerald-100",
      error: "border-rose-500 bg-rose-950/95 text-rose-100",
      info: "border-cyan-400 bg-slate-900/95 text-cyan-100"
    };

    const toast = document.createElement("div");
    toast.className = `px-4 py-3 rounded-xl border shadow-xl text-xs font-medium max-w-sm transition-all ${
      colors[variant] || colors.info
    }`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  function updateConnectionStatusBadge(connected, labelText) {
    const led = document.getElementById("cloud-status-led");
    const text = document.getElementById("cloud-status-text");
    if (!led || !text) return;

    led.className = `status-led ${connected ? "led-online" : "led-offline"}`;
    text.textContent = labelText;
  }

  function showView(viewName) {
    document.getElementById("view-auth-portal").classList.toggle("hidden", viewName !== "auth");
    document.getElementById("view-student-portal").classList.toggle("hidden", viewName !== "student");
    document.getElementById("view-teacher-portal").classList.toggle("hidden", viewName !== "teacher");
    document.getElementById("btn-global-logout").classList.toggle("hidden", viewName === "auth");
  }

  async function bootstrap() {
    bindAuthAndConfigEvents();

    const initState = window.SupabaseService.init();
    if (!initState.connected) {
      updateConnectionStatusBadge(false, "SUPABASE NÃO CONFIGURADO");
      document.getElementById("supabase-setup-banner").classList.remove("hidden");
      showView("auth");
      return;
    }

    const ping = await window.SupabaseService.testConnection();
    if (!ping.ok) {
      updateConnectionStatusBadge(false, "ERRO CONEXÃO SUPABASE");
      document.getElementById("supabase-setup-banner").classList.remove("hidden");
      showToast(`Atenção: ${ping.error}. Verifique se executou o schema.sql.`, "error");
      showView("auth");
      return;
    }

    updateConnectionStatusBadge(true, "SUPABASE ONLINE • REALTIME");
    document.getElementById("supabase-setup-banner").classList.add("hidden");

    // 1. Verifica se existe sessão ativa de Professor
    const teacherSession = await window.SupabaseService.getTeacherSession();
    if (teacherSession) {
      document.getElementById("active-role-label").textContent =
        `PROFESSOR: ${teacherSession.user.email}`;
      showView("teacher");
      await window.TeacherUI.initPanel();
      return;
    }

    // 2. Verifica se existe sessão ativa de Aluno na aba atual
    try {
      const savedStudent = JSON.parse(sessionStorage.getItem(STUDENT_SESSION_KEY) || "null");
      if (savedStudent && savedStudent.classCode && savedStudent.pin) {
        const revalidated = await window.SupabaseService.studentLoginWithPin(
          savedStudent.classCode,
          savedStudent.pin
        );
        document.getElementById("active-role-label").textContent =
          `OPERADOR: ${revalidated.student.full_name}`;
        showView("student");
        window.StudentUI.initSession({
          class: revalidated.class,
          student: revalidated.student,
          pin: savedStudent.pin
        });
        return;
      }
    } catch (e) {
      sessionStorage.removeItem(STUDENT_SESSION_KEY);
    }

    showView("auth");
  }

  function bindAuthAndConfigEvents() {
    // Alternância entre Login Aluno (PIN) e Login Professor
    const tabStudent = document.getElementById("auth-tab-student");
    const tabTeacher = document.getElementById("auth-tab-teacher");

    tabStudent.onclick = () => {
      tabStudent.classList.add("bg-cyan-600", "text-slate-950", "font-bold");
      tabStudent.classList.remove("text-slate-300");
      tabTeacher.classList.remove("bg-amber-500", "text-slate-950", "font-bold");
      tabTeacher.classList.add("text-slate-300");
      document.getElementById("auth-student-box").classList.remove("hidden");
      document.getElementById("auth-teacher-box").classList.add("hidden");
    };

    tabTeacher.onclick = () => {
      tabTeacher.classList.add("bg-amber-500", "text-slate-950", "font-bold");
      tabTeacher.classList.remove("text-slate-300");
      tabStudent.classList.remove("bg-cyan-600", "text-slate-950", "font-bold");
      tabStudent.classList.add("text-slate-300");
      document.getElementById("auth-teacher-box").classList.remove("hidden");
      document.getElementById("auth-student-box").classList.add("hidden");
    };

    // Formulário de Login do Aluno por PIN
    document.getElementById("student-pin-login-form").onsubmit = async (e) => {
      e.preventDefault();
      if (!window.SupabaseService.isReady()) {
        showToast("Configure a conexão com o Supabase primeiro.", "error");
        return;
      }
      const classCode = document.getElementById("login-class-code").value.trim().toUpperCase();
      const pin = document.getElementById("login-student-pin").value.trim().toUpperCase();

      try {
        const res = await window.SupabaseService.studentLoginWithPin(classCode, pin);
        sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify({ classCode, pin }));
        document.getElementById("active-role-label").textContent =
          `OPERADOR: ${res.student.full_name}`;
        playTone("success");
        showView("student");
        window.StudentUI.initSession({
          class: res.class,
          student: res.student,
          pin
        });
      } catch (err) {
        playTone("error");
        showToast(err.message, "error");
      }
    };

    // Alternar Login / Criar Conta de Professor
    document.getElementById("toggle-teacher-signup").onclick = () => {
      const signupBox = document.getElementById("teacher-signup-fields");
      const isHidden = signupBox.classList.contains("hidden");
      signupBox.classList.toggle("hidden", !isHidden);
      document.getElementById("teacher-auth-submit-btn").textContent = isHidden
        ? "Criar Conta de Professor"
        : "Entrar no Painel Administrativo";
      document.getElementById("toggle-teacher-signup").textContent = isHidden
        ? "Já possuo conta de professor"
        : "Primeiro acesso? Cadastrar Professor";
    };

    // Submissão Auth Professor
    document.getElementById("teacher-auth-form").onsubmit = async (e) => {
      e.preventDefault();
      if (!window.SupabaseService.isReady()) {
        showToast("Configure a conexão com o Supabase primeiro.", "error");
        return;
      }

      const isSignUp = !document
        .getElementById("teacher-signup-fields")
        .classList.contains("hidden");
      const email = document.getElementById("teacher-email").value;
      const password = document.getElementById("teacher-password").value;

      try {
        if (isSignUp) {
          const fullName = document.getElementById("teacher-fullname").value;
          const institution = document.getElementById("teacher-institution").value;
          if (!fullName || fullName.trim().length < 3) {
            showToast("Informe seu nome completo de professor.", "error");
            return;
          }
          const res = await window.SupabaseService.teacherSignUp(
            fullName,
            email,
            password,
            institution
          );
          if (!res.session) {
            showToast(
              "Cadastro realizado! Confirme seu e-mail (caso ativo no Supabase) e faça login.",
              "success"
            );
            return;
          }
        } else {
          await window.SupabaseService.teacherSignIn(email, password);
        }

        const session = await window.SupabaseService.getTeacherSession();
        if (session) {
          document.getElementById("active-role-label").textContent =
            `PROFESSOR: ${session.user.email}`;
          showView("teacher");
          await window.TeacherUI.initPanel();
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    };

    // Botão Sair / Trocar Perfil
    document.getElementById("btn-global-logout").onclick = async () => {
      sessionStorage.removeItem(STUDENT_SESSION_KEY);
      window.StudentUI.destroySession();
      window.TeacherUI.destroyPanel();
      await window.SupabaseService.teacherSignOut();
      document.getElementById("active-role-label").textContent = "";
      showView("auth");
      showToast("Sessão encerrada com segurança.", "info");
    };

    // Modal de Configuração Rápida do Supabase
    const modal = document.getElementById("supabase-config-modal");
    document.getElementById("btn-open-config-modal").onclick = () => {
      const current = window.AutoTechConfig.getCredentials();
      if (current) {
        document.getElementById("cfg-supabase-url").value = current.url;
        document.getElementById("cfg-supabase-key").value = current.anonKey;
      }
      modal.classList.remove("hidden");
    };

    document.getElementById("btn-close-config-modal").onclick = () => {
      modal.classList.add("hidden");
    };

    document.getElementById("supabase-config-form").onsubmit = async (e) => {
      e.preventDefault();
      const url = document.getElementById("cfg-supabase-url").value;
      const anonKey = document.getElementById("cfg-supabase-key").value;
      window.AutoTechConfig.saveCredentials(url, anonKey);
      modal.classList.add("hidden");
      showToast("Credenciais salvas! Testando conexão...", "info");
      await bootstrap();
    };
  }

  return {
    bootstrap,
    playTone,
    showToast
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  window.AutoTechApp.bootstrap();
});
