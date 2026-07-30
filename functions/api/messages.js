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

  const auth = request.headers.get('Authorization')
  if (!auth || !verifyAdmin(auth, env)) {
    return Response.json({ success: false, error: 'Non autorizzato' }, { status: 401 })
  }

  const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY id DESC').all()

  return Response.json({ success: true, messages: results })
}
