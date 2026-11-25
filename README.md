# AutoTech Arena — Plataforma Gamificada de Automação Industrial (Supabase Edition)

Aplicação web completa para ensino técnico em **Automação Industrial (2º Ano do Ensino Médio)** com persistência em nuvem via **Supabase (PostgreSQL + Auth + RPC Anti-Fraude + Realtime)**, acesso de alunos por **Código de Turma + PIN Individual**, painel administrativo do professor, gráficos pedagógicos, ranking ao vivo em modo projetor e exportação real de relatórios em **Excel (.xlsx)** e **PDF (.pdf)**.

---

## Estrutura de Arquivos

```text
autotech-arena-supabase/
├── index.html                      # Interface principal (Portal Híbrido, Ambiente Aluno e Painel Professor)
├── css/
│   └── styles.css                  # Identidade visual IHM/SCADA e Modo Projetor
├── js/
│   ├── config.js                   # Credenciais públicas do Supabase (URL e Anon Key)
│   ├── questions.js                # Banco de 30 questões técnicas, diagramas SVG, avatares e medalhas
│   ├── supabase-service.js         # Conexão Supabase, Auth, RPCs seguras e Realtime
│   ├── reports.js                  # Importação CSV/XLSX e exportação de relatórios PDF/Excel
│   ├── ui-student.js               # Painel gamificado do aluno e motor de desafios cronometrados
│   ├── ui-teacher.js               # Painel administrativo do professor e gráficos Chart.js
│   └── app.js                      # Inicializador global, áudio industrial e gerenciamento de sessão
├── supabase/
│   └── schema.sql                  # Script SQL completo (Tabelas, Triggers, Índices, RLS, RPCs, Realtime)
├── .env.example                    # Modelo de variáveis de ambiente
├── config.example.js               # Modelo de configuração local
├── modelo_importacao_alunos.csv    # Planilha modelo para importação em lote de alunos
└── README.md                       # Este guia
```

---

## Passo a Passo para Conectar o Supabase

### 1. Criar Projeto no Supabase
1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Clique em **New Project**, escolha o nome `autotech-arena`, defina uma senha para o banco e selecione a região **South America (São Paulo)**.

### 2. Executar o Script SQL (`supabase/schema.sql`)
1. No menu lateral do Supabase, clique em **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/schema.sql`, copie todo o conteúdo, cole no editor SQL do Supabase e clique em **Run**.
3. Verifique se apareceu a mensagem `Success. No rows returned`.

### 3. Configurar Autenticação de Professores
1. No painel do Supabase, acesse **Authentication** → **Providers** e confirme que **Email** está habilitado.
2. *(Opcional para testes rápidos)* Em **Authentication** → **Providers** → **Email**, você pode desmarcar **Confirm email** para que o professor consiga cadastrar-se e entrar imediatamente sem precisar confirmar e-mail.

### 4. Inserir Credenciais no Projeto
1. No Supabase, vá em **Project Settings** (engrenagem) → **API**.
2. Copie a **Project URL** e a chave pública **anon / public**.
3. Abra o arquivo `js/config.js` e substitua `SEU-PROJETO` e `SUA-CHAVE-PUBLICA-ANON` pelos valores copiados.
   * *(Alternativa)* Você também pode abrir o `index.html` no navegador, clicar no botão de status no canto superior direito e colar as credenciais pela interface.

---

## Como Executar e Disponibilizar aos Alunos

Como o projeto foi construído em HTML5/CSS3/JS puro sem necessidade de compilação:
* **Localmente no laboratório:** Basta abrir o arquivo `index.html` no navegador ou servir a pasta com `npx serve .`.
* **Na internet (recomendado para acesso via celular e computador):** Faça upload da pasta gratuitamente no **Netlify Drop**, **Vercel** ou **GitHub Pages**. Com o `js/config.js` preenchido, todos os alunos conectarão automaticamente ao mesmo banco de dados e ranking em tempo real.
