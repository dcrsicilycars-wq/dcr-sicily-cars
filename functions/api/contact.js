export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await request.json()
    const { name, email, phone, subject, message, privacy } = body

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return Response.json({ success: false, error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    if (privacy !== true) {
      return Response.json({ success: false, error: 'Devi acconsentire al trattamento dei dati' }, { status: 400 })
    }

    const date = new Date().toLocaleDateString('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

    const stmt = env.DB.prepare(
      'INSERT INTO messages (name, email, phone, subject, message, date) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(name.trim(), email.trim(), phone || '', subject.trim(), message.trim(), date)

    const result = await stmt.run()

    return Response.json({ success: true, id: result.meta.last_row_id })
  } catch (e) {
    return Response.json({ success: false, error: e.message }, { status: 500 })
  }
}
