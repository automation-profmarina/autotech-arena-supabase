/**
 * AUTOTECH ARENA - Configuração de Conexão com Supabase
 * Substitua os valores abaixo pelas credenciais públicas do seu projeto Supabase
 * (Project Settings -> API -> Project URL e anon/public key).
 * Caso deixe os valores padrão, o sistema permitirá configurar diretamente pela tela inicial.
 */
window.AUTOTECH_ENV = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_ANON_KEY: "SUA-CHAVE-PUBLICA-ANON"
};

window.AutoTechConfig = (function () {
  const STORAGE_KEY = "autotech_supabase_creds_v1";

  function isPlaceholder(val) {
    return !val || val.includes("SEU-PROJETO") || val.includes("SUA-CHAVE") || val.trim() === "";
  }

  function getCredentials() {
    // 1. Prioriza credenciais configuradas no arquivo js/config.js (deploy em produção)
    if (
      window.AUTOTECH_ENV &&
      !isPlaceholder(window.AUTOTECH_ENV.SUPABASE_URL) &&
      !isPlaceholder(window.AUTOTECH_ENV.SUPABASE_ANON_KEY)
    ) {
      return {
        url: window.AUTOTECH_ENV.SUPABASE_URL.trim(),
        anonKey: window.AUTOTECH_ENV.SUPABASE_ANON_KEY.trim(),
        source: "file"
      };
    }

    // 2. Fallback: credenciais salvas pelo professor na configuração rápida do navegador
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.url && saved.anonKey) {
        return {
          url: saved.url.trim(),
          anonKey: saved.anonKey.trim(),
          source: "browser"
        };
      }
    } catch (e) {
      console.warn("Erro ao ler credenciais salvas:", e);
    }

    return null;
  }

  function saveCredentials(url, anonKey) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
    );
  }

  function clearCredentials() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getCredentials,
    saveCredentials,
    clearCredentials
  };
})();
