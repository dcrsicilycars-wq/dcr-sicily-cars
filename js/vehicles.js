export class VehicleRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  createCard(vehicle) {
    const badgeHtml = vehicle.badge
      ? `<span class="car-badge ${vehicle.badge}">${i18n.t('vehicle.' + vehicle.badge)}</span>`
      : '';

    const price = `€ ${vehicle.price.toLocaleString()}`;

    return `
      <div class="car-card" data-id="${vehicle.id}">
        <div class="car-card-image">
          <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.model}" loading="lazy">
          ${badgeHtml}
        </div>
        <div class="car-card-body">
          <h3 class="car-card-title">${vehicle.brand} ${vehicle.model}</h3>
          <div class="car-card-price">${price}</div>
          <div class="car-card-specs">
            <span class="car-card-spec">
              <strong>${i18n.t('vehicle.year')}:</strong> ${vehicle.year}
            </span>
            <span class="car-card-spec">
              <strong>${i18n.t('vehicle.mileage')}:</strong> ${vehicle.mileage.toLocaleString()} ${i18n.t('vehicle.km')}
            </span>
            <span class="car-card-spec">
              <strong>${i18n.t('vehicle.fuel')}:</strong> ${vehicle.fuel}
            </span>
            <span class="car-card-spec">
              <strong>${i18n.t('vehicle.price')}:</strong> ${price}
            </span>
          </div>
        </div>
        <div class="car-card-footer">
          <a href="/pages/vehicle-detail.html?id=${vehicle.id}" class="btn btn-outline btn-sm" style="width:100%">${i18n.t('featured.view_detail')}</a>
        </div>
      </div>
    `;
  }

  render(vehicles) {
    if (!this.container) return;

    if (!vehicles || vehicles.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem;">
          <p style="color:var(--color-gray-500);font-size:1.125rem;">${i18n.t('search.no_results')}</p>
        </div>`;
      return;
    }

    this.container.innerHTML = vehicles.map(v => this.createCard(v)).join('');
  }
}
