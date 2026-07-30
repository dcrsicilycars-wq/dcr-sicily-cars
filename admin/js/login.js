const form = document.getElementById('login-form')
const emailInput = document.getElementById('login-email')
const passwordInput = document.getElementById('login-password')
const errorEl = document.getElementById('login-error')

if (localStorage.getItem('dcr-admin')) {
  try {
    const admin = JSON.parse(localStorage.getItem('dcr-admin'))
    if (admin.loggedIn) {
      window.location.href = 'index.html'
      return
    }
  } catch (_) {}
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  errorEl.style.display = 'none'

  const email = emailInput.value.trim()
  const password = passwordInput.value

  if (!email || !password) {
    errorEl.textContent = 'Inserisci email e password.'
    errorEl.style.display = 'block'
    return
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (data.success) {
      localStorage.setItem('dcr-admin', JSON.stringify({ loggedIn: true, email, password }))
      window.location.href = '/admin/'
    } else {
      errorEl.textContent = data.error || 'Email o password non validi.'
      errorEl.style.display = 'block'
    }
  } catch (err) {
    errorEl.textContent = 'Errore di connessione al server. Se sei in locale, esegui il deploy su Cloudflare.'
    errorEl.style.display = 'block'
  }
})
