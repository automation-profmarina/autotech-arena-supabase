-- ==============================================================================
-- AUTOTECH ARENA - SCRIPT SQL COMPLETO PARA SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Instruções:
-- 1. No painel do Supabase, acesse "SQL Editor" -> "New query".
-- 2. Cole todo este script e clique em "Run".
-- 3. Certifique-se de que o provedor "Email" está ativo em Authentication -> Providers.
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELA DE PROFESSORES (Sincronizada com auth.users)
CREATE TABLE IF NOT EXISTS public.professors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  institution TEXT DEFAULT 'Curso Técnico em Automação Industrial',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABELA DE TURMAS
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID NOT NULL REFERENCES public.professors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  academic_year TEXT NOT NULL DEFAULT '2026',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FUNÇÃO GERADORA DE PIN SEGURO (6 caracteres sem ambiguidade visual: sem 0/O, 1/I)
CREATE OR REPLACE FUNCTION public.generate_student_pin()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- 5. TABELA DE ALUNOS
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  registration_code TEXT,
  pin_code TEXT NOT NULL DEFAULT public.generate_student_pin(),
  avatar_id TEXT NOT NULL DEFAULT 'plc',
  xp_total INTEGER NOT NULL DEFAULT 0 CHECK (xp_total >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
  streak_best INTEGER NOT NULL DEFAULT 0 CHECK (streak_best >= 0),
  quizzes_completed INTEGER NOT NULL DEFAULT 0 CHECK (quizzes_completed >= 0),
  correct_answers INTEGER NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  total_answered INTEGER NOT NULL DEFAULT 0 CHECK (total_answered >= 0),
  avg_time_ms INTEGER NOT NULL DEFAULT 0 CHECK (avg_time_ms >= 0),
  badges JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_student_pin_per_class UNIQUE (class_id, pin_code)
);

-- Trigger para garantir PIN único por turma caso ocorra colisão rara na geração aleatória
CREATE OR REPLACE FUNCTION public.ensure_unique_student_pin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
  attempts INT := 0;
BEGIN
  IF NEW.pin_code IS NULL OR TRIM(NEW.pin_code) = '' THEN
    NEW.pin_code := public.generate_student_pin();
  ELSE
    NEW.pin_code := UPPER(REPLACE(TRIM(NEW.pin_code), '-', ''));
  END IF;

  WHILE EXISTS (
    SELECT 1 FROM public.students
    WHERE class_id = NEW.class_id AND pin_code = NEW.pin_code AND id <> COALESCE(NEW.id, gen_random_uuid())
  ) LOOP
    attempts := attempts + 1;
    IF attempts > 25 THEN
      RAISE EXCEPTION 'Não foi possível gerar um PIN único para esta turma.';
    END IF;
    candidate := public.generate_student_pin();
    NEW.pin_code := candidate;
  END LOOP;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_unique_student_pin ON public.students;
CREATE TRIGGER trg_ensure_unique_student_pin
  BEFORE INSERT OR UPDATE OF pin_code ON public.students
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_unique_student_pin();

-- 6. TABELA DE HISTÓRICO DE ATIVIDADES E DESAFIOS
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  xp_earned INTEGER NOT NULL CHECK (xp_earned >= 0 AND xp_earned <= 2500),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  accuracy_pct NUMERIC(5,2) NOT NULL CHECK (accuracy_pct >= 0 AND accuracy_pct <= 100),
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
  question_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TRIGGER PARA CRIAR PERFIL DE PROFESSOR AUTOMATICAMENTE APÓS CADASTRO NO SUPABASE AUTH
CREATE OR REPLACE FUNCTION public.handle_new_professor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.professors (id, full_name, email, institution)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'institution', 'Curso Técnico em Automação Industrial')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_professor();

