export async function onRequest(context) {
  const { env } = context
  const base = 'https://dcrsicilycars.com'

  const staticUrls = [
    { loc: `${base}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${base}/pages/vehicles`, changefreq: 'daily', priority: '0.9' },
    { loc: `${base}/pages/contact`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${base}/pages/about`, changefreq: 'monthly', priority: '0.7' },
    { loc: `${base}/pages/privacy`, changefreq: 'yearly', priority: '0.3' },
    { loc: `${base}/pages/cookies`, changefreq: 'yearly', priority: '0.3' }
  ]

  const vehicleUrls = []

  try {
    const { results } = await env.DB.prepare(
      'SELECT id, updated_at FROM vehicles ORDER BY id DESC'
    ).all()
    for (const v of results) {
      vehicleUrls.push({
        loc: `${base}/pages/vehicle-detail?id=${v.id}`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod: (v.updated_at || '').slice(0, 10)
      })
    }
  } catch (e) {
    // fallback: only static pages
  }

  function urlTag(u) {
    let tag = '  <url>\n'
    tag += `    <loc>${u.loc}</loc>\n`
    if (u.changefreq) tag += `    <changefreq>${u.changefreq}</changefreq>\n`
    if (u.priority) tag += `    <priority>${u.priority}</priority>\n`
    if (u.lastmod) tag += `    <lastmod>${u.lastmod}</lastmod>\n`
    tag += '  </url>'
    return tag
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    staticUrls.map(urlTag).join('\n') + '\n' +
    vehicleUrls.map(urlTag).join('\n') + '\n' +
    '</urlset>\n'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}
