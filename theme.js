(function () {
  const storageKey = 'roavyn-theme';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    try {
      const theme = localStorage.getItem(storageKey);
      return theme === 'light' || theme === 'dark' ? theme : null;
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still applies for this page if storage is unavailable.
    }
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = isDark ? '#141a16' : '#f7f8f4';
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-checked', String(isDark));
      button.title = isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren';
    });
  }

  applyTheme(getStoredTheme() || (mediaQuery.matches ? 'dark' : 'light'));

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(document.documentElement.dataset.theme);

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setStoredTheme(theme);
        applyTheme(theme);
      });
    });
  });

  mediaQuery.addEventListener('change', (event) => {
    if (!getStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
})();
