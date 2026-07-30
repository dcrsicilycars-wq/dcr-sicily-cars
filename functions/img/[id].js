export async function onRequest(context) {
  const { request, env, params } = context
  const id = params.id

  if (!id) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const row = await env.DB.prepare('SELECT data, mime FROM images WHERE id = ?').bind(id).first()
    if (!row) {
      return new Response('Not found', { status: 404 })
    }

    const buf = Uint8Array.from(atob(row.data), c => c.charCodeAt(0))
    return new Response(buf, {
      headers: {
        'Content-Type': row.mime,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (e) {
    return new Response('Error', { status: 500 })
  }
}
