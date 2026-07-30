class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('dcr-lang') || 'it';
    this.translations = {};
    this.observers = [];
  }

  async init() {
    await this.loadTranslations();
    this.applyLanguage();
    this.bindSwitcher();
  }

  async loadTranslations() {
    try {
      const itResp = await fetch('/locales/it.json');
      const enResp = await fetch('/locales/en.json');
      this.translations = {
        it: await itResp.json(),
        en: await enResp.json()
      };
    } catch (e) {
      console.error('Failed to load translations:', e);
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    for (const k of keys) {
      if (value) value = value[k];
    }
    return value || key;
  }

  setLang(lang) {
    if (lang === this.currentLang) return;
    this.currentLang = lang;
    localStorage.setItem('dcr-lang', lang);
    this.applyLanguage();
    this.notifyObservers();
    document.documentElement.lang = lang === 'it' ? 'it' : 'en';
  }

  applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else if (el.tagName === 'IMG') {
        el.alt = translation;
      } else if (el.tagName === 'TITLE') {
        el.textContent = translation;
      } else {
        el.innerHTML = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });

    document.querySelectorAll('[data-i18n-btn]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nBtn);
    });

    const title = document.querySelector('title[data-i18n]');
    if (!title) {
      document.title = this.t('site.title');
    }
  }

  bindSwitcher() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.dataset.lang;
        this.setLang(lang);
        document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  observe(fn) {
    this.observers.push(fn);
  }

  notifyObservers() {
    this.observers.forEach(fn => fn(this.currentLang));
  }
}

const i18n = new I18n();
export { I18n, i18n };
