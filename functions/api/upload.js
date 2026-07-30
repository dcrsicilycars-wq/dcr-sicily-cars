import { randomUUID } from 'node:crypto'

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

export async function onRequest(context) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const auth = request.headers.get('Authorization')
  if (!auth || !verifyAdmin(auth, env)) {
    return Response.json({ success: false, error: 'Non autorizzato' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { image, gallery } = body

    if (!image && !gallery) {
      return Response.json({ success: false, error: 'Nessuna immagine fornita' }, { status: 400 })
    }

    if (gallery && Array.isArray(gallery)) {
      const ids = await Promise.all(gallery.map(async (dataUrl) => {
        if (dataUrl.startsWith('/img/')) return dataUrl
        const id = randomUUID()
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/)
        if (!match) return dataUrl
        await env.DB.prepare(
          'INSERT INTO images (id, data, mime) VALUES (?, ?, ?)'
        ).bind(id, match[2], match[1]).run()
        return '/img/' + id
      }))
      return Response.json({ success: true, gallery: ids })
    }

    const id = randomUUID()
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!match) {
      return Response.json({ success: false, error: 'Formato immagine non valido' }, { status: 400 })
    }

    await env.DB.prepare(
      'INSERT INTO images (id, data, mime) VALUES (?, ?, ?)'
    ).bind(id, match[2], match[1]).run()

    return Response.json({ success: true, image: '/img/' + id, id })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
