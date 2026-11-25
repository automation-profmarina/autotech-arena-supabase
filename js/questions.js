/**
 * AUTOTECH ARENA - Banco Técnico de Questões, Diagramas SVG, Avatares e Medalhas
 * Conteúdo alinhado à ementa do 2º Ano do Curso Técnico em Automação Industrial.
 */
window.AutoTechData = (function () {
  const AVATARS = [
    {
      id: "plc",
      name: "Controlador CLP",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="10" y="8" width="44" height="48" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><rect x="16" y="14" width="32" height="14" rx="2" fill="#083344"/><circle cx="22" cy="21" r="2.5" fill="#10b981"/><circle cx="30" cy="21" r="2.5" fill="#10b981"/><circle cx="38" cy="21" r="2.5" fill="#f59e0b"/><rect x="16" y="34" width="32" height="16" rx="2" fill="#1e293b"/><path d="M20 40h6v4h-6zM29 40h6v4h-6zM38 40h6v4h-6z" fill="#38bdf8"/></svg>`
    },
    {
      id: "robot",
      name: "Braço Robótico",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="14" y="48" width="36" height="8" rx="3" fill="#334155" stroke="#f59e0b" stroke-width="2"/><path d="M26 48 L20 32 L36 18 L46 24" fill="none" stroke="#f59e0b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="32" r="4.5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><circle cx="36" cy="18" r="4.5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><path d="M45 20 L52 17 M45 27 L52 30" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/></svg>`
    },
    {
      id: "sensor",
      name: "Sensor Indutivo",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="22" y="16" width="20" height="34" rx="3" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/><rect x="24" y="10" width="16" height="6" rx="1" fill="#06b6d4"/><path d="M16 8 Q32 2 48 8" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/><path d="M20 13 Q32 8 44 13" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="24" x2="42" y2="24" stroke="#64748b" stroke-width="2"/><line x1="22" y1="32" x2="42" y2="32" stroke="#64748b" stroke-width="2"/><circle cx="32" cy="42" r="3" fill="#f59e0b"/></svg>`
    },
    {
      id: "motor",
      name: "Motor Trifásico",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="14" y="18" width="32" height="28" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/><rect x="46" y="27" width="10" height="10" rx="1" fill="#94a3b8"/><rect x="20" y="11" width="18" height="7" rx="1.5" fill="#0284c7"/><line x1="18" y1="24" x2="42" y2="24" stroke="#475569" stroke-width="2"/><line x1="18" y1="32" x2="42" y2="32" stroke="#475569" stroke-width="2"/><line x1="18" y1="40" x2="42" y2="40" stroke="#475569" stroke-width="2"/><path d="M12 46 L10 53 L20 53 M48 46 L50 53 L40 53" stroke="#94a3b8" stroke-width="2.5" fill="none"/></svg>`
    },
    {
      id: "pneumatic",
      name: "Atuador Pneumático",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="10" y="22" width="28" height="20" rx="3" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/><rect x="38" y="29" width="16" height="6" fill="#cbd5e1"/><rect x="52" y="25" width="4" height="14" rx="1" fill="#f59e0b"/><line x1="16" y1="15" x2="16" y2="22" stroke="#38bdf8" stroke-width="2.5"/><line x1="32" y1="15" x2="32" y2="22" stroke="#38bdf8" stroke-width="2.5"/></svg>`
    },
    {
      id: "logic",
      name: "Porta Lógica",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><line x1="8" y1="24" x2="20" y2="24" stroke="#10b981" stroke-width="3"/><line x1="8" y1="40" x2="20" y2="40" stroke="#10b981" stroke-width="3"/><path d="M20 16 H32 A16 16 0 0 1 32 48 H20 Z" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><line x1="48" y1="32" x2="58" y2="32" stroke="#f59e0b" stroke-width="3"/></svg>`
    },
    {
      id: "scada",
      name: "Operador IHM",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><rect x="10" y="12" width="44" height="34" rx="4" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/><polyline points="16,34 24,24 31,31 40,19 48,26" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/><rect x="24" y="46" width="16" height="6" fill="#475569"/><rect x="18" y="52" width="28" height="3" rx="1.5" fill="#64748b"/></svg>`
    },
    {
      id: "helmet",
      name: "Técnico Campo",
      svg: `<svg viewBox="0 0 64 64" class="w-full h-full"><path d="M14 36 A18 18 0 0 1 50 36 Z" fill="#f59e0b" stroke="#fef3c7" stroke-width="2"/><rect x="10" y="35" width="44" height="5" rx="2.5" fill="#d97706"/><path d="M28 18 V35 M36 18 V35" stroke="#b45309" stroke-width="2"/><path d="M22 44 Q32 52 42 44" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/></svg>`
    }
  ];

  const BADGE_CATALOG = [
    {
      id: "precisao_cirurgica",
      title: "Precisão Cirúrgica",
      desc: "Concluiu um módulo com 100% de acerto.",
      icon: "🎯",
      color: "emerald"
    },
    {
      id: "combo_industrial",
      title: "Combo Industrial",
      desc: "Acertou 5 ou mais questões consecutivas sem errar.",
      icon: "⚡",
      color: "amber"
    },
    {
      id: "tecnico_pleno",
      title: "Técnico Pleno",
      desc: "Ultrapassou 1.000 XP acumulados na plataforma.",
      icon: "🛠️",
      color: "cyan"
    },
    {
      id: "especialista_clp",
      title: "Especialista em CLP",
      desc: "Gabaritou o módulo de CLP & Lógica Ladder.",
      icon: "📟",
      color: "blue"
    },
    {
      id: "velocista_scada",
      title: "Velocista SCADA",
      desc: "Acertou ≥ 80% com tempo médio menor que 8s/questão.",
      icon: "🚀",
      color: "purple"
    },
    {
      id: "mestre_automacao",
      title: "Mestre da Automação",
      desc: "Alcançou 3.000 XP acumulados em desafios.",
      icon: "🏆",
      color: "yellow"
    }
  ];

  const MODULES = [
    {
      id: "portas_logicas",
      title: "Portas Lógicas & Álgebra Booleana",
      shortTitle: "Portas Lógicas",
      tag: "DIG-01",
      color: "cyan",
      timePerQuestion: 25,
      description: "Intertravamentos de segurança, tabelas-verdade, portas AND, OR, NOT, NAND, NOR e XOR aplicadas a células robotizadas."
    },
    {
      id: "clp",
      title: "CLP & Programação Ladder",
      shortTitle: "CLP & Ladder",
      tag: "PLC-02",
      color: "blue",
      timePerQuestion: 30,
      description: "Lógica de selo, bobinas SET/RESET, temporizadores TON/TOF, contadores CTU e cartões digitais 24Vcc."
    },
    {
      id: "sensores",
      title: "Sensores Industriais",
      shortTitle: "Sensores",
      tag: "SEN-03",
      color: "emerald",
      timePerQuestion: 25,
      description: "Sensores indutivos, capacitivos, fotoelétricos, ultrassônicos, PNP/NPN e histerese na detecção de peças."
    },
    {
      id: "variaveis_fisicas",
      title: "Variáveis Físicas & Instrumentação",
      shortTitle: "Variáveis Físicas",
      tag: "INS-04",
      color: "amber",
      timePerQuestion: 30,
      description: "Transmissores 4–20 mA e 0–10 V, PT100, pressão manométrica, vazão e conversão analógico-digital (A/D)."
    },
    {
      id: "pneumatica",
      title: "Atuadores & Eletropneumática",
      shortTitle: "Pneumática",
      tag: "PNE-05",
      color: "purple",
      timePerQuestion: 30,
      description: "Cálculo de força (F = P × A), válvulas direcionais 3/2 e 5/2 vias, unidade FRL e cilindros de dupla ação."
    },
    {
      id: "motores",
      title: "Motores Elétricos & Acionamentos",
      shortTitle: "Motores Elétricos",
      tag: "MOT-06",
      color: "rose",
      timePerQuestion: 30,
      description: "Motor de indução trifásico (MIT), partida Estrela-Triângulo, inversor de frequência (V/f), relé térmico e escorregamento."
    }
  ];

  const QUESTIONS = [
    // ==================== 1. PORTAS LÓGICAS ====================
    {
      id: "pl_1",
      moduleId: "portas_logicas",
      context: "Prensa hidráulica industrial equipada com comando bimanual de segurança (NR-12). O cilindro só deve avançar quando ambos os botões (B1 e B2) forem pressionados.",
      objective: "Identificar a porta lógica que garante o acionamento seguro da prensa.",
      question: "Qual porta lógica representa exatamente a condição necessária para o avanço da prensa (Saída Q = 1 somente quando B1 = 1 e B2 = 1)?",
      options: [
        "Porta AND (E)",
        "Porta OR (OU)",
        "Porta XOR (OU Exclusivo)",
        "Porta NOR (NÃO-OU)"
      ],
      correctIndex: 0,
      explanation: "A porta AND (E) fornece nível lógico 1 na saída exclusivamente quando todas as suas entradas estiverem simultaneamente em nível lógico 1 (Q = B1 · B2).",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="15" y="38" fill="#94a3b8" font-size="12" font-family="monospace">B1 = 1</text><text x="15" y="88" fill="#94a3b8" font-size="12" font-family="monospace">B2 = 0</text><line x1="68" y1="34" x2="130" y2="34" stroke="#10b981" stroke-width="3"/><line x1="68" y1="84" x2="130" y2="84" stroke="#64748b" stroke-width="3"/><path d="M130 20 H175 A40 40 0 0 1 175 98 H130 Z" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><text x="145" y="63" fill="#38bdf8" font-size="13" font-weight="bold">AND</text><line x1="215" y1="59" x2="285" y2="59" stroke="#64748b" stroke-width="3"/><text x="292" y="63" fill="#f43f5e" font-size="12" font-family="monospace">Q = 0</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="15" y="38" fill="#10b981" font-size="12" font-family="monospace">B1 = 1</text><text x="15" y="88" fill="#10b981" font-size="12" font-family="monospace">B2 = 1</text><line x1="68" y1="34" x2="130" y2="34" stroke="#10b981" stroke-width="3.5"/><line x1="68" y1="84" x2="130" y2="84" stroke="#10b981" stroke-width="3.5"/><path d="M130 20 H175 A40 40 0 0 1 175 98 H130 Z" fill="#083344" stroke="#10b981" stroke-width="3"/><text x="145" y="63" fill="#10b981" font-size="13" font-weight="bold">AND</text><line x1="215" y1="59" x2="285" y2="59" stroke="#10b981" stroke-width="3.5"/><text x="292" y="63" fill="#10b981" font-size="12" font-weight="bold" font-family="monospace">Q = 1</text></svg>`
    },
    {
      id: "pl_2",
      moduleId: "portas_logicas",
      context: "Sistema de alarme de uma caldeira recebe sinais de três sensores críticos: Sobrepressão (P), Sobretemperatura (T) e Baixo Nível (N). Qualquer anomalia (nível 1) deve disparar a sirene.",
      objective: "Selecionar a função lógica adequada para detecção de falhas múltiplas.",
      question: "Qual expressão booleana aciona a sirene (S = 1) se pelo menos um dos sensores detectar falha?",
      options: [
        "S = P + T + N (Porta OR)",
        "S = P · T · N (Porta AND)",
        "S = P ⊕ T (Porta XOR)",
        "S = (P + T + N)' (Porta NOR)"
      ],
      correctIndex: 0,
      explanation: "Na álgebra booleana, o operador '+' representa a porta OR (OU): basta que uma das variáveis seja 1 para que a saída S assuma nível lógico 1.",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="12" y="30" fill="#94a3b8" font-size="11" font-family="monospace">P = 0</text><text x="12" y="62" fill="#94a3b8" font-size="11" font-family="monospace">T = 0</text><text x="12" y="94" fill="#94a3b8" font-size="11" font-family="monospace">N = 0</text><line x1="55" y1="26" x2="128" y2="26" stroke="#64748b" stroke-width="2.5"/><line x1="55" y1="58" x2="132" y2="58" stroke="#64748b" stroke-width="2.5"/><line x1="55" y1="90" x2="128" y2="90" stroke="#64748b" stroke-width="2.5"/><path d="M120 18 Q155 18 205 58 Q155 98 120 98 Q140 58 120 18 Z" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><text x="148" y="62" fill="#38bdf8" font-size="12" font-weight="bold">OR</text><line x1="205" y1="58" x2="275" y2="58" stroke="#64748b" stroke-width="2.5"/><text x="282" y="62" fill="#94a3b8" font-size="12" font-family="monospace">S = 0</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="12" y="30" fill="#f43f5e" font-size="11" font-family="monospace">P = 1!</text><text x="12" y="62" fill="#94a3b8" font-size="11" font-family="monospace">T = 0</text><text x="12" y="94" fill="#94a3b8" font-size="11" font-family="monospace">N = 0</text><line x1="55" y1="26" x2="128" y2="26" stroke="#f43f5e" stroke-width="3"/><line x1="55" y1="58" x2="132" y2="58" stroke="#64748b" stroke-width="2.5"/><line x1="55" y1="90" x2="128" y2="90" stroke="#64748b" stroke-width="2.5"/><path d="M120 18 Q155 18 205 58 Q155 98 120 98 Q140 58 120 18 Z" fill="#3f121d" stroke="#f43f5e" stroke-width="3"/><text x="148" y="62" fill="#fda4af" font-size="12" font-weight="bold">OR</text><line x1="205" y1="58" x2="275" y2="58" stroke="#f43f5e" stroke-width="3.5"/><text x="282" y="62" fill="#f43f5e" font-size="12" font-weight="bold" font-family="monospace">S = 1</text></svg>`
    },
    {
      id: "pl_3",
      moduleId: "portas_logicas",
      context: "Em um circuito digital TTL/CMOS de um painel de sinalização, uma porta NAND de 2 entradas recebe A = 1 e B = 1.",
      objective: "Determinar o estado lógico de saída da porta NAND.",
      question: "Qual será o nível lógico na saída Y de uma porta NAND quando ambas as entradas A e B estiverem em nível lógico 1?",
      options: [
        "Y = 0 (nível lógico baixo)",
        "Y = 1 (nível lógico alto)",
        "Alta impedância (Tri-state)",
        "Oscilação entre 0 e 1"
      ],
      correctIndex: 0,
      explanation: "A porta NAND é a negação da porta AND: Y = (A · B)'. Como 1 · 1 = 1, a negação resulta em Y = 0.",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="20" y="40" fill="#10b981" font-size="12" font-family="monospace">A = 1</text><text x="20" y="84" fill="#10b981" font-size="12" font-family="monospace">B = 1</text><line x1="68" y1="36" x2="130" y2="36" stroke="#10b981" stroke-width="3"/><line x1="68" y1="80" x2="130" y2="80" stroke="#10b981" stroke-width="3"/><path d="M130 20 H170 A38 38 0 0 1 170 96 H130 Z" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><circle cx="214" cy="58" r="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="140" y="62" fill="#38bdf8" font-size="12" font-weight="bold">NAND</text><line x1="220" y1="58" x2="285" y2="58" stroke="#64748b" stroke-width="3"/><text x="292" y="62" fill="#f43f5e" font-size="12" font-family="monospace">Y = ?</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="20" y="40" fill="#10b981" font-size="12" font-family="monospace">A = 1</text><text x="20" y="84" fill="#10b981" font-size="12" font-family="monospace">B = 1</text><line x1="68" y1="36" x2="130" y2="36" stroke="#10b981" stroke-width="3"/><line x1="68" y1="80" x2="130" y2="80" stroke="#10b981" stroke-width="3"/><path d="M130 20 H170 A38 38 0 0 1 170 96 H130 Z" fill="#083344" stroke="#06b6d4" stroke-width="2.5"/><circle cx="214" cy="58" r="6" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"/><text x="140" y="62" fill="#38bdf8" font-size="12" font-weight="bold">NAND</text><line x1="220" y1="58" x2="285" y2="58" stroke="#f43f5e" stroke-width="3"/><text x="292" y="62" fill="#f43f5e" font-size="12" font-weight="bold" font-family="monospace">Y = 0</text></svg>`
    },
    {
      id: "pl_4",
      moduleId: "portas_logicas",
      context: "Uma esteira seletora possui dois sensores ópticos (S1 e S2) para detectar caixas fora de padrão. O atuador de rejeição (R) deve ser acionado apenas quando os sensores apresentarem estados lógicos diferentes entre si.",
      objective: "Aplicar a tabela-verdade da porta XOR (OU Exclusivo).",
      question: "Qual porta lógica aciona a saída R = 1 exclusivamente quando as duas entradas têm valores opostos (0 e 1, ou 1 e 0)?",
      options: [
        "Porta XOR (OU Exclusivo)",
        "Porta XNOR (Coincidência)",
        "Porta NAND",
        "Porta Buffer"
      ],
      correctIndex: 0,
      explanation: "A porta XOR (OU Exclusivo) é um detector de desigualdade: sua saída é 1 quando as entradas são diferentes (A ≠ B) e 0 quando são iguais.",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="18" y="40" fill="#10b981" font-size="12" font-family="monospace">S1 = 1</text><text x="18" y="84" fill="#64748b" font-size="12" font-family="monospace">S2 = 0</text><line x1="70" y1="36" x2="126" y2="36" stroke="#10b981" stroke-width="3"/><line x1="70" y1="80" x2="126" y2="80" stroke="#64748b" stroke-width="3"/><path d="M118 18 Q138 58 118 98" fill="none" stroke="#f59e0b" stroke-width="2.5"/><path d="M128 18 Q162 18 210 58 Q162 98 128 98 Q148 58 128 18 Z" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="150" y="62" fill="#fbbf24" font-size="12" font-weight="bold">XOR</text><line x1="210" y1="58" x2="280" y2="58" stroke="#10b981" stroke-width="3"/><text x="288" y="62" fill="#10b981" font-size="12" font-family="monospace">R = 1</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><text x="18" y="40" fill="#10b981" font-size="12" font-family="monospace">S1 = 1</text><text x="18" y="84" fill="#10b981" font-size="12" font-family="monospace">S2 = 1</text><line x1="70" y1="36" x2="126" y2="36" stroke="#10b981" stroke-width="3"/><line x1="70" y1="80" x2="126" y2="80" stroke="#10b981" stroke-width="3"/><path d="M118 18 Q138 58 118 98" fill="none" stroke="#f59e0b" stroke-width="2.5"/><path d="M128 18 Q162 18 210 58 Q162 98 128 98 Q148 58 128 18 Z" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="150" y="62" fill="#fbbf24" font-size="12" font-weight="bold">XOR</text><line x1="210" y1="58" x2="280" y2="58" stroke="#64748b" stroke-width="3"/><text x="288" y="62" fill="#f43f5e" font-size="12" font-family="monospace">R = 0</text></svg>`
    },
    {
      id: "pl_5",
      moduleId: "portas_logicas",
      context: "Durante a simplificação de um circuito lógico de intertravamento, o técnico precisa aplicar o Teorema de De Morgan na expressão Y = (A · B)'.",
      objective: "Aplicar corretamente os Teoremas de De Morgan.",
      question: "De acordo com o Teorema de De Morgan, a expressão booleana (A · B)' é logicamente equivalente a:",
      options: [
        "A' + B'",
        "A' · B'",
        "A + B",
        "(A + B)'"
      ],
      correctIndex: 0,
      explanation: "Pelo 1º Teorema de De Morgan, o complemento de um produto lógico é igual à soma dos complementos individuais: (A · B)' = A' + B'.",
      svgNormal: `<svg viewBox="0 0 360 110" class="w-full h-28"><rect x="30" y="20" width="120" height="70" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/><text x="52" y="60" fill="#38bdf8" font-size="16" font-weight="bold" font-family="monospace">(A · B)'</text><text x="168" y="60" fill="#f59e0b" font-size="18" font-weight="bold">≡</text><rect x="205" y="20" width="125" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="232" y="60" fill="#10b981" font-size="16" font-weight="bold" font-family="monospace">A' + B'</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 110" class="w-full h-28"><rect x="30" y="20" width="120" height="70" rx="8" fill="#083344" stroke="#06b6d4" stroke-width="2.5"/><text x="48" y="50" fill="#38bdf8" font-size="13" font-family="monospace">NAND(A,B)</text><text x="58" y="72" fill="#94a3b8" font-size="11" font-family="monospace">Negação AND</text><text x="168" y="60" fill="#f59e0b" font-size="18" font-weight="bold">≡</text><rect x="205" y="20" width="125" height="70" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="220" y="50" fill="#10b981" font-size="13" font-family="monospace">OR(A', B')</text><text x="224" y="72" fill="#a7f3d0" font-size="11" font-family="monospace">Soma Invertida</text></svg>`
    },

    // ==================== 2. CLP & LADDER ====================
    {
      id: "clp_1",
      moduleId: "clp",
      context: "Em um programa Ladder para partida direta de uma bomba, a botoeira de emergência/desliga (I0.1) é fisicamente um contato Normalmente Fechado (NF) ligado à entrada digital do CLP.",
      objective: "Escolher a instrução Ladder correta para leitura de contato físico NF.",
      question: "Para que a lógica de selo funcione corretamente em condições normais (botão NF não pressionado enviando 24Vcc à entrada I0.1), qual instrução deve ser usada no Ladder?",
      options: [
        "Contato Normalmente Aberto — | | — (XIC)",
        "Contato Normalmente Fechado — |/| — (XIO)",
        "Bobina de Reset — (R) —",
        "Detector de borda de descida — |N| —"
      ],
      correctIndex: 0,
      explanation: "Como o botão físico NF mantém nível lógico 1 na entrada I0.1 em repouso, a instrução —| |— (Examinar se Fechado) conduz energia lógica enquanto ninguém pressionar o botão.",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><line x1="20" y1="20" x2="20" y2="100" stroke="#38bdf8" stroke-width="3"/><line x1="340" y1="20" x2="340" y2="100" stroke="#38bdf8" stroke-width="3"/><line x1="20" y1="45" x2="80" y2="45" stroke="#10b981" stroke-width="2.5"/><text x="82" y="28" fill="#94a3b8" font-size="11" font-family="monospace">I0.0(Liga)</text><line x1="80" y1="35" x2="80" y2="55" stroke="#38bdf8" stroke-width="2.5"/><line x1="100" y1="35" x2="100" y2="55" stroke="#38bdf8" stroke-width="2.5"/><line x1="100" y1="45" x2="175" y2="45" stroke="#64748b" stroke-width="2.5"/><text x="172" y="28" fill="#f59e0b" font-size="11" font-family="monospace">I0.1(NF)</text><line x1="175" y1="35" x2="175" y2="55" stroke="#10b981" stroke-width="2.5"/><line x1="195" y1="35" x2="195" y2="55" stroke="#10b981" stroke-width="2.5"/><line x1="195" y1="45" x2="280" y2="45" stroke="#64748b" stroke-width="2.5"/><text x="278" y="28" fill="#94a3b8" font-size="11" font-family="monospace">Q0.0</text><text x="276" y="50" fill="#38bdf8" font-size="15" font-family="monospace">( )</text><line x1="304" y1="45" x2="340" y2="45" stroke="#64748b" stroke-width="2.5"/><path d="M50 45 V85 H80 M100 85 H135 V45" fill="none" stroke="#38bdf8" stroke-width="2"/><line x1="80" y1="75" x2="80" y2="95" stroke="#38bdf8" stroke-width="2"/><line x1="100" y1="75" x2="100" y2="95" stroke="#38bdf8" stroke-width="2"/><text x="76" y="108" fill="#94a3b8" font-size="10" font-family="monospace">Q0.0</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><line x1="20" y1="20" x2="20" y2="100" stroke="#10b981" stroke-width="3"/><line x1="340" y1="20" x2="340" y2="100" stroke="#10b981" stroke-width="3"/><line x1="20" y1="45" x2="175" y2="45" stroke="#10b981" stroke-width="3"/><text x="80" y="28" fill="#10b981" font-size="11" font-family="monospace">I0.0=1</text><text x="172" y="28" fill="#10b981" font-size="11" font-family="monospace">I0.1=1</text><line x1="195" y1="45" x2="280" y2="45" stroke="#10b981" stroke-width="3"/><text x="274" y="28" fill="#10b981" font-size="11" font-weight="bold" font-family="monospace">Q0.0=1</text><text x="276" y="50" fill="#10b981" font-size="15" font-weight="bold" font-family="monospace">(●)</text><line x1="304" y1="45" x2="340" y2="45" stroke="#10b981" stroke-width="3"/><path d="M50 45 V85 H135 V45" fill="none" stroke="#10b981" stroke-width="2.5"/><text x="72" y="108" fill="#10b981" font-size="10" font-family="monospace">SELO ATIVO</text></svg>`
    },
    {
      id: "clp_2",
      moduleId: "clp",
      context: "Uma esteira de transporte precisa aguardar 8 segundos após o acionamento de uma sirene de alerta antes de iniciar o movimento do motor.",
      objective: "Selecionar o bloco temporizador IEC 61131-3 adequado para retardo na energização.",
      question: "Qual bloco temporizador deve ser utilizado para retardar a ativação da saída em 8 segundos após a entrada passar para nível 1?",
      options: [
        "TON (Timer On-Delay)",
        "TOF (Timer Off-Delay)",
        "CTU (Count Up)",
        "SR (Flip-Flop Set-Reset)"
      ],
      correctIndex: 0,
      explanation: "O temporizador TON (On-Delay) inicia a contagem quando sua entrada IN vai para 1 e só ativa a saída Q após decorrido o tempo pré-selecionado (PT = T#8s).",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><rect x="115" y="18" width="130" height="84" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/><text x="162" y="40" fill="#38bdf8" font-size="14" font-weight="bold" font-family="monospace">TON</text><line x1="40" y1="52" x2="115" y2="52" stroke="#10b981" stroke-width="2.5"/><text x="44" y="45" fill="#94a3b8" font-size="11" font-family="monospace">IN = 1</text><text x="44" y="82" fill="#f59e0b" font-size="11" font-family="monospace">PT = 8s</text><line x1="245" y1="52" x2="320" y2="52" stroke="#64748b" stroke-width="2.5"/><text x="256" y="45" fill="#94a3b8" font-size="11" font-family="monospace">Q = 0</text><text x="142" y="78" fill="#94a3b8" font-size="11" font-family="monospace">ET: 3.2s</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><rect x="115" y="18" width="130" height="84" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="3"/><text x="162" y="40" fill="#10b981" font-size="14" font-weight="bold" font-family="monospace">TON</text><line x1="40" y1="52" x2="115" y2="52" stroke="#10b981" stroke-width="3"/><text x="44" y="45" fill="#10b981" font-size="11" font-family="monospace">IN = 1</text><text x="44" y="82" fill="#fbbf24" font-size="11" font-family="monospace">PT = 8s</text><line x1="245" y1="52" x2="320" y2="52" stroke="#10b981" stroke-width="3.5"/><text x="256" y="45" fill="#10b981" font-size="11" font-weight="bold" font-family="monospace">Q = 1</text><text x="142" y="78" fill="#a7f3d0" font-size="11" font-family="monospace">ET: 8.0s</text></svg>`
    },
    {
      id: "clp_3",
      moduleId: "clp",
      context: "Durante a varredura cíclica (Scan Cycle) de um CLP industrial, a CPU executa etapas sequenciais bem definidas a cada poucos milissegundos.",
      objective: "Compreender a ordem correta do ciclo de varredura de um CLP.",
      question: "Qual é a sequência padrão de execução do ciclo de varredura (Scan) de um CLP?",
      options: [
        "Leitura das entradas → Execução do programa do usuário → Atualização das saídas",
        "Atualização das saídas → Execução do programa → Leitura das entradas",
        "Execução do programa → Formatação da memória → Leitura das entradas",
        "Leitura analógica → Reinicialização da CPU → Atualização das saídas"
      ],
      correctIndex: 0,
      explanation: "O CLP primeiro lê a imagem das entradas físicas, depois processa todas as linhas da lógica (Ladder/FBD) e, ao final do ciclo, escreve os resultados nas saídas.",
      svgNormal: `<svg viewBox="0 0 360 110" class="w-full h-28"><rect x="15" y="30" width="95" height="50" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/><text x="28" y="52" fill="#38bdf8" font-size="11" font-weight="bold">1. ENTRADAS</text><text x="34" y="68" fill="#94a3b8" font-size="10">Leitura I/O</text><path d="M112 55 H130" stroke="#f59e0b" stroke-width="2.5"/><rect x="132" y="30" width="95" height="50" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><text x="144" y="52" fill="#fbbf24" font-size="11" font-weight="bold">2. PROGRAMA</text><text x="148" y="68" fill="#94a3b8" font-size="10">CPU / Ladder</text><path d="M229 55 H247" stroke="#f59e0b" stroke-width="2.5"/><rect x="249" y="30" width="95" height="50" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="266" y="52" fill="#10b981" font-size="11" font-weight="bold">3. SAÍDAS</text><text x="265" y="68" fill="#94a3b8" font-size="10">Escrita Q/O</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 110" class="w-full h-28"><rect x="15" y="30" width="95" height="50" rx="6" fill="#083344" stroke="#06b6d4" stroke-width="2.5"/><text x="28" y="52" fill="#38bdf8" font-size="11" font-weight="bold">1. ENTRADAS</text><text x="34" y="68" fill="#e0f2fe" font-size="10">PII (t=0ms)</text><path d="M112 55 H130" stroke="#10b981" stroke-width="3"/><rect x="132" y="30" width="95" height="50" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/><text x="144" y="52" fill="#fbbf24" font-size="11" font-weight="bold">2. PROGRAMA</text><text x="148" y="68" fill="#fef3c7" font-size="10">Scan ~2ms</text><path d="M229 55 H247" stroke="#10b981" stroke-width="3"/><rect x="249" y="30" width="95" height="50" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="266" y="52" fill="#10b981" font-size="11" font-weight="bold">3. SAÍDAS</text><text x="265" y="68" fill="#d1fae5" font-size="10">PIQ (t=3ms)</text></svg>`
    },
    {
      id: "clp_4",
      moduleId: "clp",
      context: "Em uma linha de envase, cada lote deve conter exatamente 24 garrafas. Um sensor óptico envia pulsos para a entrada CU de um contador crescente (CTU) com PV = 24.",
      objective: "Identificar o funcionamento do contador crescente CTU no CLP.",
      question: "Quando o valor acumulado (CV) do contador CTU atingir 24 pulsos, o que ocorre com sua saída booleana Q?",
      options: [
        "Q passa para nível lógico 1 e permanece ativa até que a entrada Reset (R) seja acionada",
        "Q gera apenas um pulso de 1 milissegundo e zera CV automaticamente",
        "Q desliga a CPU do CLP por excesso de contagem",
        "CV retorna para zero sem alterar o estado da saída Q"
      ],
      correctIndex: 0,
      explanation: "No bloco CTU padrão IEC, quando CV >= PV, a saída Q torna-se 1 e permanece retida até que a entrada R (Reset) zere o valor acumulado CV.",
      svgNormal: `<svg viewBox="0 0 360 120" class="w-full h-32"><rect x="115" y="16" width="130" height="88" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2.5"/><text x="162" y="38" fill="#38bdf8" font-size="14" font-weight="bold" font-family="monospace">CTU</text><line x1="45" y1="48" x2="115" y2="48" stroke="#10b981" stroke-width="2.5"/><text x="48" y="42" fill="#94a3b8" font-size="11" font-family="monospace">CU (Pulso)</text><line x1="45" y1="78" x2="115" y2="78" stroke="#64748b" stroke-width="2.5"/><text x="48" y="72" fill="#94a3b8" font-size="11" font-family="monospace">R = 0</text><text x="142" y="64" fill="#fbbf24" font-size="11" font-family="monospace">PV = 24</text><text x="142" y="84" fill="#94a3b8" font-size="11" font-family="monospace">CV = 23</text><line x1="245" y1="48" x2="315" y2="48" stroke="#64748b" stroke-width="2.5"/><text x="255" y="42" fill="#94a3b8" font-size="11" font-family="monospace">Q = 0</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 120" class="w-full h-32"><rect x="115" y="16" width="130" height="88" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="3"/><text x="162" y="38" fill="#10b981" font-size="14" font-weight="bold" font-family="monospace">CTU</text><line x1="45" y1="48" x2="115" y2="48" stroke="#10b981" stroke-width="3"/><text x="48" y="42" fill="#10b981" font-size="11" font-family="monospace">+1 Pulso!</text><line x1="45" y1="78" x2="115" y2="78" stroke="#64748b" stroke-width="2.5"/><text x="48" y="72" fill="#94a3b8" font-size="11" font-family="monospace">R = 0</text><text x="142" y="64" fill="#fbbf24" font-size="11" font-family="monospace">PV = 24</text><text x="142" y="84" fill="#10b981" font-size="11" font-weight="bold" font-family="monospace">CV = 24</text><line x1="245" y1="48" x2="315" y2="48" stroke="#10b981" stroke-width="3.5"/><text x="255" y="42" fill="#10b981" font-size="11" font-weight="bold" font-family="monospace">Q = 1</text></svg>`
    },
    {
      id: "clp_5",
      moduleId: "clp",
      context: "Um painel elétrico utiliza um CLP com entradas digitais padrão Sink (NPN interno, comum ligado ao 0Vcc). Você precisa conectar um sensor de 3 fios a essa entrada.",
      objective: "Garantir compatibilidade elétrica entre sensor e cartão de entrada digital do CLP.",
      question: "Qual tipo de saída de sensor de 3 fios deve ser utilizado para comutar +24Vcc na entrada digital tipo Sink do CLP?",
      options: [
        "Sensor PNP (chaveia o positivo +24Vcc para a entrada do CLP)",
        "Sensor NPN (chaveia o negativo 0Vcc)",
        "Sensor com saída a termopar tipo K",
        "Sensor com saída em corrente 4–20 mA"
      ],
      correctIndex: 0,
      explanation: "Entradas digitais tipo Sink (comum em 0V) aguardam potencial positivo (+24Vcc) para reconhecer nível lógico 1; portanto, exigem sensores do tipo PNP.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="20" width="110" height="75" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="42" y="45" fill="#10b981" font-size="12" font-weight="bold">SENSOR PNP</text><text x="38" y="66" fill="#94a3b8" font-size="10">Chaveia +24Vcc</text><line x1="135" y1="55" x2="225" y2="55" stroke="#f59e0b" stroke-width="3"/><text x="155" y="47" fill="#fbbf24" font-size="11" font-family="monospace">+24Vcc</text><rect x="225" y="20" width="110" height="75" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="242" y="45" fill="#38bdf8" font-size="12" font-weight="bold">CLP (SINK)</text><text x="240" y="66" fill="#94a3b8" font-size="10">Comum = 0Vcc</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="20" width="110" height="75" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="42" y="45" fill="#10b981" font-size="12" font-weight="bold">SENSOR PNP</text><text x="38" y="66" fill="#d1fae5" font-size="10">Fio Preto = +24V</text><line x1="135" y1="55" x2="225" y2="55" stroke="#10b981" stroke-width="3.5"/><text x="150" y="47" fill="#10b981" font-size="11" font-weight="bold" font-family="monospace">I = +24V →</text><rect x="225" y="20" width="110" height="75" rx="6" fill="#083344" stroke="#38bdf8" stroke-width="2.5"/><text x="242" y="45" fill="#38bdf8" font-size="12" font-weight="bold">LED I0.0 ON</text><text x="240" y="66" fill="#bae6fd" font-size="10">Retorno p/ 0Vcc</text></svg>`
    },

    // ==================== 3. SENSORES INDUSTRIAIS ====================
    {
      id: "sen_1",
      moduleId: "sensores",
      context: "Na linha de montagem de autopeças, é necessário detectar o avanço de uma haste metálica de aço carbono sem contato físico, mesmo em ambiente com poeira e óleo.",
      objective: "Selecionar o princípio de sensoriamento mais robusto para metais.",
      question: "Qual sensor é o mais indicado para detectar exclusivamente alvos metálicos sem contato físico em ambiente industrial severo?",
      options: [
        "Sensor Indutivo",
        "Sensor Capacitivo",
        "Sensor Fotoelétrico por barreira",
        "Sensor Termoresistivo PT100"
      ],
      correctIndex: 0,
      explanation: "Sensores indutivos geram um campo eletromagnético de alta frequência que sofre atenuação por correntes parasitas (Foucault) apenas na presença de materiais metálicos.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="35" y="38" width="95" height="38" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2.5"/><text x="48" y="61" fill="#38bdf8" font-size="11" font-weight="bold">INDUTIVO</text><path d="M138 42 Q152 57 138 72" fill="none" stroke="#38bdf8" stroke-width="2"/><path d="M148 36 Q168 57 148 78" fill="none" stroke="#38bdf8" stroke-width="2"/><rect x="235" y="32" width="45" height="50" rx="3" fill="#64748b" stroke="#cbd5e1" stroke-width="2"/><text x="242" y="61" fill="#f8fafc" font-size="10" font-weight="bold">AÇO</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="35" y="38" width="95" height="38" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="3"/><text x="45" y="61" fill="#10b981" font-size="11" font-weight="bold">ATIVO (LED)</text><path d="M138 42 Q152 57 138 72" fill="none" stroke="#10b981" stroke-width="2.5"/><rect x="165" y="32" width="45" height="50" rx="3" fill="#94a3b8" stroke="#10b981" stroke-width="2.5"/><text x="172" y="61" fill="#0f172a" font-size="10" font-weight="bold">AÇO</text><text x="225" y="61" fill="#10b981" font-size="11" font-family="monospace">Sn = 8mm OK</text></svg>`
    },
    {
      id: "sen_2",
      moduleId: "sensores",
      context: "Uma indústria alimentícia precisa detectar o nível de farinha de trigo (material não metálico) através da parede externa de um silo de plástico (PVC).",
      objective: "Escolher o sensor capaz de detectar sólidos/líquidos não metálicos através de barreiras dielétricas.",
      question: "Qual sensor deve ser instalado na parede externa do silo plástico para detectar o nível de farinha?",
      options: [
        "Sensor Capacitivo (com ajuste de sensibilidade)",
        "Sensor Indutivo faceado",
        "Chave fim de curso mecânica externa",
        "Encoder incremental"
      ],
      correctIndex: 0,
      explanation: "Sensores capacitivos detectam variações na constante dielétrica do meio, permitindo enxergar materiais não metálicos (pós, líquidos, grãos) através de paredes plásticas.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="38" width="95" height="38" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/><text x="46" y="61" fill="#fbbf24" font-size="11" font-weight="bold">CAPACITIVO</text><rect x="145" y="20" width="12" height="75" fill="#38bdf8" opacity="0.6"/><text x="135" y="14" fill="#38bdf8" font-size="10">Parede PVC</text><rect x="157" y="25" width="130" height="65" fill="#451a03" stroke="#f59e0b" stroke-width="1.5"/><text x="185" y="61" fill="#fef3c7" font-size="11">Farinha (εr &gt; 1)</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="38" width="95" height="38" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="3"/><text x="46" y="61" fill="#10b981" font-size="11" font-weight="bold">DETECTADO</text><rect x="145" y="20" width="12" height="75" fill="#38bdf8" opacity="0.8"/><rect x="157" y="25" width="130" height="65" fill="#78350f" stroke="#10b981" stroke-width="2"/><text x="176" y="61" fill="#10b981" font-size="11" font-weight="bold">ΔC → SAÍDA = 1</text></svg>`
    },
    {
      id: "sen_3",
      moduleId: "sensores",
      context: "Em uma linha de engarrafamento, garrafas de vidro transparente e frascos escuros passam a uma distância de 1,5 metro entre o emissor e o receptor.",
      objective: "Selecionar o sistema fotoelétrico de maior alcance e confiabilidade para objetos transparentes ou opacos.",
      question: "Qual configuração de sensor fotoelétrico possui um emissor em uma unidade e um receptor alinhado no lado oposto da esteira?",
      options: [
        "Fotoelétrico por Barreira (Through-Beam)",
        "Fotoelétrico Difuso",
        "Sensor Indutivo não faceado",
        "Termopar tipo J"
      ],
      correctIndex: 0,
      explanation: "No sistema por barreira, o feixe viaja diretamente do emissor ao receptor, oferecendo o maior alcance e alta imunidade à cor ou transparência do objeto.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="35" width="60" height="45" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><text x="35" y="61" fill="#38bdf8" font-size="10" font-weight="bold">EMISSOR</text><line x1="85" y1="57" x2="275" y2="57" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6,4"/><rect x="275" y="35" width="60" height="45" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="2"/><text x="282" y="61" fill="#10b981" font-size="10" font-weight="bold">RECEPTOR</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="35" width="60" height="45" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2"/><text x="35" y="61" fill="#38bdf8" font-size="10" font-weight="bold">EMISSOR</text><line x1="85" y1="57" x2="162" y2="57" stroke="#f43f5e" stroke-width="2.5"/><rect x="162" y="25" width="36" height="65" rx="6" fill="#083344" stroke="#38bdf8" stroke-width="2"/><text x="167" y="61" fill="#e0f2fe" font-size="9">GARRAFA</text><rect x="275" y="35" width="60" height="45" rx="4" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/><text x="280" y="61" fill="#fbbf24" font-size="10" font-weight="bold">FEIXE CORTADO</text></svg>`
    },
    {
      id: "sen_4",
      moduleId: "sensores",
      context: "Um reservatório aberto de tratamento químico precisa de medição contínua de nível sem contato com o líquido corrosivo, calculando o tempo de eco de ondas sonoras de alta frequência.",
      objective: "Identificar o princípio de medição por tempo de voo acústico.",
      question: "Qual tecnologia de sensor mede a distância até a superfície do líquido através do tempo de ida e volta de ondas acústicas?",
      options: [
        "Sensor Ultrassônico",
        "Sensor Indutivo",
        "Chave boia magnética Reed-Switch",
        "Tacogerador CC"
      ],
      correctIndex: 0,
      explanation: "Sensores ultrassônicos emitem pulsos sonoros acima de 20 kHz e calculam a distância pela fórmula d = (v_som × Δt) / 2, sem contato com o fluido.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="145" y="12" width="70" height="24" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2"/><text x="152" y="28" fill="#d8b4fe" font-size="10" font-weight="bold">ULTRASSOM</text><path d="M168 44 Q180 50 192 44" fill="none" stroke="#a855f7" stroke-width="2"/><path d="M162 54 Q180 62 198 54" fill="none" stroke="#a855f7" stroke-width="2"/><rect x="90" y="72" width="180" height="32" fill="#083344" stroke="#06b6d4" stroke-width="2"/><text x="142" y="92" fill="#38bdf8" font-size="11">Fluido Químico</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="145" y="12" width="70" height="24" rx="4" fill="#3b0764" stroke="#a855f7" stroke-width="2.5"/><text x="152" y="28" fill="#f3e8ff" font-size="10" font-weight="bold">Δt = 2.4ms</text><line x1="180" y1="36" x2="180" y2="72" stroke="#10b981" stroke-width="2" stroke-dasharray="4,3"/><text x="190" y="58" fill="#10b981" font-size="11" font-family="monospace">d = 41 cm</text><rect x="90" y="72" width="180" height="32" fill="#083344" stroke="#10b981" stroke-width="2"/><text x="142" y="92" fill="#10b981" font-size="11">Saída: 14.8 mA</text></svg>`
    },
    {
      id: "sen_5",
      moduleId: "sensores",
      context: "Durante a calibração de um sensor de proximidade, observa-se que ele aciona quando a peça está a 10,0 mm de distância, mas só desliga quando a peça se afasta para 11,2 mm.",
      objective: "Compreender o conceito de histerese em sensores industriais.",
      question: "Qual é a finalidade técnica dessa diferença de 1,2 mm (chamada de Histerese) entre o ponto de acionamento e o de desacionamento?",
      options: [
        "Evitar trepidação (chaveamento rápido e instável) da saída quando a peça vibra próximo ao limite",
        "Aumentar o consumo elétrico da fonte de 24Vcc",
        "Converter o sinal digital em sinal analógico 0–10 V",
        "Reduzir a vida útil do contato de saída do sensor"
      ],
      correctIndex: 0,
      explanation: "A histerese cria uma banda morta que impede oscilações indesejadas (chattering) na entrada do CLP caso a peça mecânica apresente microvibrações no ponto de detecção.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><line x1="40" y1="80" x2="320" y2="80" stroke="#64748b" stroke-width="2"/><line x1="140" y1="25" x2="140" y2="85" stroke="#10b981" stroke-width="2" stroke-dasharray="4,3"/><line x1="210" y1="25" x2="210" y2="85" stroke="#f43f5e" stroke-width="2" stroke-dasharray="4,3"/><text x="115" y="20" fill="#10b981" font-size="10" font-family="monospace">ON: 10mm</text><text x="190" y="20" fill="#f43f5e" font-size="10" font-family="monospace">OFF: 11.2mm</text><rect x="140" y="42" width="70" height="24" fill="rgba(245,158,11,0.25)" stroke="#f59e0b"/><text x="146" y="58" fill="#fbbf24" font-size="10" font-weight="bold">HISTERESE</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><line x1="40" y1="80" x2="320" y2="80" stroke="#64748b" stroke-width="2"/><path d="M80 75 H210 V35 H290" fill="none" stroke="#f43f5e" stroke-width="2.5"/><path d="M290 42 H140 V78 H80" fill="none" stroke="#10b981" stroke-width="2.5"/><text x="122" y="100" fill="#fbbf24" font-size="11" font-weight="bold">ΔS = 1,2 mm (Imunidade a Vibração)</text></svg>`
    },

    // ==================== 4. VARIÁVEIS FÍSICAS & INSTRUMENTAÇÃO ====================
    {
      id: "vf_1",
      moduleId: "variaveis_fisicas",
      context: "Um transmissor de pressão calibrado de 0 a 10 bar envia um sinal padrão industrial de 4 a 20 mA para a entrada analógica do CLP. O multímetro em série indica exatamente 12 mA.",
      objective: "Realizar o escalonamento linear de um sinal 4–20 mA.",
      question: "Qual é a pressão medida no processo quando a corrente do transmissor é 12 mA?",
      options: [
        "5,0 bar (50% da faixa de medição)",
        "6,0 bar (60% da faixa de medição)",
        "4,0 bar (40% da faixa de medição)",
        "12,0 bar (acima do fundo de escala)"
      ],
      correctIndex: 0,
      explanation: "Na faixa 4–20 mA (span de 16 mA), 12 mA corresponde a (12 - 4) / 16 = 0,5 (50% do span). Logo, 50% de 10 bar = 5,0 bar.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="28" width="110" height="58" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><text x="40" y="52" fill="#fbbf24" font-size="11" font-weight="bold">PT (0..10 bar)</text><text x="45" y="72" fill="#94a3b8" font-size="11" font-family="monospace">I = 12,0 mA</text><line x1="135" y1="57" x2="225" y2="57" stroke="#10b981" stroke-width="3"/><text x="150" y="48" fill="#10b981" font-size="11" font-family="monospace">4–20 mA</text><rect x="225" y="28" width="110" height="58" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="245" y="52" fill="#38bdf8" font-size="11" font-weight="bold">CLP AI0</text><text x="248" y="72" fill="#f8fafc" font-size="12" font-family="monospace">P = ? bar</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="28" width="110" height="58" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/><text x="40" y="52" fill="#fbbf24" font-size="11" font-weight="bold">SPAN = 16 mA</text><text x="38" y="72" fill="#fef3c7" font-size="11" font-family="monospace">(12-4)/16 = 50%</text><line x1="135" y1="57" x2="225" y2="57" stroke="#10b981" stroke-width="3.5"/><rect x="225" y="28" width="110" height="58" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="245" y="52" fill="#10b981" font-size="11" font-weight="bold">VALOR ESCALA</text><text x="245" y="72" fill="#10b981" font-size="13" font-weight="bold" font-family="monospace">5,0 bar</text></svg>`
    },
    {
      id: "vf_2",
      moduleId: "variaveis_fisicas",
      context: "Na instrumentação de processos industriais, o padrão de transmissão em corrente 4–20 mA é amplamente preferido ao padrão 0–20 mA ou 0–10 V para longas distâncias.",
      objective: "Identificar a principal vantagem diagnóstica do zero vivo (4 mA).",
      question: "Por que o valor mínimo da escala analógica industrial começa em 4 mA e não em 0 mA?",
      options: [
        "Permite distinguir o valor 0% da variável (4 mA) de uma falha de rompimento de cabo ou falta de alimentação (0 mA)",
        "Porque fios de cobre não conduzem correntes abaixo de 4 mA",
        "Para dobrar a tensão elétrica da rede de 220 V para 440 V",
        "Para eliminar a necessidade de conversores analógico-digitais no CLP"
      ],
      correctIndex: 0,
      explanation: "O 'zero vivo' (live zero) em 4 mA permite diagnóstico imediato de falha: se a leitura cair para 0 mA, o CLP identifica cabo rompido ou transmissor desligado.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="20" y="30" width="95" height="52" rx="5" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/><text x="36" y="53" fill="#f43f5e" font-size="12" font-weight="bold">0 mA</text><text x="30" y="70" fill="#94a3b8" font-size="10">Cabo Rompido</text><rect x="132" y="30" width="95" height="52" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="155" y="53" fill="#10b981" font-size="12" font-weight="bold">4 mA</text><text x="145" y="70" fill="#94a3b8" font-size="10">Zero Vivo (0%)</text><rect x="244" y="30" width="95" height="52" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="264" y="53" fill="#38bdf8" font-size="12" font-weight="bold">20 mA</text><text x="255" y="70" fill="#94a3b8" font-size="10">Fundo Escala</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="20" y="30" width="95" height="52" rx="5" fill="#4c0519" stroke="#f43f5e" stroke-width="2.5"/><text x="32" y="53" fill="#fda4af" font-size="11" font-weight="bold">FALHA (0 mA)</text><text x="30" y="70" fill="#fecdd3" font-size="10">Alarme CLP!</text><rect x="132" y="30" width="95" height="52" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="148" y="53" fill="#10b981" font-size="11" font-weight="bold">OK (4 mA)</text><text x="145" y="70" fill="#d1fae5" font-size="10">Processo em 0%</text><rect x="244" y="30" width="95" height="52" rx="5" fill="#083344" stroke="#38bdf8" stroke-width="2.5"/><text x="258" y="53" fill="#38bdf8" font-size="11" font-weight="bold">OK (20 mA)</text><text x="255" y="70" fill="#e0f2fe" font-size="10">Processo 100%</text></svg>`
    },
    {
      id: "vf_3",
      moduleId: "variaveis_fisicas",
      context: "Um forno de tratamento térmico opera entre 0 °C e 400 °C e utiliza um sensor termoresistivo PT100 (platina) para controle preciso de temperatura.",
      objective: "Conhecer as características padronizadas do sensor PT100.",
      question: "Qual é a resistência elétrica nominal de um sensor PT100 na temperatura de referência de 0 °C?",
      options: [
        "100,00 Ω (Ohms)",
        "100,00 mV (milivolts)",
        "4,00 mA (miliamperes)",
        "1.000,00 Ω (Ohms)"
      ],
      correctIndex: 0,
      explanation: "A sigla PT100 indica elemento sensor de Platina (Pt) com resistência nominal de 100 Ω a 0 °C, aumentando sua resistência linearmente com a temperatura.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="25" width="270" height="65" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><text x="70" y="52" fill="#fbbf24" font-size="14" font-weight="bold" font-family="monospace">RTD PT100 (Platina)</text><text x="70" y="74" fill="#94a3b8" font-size="12" font-family="monospace">T = 0 °C  ──►  R = ? Ω</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="25" width="270" height="65" rx="8" fill="#451a03" stroke="#10b981" stroke-width="2.5"/><text x="70" y="52" fill="#10b981" font-size="14" font-weight="bold" font-family="monospace">R(0°C) = 100,00 Ω</text><text x="70" y="74" fill="#fde68a" font-size="11" font-family="monospace">Coeficiente α ≈ 0,385 Ω/°C</text></svg>`
    },
    {
      id: "vf_4",
      moduleId: "variaveis_fisicas",
      context: "Um módulo de entrada analógica de 12 bits lê um sinal de tensão de 0 a 10 V proveniente de um sensor de deslocamento linear.",
      objective: "Calcular a resolução digital de um conversor A/D de 12 bits.",
      question: "Quantos níveis discretos (contagens) um conversor analógico-digital (A/D) de 12 bits consegue representar?",
      options: [
        "4.096 níveis (2¹²)",
        "1.024 níveis (2¹⁰)",
        "256 níveis (2⁸)",
        "65.536 níveis (2¹⁶)"
      ],
      correctIndex: 0,
      explanation: "A resolução de um conversor A/D de N bits é dada por 2^N. Para N = 12 bits, temos 2¹² = 4.096 níveis (de 0 a 4095).",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="25" y="28" width="115" height="58" rx="6" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/><text x="42" y="53" fill="#38bdf8" font-size="11" font-weight="bold">Sinal 0–10 V</text><text x="42" y="71" fill="#94a3b8" font-size="10">Analógico</text><path d="M145 57 H210" stroke="#f59e0b" stroke-width="2.5"/><text x="152" y="48" fill="#fbbf24" font-size="10" font-family="monospace">ADC 12-bit</text><rect x="215" y="28" width="120" height="58" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="235" y="53" fill="#10b981" font-size="11" font-weight="bold">Word Digital</text><text x="235" y="71" fill="#94a3b8" font-size="10">0 .. 4095</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="35" y="22" width="290" height="70" rx="8" fill="#083344" stroke="#10b981" stroke-width="2.5"/><text x="65" y="50" fill="#10b981" font-size="13" font-weight="bold" font-family="monospace">2¹² = 4.096 passos</text><text x="65" y="72" fill="#bae6fd" font-size="11" font-family="monospace">Passo mínimo: 10V / 4095 ≈ 2,44 mV</text></svg>`
    },
    {
      id: "vf_5",
      moduleId: "variaveis_fisicas",
      context: "Em uma tubulação de água industrial, deseja-se medir a vazão volumétrica sem partes móveis internas usando o princípio da Lei de Faraday (indução eletromagnética).",
      objective: "Relacionar propriedades físicas do fluido com a seleção do medidor de vazão.",
      question: "Qual requisito físico indispensável o fluido deve possuir para ser medido por um medidor de vazão eletromagnético?",
      options: [
        "Ser eletricamente condutivo (como água tratada, ácidos ou polpas)",
        "Ser um gás seco isolante elétrico",
        "Ter temperatura obrigatoriamente acima de 500 °C",
        "Conter limalha de ferro em suspensão"
      ],
      correctIndex: 0,
      explanation: "O medidor eletromagnético aplica a Lei de Faraday (E = B · L · v), exigindo que o fluido possua condutividade elétrica mínima para induzir tensão nos eletrodos.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="38" width="280" height="40" fill="#083344" stroke="#38bdf8" stroke-width="2"/><rect x="135" y="22" width="90" height="72" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="150" y="54" fill="#fbbf24" font-size="11" font-weight="bold">MAG-FLOW</text><text x="148" y="70" fill="#94a3b8" font-size="10">E = B·L·v</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="38" width="280" height="40" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><rect x="135" y="22" width="90" height="72" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/><text x="145" y="54" fill="#10b981" font-size="10" font-weight="bold">CONDUTIVO</text><text x="146" y="70" fill="#a7f3d0" font-size="10">&gt; 5 µS/cm</text></svg>`
    },

    // ==================== 5. ATUADORES PNEUMÁTICOS ====================
    {
      id: "pn_1",
      moduleId: "pneumatica",
      context: "Um cilindro pneumático de dupla ação possui área efetiva do êmbolo de 0,002 m² (20 cm²) e opera com pressão manométrica de linha igual a 600.000 Pa (6 bar).",
      objective: "Calcular a força teórica de avanço de um atuador pneumático.",
      question: "Desprezando o atrito interno, qual é a força teórica de avanço (F = P × A) exercida pela haste desse cilindro?",
      options: [
        "1.200 N",
        "300 N",
        "6.000 N",
        "120 N"
      ],
      correctIndex: 0,
      explanation: "Aplicando F = P × A no Sistema Internacional: F = 600.000 Pa × 0,002 m² = 1.200 N (aproximadamente 122 kgf).",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="32" width="150" height="50" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/><rect x="70" y="35" width="14" height="44" fill="#f59e0b"/><rect x="84" y="50" width="155" height="14" fill="#cbd5e1"/><text x="95" y="24" fill="#d8b4fe" font-size="11" font-family="monospace">P = 6 bar | A = 20 cm²</text><text x="250" y="61" fill="#f59e0b" font-size="12" font-weight="bold" font-family="monospace">F = ? N</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="40" y="32" width="150" height="50" rx="4" fill="#3b0764" stroke="#10b981" stroke-width="2.5"/><rect x="155" y="35" width="14" height="44" fill="#10b981"/><rect x="169" y="50" width="110" height="14" fill="#e2e8f0"/><text x="65" y="24" fill="#10b981" font-size="11" font-family="monospace">F = 600.000 × 0,002</text><text x="285" y="61" fill="#10b981" font-size="13" font-weight="bold" font-family="monospace">1.200 N</text></svg>`
    },
    {
      id: "pn_2",
      moduleId: "pneumatica",
      context: "Para comandar o avanço e o retorno forçado de um cilindro pneumático de dupla ação em uma estação de prensagem, é necessário escolher a válvula direcional adequada.",
      objective: "Identificar a simbologia e aplicação das válvulas direcionais pneumáticas.",
      question: "Qual válvula direcional é o padrão industrial para acionar um cilindro pneumático de dupla ação?",
      options: [
        "Válvula direcional 5/2 vias (5 pórticos e 2 posições)",
        "Válvula direcional 2/2 vias",
        "Válvula reguladora de fluxo unidirecional apenas",
        "Válvula de alívio hidráulico"
      ],
      correctIndex: 0,
      explanation: "A válvula 5/2 vias possui 1 pórtico de pressão (1), 2 de utilização (2 e 4) ligados às câmaras do cilindro e 2 escapes independentes (3 e 5).",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="105" y="30" width="75" height="55" fill="#0f172a" stroke="#a855f7" stroke-width="2.5"/><rect x="180" y="30" width="75" height="55" fill="#0f172a" stroke="#a855f7" stroke-width="2.5"/><text x="128" y="62" fill="#d8b4fe" font-size="12" font-weight="bold" font-family="monospace">5 / 2</text><text x="195" y="62" fill="#d8b4fe" font-size="12" font-weight="bold" font-family="monospace">VIAS</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="105" y="30" width="75" height="55" fill="#3b0764" stroke="#10b981" stroke-width="2.5"/><rect x="180" y="30" width="75" height="55" fill="#0f172a" stroke="#a855f7" stroke-width="2"/><text x="122" y="55" fill="#10b981" font-size="11" font-weight="bold">1 → 4 (Avança)</text><text x="122" y="72" fill="#94a3b8" font-size="10">2 → 3 (Escape)</text></svg>`
    },
    {
      id: "pn_3",
      moduleId: "pneumatica",
      context: "Antes de entrar nas eletroválvulas e cilindros de uma máquina automatizada, o ar comprimido vindo do compressor passa pela unidade de conservação (Lubrefil / FRL).",
      objective: "Conhecer os três elementos que compõem a unidade FRL.",
      question: "O que significa a sigla FRL na preparação do ar comprimido industrial?",
      options: [
        "Filtro, Regulador de pressão e Lubrificador",
        "Fluxostato, Relé e Limitador de corrente",
        "Frequência, Rotação e Linha trifásica",
        "Frenagem, Retorno e Linearidade"
      ],
      correctIndex: 0,
      explanation: "A unidade FRL remove condensado e partículas sólidas (Filtro), estabiliza a pressão de trabalho (Regulador) e pulveriza névoa de óleo quando aplicável (Lubrificador).",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="30" width="75" height="55" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="64" y="62" fill="#38bdf8" font-size="12" font-weight="bold">F (Filtro)</text><rect x="142" y="30" width="75" height="55" rx="5" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><text x="155" y="62" fill="#fbbf24" font-size="12" font-weight="bold">R (Reg.)</text><rect x="239" y="30" width="75" height="55" rx="5" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="252" y="62" fill="#10b981" font-size="12" font-weight="bold">L (Lub.)</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="30" width="75" height="55" rx="5" fill="#083344" stroke="#38bdf8" stroke-width="2.5"/><text x="53" y="55" fill="#38bdf8" font-size="10" font-weight="bold">Retém Água</text><text x="56" y="70" fill="#bae6fd" font-size="10">&amp; Partículas</text><rect x="142" y="30" width="75" height="55" rx="5" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/><text x="150" y="55" fill="#fbbf24" font-size="10" font-weight="bold">Estabiliza</text><text x="156" y="70" fill="#fde68a" font-size="10">Pressão Bar</text><rect x="239" y="30" width="75" height="55" rx="5" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="248" y="55" fill="#10b981" font-size="10" font-weight="bold">Névoa Óleo</text><text x="250" y="70" fill="#d1fae5" font-size="10">Reduz Atrito</text></svg>`
    },
    {
      id: "pn_4",
      moduleId: "pneumatica",
      context: "Um cilindro pneumático está avançando rápido demais e causando impacto mecânico no fim de curso. O técnico instala uma válvula reguladora de fluxo unidirecional.",
      objective: "Aplicar o controle de velocidade por estrangulamento na exaustão (meter-out).",
      question: "Qual é a forma tecnicamente recomendada para controlar a velocidade de avanço de um cilindro pneumático de dupla ação?",
      options: [
        "Estrangular o ar que sai da câmara dianteira (controle na exaustão / meter-out)",
        "Reduzir a tensão da bobina solenoide de 24Vcc para 12Vcc",
        "Tampar completamente o escape da válvula direcional",
        "Aumentar a pressão do compressor para 12 bar"
      ],
      correctIndex: 0,
      explanation: "Devido à compressibilidade do ar, controlar o fluxo na exaustão (meter-out) cria uma contrapressão amortecedora que garante movimento suave e uniforme sem trancos.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="55" y="32" width="160" height="50" rx="4" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/><text x="80" y="61" fill="#d8b4fe" font-size="11" font-weight="bold">CILINDRO PNEUMÁTICO</text><circle cx="255" cy="57" r="18" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="242" y="61" fill="#fbbf24" font-size="10" font-weight="bold">FLOW</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="55" y="32" width="160" height="50" rx="4" fill="#3b0764" stroke="#10b981" stroke-width="2.5"/><text x="72" y="61" fill="#10b981" font-size="11" font-weight="bold">AVANÇO SUAVE (METER-OUT)</text><circle cx="255" cy="57" r="18" fill="#451a03" stroke="#10b981" stroke-width="2.5"/><text x="240" y="61" fill="#10b981" font-size="9" font-weight="bold">EXAUSTÃO</text></svg>`
    },
    {
      id: "pn_5",
      moduleId: "pneumatica",
      context: "Em uma aplicação de segurança 'fail-safe' (falha segura), se faltar energia elétrica ou pressão de ar, o atuador deve retornar automaticamente à posição inicial.",
      objective: "Selecionar o atuador pneumático com retorno mecânico garantido.",
      question: "Qual atuador utiliza ar comprimido apenas para o movimento de avanço e retorna mecanicamente na ausência de pressão?",
      options: [
        "Cilindro de Simples Ação com retorno por mola",
        "Cilindro de Dupla Ação sem amortecimento",
        "Motor pneumático bidirecional",
        "Cilindro sem haste magnético"
      ],
      correctIndex: 0,
      explanation: "O cilindro de simples ação possui apenas uma conexão de ar; quando a válvula despressuriza a câmara, a mola interna recolhe a haste automaticamente.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="55" y="32" width="170" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" stroke-width="2.5"/><rect x="85" y="35" width="12" height="44" fill="#f59e0b"/><polyline points="100,45 112,68 124,45 136,68 148,45 160,68 172,45 184,68" fill="none" stroke="#94a3b8" stroke-width="2.5"/><rect x="97" y="51" width="165" height="12" fill="#cbd5e1"/></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="55" y="32" width="170" height="50" rx="4" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><rect x="85" y="35" width="12" height="44" fill="#10b981"/><polyline points="100,45 112,68 124,45 136,68 148,45 160,68 172,45 184,68" fill="none" stroke="#10b981" stroke-width="2.5"/><text x="235" y="61" fill="#10b981" font-size="11" font-weight="bold">RETORNO MOLA</text></svg>`
    },

    // ==================== 6. MOTORES ELÉTRICOS & ACIONAMENTOS ====================
    {
      id: "mot_1",
      moduleId: "motores",
      context: "Um motor de indução trifásico (MIT) de 4 polos opera em uma rede industrial brasileira com frequência nominal de 60 Hz.",
      objective: "Calcular a velocidade síncrona (ns) do campo girante do motor.",
      question: "Qual é a velocidade síncrona (ns = 120 × f / P) desse motor trifásico de 4 polos em 60 Hz?",
      options: [
        "1.800 rpm",
        "3.600 rpm",
        "1.200 rpm",
        "900 rpm"
      ],
      correctIndex: 0,
      explanation: "Usando ns = (120 × f) / P: ns = (120 × 60) / 4 = 7.200 / 4 = 1.800 rpm. Em carga, o rotor girará ligeiramente abaixo (ex.: 1.740 rpm) devido ao escorregamento.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="50" y="24" width="260" height="66" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2"/><text x="72" y="50" fill="#fda4af" font-size="13" font-weight="bold" font-family="monospace">MIT Trifásico: f = 60 Hz | P = 4</text><text x="72" y="73" fill="#94a3b8" font-size="12" font-family="monospace">ns = (120 × f) / P = ? rpm</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="50" y="24" width="260" height="66" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="72" y="50" fill="#10b981" font-size="14" font-weight="bold" font-family="monospace">ns = (120 × 60) / 4 = 1.800 rpm</text><text x="72" y="73" fill="#d1fae5" font-size="11" font-family="monospace">2 polos=3600 | 4 polos=1800 | 6 polos=1200</text></svg>`
    },
    {
      id: "mot_2",
      moduleId: "motores",
      context: "Durante a comissionamento de uma bomba centrífuga trifásica, o técnico percebe que o rotor está girando no sentido horário, mas o projeto exige rotação anti-horária.",
      objective: "Aplicar o procedimento correto para inversão do sentido de rotação de um motor trifásico.",
      question: "Como deve ser realizada a inversão do sentido de rotação de um motor de indução trifásico?",
      options: [
        "Invertendo entre si quaisquer duas das três fases de alimentação (ex.: L1 com L2)",
        "Invertendo o cabo de aterramento (PE) com o neutro (N)",
        "Aumentando a corrente de ajuste do relé térmico",
        "Substituindo os fusíveis retardados por disjuntor monopolar"
      ],
      correctIndex: 0,
      explanation: "Trocar duas fases quaisquer (L1 ↔ L2, L2 ↔ L3 ou L1 ↔ L3) inverte a sequência de fases e, consequentemente, o sentido do campo magnético girante.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><text x="45" y="34" fill="#38bdf8" font-size="12" font-family="monospace">L1 ─────────► U1</text><text x="45" y="60" fill="#f59e0b" font-size="12" font-family="monospace">L2 ─────────► V1</text><text x="45" y="86" fill="#10b981" font-size="12" font-family="monospace">L3 ─────────► W1</text><text x="230" y="60" fill="#94a3b8" font-size="12" font-weight="bold">HORÁRIO ↻</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><text x="45" y="34" fill="#38bdf8" font-size="12" font-family="monospace">L1 ──╲   ╱──► U1</text><text x="45" y="60" fill="#f59e0b" font-size="12" font-family="monospace">L2 ──╱   ╲──► V1</text><text x="45" y="86" fill="#10b981" font-size="12" font-family="monospace">L3 ─────────► W1</text><text x="215" y="60" fill="#10b981" font-size="12" font-weight="bold">ANTI-HORÁRIO ↺</text></svg>`
    },
    {
      id: "mot_3",
      moduleId: "motores",
      context: "Um ventilador industrial de alta potência necessita de controle contínuo de velocidade (de 20% a 100% da rotação nominal) com rampas suaves de aceleração e desaceleração.",
      objective: "Selecionar o equipamento eletrônico de potência ideal para variação contínua de velocidade.",
      question: "Qual equipamento eletrônico controla a velocidade de um motor trifásico variando simultaneamente a frequência e a tensão (controle escalar V/f ou vetorial)?",
      options: [
        "Inversor de Frequência (VFD)",
        "Chave Estrela-Triângulo (Y-Δ)",
        "Relé de sobrecarga bimetálico",
        "Transformador de corrente (TC)"
      ],
      correctIndex: 0,
      explanation: "O Inversor de Frequência retifica a tensão alternada para um barramento CC e sintetiza uma saída trifásica PWM com frequência e tensão variáveis, mantendo o torque nominal.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="30" y="28" width="95" height="58" rx="5" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="44" y="54" fill="#38bdf8" font-size="11" font-weight="bold">REDE 60Hz</text><text x="48" y="70" fill="#94a3b8" font-size="10">380 Vca</text><rect x="142" y="24" width="90" height="66" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2.5"/><text x="155" y="52" fill="#fbbf24" font-size="11" font-weight="bold">INVERSOR</text><text x="156" y="70" fill="#94a3b8" font-size="10">PWM V/f</text><circle cx="290" cy="57" r="24" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/><text x="278" y="61" fill="#10b981" font-size="12" font-weight="bold">M 3~</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="30" y="28" width="95" height="58" rx="5" fill="#083344" stroke="#38bdf8" stroke-width="2"/><text x="44" y="54" fill="#38bdf8" font-size="11" font-weight="bold">ENTRADA</text><text x="48" y="70" fill="#bae6fd" font-size="10">Fixa 60Hz</text><rect x="142" y="24" width="90" height="66" rx="6" fill="#451a03" stroke="#10b981" stroke-width="2.5"/><text x="152" y="52" fill="#10b981" font-size="11" font-weight="bold">0..60 Hz</text><text x="152" y="70" fill="#fde68a" font-size="10">Rampa Suave</text><circle cx="290" cy="57" r="24" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="274" y="61" fill="#10b981" font-size="11" font-weight="bold">RPM VAR</text></svg>`
    },
    {
      id: "mot_4",
      moduleId: "motores",
      context: "Na partida direta de um motor trifásico de grande porte, o pico de corrente de partida (Ip/In) pode atingir 6 a 8 vezes a corrente nominal, causando queda de tensão na rede.",
      objective: "Compreender a redução de corrente proporcionada pela partida Estrela-Triângulo (Y-Δ).",
      question: "Na partida Estrela-Triângulo (Y-Δ), a corrente de partida na rede elétrica é reduzida para aproximadamente quanto em relação à partida direta?",
      options: [
        "1/3 (cerca de 33%) da corrente de partida direta",
        "1/2 (50%) da corrente de partida direta",
        "3 vezes maior que a partida direta",
        "Zero ampere durante os primeiros 10 segundos"
      ],
      correctIndex: 0,
      explanation: "Na ligação Estrela (Y), cada bobina recebe tensão reduzida por √3 (V_fase = V_linha / √3), reduzindo a corrente de linha absorvida da rede a 1/3 (33,3%) da partida direta.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="35" y="26" width="125" height="62" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="52" y="53" fill="#38bdf8" font-size="12" font-weight="bold">1º ESTRELA (Y)</text><text x="52" y="71" fill="#94a3b8" font-size="10">Partida Suave</text><path d="M165 57 H195" stroke="#f59e0b" stroke-width="2.5"/><rect x="200" y="26" width="125" height="62" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/><text x="214" y="53" fill="#10b981" font-size="12" font-weight="bold">2º TRIÂNGULO (Δ)</text><text x="218" y="71" fill="#94a3b8" font-size="10">Regime Nominal</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="35" y="26" width="125" height="62" rx="6" fill="#083344" stroke="#38bdf8" stroke-width="2.5"/><text x="52" y="53" fill="#38bdf8" font-size="12" font-weight="bold">Ip(Y) = 1/3 Ip(Δ)</text><text x="52" y="71" fill="#bae6fd" font-size="10">Redução de 67%</text><path d="M165 57 H195" stroke="#10b981" stroke-width="3"/><rect x="200" y="26" width="125" height="62" rx="6" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/><text x="214" y="53" fill="#10b981" font-size="12" font-weight="bold">TORQUE 100%</text><text x="218" y="71" fill="#d1fae5" font-size="10">Após Temporizador</text></svg>`
    },
    {
      id: "mot_5",
      moduleId: "motores",
      context: "No circuito de comando e força de um motor elétrico, dois dispositivos distintos garantem a proteção da instalação: um disjuntor-motor/fusível e um relé térmico de sobrecarga (FT).",
      objective: "Diferenciar proteção contra curto-circuito de proteção contra sobrecarga térmica.",
      question: "Qual é a função específica do Relé Térmico (bimetálico) acoplado à saída do contator principal?",
      options: [
        "Proteger o motor contra sobrecorrentes prolongadas (sobrecarga mecânica ou falta de fase), abrindo o contato auxiliar 95-96 do comando",
        "Interromper instantaneamente correntes de curto-circuito de 10 kA nos cabos principais",
        "Corrigir o fator de potência indutivo do motor",
        "Converter corrente alternada em corrente contínua"
      ],
      correctIndex: 0,
      explanation: "O relé térmico atua por curvatura de lâminas bimetálicas devido ao aquecimento prolongado (efeito Joule), abrindo o contato NF 95-96 para desenergizar a bobina do contator.",
      svgNormal: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="26" width="120" height="62" rx="6" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/><text x="60" y="53" fill="#fbbf24" font-size="11" font-weight="bold">RELÉ TÉRMICO</text><text x="65" y="71" fill="#94a3b8" font-size="10">Bimetálico (FT)</text><rect x="195" y="26" width="120" height="62" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><text x="212" y="53" fill="#38bdf8" font-size="11" font-weight="bold">CONTATO 95-96</text><text x="218" y="71" fill="#10b981" font-size="10">NF (Fechado)</text></svg>`,
      svgInspect: `<svg viewBox="0 0 360 115" class="w-full h-28"><rect x="45" y="26" width="120" height="62" rx="6" fill="#4c0519" stroke="#f43f5e" stroke-width="2.5"/><text x="60" y="53" fill="#fda4af" font-size="11" font-weight="bold">SOBRECARGA!</text><text x="65" y="71" fill="#fecdd3" font-size="10">I &gt; In ajustada</text><rect x="195" y="26" width="120" height="62" rx="6" fill="#451a03" stroke="#f59e0b" stroke-width="2.5"/><text x="210" y="53" fill="#fbbf24" font-size="11" font-weight="bold">95-96 ABRE</text><text x="212" y="71" fill="#fde68a" font-size="10">Desliga Contator</text></svg>`
    }
  ];

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function buildSessionQuestions(moduleId) {
    let pool =
      moduleId === "maratona"
        ? shuffleArray(QUESTIONS).slice(0, 10)
        : shuffleArray(QUESTIONS.filter((q) => q.moduleId === moduleId));

    return pool.map((q) => {
      const indexedOptions = q.options.map((text, idx) => ({
        text,
        isCorrect: idx === q.correctIndex
      }));
      const shuffledOptions = shuffleArray(indexedOptions);
      return {
        ...q,
        shuffledOptions,
        shuffledCorrectIndex: shuffledOptions.findIndex((o) => o.isCorrect)
      };
    });
  }

  function getAvatarSvg(avatarId) {
    const found = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
    return found.svg;
  }

  return {
    AVATARS,
    BADGE_CATALOG,
    MODULES,
    QUESTIONS,
    buildSessionQuestions,
    getAvatarSvg
  };
})();
