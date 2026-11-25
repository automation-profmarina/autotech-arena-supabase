/**
 * AUTOTECH ARENA - Camada Centralizada de Comunicação com Supabase
 * Gerencia Autenticação de Professores, Turmas, Alunos, RPCs Anti-Fraude e Realtime.
 */
window.SupabaseService = (function () {
  let client = null;
  let activeChannel = null;

  function init() {
    const creds = window.AutoTechConfig.getCredentials();
    if (!creds) {
      client = null;
      return { connected: false, reason: "missing_credentials" };
    }

    try {
      if (!window.supabase || !window.supabase.createClient) {
        return { connected: false, reason: "sdk_not_loaded" };
      }
      client = window.supabase.createClient(creds.url, creds.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return { connected: true, url: creds.url, source: creds.source };
    } catch (err) {
      console.error("Erro ao inicializar cliente Supabase:", err);
      client = null;
      return { connected: false, reason: err.message };
    }
  }

  function isReady() {
    return client !== null;
  }

  async function testConnection() {
    if (!client) return { ok: false, error: "Cliente Supabase não inicializado." };
    try {
      const { error } = await client.from("students").select("id").limit(1);
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ==================== AUTENTICAÇÃO DO PROFESSOR ====================
  async function getTeacherSession() {
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error || !data.session) return null;
    return data.session;
  }

  async function teacherSignIn(email, password) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async function teacherSignUp(fullName, email, password, institution) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          institution: (institution || "Curso Técnico em Automação Industrial").trim()
        }
      }
    });
    if (error) throw new Error(error.message);
    return data;
  }

  async function teacherSignOut() {
    if (!client) return;
    await client.auth.signOut();
  }

  // ==================== TURMAS (PROFESSOR) ====================
  async function getTeacherClasses() {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function createClass({ name, classCode, academicYear }) {
    if (!client) throw new Error("Supabase não configurado.");
    const session = await getTeacherSession();
    if (!session) throw new Error("Sessão de professor expirada.");

    const cleanCode = classCode.trim().toUpperCase().replace(/\s+/g, "-");
    const { data, error } = await client
      .from("classes")
      .insert([
        {
          professor_id: session.user.id,
          name: name.trim(),
          class_code: cleanCode,
          academic_year: (academicYear || new Date().getFullYear().toString()).trim()
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error(`O código de turma "${cleanCode}" já está em uso. Escolha outro.`);
      }
      throw new Error(error.message);
    }
    return data;
  }

  async function deleteClass(classId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { error } = await client.from("classes").delete().eq("id", classId);
    if (error) throw new Error(error.message);
  }

  // ==================== ALUNOS (PROFESSOR) ====================
  async function getStudentsForTeacher(classId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client
      .from("students")
      .select("*")
      .eq("class_id", classId)
      .order("xp_total", { ascending: false })
      .order("full_name", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function addStudent({ classId, fullName, registrationCode }) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client
      .from("students")
      .insert([
        {
          class_id: classId,
          full_name: fullName.trim(),
          registration_code: registrationCode ? registrationCode.trim() : null
        }
      ])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async function bulkAddStudents(classId, studentsList) {
    if (!client) throw new Error("Supabase não configurado.");
    const payload = studentsList
      .filter((s) => s.fullName && s.fullName.trim().length >= 2)
      .map((s) => ({
        class_id: classId,
        full_name: s.fullName.trim(),
        registration_code: s.registrationCode ? String(s.registrationCode).trim() : null
      }));

    if (payload.length === 0) {
      throw new Error("Nenhum aluno válido encontrado na lista.");
    }

    const { data, error } = await client.from("students").insert(payload).select();
    if (error) throw new Error(error.message);
    return data || [];
  }

  async function regenerateStudentPin(studentId) {
    if (!client) throw new Error("Supabase não configurado.");
    // Envia pin_code vazio para o trigger ensure_unique_student_pin gerar um novo PIN seguro
    const { data, error } = await client
      .from("students")
      .update({ pin_code: "", updated_at: new Date().toISOString() })
      .eq("id", studentId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async function deleteStudent(studentId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { error } = await client.from("students").delete().eq("id", studentId);
    if (error) throw new Error(error.message);
  }

  async function getClassAttemptsForTeacher(classId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("get_class_attempts_for_teacher", {
      p_class_id: classId
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) throw new Error(data?.error || "Erro ao carregar histórico.");
    return data.attempts || [];
  }

  async function resetClassProgress(classId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("reset_class_progress", {
      p_class_id: classId
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) throw new Error(data?.error || "Erro ao zerar pontuações.");
    return true;
  }

  // ==================== PORTAL DO ALUNO (PIN & RPCs) ====================
  async function studentLoginWithPin(classCode, pin) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("student_login_with_pin", {
      p_class_code: classCode,
      p_pin: pin
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) {
      throw new Error(data?.error || "Falha na autenticação por PIN.");
    }
    return data;
  }

  async function updateStudentAvatar(studentId, pin, avatarId) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("update_student_avatar", {
      p_student_id: studentId,
      p_pin: pin,
      p_avatar_id: avatarId
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) throw new Error(data?.error || "Erro ao salvar avatar.");
    return data;
  }

  async function submitChallengeResult({
    studentId,
    pin,
    moduleId,
    moduleTitle,
    correctCount,
    totalQuestions,
    durationSeconds,
    streakMax,
    breakdown
  }) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("submit_challenge_result", {
      p_student_id: studentId,
      p_pin: pin,
      p_module_id: moduleId,
      p_module_title: moduleTitle,
      p_correct_count: correctCount,
      p_total_questions: totalQuestions,
      p_duration_seconds: durationSeconds,
      p_streak_max: streakMax,
      p_breakdown: breakdown || []
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) {
      throw new Error(data?.error || "Erro ao validar pontuação no servidor.");
    }
    return data;
  }

  async function getStudentHistory(studentId, pin) {
    if (!client) throw new Error("Supabase não configurado.");
    const { data, error } = await client.rpc("get_student_history", {
      p_student_id: studentId,
      p_pin: pin
    });
    if (error) throw new Error(error.message);
    if (!data || !data.success) throw new Error(data?.error || "Erro ao carregar histórico.");
    return data.attempts || [];
  }

  // ==================== RANKING AO VIVO & REALTIME ====================
  async function getPublicClassLeaderboard(classId) {
    if (!client) throw new Error("Supabase não configurado.");
    // Seleciona estritamente as colunas públicas autorizadas pelo RLS/GRANT
    const { data, error } = await client
      .from("students")
      .select(
        "id, class_id, full_name, avatar_id, xp_total, level, streak_best, quizzes_completed, correct_answers, total_answered, avg_time_ms, badges, updated_at"
      )
      .eq("class_id", classId)
      .order("xp_total", { ascending: false })
      .order("correct_answers", { ascending: false })
      .order("avg_time_ms", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  function subscribeToClassLeaderboard(classId, onUpdateCallback) {
    unsubscribeLeaderboard();
    if (!client || !classId) return;

    activeChannel = client
      .channel(`leaderboard-class-${classId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
          filter: `class_id=eq.${classId}`
        },
        (payload) => {
          if (typeof onUpdateCallback === "function") {
            onUpdateCallback(payload);
          }
        }
      )
      .subscribe();
  }

  function unsubscribeLeaderboard() {
    if (client && activeChannel) {
      client.removeChannel(activeChannel);
      activeChannel = null;
    }
  }

  return {
    init,
    isReady,
    testConnection,
    getTeacherSession,
    teacherSignIn,
    teacherSignUp,
    teacherSignOut,
    getTeacherClasses,
    createClass,
    deleteClass,
    getStudentsForTeacher,
    addStudent,
    bulkAddStudents,
    regenerateStudentPin,
    deleteStudent,
    getClassAttemptsForTeacher,
    resetClassProgress,
    studentLoginWithPin,
    updateStudentAvatar,
    submitChallengeResult,
    getStudentHistory,
    getPublicClassLeaderboard,
    subscribeToClassLeaderboard,
    unsubscribeLeaderboard
  };
})();
