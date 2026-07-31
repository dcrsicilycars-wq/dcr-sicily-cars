function imgSrc(url) {
  return url && url.match(/^(https?:|data:|\/)/i) ? url : (BASE_PATH || '') + url
}

function imgUrl(v) {
  return v.image && v.image !== '/assets/images/placeholder-car.svg' ? v.image : (v.gallery && v.gallery[0]) || v.image
}

var SPEC_ICONS = {
  year: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  mileage: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  fuel: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="20"/><path d="M5 20V4h10v16"/><rect x="7" y="6" width="3" height="4"/><path d="M17 20V8l3-3"/></svg>',
  transmission: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
}

var TRANS_MAP = {
  fuel: {
    it: { Diesel: 'Diesel', Benzina: 'Benzina', Ibrido: 'Ibrido', Elettrica: 'Elettrica' },
    en: { Diesel: 'Diesel', Benzina: 'Petrol', Ibrido: 'Hybrid', Elettrica: 'Electric' }
  },
  transmission: {
    it: { Automatic: 'Automatico', Manuale: 'Manuale' },
    en: { Automatic: 'Automatic', Manuale: 'Manual' }
  }
}

function mapValue(category, value, lang) {
  return (TRANS_MAP[category] && TRANS_MAP[category][lang] && TRANS_MAP[category][lang][value]) || value
}

function VehicleRenderer(containerId, detailPath) {
  this.container = document.getElementById(containerId);
  this.detailPath = detailPath || 'vehicle-detail.html';
}

VehicleRenderer.prototype.createCard = function(vehicle, index) {
  var badgeHtml = vehicle.badge ? '<span class="car-badge-ribbon ' + vehicle.badge + '">' + i18n.t('vehicle.' + vehicle.badge) + '</span>' : '';
  var featuredHtml = vehicle.featured ? '<span class="car-card-featured">&#9733;</span>' : '';
  var price = '\u20AC ' + vehicle.price.toLocaleString();
  var delay = (index || 0) * 0.06;
  var lang = i18n.currentLang;
  var mileage = vehicle.mileage.toLocaleString() + ' ' + i18n.t('vehicle.km');
  var fuelLabel = mapValue('fuel', vehicle.fuel, lang);
  var transLabel = mapValue('transmission', vehicle.transmission, lang);
  return '<div class="car-card" style="animation-delay:' + delay + 's" data-id="' + vehicle.id + '">'
    + badgeHtml
    + '<div class="car-card-image">' + featuredHtml + '<img src="' + imgSrc(imgUrl(vehicle)) + '" alt="' + vehicle.brand + ' ' + vehicle.model + '" loading="lazy"></div>'
    + '<div class="car-card-body">'
    + '<h3 class="car-card-title">' + vehicle.brand + ' ' + vehicle.model + '</h3>'
    + '<div class="car-card-price">' + price + '</div>'
    + '<div class="car-card-specs">'
    + '<div class="car-card-spec"><span class="car-card-spec-icon">' + SPEC_ICONS.year + '</span><span class="car-card-spec-value">' + vehicle.year + '</span><span class="car-card-spec-label">' + i18n.t('vehicle.year') + '</span></div>'
    + '<div class="car-card-spec"><span class="car-card-spec-icon">' + SPEC_ICONS.mileage + '</span><span class="car-card-spec-value">' + mileage + '</span><span class="car-card-spec-label">' + i18n.t('vehicle.mileage') + '</span></div>'
    + '<div class="car-card-spec"><span class="car-card-spec-icon">' + SPEC_ICONS.fuel + '</span><span class="car-card-spec-value">' + fuelLabel + '</span><span class="car-card-spec-label">' + i18n.t('vehicle.fuel') + '</span></div>'
    + '<div class="car-card-spec"><span class="car-card-spec-icon">' + SPEC_ICONS.transmission + '</span><span class="car-card-spec-value">' + transLabel + '</span><span class="car-card-spec-label">' + i18n.t('vehicle.transmission') + '</span></div>'
    + '</div></div>'
    + '<div class="car-card-footer"><a href="' + this.detailPath + '?id=' + vehicle.id + '" class="car-card-link">' + i18n.t('featured.view_detail') + ' <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a></div>'
    + '</div>';
};

VehicleRenderer.prototype.render = function(vehicles) {
  if (!this.container) return;
  if (!vehicles || vehicles.length === 0) {
    this.container.innerHTML = '<div class="empty-state">'
      + '<svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>'
      + '<h3>' + i18n.t('search.no_results') + '</h3>'
      + '<p>' + i18n.t('search.all_brands') + '</p>'
      + '</div>';
    return;
  }
  this.container.innerHTML = vehicles.map(function(v, i) { return this.createCard(v, i); }.bind(this)).join('');
};
