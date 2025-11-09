/* === theme_toggle.js === */
/* Quản lý chuyển đổi giao diện Dark/Light cho toàn trang */
/* Sử dụng biến CSS để thay đổi màu sắc nhanh chóng */


(function () {
  const THEME_KEY = 'hv_theme_mode';
  const root = document.documentElement;

  function setTheme(mode) {
    if (mode === 'light') {
      root.style.setProperty('--bg-dark', '#f7f8fb');
      root.style.setProperty('--card', '#ffffff');
      root.style.setProperty('--text', '#1e293b');
      root.style.setProperty('--muted', '#64748b');
      document.documentElement.style.background = '#f7f8fb'
      document.body.style.background = '#f7f8fb';
      document.body.style.color = '#1e293b';
    } else {
      root.style.setProperty('--bg-dark', '#0f1724');
      root.style.setProperty('--card', 'rgba(255,255,255,0.03)');
      root.style.setProperty('--text', '#e6eef8');
      root.style.setProperty('--muted', '#9aa7bf');
      document.body.style.background = 'linear-gradient(180deg,#07101a,#0b1220)';
      document.body.style.color = '#e6eef8';
    }
    localStorage.setItem(THEME_KEY, mode);
  }

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applySavedTheme() {
    const saved = getSavedTheme();
    setTheme(saved);
    const selector = document.getElementById('themeMode');
    if (selector) selector.value = saved;
  }

  function initThemeListener() {
    const selector = document.getElementById('themeMode');
    if (!selector) return;
    selector.addEventListener('change', () => {
      const newMode = selector.value;
      setTheme(newMode);
      // 🔄 reload nhẹ để đồng bộ giao diện
      setTimeout(() => location.reload(), 200);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    initThemeListener();
  });
})();
