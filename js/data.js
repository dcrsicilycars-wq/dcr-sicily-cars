class VehicleData {
  constructor() {
    this.vehicles = [];
    this.apiEndpoint = '/api/vehicles';
  }

  async loadVehicles() {
    try {
      const resp = await fetch(this.apiEndpoint);
      const json = await resp.json();
      if (json.success && Array.isArray(json.vehicles)) {
        this.vehicles = json.vehicles;
      } else {
        this.vehicles = [];
      }
      return this.vehicles;
    } catch (e) {
      console.error('Failed to load vehicles:', e);
      return [];
    }
  }

  getFeatured() {
    return this.vehicles.filter(v => v.featured);
  }

  getById(id) {
    return this.vehicles.find(v => v.id === id);
  }

  getBrands() {
    return [...new Set(this.vehicles.map(v => v.brand))].sort();
  }

  getModels(brand) {
    const models = brand
      ? this.vehicles.filter(v => v.brand === brand).map(v => v.model)
      : this.vehicles.map(v => v.model);
    return [...new Set(models)].sort();
  }

  getFuels() {
    return [...new Set(this.vehicles.map(v => v.fuel))].sort();
  }

  getMaxPrice() {
    return Math.max(...this.vehicles.map(v => v.price));
  }

  filter(filters) {
    return this.vehicles.filter(v => {
      if (filters.brand && v.brand !== filters.brand) return false;
      if (filters.model && v.model !== filters.model) return false;
      if (filters.fuel && v.fuel !== filters.fuel) return false;
      if (filters.price && v.price > parseInt(filters.price)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchBrand = v.brand.toLowerCase().includes(q);
        const matchModel = v.model.toLowerCase().includes(q);
        if (!matchBrand && !matchModel) return false;
      }
      return true;
    });
  }
}

const vehicleData = new VehicleData();
export { VehicleData, vehicleData };
