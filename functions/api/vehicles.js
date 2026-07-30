function verifyAdmin(auth, env) {
  if (!auth || !auth.startsWith('Basic ')) return false
  try {
    const decoded = atob(auth.slice(6))
    const [email, password] = decoded.split(':')
    return email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD
  } catch {
    return false
  }
}

function rowToVehicle(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    fuel: row.fuel,
    transmission: row.transmission,
    image: row.image,
    gallery: JSON.parse(row.gallery || '[]'),
    badge: row.badge,
    featured: row.featured === 1,
    description: {
      it: row.description_it || '',
      en: row.description_en || ''
    },
    color_ext: row.color_ext || '',
    color_int: row.color_int || '',
    doors: row.doors || '',
    power_cv: row.power_cv || '',
    power_kw: row.power_kw || '',
    co2: row.co2 || '',
    euro_class: row.euro_class || '',
    consumption: row.consumption || '',
    registration: row.registration || '',
    warranty: row.warranty === 1
  }
}

function vehicleToRow(v) {
  return {
    brand: v.brand,
    model: v.model,
    year: v.year,
    mileage: v.mileage || 0,
    price: v.price || 0,
    fuel: v.fuel || '',
    transmission: v.transmission || '',
    image: v.image || '',
    gallery: JSON.stringify(v.gallery || []),
    badge: v.badge || null,
    featured: v.featured ? 1 : 0,
    description_it: v.description?.it || '',
    description_en: v.description?.en || '',
    color_ext: v.color_ext || '',
    color_int: v.color_int || '',
    doors: v.doors || '',
    power_cv: v.power_cv || '',
    power_kw: v.power_kw || '',
    co2: v.co2 || '',
    euro_class: v.euro_class || '',
    consumption: v.consumption || '',
    registration: v.registration || '',
    warranty: v.warranty ? 1 : 0
  }
}

export async function onRequest(context) {
  const { request, env, params } = context
  const url = new URL(request.url)
  const pathParts = url.pathname.replace('/api/vehicles', '').split('/').filter(Boolean)
  const id = pathParts[0] || null

  if (request.method === 'GET') {
    if (id) {
      const row = await env.DB.prepare('SELECT * FROM vehicles WHERE id = ?').bind(id).first()
      if (!row) {
        return Response.json({ success: false, error: 'Veicolo non trovato' }, { status: 404 })
      }
      return Response.json({ success: true, vehicle: rowToVehicle(row) })
    }
    const { results } = await env.DB.prepare('SELECT * FROM vehicles ORDER BY id DESC').all()
    return Response.json({ success: true, vehicles: results.map(rowToVehicle) })
  }

  const auth = request.headers.get('Authorization')
  if (!auth || !verifyAdmin(auth, env)) {
    return Response.json({ success: false, error: 'Non autorizzato' }, { status: 401 })
  }

  if (request.method === 'POST') {
    try {
      const v = await request.json()
      const row = vehicleToRow(v)
      const stmt = env.DB.prepare(
        `INSERT INTO vehicles (brand, model, year, mileage, price, fuel, transmission, image, gallery, badge, featured,
          description_it, description_en, color_ext, color_int, doors, power_cv, power_kw, co2, euro_class, consumption,
          registration, warranty)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        row.brand, row.model, row.year, row.mileage, row.price, row.fuel, row.transmission,
        row.image, row.gallery, row.badge, row.featured,
        row.description_it, row.description_en,
        row.color_ext, row.color_int, row.doors, row.power_cv, row.power_kw,
        row.co2, row.euro_class, row.consumption, row.registration, row.warranty
      )
      const result = await stmt.run()
      return Response.json({ success: true, id: result.meta.last_row_id })
    } catch (e) {
      return Response.json({ success: false, error: e.message }, { status: 500 })
    }
  }

  if (request.method === 'PUT') {
    if (!id) {
      return Response.json({ success: false, error: 'ID richiesto' }, { status: 400 })
    }
    try {
      const v = await request.json()
      const row = vehicleToRow(v)
      const stmt = env.DB.prepare(
        `UPDATE vehicles SET brand=?, model=?, year=?, mileage=?, price=?, fuel=?, transmission=?, image=?, gallery=?,
          badge=?, featured=?, description_it=?, description_en=?, color_ext=?, color_int=?, doors=?, power_cv=?,
          power_kw=?, co2=?, euro_class=?, consumption=?, registration=?, warranty=?, updated_at=datetime('now')
         WHERE id=?`
      ).bind(
        row.brand, row.model, row.year, row.mileage, row.price, row.fuel, row.transmission,
        row.image, row.gallery, row.badge, row.featured,
        row.description_it, row.description_en,
        row.color_ext, row.color_int, row.doors, row.power_cv, row.power_kw,
        row.co2, row.euro_class, row.consumption, row.registration, row.warranty,
        id
      )
      await stmt.run()
      return Response.json({ success: true })
    } catch (e) {
      return Response.json({ success: false, error: e.message }, { status: 500 })
    }
  }

  if (request.method === 'DELETE') {
    if (!id) {
      return Response.json({ success: false, error: 'ID richiesto' }, { status: 400 })
    }
    try {
      await env.DB.prepare('DELETE FROM vehicles WHERE id = ?').bind(id).run()
      return Response.json({ success: true })
    } catch (e) {
      return Response.json({ success: false, error: e.message }, { status: 500 })
    }
  }

  return new Response('Method not allowed', { status: 405 })
}
