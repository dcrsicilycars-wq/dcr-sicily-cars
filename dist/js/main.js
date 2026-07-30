// ============================================
// DCR SICILY CARS - Main Application Entry
// ============================================

import { i18n } from './i18n.js'
import { vehicleData } from './data.js'
import { ParallaxHero } from './parallax.js'
import { SearchFilters } from './filters.js'
import { VehicleRenderer } from './vehicles.js'

// Expose to window for inline scripts in HTML
window.i18n = i18n
window.vehicleData = vehicleData
window.VehicleRenderer = VehicleRenderer

document.addEventListener('DOMContentLoaded', async () => {
  await i18n.init()
  await vehicleData.loadVehicles()

  initCookieBanner()
  initMobileMenu()
  initHeaderScroll()
  initParallax()
  initSearchFilters()
  initFeaturedCars()
  initContactForm()
  initScrollReveal()
})

function initCookieBanner() {
  const banner = document.getElementById('cookie-banner')
  const acceptBtn = document.getElementById('cookie-accept')
  if (!banner || !acceptBtn) return

  if (localStorage.getItem('dcr-cookie-consent') === 'accepted') return

  setTimeout(() => banner.classList.add('show'), 500)

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('dcr-cookie-consent', 'accepted')
    banner.classList.remove('show')
    setTimeout(() => banner.remove(), 400)
  })
}

function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle')
  const nav = document.querySelector('.header-nav')
  if (!toggle || !nav) return

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active')
    nav.classList.toggle('active')
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : ''
  })

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active')
      nav.classList.remove('active')
      document.body.style.overflow = ''
    })
  })
}

function initHeaderScroll() {
  const header = document.querySelector('.header')
  if (!header) return

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 50)
        ticking = false
      })
      ticking = true
    }
  }, { passive: true })
}

function initParallax() {
  new ParallaxHero()
}

function initSearchFilters() {
  const filterContainer = document.getElementById('home-filters')
  if (!filterContainer) return

  new SearchFilters('home-filters', (filters) => {
    const results = vehicleData.filter(filters)
    const renderer = new VehicleRenderer('featured-cars-grid')
    renderer.render(results)
  })
}

function initFeaturedCars() {
  const grid = document.getElementById('featured-cars-grid')
  if (!grid) return

  const renderer = new VehicleRenderer('featured-cars-grid')

  const render = () => {
    const featured = vehicleData.getFeatured()
    renderer.render(featured)
  }

  render()
  i18n.observe(() => render())
}

function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const submitBtn = form.querySelector('[type="submit"]')
    submitBtn.disabled = true
    submitBtn.textContent = '...'

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    data.privacy = form.querySelector('#privacy-consent')?.checked === true

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const json = await res.json()
      if (!json.success) {
        showToast(json.error || i18n.t('contact.error'), 'error')
        return
      }
      showToast(i18n.t('contact.success'), 'success')
      form.reset()
    } catch {
      showToast(i18n.t('contact.error'), 'error')
    } finally {
      submitBtn.disabled = false
      submitBtn.textContent = i18n.t('contact.submit')
    }
  })
}

function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]')
  if (!elements.length) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

  elements.forEach(el => observer.observe(el))
}

function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}
