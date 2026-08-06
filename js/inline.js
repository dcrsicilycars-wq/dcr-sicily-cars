// ==============================
// DCR Sicily Cars — Inline Runtime
// Usato da tutte le pagine per funzionare da file://
// (no ES modules, no fetch)
// ==============================

var BASE_PATH = '';

function formatNum(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

var IT_TRANSLATIONS = {"site":{"title":"DCR Sicily Cars s.r.l.s — Concessionaria Auto","tagline":"Auto selezionate con passione, dalla Sicilia al mondo","description":"DCR Sicily Cars s.r.l.s — concessionaria auto a Catania. BMW, Mercedes, Audi, Tesla e molte altre marche. Vendita, permuta e spedizione in tutta Europa."},"nav":{"home":"Home","about":"Chi Siamo","vehicles":"Veicoli","contact":"Contatti"},"hero":{"title":"<span class=\"hero-line\">La tua prossima</span><span class=\"hero-line\"><span class=\"hero-highlight\">auto</span> ti aspetta!</span>","subtitle":"<span class=\"hero-sub-line\">Vieni a scoprire la nostra selezione di auto</span><span class=\"hero-sub-line\">usati <span class=\"hero-highlight\">garantiti e certificati</span></span>","cta_primary":"Esplora le Auto","cta_secondary":"Contattaci","scroll":"Scopri di più"},"search":{"title":"Trova l'auto dei tuoi sogni","brand":"Marca","model":"Modello","price":"Prezzo massimo","fuel":"Alimentazione","submit":"Cerca Auto","all_brands":"Tutte le Marche","all_models":"Tutti i Modelli","all_prices":"Qualsiasi Prezzo","all_fuels":"Tutte le Alimentazioni","no_results":"Nessun veicolo trovato. Prova a modificare i filtri."},"featured":{"title":"Auto in Evidenza","subtitle":"Selezione esclusiva dei migliori veicoli disponibili nel nostro showroom","view_all":"Vedi Tutti i Veicoli","view_detail":"Scopri di più"},"vehicle":{"year":"Anno","mileage":"Chilometraggio","fuel":"Alimentazione","transmission":"Cambio","price":"Prezzo","km":"km","sold":"Venduta","reserved":"Prenotata","new_arrival":"Nuovo Arrivo","offer":"Offerta Speciale","certified":"Certificata","no_vat":"IVA Esclusa","details":"Scheda Veicolo","description":"Descrizione","gallery":"Galleria Foto","breadcrumb_home":"Home","breadcrumb_vehicles":"Veicoli","cta_contact":"Richiedi Informazioni","cta_whatsapp":"Contatta su WhatsApp","not_found":"Veicolo non trovato"},"detail":{"specs_title":"Specifiche Tecniche","overview_title":"Presentazione","gallery_title":"Galleria Immagini","cta_title":"Sei interessato a questo veicolo?","cta_text":"Contattaci per ricevere maggiori informazioni o per fissare un appuntamento senza impegno."},"about":{"title":"Chi Siamo","subtitle":"La nostra storia, la nostra passione","intro_title":"Benvenuti da DCR Sicily Cars","intro_p1":"DCR Sicily Cars nasce dall'incontro tra la passione per i motori e una visione chiara: ripensare il mondo dell'auto usata con un approccio fondato su serietà, competenza e attenzione alla persona. Non siamo semplici venditori: siamo consulenti che mettono il cliente al centro di ogni scelta.","intro_p2":"Dietro ogni veicolo c'è un lavoro meticoloso di ricerca, verifica e preparazione. Crediamo che la qualità non si improvvisi: per questo ogni auto passa attraverso controlli approfonditi prima di entrare nel nostro showroom, perché ciò che offriamo deve rispecchiare gli standard che pretendiamo per noi stessi.","intro_p3":"Con sede a Catania, operiamo come punto di riferimento per chi cerca un'auto in tutta Italia e in Europa. La nostra crescita è fatta di relazioni durature, clienti che tornano e che ci scelgono per la trasparenza che trovano in ogni fase del percorso d'acquisto.","stat1":"Auto Consegnate","stat2":"Anni di Esperienza","stat3":"Clienti Soddisfatti","mission_title":"La Nostra Missione","mission_text":"Selezioniamo con cura ogni veicolo, lo sottoponiamo a verifiche rigorose e lo prepariamo con la massima attenzione. Perché per noi l'acquisto di un'auto usata deve essere un'esperienza trasparente, professionale e senza sorprese.","vision_title":"La Nostra Visione","vision_text":"Diventare il punto di riferimento in Sicilia per il mercato dell'auto usata. Vogliamo essere riconosciuti per la serietà, l'affidabilità e un servizio clienti che fa davvero la differenza — in Italia e in tutta Europa.","value_1_text":"Documentiamo ogni dettaglio con precisione: storico manutentivo, condizioni reali e certificazioni. Perché la fiducia si costruisce sulla chiarezza, non sulle promesse.","value_2_text":"Scegliamo solo veicoli che superano i nostri standard qualitativi. Ogni auto è frutto di una ricerca attenta sul mercato, verificata e preparata per garantirti un prodotto eccellente.","value_3_text":"Gestiamo la logistica in tutto il continente con partner certificati. Dalla documentazione doganale alla consegna porta a porta, seguiamo ogni passaggio per farti ricevere l'auto ovunque tu ti trovi.","value_4_text":"Il nostro impegno non si esaurisce con la vendita. Ti accompagniamo con assistenza dedicata prima, durante e dopo l'acquisto, perché un cliente soddisfatto è il nostro miglior biglietto da visita.","team_subtitle":"Conosci chi si prende cura della tua prossima auto","team_christian_role":"Amministratore Unico — Selezione Veicoli","team_christian_bio":"Fondatore e anima di DCR Sicily Cars, Christian ha costruito questa realtà unendo una profonda conoscenza del settore a una visione precisa: offrire solo veicoli che lui stesso guiderebbe. La sua esperienza è la garanzia che ogni auto in showroom ha superato una selezione senza compromessi.","team_roberto_role":"SOCIO - RESPONSABILE COMMERCIALE","team_roberto_bio":"È il volto che accoglie ogni cliente e lo guida con empatia e professionalità. Roberto trasforma il processo di acquisto in un percorso su misura, ascoltando le esigenze di chi ha di fronte e trovando la soluzione giusta, dalla scelta del veicolo fino alla consegna.","values_title":"I Nostri Valori"},"contact":{"title":"Contattaci","subtitle":"Siamo a tua disposizione. Scrivici, chiamaci o passa a trovarci.","form_title":"Inviaci un Messaggio","name":"Nome e Cognome","email":"Indirizzo Email","phone":"Numero di Telefono","subject":"Oggetto","message":"Il tuo Messaggio","submit":"Invia Messaggio","success":"Grazie per averci contattato! Riceverai una risposta entro 24 ore.","error":"Si è verificato un errore. Riprova più tardi o chiamaci al +39 375 883 9616.","privacy":"Acconsento al trattamento dei miei dati personali secondo la Privacy Policy","map_consent":"Clicca per caricare la mappa Google Maps. Il caricamento avviene solo dopo il tuo consenso.","map_load":"Carica Mappa","info_title":"I Nostri Contatti","address":"Indirizzo","address_val":"Via Del Rotolo 44/46 (CT)","phone_val":"Christian +39 375 883 9616 — Roberto +39 327 7540399","phone_christian":"Christian +39 375 883 9616","phone_roberto":"Roberto +39 327 7540399","email_val":"dcrsicilycars@gmail.com","hours":"Orari di Apertura","hours_val":"Lunedì-Venerdì: 09:00-19:00 | Sabato: 09:00-13:00"},"cookies":{"banner_title":"Questo sito utilizza cookie","banner_text":"Questo sito utilizza cookie tecnici necessari al funzionamento e Google Maps per mostrare la nostra posizione. Il caricamento di Google Maps avviene solo dopo il tuo consenso. Cliccando 'Accetta' acconsenti.","accept":"Accetta","reject":"Rifiuta","more_info":"Maggiori informazioni","privacy_link":"Privacy Policy","cookie_link":"Cookie Policy"},"admin":{"login_title":"Accesso Admin","email":"Email","password":"Password","login":"Accedi","logout":"Esci","dashboard":"Dashboard","add_vehicle":"Aggiungi Veicolo","edit_vehicle":"Modifica","delete_vehicle":"Elimina","duplicate_vehicle":"Duplica","confirm_delete":"Sei sicuro di voler eliminare questo veicolo? L'operazione non può essere annullata.","save":"Salva Veicolo","cancel":"Annulla","upload_image":"Trascina un'immagine qui o clicca per caricare (max 10 MB, compressa automaticamente)","upload_gallery":"Galleria Foto (clicca per aggiungere)","mark_sold":"Venduta","mark_reserved":"Prenotata","no_status":"Disponibile","search_placeholder":"Cerca per marca, modello...","no_vehicles":"Nessun veicolo nel catalogo","no_vehicles_add":"Aggiungi il primo veicolo","validation_required":"Campo obbligatorio","validation_year":"Inserisci un anno valido (2000-2030)","validation_price":"Inserisci un prezzo valido","validation_mileage":"Inserisci un chilometraggio valido","saved":"Veicolo salvato con successo!","deleted":"Veicolo eliminato","duplicated":"Veicolo duplicato con successo","messages":"Messaggi","all_vehicles":"Tutti i Veicoli","view_site":"Vedi Sito","message_date":"Data","message_name":"Nome","message_email":"Email","message_subject":"Oggetto","message_preview":"Messaggio","actions":"Azioni","no_messages":"Nessun messaggio","confirm_title":"Conferma","confirm_delete_btn":"Elimina","technical_details":"Dettagli Tecnici","color_ext":"Colore Esterno","color_int":"Colore Interno","power_cv":"Potenza (CV)","power_kw":"Potenza (kW)","doors":"Porte","co2":"CO₂ (g/km)","euro_class":"Classe Euro","consumption":"Consumo","registration":"Immatricolazione","warranty":"Garanzia","warranty_label":"Auto in garanzia","description_it":"Descrizione (Italiano)","description_en":"Description (English)","brand":"Marca","model":"Modello","mileage":"Chilometraggio","transmission":"Cambio","badge":"Adesivo","reserved_label":"Prenotata","featured":"In Evidenza","gallery":"Galleria Foto","photo":"Foto","brand_model":"Marca / Modello","year":"Anno","price":"Prezzo","fuel":"Alimentazione","status":"Status","featured_short":"Ev.","all_statuses":"Tutti gli status","available":"Disponibili","reserved":"Prenotata","sold":"Venduta","new_arrival":"Nuovo Arrivo","offer":"Offerta Speciale","certified":"Certificata","no_vat":"IVA Esclusa","total_vehicles":"Veicoli Totali","sold_upper":"VENDUTA","reserved_upper":"PRENOTATA","new_arrival_upper":"NUOVO ARRIVO","offer_upper":"OFFERTA SPECIALE","certified_upper":"CERTIFICATA","no_vat_upper":"IVA ESCLUSA","preview":"Anteprima","view":"Visualizza","delete":"Elimina","close":"Chiudi","confirm_delete_msg":"Eliminare questo messaggio?","validation_form_errors":"Correggi gli errori nel form prima di salvare","error_image_size":"L'immagine non può superare i 10 MB","error_image_type":"Il file deve essere un'immagine","error_image_read":"Impossibile leggere l'immagine","error_heic":"Formato HEIC non supportato. Converti in JPEG o PNG prima di caricare.","error_file_read":"Errore nella lettura del file","loading":"Caricamento...","vehicles_count":"veicoli","unsaved_changes":"Hai modifiche non salvate. Sei sicuro di voler lasciare questa pagina?","confirm_leave":"Esci senza salvare"},"footer":{"description":"Auto selezionate con passione a Catania. Trasparenza, qualità e professionalità in ogni fase dell'acquisto — con spedizioni in tutta Europa.","quick_links":"Link Rapidi","contact_info":"Contatti","follow_us":"Seguici","privacy":"Privacy Policy","cookies":"Cookie Policy","rights":"© 2026 DCR Sicily Cars s.r.l.s — P.IVA e C.F. 06286240871 — Tutti i diritti riservati."},"errors":{"404_title":"Pagina Non Trovata","404_message":"La pagina che stai cercando non esiste o è stata rimossa.","404_cta":"Torna alla Home"}};

var EN_TRANSLATIONS = {"site":{"title":"DCR Sicily Cars s.r.l.s — Car Dealership","tagline":"Hand-picked cars with passion, from Sicily to the world","description":"DCR Sicily Cars s.r.l.s — car dealership in Catania. BMW, Mercedes, Audi, Tesla and more. Sales, trade-in and shipping across Europe."},"nav":{"home":"Home","about":"About Us","vehicles":"Vehicles","contact":"Contact"},"hero":{"title":"<span class=\"hero-line\">Your next</span><span class=\"hero-line\"><span class=\"hero-highlight\">car</span> is waiting!</span>","subtitle":"<span class=\"hero-sub-line\">Discover our selection of cars</span><span class=\"hero-sub-line\">all <span class=\"hero-highlight\">guaranteed and certified</span></span>","cta_primary":"Browse Our Collection","cta_secondary":"Get in Touch","scroll":"Discover More"},"search":{"title":"Find Your Dream Car","brand":"Brand","model":"Model","price":"Max Price","fuel":"Fuel Type","submit":"Search Car","all_brands":"All Brands","all_models":"All Models","all_prices":"Any Price","all_fuels":"All Fuel Types","no_results":"No vehicles found. Try adjusting your filters."},"featured":{"title":"Featured Cars","subtitle":"An exclusive selection of the finest vehicles in our showroom","view_all":"View All Vehicles","view_detail":"Learn More"},"vehicle":{"year":"Year","mileage":"Mileage","fuel":"Fuel","transmission":"Transmission","price":"Price","km":"km","sold":"Sold","reserved":"Reserved","new_arrival":"New Arrival","offer":"Special Offer","certified":"Certified","no_vat":"No VAT","details":"Vehicle Details","description":"Description","gallery":"Photo Gallery","breadcrumb_home":"Home","breadcrumb_vehicles":"Vehicles","cta_contact":"Request Information","cta_whatsapp":"Contact via WhatsApp","not_found":"Vehicle not found"},"detail":{"specs_title":"Technical Specifications","overview_title":"Overview","gallery_title":"Image Gallery","cta_title":"Interested in this vehicle?","cta_text":"Contact us for more information or to schedule a no-obligation appointment."},"about":{"title":"About Us","subtitle":"Our story, our passion","intro_title":"Welcome to DCR Sicily Cars","intro_p1":"DCR Sicily Cars was born at the crossroads of automotive passion and a clear vision: to reshape the used car world with an approach built on integrity, expertise, and genuine care for people. We are not just sellers — we are consultants who put the client at the heart of every decision.","intro_p2":"Behind every vehicle lies meticulous research, inspection, and preparation. We believe quality cannot be improvised: that's why every car goes through thorough checks before entering our showroom, because what we offer must meet the standards we demand for ourselves.","intro_p3":"Based in Catania, we serve as a benchmark for anyone seeking a car across Italy and throughout Europe. Our growth is built on lasting relationships, returning clients who choose us time and again for the transparency they find at every step of their buying journey.","stat1":"Cars Delivered","stat2":"Years of Experience","stat3":"Happy Clients","mission_title":"Our Mission","mission_text":"We carefully select every vehicle, subject it to rigorous inspections, and prepare it with the utmost attention. Because for us, buying a used car should be a transparent, professional, and surprise-free experience.","vision_title":"Our Vision","vision_text":"To become Sicily's benchmark for the used car market. We strive to be recognised for our integrity, reliability, and a customer service that truly makes a difference — across Italy and throughout Europe.","value_1_text":"We document every detail with precision: service history, actual conditions, and certifications. Because trust is built on clarity, not on promises.","value_2_text":"We only choose vehicles that exceed our quality standards. Every car is the result of careful market research, verified and prepared to deliver an outstanding product.","value_3_text":"We handle logistics across the continent with certified partners. From customs documentation to door-to-door delivery, we manage every step to get your car wherever you are.","value_4_text":"Our commitment does not end with the sale. We support you with dedicated assistance before, during, and after your purchase, because a satisfied client is our greatest endorsement.","team_subtitle":"Meet the people behind your next car","team_christian_role":"Sole Administrator — Vehicle Selection","team_christian_bio":"Founder and driving force of DCR Sicily Cars, Christian built this company by combining deep industry knowledge with a clear vision: to offer only vehicles he would drive himself. His experience is the guarantee that every car in our showroom has passed an uncompromising selection process.","team_roberto_role":"PARTNER - SALES MANAGER","team_roberto_bio":"He is the face that welcomes every client and guides them with empathy and professionalism. Roberto transforms the buying process into a tailored journey, listening to each client's needs and finding the right solution, from vehicle selection to final delivery.","values_title":"Our Values"},"contact":{"title":"Contact Us","subtitle":"We're here to help. Write, call, or visit us.","form_title":"Send Us a Message","name":"Full Name","email":"Email Address","phone":"Phone Number","subject":"Subject","message":"Your Message","submit":"Send Message","success":"Thank you for reaching out! We'll get back to you within 24 hours.","error":"Something went wrong. Please try again later or call us at +39 375 883 9616.","privacy":"I consent to the processing of my personal data according to the Privacy Policy","map_consent":"Click to load the Google Maps map. Loading only occurs after your consent.","map_load":"Load Map","info_title":"Our Contact Info","address":"Address","address_val":"Via Del Rotolo 44/46 (CT)","phone_val":"Christian +39 375 883 9616 — Roberto +39 327 7540399","phone_christian":"Christian +39 375 883 9616","phone_roberto":"Roberto +39 327 7540399","email_val":"dcrsicilycars@gmail.com","hours":"Opening Hours","hours_val":"Monday-Friday: 09:00-19:00 | Saturday: 09:00-13:00"},"cookies":{"banner_title":"This site uses cookies","banner_text":"This site uses technical cookies necessary for operation and Google Maps to show our location. Google Maps loads only after your consent. By clicking 'Accept' you consent.","accept":"Accept","reject":"Reject","more_info":"Learn more","privacy_link":"Privacy Policy","cookie_link":"Cookie Policy"},"admin":{"login_title":"Admin Login","email":"Email","password":"Password","login":"Sign In","logout":"Logout","dashboard":"Dashboard","add_vehicle":"Add Vehicle","confirm_delete":"Are you sure you want to delete this vehicle? This action cannot be undone.","save":"Save Vehicle","cancel":"Cancel","upload_image":"Drag an image here or click to upload (max 10 MB, auto-compressed)","upload_gallery":"Photo Gallery (click to add)","mark_sold":"Sold","mark_reserved":"Reserved","no_status":"Available","search_placeholder":"Search by brand, model...","no_vehicles":"No vehicles in catalog","no_vehicles_add":"Add your first vehicle","validation_required":"Required field","validation_year":"Enter a valid year (2000-2030)","validation_price":"Enter a valid price","validation_mileage":"Enter a valid mileage","saved":"Vehicle saved successfully!","deleted":"Vehicle deleted","duplicated":"Vehicle duplicated successfully","messages":"Messages","all_vehicles":"All Vehicles","view_site":"View Site","message_date":"Date","message_name":"Name","message_email":"Email","message_subject":"Subject","message_preview":"Message","actions":"Actions","no_messages":"No messages","confirm_title":"Confirm","confirm_delete_btn":"Delete","technical_details":"Technical Details","color_ext":"Exterior Color","color_int":"Interior Color","power_cv":"Power (HP)","power_kw":"Power (kW)","doors":"Doors","co2":"CO₂ (g/km)","euro_class":"Euro Class","consumption":"Consumption","registration":"Registration","warranty":"Warranty","warranty_label":"Car under warranty","description_it":"Description (Italian)","description_en":"Description (English)","brand":"Brand","model":"Model","mileage":"Mileage","transmission":"Transmission","badge":"Badge","reserved_label":"Reserved","featured":"Featured","gallery":"Photo Gallery","photo":"Photo","brand_model":"Brand / Model","year":"Year","price":"Price","fuel":"Fuel","status":"Status","featured_short":"Feat.","all_statuses":"All Statuses","available":"Available","reserved":"Reserved","sold":"Sold","new_arrival":"New Arrival","offer":"Special Offer","certified":"Certified","no_vat":"No VAT","total_vehicles":"Total Vehicles","sold_upper":"SOLD","reserved_upper":"RESERVED","new_arrival_upper":"NEW ARRIVAL","offer_upper":"SPECIAL OFFER","certified_upper":"CERTIFIED","no_vat_upper":"NO VAT","preview":"Preview","view":"View","delete":"Delete","close":"Close","confirm_delete_msg":"Delete this message?","validation_form_errors":"Fix form errors before saving","error_image_size":"Image cannot exceed 10 MB","error_image_type":"File must be an image","error_image_read":"Cannot read image","error_heic":"HEIC format not supported. Convert to JPEG or PNG before uploading.","error_file_read":"Error reading file","loading":"Loading...","edit_vehicle":"Edit","duplicate_vehicle":"Duplicate","delete_vehicle":"Delete","vehicles_count":"vehicles","unsaved_changes":"You have unsaved changes. Are you sure you want to leave this page?","confirm_leave":"Leave without saving"},"footer":{"description":"Cars hand-selected with passion in Catania. Transparency, quality, and professionalism at every step — with shipping across Europe.","quick_links":"Quick Links","contact_info":"Contact Info","follow_us":"Follow Us","privacy":"Privacy Policy","cookies":"Cookie Policy","rights":"© 2026 DCR Sicily Cars s.r.l.s — VAT and Tax ID 06286240871 — All rights reserved."},"errors":{"404_title":"Page Not Found","404_message":"The page you are looking for does not exist or has been removed.","404_cta":"Back to Home"}};

// ===== I18n =====
function I18n() {
  this.currentLang = localStorage.getItem('dcr-lang') || 'it';
  this.translations = { it: IT_TRANSLATIONS, en: EN_TRANSLATIONS };
  this.observers = [];
}
I18n.prototype.init = function() {
  this.applyLanguage();
  this.bindSwitcher();
};
I18n.prototype.t = function(key) {
  var keys = key.split('.');
  var value = this.translations[this.currentLang];
  for (var i = 0; i < keys.length; i++) {
    if (value) value = value[keys[i]];
  }
  return value || key;
};
I18n.prototype.setLang = function(lang) {
  if (lang === this.currentLang) return;
  this.currentLang = lang;
  localStorage.setItem('dcr-lang', lang);
  this.applyLanguage();
  this.notifyObservers();
  document.documentElement.lang = lang === 'it' ? 'it' : 'en';
};
I18n.prototype.applyLanguage = function() {
  var self = this;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.dataset.i18n;
    var translation = self.t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = translation;
    } else if (el.tagName === 'IMG') {
      el.alt = translation;
    } else {
      el.innerHTML = translation;
    }
  });
  document.title = this.t('site.title');
};
I18n.prototype.bindSwitcher = function() {
  var self = this;
  document.querySelectorAll('[data-lang]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var lang = btn.dataset.lang;
      self.setLang(lang);
      document.querySelectorAll('[data-lang]').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
};
I18n.prototype.observe = function(fn) { this.observers.push(fn); };
I18n.prototype.notifyObservers = function() {
  this.observers.forEach(function(fn) { fn(this.currentLang); }.bind(this));
};
var i18n = new I18n();

// ===== VehicleData =====
function VehicleData() {
  this.vehicles = [];
}
VehicleData.prototype.loadVehicles = function() {
  var self = this;
  return fetch('/api/vehicles')
    .then(function(r) { return r.json(); })
    .then(function(j) {
      if (j.success && Array.isArray(j.vehicles)) {
        self.vehicles = j.vehicles;
      } else {
        self.vehicles = VEHICLES_DATA;
      }
      return self.vehicles;
    })
    .catch(function() {
      self.vehicles = VEHICLES_DATA;
      return self.vehicles;
    });
};
VehicleData.prototype.getFeatured = function() {
  return this.vehicles.filter(function(v) { return v.featured; });
};
VehicleData.prototype.getById = function(id) {
  return this.vehicles.find(function(v) { return v.id === id; });
};
VehicleData.prototype.getBrands = function() {
  var arr = [];
  this.vehicles.forEach(function(v) { if (arr.indexOf(v.brand) === -1) arr.push(v.brand); });
  return arr.sort();
};
VehicleData.prototype.getModels = function(brand) {
  var arr = [];
  var list = brand ? this.vehicles.filter(function(v) { return v.brand === brand; }) : this.vehicles;
  list.forEach(function(v) { if (arr.indexOf(v.model) === -1) arr.push(v.model); });
  return arr.sort();
};
VehicleData.prototype.getFuels = function() {
  var arr = [];
  this.vehicles.forEach(function(v) { if (arr.indexOf(v.fuel) === -1) arr.push(v.fuel); });
  return arr.sort();
};
VehicleData.prototype.getMaxPrice = function() {
  var max = 0;
  this.vehicles.forEach(function(v) { if (v.price > max) max = v.price; });
  return max;
};
VehicleData.prototype.filter = function(filters) {
  return this.vehicles.filter(function(v) {
    if (filters.brand && v.brand !== filters.brand) return false;
    if (filters.model && v.model !== filters.model) return false;
    if (filters.fuel && v.fuel !== filters.fuel) return false;
    if (filters.price && v.price > parseInt(filters.price)) return false;
    if (filters.search) {
      var q = filters.search.toLowerCase();
      if (v.brand.toLowerCase().indexOf(q) === -1 && v.model.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  });
};
var vehicleData = new VehicleData();

function imgUrl(v) {
  return v.image && v.image !== '/assets/images/placeholder-car.svg' ? v.image : (v.gallery && v.gallery[0]) || v.image
}

// ===== VehicleRenderer =====
function VehicleRenderer(containerId) {
  this.container = document.getElementById(containerId);
}
VehicleRenderer.prototype.createCard = function(vehicle) {
  var badgeHtml = vehicle.badge ? '<span class="car-badge ' + vehicle.badge + '\">' + i18n.t('vehicle.' + vehicle.badge) + '</span>' : '';
  var price = '\\u20AC ' + formatNum(vehicle.price);
  return '<div class="car-card" data-id="' + vehicle.id + '\">'
    + '<div class="car-card-image"><img src="' + BASE_PATH + imgUrl(vehicle) + '" alt="' + vehicle.brand + ' ' + vehicle.model + '" loading="lazy">' + badgeHtml + '</div>'
    + '<div class="car-card-body">'
    + '<h3 class="car-card-title">' + vehicle.brand + ' ' + vehicle.model + '</h3>'
    + '<div class="car-card-price">' + price + '</div>'
    + '<div class="car-card-specs">'
    + '<span class="car-card-spec"><strong>' + i18n.t('vehicle.year') + ':</strong> ' + vehicle.year + '</span>'
    + '<span class="car-card-spec"><strong>' + i18n.t('vehicle.mileage') + ':</strong> ' + formatNum(vehicle.mileage) + ' ' + i18n.t('vehicle.km') + '</span>'
    + '<span class="car-card-spec"><strong>' + i18n.t('vehicle.fuel') + ':</strong> ' + vehicle.fuel + '</span>'
    + '<span class="car-card-spec"><strong>' + i18n.t('vehicle.price') + ':</strong> ' + price + '</span>'
    + '</div></div>'
    + '<div class="car-card-footer"><a href="vehicle-detail.html?id=' + vehicle.id + '" class="btn btn-outline btn-sm btn-block">' + i18n.t('featured.view_detail') + '</a></div>'
    + '</div>';
};
VehicleRenderer.prototype.render = function(vehicles) {
  if (!this.container) return;
  if (!vehicles || vehicles.length === 0) {
    this.container.innerHTML = '<div class="grid-span-all empty-state"><p>' + i18n.t('search.no_results') + '</p></div>';
    return;
  }
  this.container.innerHTML = vehicles.map(function(v) { return this.createCard(v); }.bind(this)).join('');
};

// ===== Common init helpers =====
function initCookieBanner() {
  var banner = document.getElementById('cookie-banner');
  var acceptBtn = document.getElementById('cookie-accept');
  var rejectBtn = document.getElementById('cookie-reject');
  if (!banner || !acceptBtn) return;
  if (localStorage.getItem('dcr-cookie-consent')) return;
  setTimeout(function() { banner.classList.add('show'); }, 500);
  acceptBtn.addEventListener('click', function() {
    localStorage.setItem('dcr-cookie-consent', 'accepted');
    banner.classList.remove('show');
    setTimeout(function() { banner.remove(); }, 400);
  });
  if (rejectBtn) rejectBtn.addEventListener('click', function() {
    localStorage.setItem('dcr-cookie-consent', 'rejected');
    banner.classList.remove('show');
    setTimeout(function() { banner.remove(); }, 400);
  });
}

function initMobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.header-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function() {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initHeaderScroll() {
  var header = document.querySelector('.header');
  if (!header) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initScrollReveal() {
  var elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(function(el) { observer.observe(el); });
}

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast(i18n.t('contact.success'), 'success');
    form.reset();
  });
}

function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) return;
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(function() { toast.remove(); }, 300);
  }, 4000);
}