-- 8. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_classes_professor ON public.classes(professor_id);
CREATE INDEX IF NOT EXISTS idx_classes_code ON public.classes(UPPER(class_code));
CREATE INDEX IF NOT EXISTS idx_students_class_xp ON public.students(class_id, xp_total DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_class_module ON public.challenge_attempts(class_id, module_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student_date ON public.challenge_attempts(student_id, created_at DESC);

-- 9. ROW LEVEL SECURITY (RLS) E PRIVILÉGIOS LGPD / ANTI-FRAUDE
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Professores (apenas usuário autenticado acessa seu próprio perfil)
GRANT SELECT, INSERT, UPDATE ON public.professors TO authenticated;
DROP POLICY IF EXISTS "Professor gerencia proprio perfil" ON public.professors;
CREATE POLICY "Professor gerencia proprio perfil"
  ON public.professors FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Turmas (cada professor vê e gerencia apenas suas turmas)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
DROP POLICY IF EXISTS "Professor gerencia suas turmas" ON public.classes;
CREATE POLICY "Professor gerencia suas turmas"
  ON public.classes FOR ALL TO authenticated
  USING (auth.uid() = professor_id)
  WITH CHECK (auth.uid() = professor_id);

-- Alunos: Professor tem controle total sobre alunos de suas turmas
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
DROP POLICY IF EXISTS "Professor gerencia alunos de suas turmas" ON public.students;
CREATE POLICY "Professor gerencia alunos de suas turmas"
  ON public.students FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = students.class_id AND c.professor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = students.class_id AND c.professor_id = auth.uid()
    )
  );

-- Alunos: Visitantes/Alunos (anon) NÃO podem ver pin_code nem registration_code, nem editar tabelas diretamente.
-- Podem apenas ler colunas públicas do ranking em tempo real.
REVOKE ALL ON public.students FROM anon;
GRANT SELECT (
  id, class_id, full_name, avatar_id, xp_total, level,
  streak_best, quizzes_completed, correct_answers, total_answered,
  avg_time_ms, badges, updated_at
) ON public.students TO anon;

DROP POLICY IF EXISTS "Leitura publica ranking sem PIN" ON public.students;
CREATE POLICY "Leitura publica ranking sem PIN"
  ON public.students FOR SELECT TO anon
  USING (true);

-- Tentativas: Professor consulta/limpa histórico apenas de suas turmas; Alunos inserem apenas via RPC validada
GRANT SELECT, DELETE ON public.challenge_attempts TO authenticated;
REVOKE ALL ON public.challenge_attempts FROM anon;

DROP POLICY IF EXISTS "Professor consulta tentativas de suas turmas" ON public.challenge_attempts;
CREATE POLICY "Professor consulta tentativas de suas turmas"
  ON public.challenge_attempts FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = challenge_attempts.class_id AND c.professor_id = auth.uid()
    )
  );

-- 10. FUNÇÕES RPC SEGURAS (SECURITY DEFINER - LÓGICA NO SERVIDOR)

-- 10.1 Login do Aluno por Código da Turma + PIN Individual
CREATE OR REPLACE FUNCTION public.student_login_with_pin(
  p_class_code TEXT,
  p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class RECORD;
  v_student RECORD;
BEGIN
  SELECT id, name, class_code, academic_year
  INTO v_class
  FROM public.classes
  WHERE UPPER(TRIM(class_code)) = UPPER(TRIM(p_class_code))
    AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Código da turma não encontrado ou turma inativa.'
    );
  END IF;

  SELECT id, class_id, full_name, avatar_id, xp_total, level, streak_best,
         quizzes_completed, correct_answers, total_answered, avg_time_ms, badges
  INTO v_student
  FROM public.students
  WHERE class_id = v_class.id
    AND UPPER(REPLACE(TRIM(pin_code), '-', '')) = UPPER(REPLACE(TRIM(p_pin), '-', ''));

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'PIN individual inválido para esta turma. Verifique com seu professor.'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'class', jsonb_build_object(
      'id', v_class.id,
      'name', v_class.name,
      'class_code', v_class.class_code,
      'academic_year', v_class.academic_year
    ),
    'student', row_to_json(v_student)
  );
END;
$$;

