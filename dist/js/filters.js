export class SearchFilters {
  constructor(containerId, onFilter) {
    this.container = document.getElementById(containerId);
    this.onFilter = onFilter;
    this.filters = { brand: '', model: '', fuel: '', price: '' };
    if (this.container) this.init();
  }

  init() {
    this.brandSelect = this.container.querySelector('[data-filter="brand"]');
    this.modelSelect = this.container.querySelector('[data-filter="model"]');
    this.fuelSelect = this.container.querySelector('[data-filter="fuel"]');
    this.priceSelect = this.container.querySelector('[data-filter="price"]');
    this.submitBtn = this.container.querySelector('[data-filter-submit]');

    this.populateBrands();
    this.populateFuels();
    this.populatePrices();
    this.bindEvents();

    i18n.observe(() => this.updateLabels());
  }

  destroy() {
    this.submitBtn?.removeEventListener('click', this._boundSubmit);
  }

  populateBrands() {
    const brands = vehicleData.getBrands();
    this.brandSelect.innerHTML = `<option value="">${i18n.t('search.all_brands')}</option>`;
    brands.forEach(b => {
      this.brandSelect.innerHTML += `<option value="${b}">${b}</option>`;
    });
  }

  populateModels(brand) {
    const models = vehicleData.getModels(brand);
    this.modelSelect.innerHTML = `<option value="">${i18n.t('search.all_models')}</option>`;
    models.forEach(m => {
      this.modelSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });
  }

  populateFuels() {
    const fuels = vehicleData.getFuels();
    this.fuelSelect.innerHTML = `<option value="">${i18n.t('search.all_fuels')}</option>`;
    fuels.forEach(f => {
      this.fuelSelect.innerHTML += `<option value="${f}">${f}</option>`;
    });
  }

  populatePrices() {
    const max = vehicleData.getMaxPrice();
    const steps = [10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000];
    this.priceSelect.innerHTML = `<option value="">${i18n.t('search.all_prices')}</option>`;
    steps.forEach(p => {
      if (p <= max) {
        this.priceSelect.innerHTML += `<option value="${p}">€ ${p.toLocaleString()}</option>`;
      }
    });
    this.priceSelect.innerHTML += `<option value="${max}">€ ${max.toLocaleString()}+</option>`;
  }

  updateLabels() {
    document.querySelectorAll('[data-filter-label]').forEach(el => {
      const key = el.dataset.filterLabel;
      el.textContent = i18n.t(key);
    });
  }

  bindEvents() {
    this.brandSelect.addEventListener('change', () => {
      this.populateModels(this.brandSelect.value);
    });

    this.submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.filters = {
        brand: this.brandSelect.value,
        model: this.modelSelect.value,
        fuel: this.fuelSelect.value,
        price: this.priceSelect.value
      };
      if (this.onFilter) this.onFilter(this.filters);
    });
  }
}
