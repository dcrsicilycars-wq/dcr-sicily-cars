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
  const { request, env, params } = context
  const { id } = params

  const auth = request.headers.get('Authorization')
  if (!auth || !verifyAdmin(auth, env)) {
    return Response.json({ success: false, error: 'Non autorizzato' }, { status: 401 })
  }

  if (request.method === 'DELETE') {
    await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run()
    return Response.json({ success: true })
  }

  if (request.method === 'PATCH') {
    await env.DB.prepare('UPDATE messages SET read = 1 WHERE id = ?').bind(id).run()
    return Response.json({ success: true })
  }

  return new Response('Method not allowed', { status: 405 })
}
