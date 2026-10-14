const fs = require('fs')
const path = require('path')

// ===== TOGGLE UNICO =====
// true  -> patina nera attiva su tutte le pagine (frontend + admin)
// false -> patina rimossa da tutte le pagine (il prossimo build la strappa via)
const ENABLED = false
// ========================

const START = '<!--DCR-OVERLAY:START-->'
const END = '<!--DCR-OVERLAY:END-->'

// Snippet iniettato subito dopo <head>: salva la chiave PRIMA di eventuali
// auth guard in <head> (admin/index.html -> location.replace('login.html'))
// che altrimenti perdono il query string e la chiave non verrebbe mai salvata.
const HEAD_BLOCK = `<!--DCR-UNLOCK:HEAD--><script>
(function () {
  try {
    var m = /[?&]chiave=([^&#]+)/.exec(location.search);
    if (m && decodeURIComponent(m[1]) === 'dcr-sblocca-2026') {
      localStorage.setItem('dcr_lock', '1');
    }
  } catch (e) {}
})();
</script>`

const BLOCK = `${START}
<style id="dcr-lock-style">
  html, body { background: #000 !important; }
  body { overflow: hidden !important; }
  .header, .footer { z-index: 2147483001 !important; }
  .footer { position: relative !important; }
  #dcr-lock {
    position: fixed; inset: 0; z-index: 2147483000;
    background: #000; overflow: hidden;
    font-family: "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    color: #00ff6a; cursor: default;
  }
  #dcr-lock .dl-scan {
    position: absolute; inset: 0; pointer-events: none; opacity: .35;
    background: repeating-linear-gradient(to bottom, rgba(0,255,106,.06) 0 1px, transparent 1px 3px);
  }
  #dcr-lock .dl-glow {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 45%, rgba(0,255,106,.10), transparent 60%);
  }
  #dcr-lock .dl-wrap {
    position: relative; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center; padding: 24px;
  }
  #dcr-lock .dl-prompt { font-size: 13px; letter-spacing: .08em; opacity: .55; margin-bottom: 28px; }
  #dcr-lock .dl-title {
    font-size: clamp(34px, 8vw, 92px); font-weight: 700; letter-spacing: .12em;
    margin: 0; color: #00ff6a; text-shadow: 0 0 18px rgba(0,255,106,.55), 0 0 60px rgba(0,255,106,.25);
    animation: dl-glitch 3.2s infinite steps(1);
  }
  #dcr-lock .dl-sub {
    margin-top: 22px; font-size: clamp(13px, 2.4vw, 18px); letter-spacing: .3em;
    color: #baffdb; text-transform: uppercase;
  }
  #dcr-lock .dl-note { margin-top: 34px; font-size: 13px; line-height: 1.9; opacity: .5; max-width: 560px; }
  #dcr-lock .dl-cursor {
    display: inline-block; width: .6em; height: 1.1em; background: #00ff6a;
    vertical-align: text-bottom; margin-left: 6px; animation: dl-blink 1s steps(1) infinite;
  }
  @keyframes dl-blink { 50% { opacity: 0; } }
  @keyframes dl-glitch {
    0%, 88%, 100% { transform: translate(0, 0); filter: none; }
    90% { transform: translate(-3px, 1px); filter: hue-rotate(60deg); }
    92% { transform: translate(3px, -1px); }
    94% { transform: translate(-2px, 0); filter: hue-rotate(-40deg); }
    96% { transform: translate(0, 0); }
  }
  @media (max-width: 600px) {
    #dcr-lock .dl-prompt { font-size: 11px; margin-bottom: 18px; }
    #dcr-lock .dl-sub { letter-spacing: .18em; }
    #dcr-lock .dl-note { font-size: 12px; }
  }
</style>
<div id="dcr-lock">
  <div class="dl-scan"></div>
  <div class="dl-glow"></div>
  <div class="dl-wrap">
    <div class="dl-prompt">&gt; dcrsicilycars.com -- security protocol engaged</div>
    <h1 class="dl-title">SITO SOSPESO</h1>
    <div class="dl-sub">Accesso rifiutato</div>
    <div class="dl-note">
      I contenuti di questo dominio non sono al momento disponibili.<span class="dl-cursor"></span><br>
      [ security_status: LOCKED ]
    </div>
  </div>
</div>
<script>
(function () {
  function unlock() {
    var l = document.getElementById('dcr-lock'); if (l && l.parentNode) l.parentNode.removeChild(l);
    var s = document.getElementById('dcr-lock-style'); if (s && s.parentNode) s.parentNode.removeChild(s);
  }
  try {
    var m = /[?&]chiave=([^&#]+)/.exec(location.search);
    if (m && decodeURIComponent(m[1]) === 'dcr-sblocca-2026') {
      localStorage.setItem('dcr_lock', '1');
    }
    if (localStorage.getItem('dcr_lock') === '1') unlock();
  } catch (e) {}
})();
</script>
${END}`

function walk(dir) {
  let out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) out = out.concat(walk(p))
    else if (entry.name.endsWith('.html')) out.push(p)
  }
  return out
}

const dist = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(dist)) {
  console.log('[overlay] dist/ non trovata, niente da fare')
  process.exit(0)
}

let injected = 0
let headInjected = 0
for (const file of walk(dist)) {
  let html = fs.readFileSync(file, 'utf8')
  const s = html.indexOf(START)
  const e = html.indexOf(END)
  if (s !== -1 && e !== -1) {
    html = html.slice(0, s) + html.slice(e + END.length)
  }
  html = html.split(HEAD_BLOCK).join('')
  const h = html.indexOf('<head>')
  if (ENABLED && h !== -1) {
    html = html.slice(0, h + 6) + HEAD_BLOCK + html.slice(h + 6)
    headInjected++
  }
  if (ENABLED && html.includes('</body>')) {
    html = html.replace('</body>', `${BLOCK}\n</body>`)
    injected++
  } else if (ENABLED) {
    html += BLOCK
    injected++
  }
  fs.writeFileSync(file, html)
}

console.log(`[overlay] ENABLED=${ENABLED} -> iniettata in ${injected} file HTML (head: ${headInjected})`)
