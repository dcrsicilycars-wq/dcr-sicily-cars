CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  fuel TEXT NOT NULL DEFAULT '',
  transmission TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '/assets/images/placeholder-car.svg',
  gallery TEXT NOT NULL DEFAULT '[]',
  badge TEXT DEFAULT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  description_it TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  color_ext TEXT NOT NULL DEFAULT '',
  color_int TEXT NOT NULL DEFAULT '',
  doors TEXT NOT NULL DEFAULT '',
  power_cv TEXT NOT NULL DEFAULT '',
  power_kw TEXT NOT NULL DEFAULT '',
  co2 TEXT NOT NULL DEFAULT '',
  euro_class TEXT NOT NULL DEFAULT '',
  consumption TEXT NOT NULL DEFAULT '',
  registration TEXT NOT NULL DEFAULT '',
  warranty INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (1, 'BMW', 'X5', 2022, 15000, 55000, 'Diesel', 'Automatic', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', '[]', NULL, 1, 'BMW X5 di ultima generazione in perfette condizioni. Interni in pelle, cerchi in lega, sistema di navigazione professionale.', 'Latest generation BMW X5 in perfect condition. Leather interior, alloy wheels, professional navigation system.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (2, 'Mercedes', 'Classe C', 2021, 28000, 38000, 'Benzina', 'Automatic', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80', '[]', NULL, 1, 'Mercedes Classe C berlina, elegante e confortevole. Mantenuta perfettamente con tagliandi regolari.', 'Mercedes C-Class sedan, elegant and comfortable. Perfectly maintained with regular servicing.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (3, 'Audi', 'Q5', 2023, 8000, 49000, 'Ibrido', 'Automatic', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', '[]', 'reserved', 1, 'Audi Q5 ibrida plug-in, tecnologia all''avanguardia e consumi ridotti. Pronta consegna.', 'Audi Q5 plug-in hybrid, cutting-edge technology and reduced consumption. Ready for delivery.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (4, 'Fiat', '500', 2023, 5000, 18500, 'Benzina', 'Manuale', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', '[]', 'sold', 0, 'Fiat 500 nuova, colorazione vivace e personalizzata. Veicolo già venduto.', 'Brand new Fiat 500, vibrant and customized color. Vehicle already sold.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (5, 'Volkswagen', 'Golf', 2022, 12000, 27000, 'Diesel', 'Automatic', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', '[]', NULL, 1, 'Volkswagen Golf VIII, agile e tecnologica. Ottima per città e viaggi.', 'Volkswagen Golf VIII, agile and technological. Great for city and travel.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (6, 'Tesla', 'Model 3', 2023, 3000, 45000, 'Elettrica', 'Automatic', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', '[]', NULL, 1, 'Tesla Model 3, full electric, autopilot integrato. Tecnologia e sostenibilità.', 'Tesla Model 3, full electric, integrated autopilot. Technology and sustainability.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (7, 'Alfa Romeo', 'Giulia', 2023, 9000, 42000, 'Diesel', 'Automatic', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', '[]', NULL, 1, 'Alfa Romeo Giulia Veloce, eleganza e prestazioni. Dotazione completa, interni in pelle e cerchi in lega.', 'Alfa Romeo Giulia Veloce, elegance and performance. Full equipment, leather interior and alloy wheels.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (8, 'Land Rover', 'Range Rover Sport', 2022, 22000, 72000, 'Diesel', 'Automatic', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', '[]', NULL, 1, 'Range Rover Sport, lusso e versatilità. Interni in pelle, sospensioni pneumatiche, sistema Hi-Fi premium.', 'Range Rover Sport, luxury and versatility. Leather interior, air suspension, premium sound system.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (9, 'Porsche', 'Cayenne', 2021, 35000, 65000, 'Benzina', 'Automatic', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80', '[]', NULL, 0, 'Porsche Cayenne, sportività e comfort. Cerchi in lega, interni in pelle e sistema di infotainment.', 'Porsche Cayenne, sportiness and comfort. Alloy wheels, leather interior and infotainment system.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (10, 'Renault', 'Clio', 2023, 1500, 16500, 'Benzina', 'Manuale', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', '[]', NULL, 0, 'Renault Clio nuova, praticità e stile. Climatizzatore, sensori di parcheggio e connettività smartphone.', 'Brand new Renault Clio, practicality and style. Air conditioning, parking sensors and smartphone connectivity.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (11, 'Toyota', 'Yaris Cross', 2023, 6000, 24000, 'Ibrido', 'Automatic', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', '[]', 'reserved', 1, 'Toyota Yaris Cross ibrida, consumo ridotto e tecnologia Toyota Safety Sense. Pronta consegna.', 'Toyota Yaris Cross hybrid, low consumption and Toyota Safety Sense technology. Ready for delivery.');
INSERT INTO vehicles (id, brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured, description_it, description_en) VALUES (12, 'Jeep', 'Compass', 2022, 18000, 29000, 'Diesel', 'Automatic', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', '[]', NULL, 0, 'Jeep Compass, robustezza e comfort. Trazione integrale, tetto panoramico e interni in pelle.', 'Jeep Compass, robustness and comfort. All-wheel drive, panoramic roof and leather interior.');