-- 10.2 Atualização de Avatar do Aluno
CREATE OR REPLACE FUNCTION public.update_student_avatar(
  p_student_id UUID,
  p_pin TEXT,
  p_avatar_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.students
  SET avatar_id = p_avatar_id,
      updated_at = NOW()
  WHERE id = p_student_id
    AND UPPER(REPLACE(TRIM(pin_code), '-', '')) = UPPER(REPLACE(TRIM(p_pin), '-', ''));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autorizado a alterar avatar.');
  END IF;

  RETURN jsonb_build_object('success', true, 'avatar_id', p_avatar_id);
END;
$$;

-- 10.3 Submissão e Validação de Pontuação no Servidor (Anti-Fraude)
CREATE OR REPLACE FUNCTION public.submit_challenge_result(
  p_student_id UUID,
  p_pin TEXT,
  p_module_id TEXT,
  p_module_title TEXT,
  p_correct_count INT,
  p_total_questions INT,
  p_duration_seconds INT,
  p_streak_max INT,
  p_breakdown JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student public.students%ROWTYPE;
  v_base_xp INT;
  v_speed_bonus INT;
  v_marathon_bonus INT := 0;
  v_total_xp INT;
  v_accuracy NUMERIC(5,2);
  v_new_xp INT;
  v_new_level INT;
  v_new_avg_ms INT;
  v_badges JSONB;
  v_new_badges JSONB := '[]'::jsonb;
BEGIN
  SELECT * INTO v_student
  FROM public.students
  WHERE id = p_student_id
    AND UPPER(REPLACE(TRIM(pin_code), '-', '')) = UPPER(REPLACE(TRIM(p_pin), '-', ''));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida ou PIN expirado.');
  END IF;

  IF p_total_questions <= 0 OR p_total_questions > 20 OR p_correct_count < 0 OR p_correct_count > p_total_questions THEN
    RETURN jsonb_build_object('success', false, 'error', 'Parâmetros de pontuação inválidos.');
  END IF;

  IF p_duration_seconds < p_total_questions THEN
    RETURN jsonb_build_object('success', false, 'error', 'Tempo mínimo de resposta violado.');
  END IF;

  v_accuracy := ROUND((p_correct_count::numeric / p_total_questions::numeric) * 100, 2);
  v_base_xp := p_correct_count * 100;
  v_speed_bonus := GREATEST(0, LEAST(250, (p_correct_count * 30) - (p_duration_seconds / 2)));

  IF p_module_id = 'maratona' AND p_correct_count >= 7 THEN
    v_marathon_bonus := 250;
  END IF;

  v_total_xp := v_base_xp + v_speed_bonus + v_marathon_bonus;

  INSERT INTO public.challenge_attempts (
    student_id, class_id, module_id, module_title, xp_earned,
    correct_count, total_questions, accuracy_pct, duration_seconds, question_breakdown
  ) VALUES (
    v_student.id, v_student.class_id, p_module_id, p_module_title, v_total_xp,
    p_correct_count, p_total_questions, v_accuracy, p_duration_seconds, COALESCE(p_breakdown, '[]'::jsonb)
  );

  v_new_xp := v_student.xp_total + v_total_xp;
  v_new_level := FLOOR(v_new_xp / 500) + 1;

  v_new_avg_ms := CASE
    WHEN (v_student.total_answered + p_total_questions) > 0 THEN
      ((v_student.avg_time_ms * v_student.total_answered) + (p_duration_seconds * 1000))
      / (v_student.total_answered + p_total_questions)
    ELSE 0
  END;

  v_badges := COALESCE(v_student.badges, '[]'::jsonb);

  IF v_accuracy = 100 AND NOT (v_badges ? 'precisao_cirurgica') THEN
    v_badges := v_badges || '["precisao_cirurgica"]'::jsonb;
    v_new_badges := v_new_badges || '["precisao_cirurgica"]'::jsonb;
  END IF;

  IF p_streak_max >= 5 AND NOT (v_badges ? 'combo_industrial') THEN
    v_badges := v_badges || '["combo_industrial"]'::jsonb;
    v_new_badges := v_new_badges || '["combo_industrial"]'::jsonb;
  END IF;

  IF v_new_xp >= 1000 AND NOT (v_badges ? 'tecnico_pleno') THEN
    v_badges := v_badges || '["tecnico_pleno"]'::jsonb;
    v_new_badges := v_new_badges || '["tecnico_pleno"]'::jsonb;
  END IF;

  IF v_new_xp >= 3000 AND NOT (v_badges ? 'mestre_automacao') THEN
    v_badges := v_badges || '["mestre_automacao"]'::jsonb;
    v_new_badges := v_new_badges || '["mestre_automacao"]'::jsonb;
  END IF;

  IF p_module_id = 'clp' AND v_accuracy = 100 AND NOT (v_badges ? 'especialista_clp') THEN
    v_badges := v_badges || '["especialista_clp"]'::jsonb;
    v_new_badges := v_new_badges || '["especialista_clp"]'::jsonb;
  END IF;

  IF v_accuracy >= 80 AND (p_duration_seconds::numeric / p_total_questions::numeric) <= 8.0 AND NOT (v_badges ? 'velocista_scada') THEN
    v_badges := v_badges || '["velocista_scada"]'::jsonb;
    v_new_badges := v_new_badges || '["velocista_scada"]'::jsonb;
  END IF;

  UPDATE public.students
  SET xp_total = v_new_xp,
      level = v_new_level,
      streak_best = GREATEST(streak_best, p_streak_max),
      quizzes_completed = quizzes_completed + 1,
      correct_answers = correct_answers + p_correct_count,
      total_answered = total_answered + p_total_questions,
      avg_time_ms = v_new_avg_ms,
      badges = v_badges,
      updated_at = NOW()
  WHERE id = v_student.id;

  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', v_total_xp,
    'base_xp', v_base_xp,
    'speed_bonus', v_speed_bonus,
    'marathon_bonus', v_marathon_bonus,
    'xp_total', v_new_xp,
    'level', v_new_level,
    'badges', v_badges,
    'new_badges', v_new_badges
  );
END;
$$;

-- 10.4 Histórico Individual do Aluno
CREATE OR REPLACE FUNCTION public.get_student_history(
  p_student_id UUID,
  p_pin TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists BOOLEAN;
  v_attempts JSONB;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.students
    WHERE id = p_student_id
      AND UPPER(REPLACE(TRIM(pin_code), '-', '')) = UPPER(REPLACE(TRIM(p_pin), '-', ''))
  ) INTO v_exists;

  IF NOT v_exists THEN
    RETURN jsonb_build_object('success', false, 'error', 'Não autorizado.');
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO v_attempts
  FROM (
    SELECT id, module_id, module_title, xp_earned, correct_count,
           total_questions, accuracy_pct, duration_seconds, created_at
    FROM public.challenge_attempts
    WHERE student_id = p_student_id
    ORDER BY created_at DESC
    LIMIT 50
  ) t;

  RETURN jsonb_build_object('success', true, 'attempts', v_attempts);
END;
$$;

-- 10.5 Relatório Pedagógico da Turma para o Professor
CREATE OR REPLACE FUNCTION public.get_class_attempts_for_teacher(
  p_class_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner BOOLEAN;
  v_rows JSONB;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = p_class_id AND professor_id = auth.uid()
  ) INTO v_owner;

  IF NOT v_owner THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso negado a esta turma.');
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  INTO v_rows
  FROM (
    SELECT ca.id, ca.student_id, s.full_name AS student_name, s.registration_code,
           ca.module_id, ca.module_title, ca.xp_earned, ca.correct_count,
           ca.total_questions, ca.accuracy_pct, ca.duration_seconds,
           ca.question_breakdown, ca.created_at
    FROM public.challenge_attempts ca
    JOIN public.students s ON s.id = ca.student_id
    WHERE ca.class_id = p_class_id
    ORDER BY ca.created_at DESC
    LIMIT 1000
  ) t;

  RETURN jsonb_build_object('success', true, 'attempts', v_rows);
END;
$$;

-- 10.6 Zerar Pontuações da Turma (Nova Rodada / Novo Bimestre)
CREATE OR REPLACE FUNCTION public.reset_class_progress(
  p_class_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_owner BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = p_class_id AND professor_id = auth.uid()
  ) INTO v_owner;

  IF NOT v_owner THEN
    RETURN jsonb_build_object('success', false, 'error', 'Acesso negado.');
  END IF;

  DELETE FROM public.challenge_attempts WHERE class_id = p_class_id;

  UPDATE public.students
  SET xp_total = 0,
      level = 1,
      streak_best = 0,
      quizzes_completed = 0,
      correct_answers = 0,
      total_answered = 0,
      avg_time_ms = 0,
      badges = '[]'::jsonb,
      updated_at = NOW()
  WHERE class_id = p_class_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.student_login_with_pin(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_student_avatar(UUID, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_challenge_result(UUID, TEXT, TEXT, TEXT, INT, INT, INT, INT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_student_history(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_class_attempts_for_teacher(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_class_progress(UUID) TO authenticated;

-- 11. HABILITAR REALTIME PARA RANKING AO VIVO
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'students'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
  END IF;
END $$;
