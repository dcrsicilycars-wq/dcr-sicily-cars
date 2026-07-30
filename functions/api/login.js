export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email?.trim() || !password) {
      return Response.json({ success: false, error: 'Email e password richieste' }, { status: 400 })
    }

    const valid = email.trim() === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD

    if (!valid) {
      return Response.json({ success: false, error: 'Email o password non validi' }, { status: 401 })
    }

    return Response.json({ success: true, email: email.trim() })
  } catch (e) {
    return Response.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}
