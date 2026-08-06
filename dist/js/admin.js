import '../admin/css/admin.css'
import heic2any from 'heic2any'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { i18n } from './i18n.js'
import { vehicleData } from './data.js'

function formatNum(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

window.i18n = i18n
window.vehicleData = vehicleData

let editingId = null
let galleryData = []
let messages = []
let sortState = { column: null, direction: 'asc' }
let modalCallback = null
let formDirty = false
let pendingView = null

function debounce(fn, ms) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

function showView(view) {
  document.querySelectorAll('[id^="view-"]').forEach(el => el.style.display = 'none')
  document.querySelectorAll('[data-page]').forEach(el => el.classList.remove('active'))
  const target = document.getElementById(`view-${view}`)
  if (target) target.style.display = ''
  const navLink = document.querySelector(`[data-page="${view}"]`)
  if (navLink) navLink.classList.add('active')
  if (view === 'dashboard') renderDashboard()
  if (view === 'list') renderListTable()
  if (view === 'add') resetForm()
  if (view === 'messages') renderMessages()
}

function renderListTable(filteredVehicles) {
  const tbody = document.getElementById('list-table-body')
  const vehicles = filteredVehicles || vehicleData.vehicles

  const countEl = document.getElementById('list-vehicle-count')
  if (countEl) countEl.textContent = `(${vehicles.length})`

  if (vehicles.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--color-gray-400);">${i18n.t('admin.no_vehicles')}. <a href="#" data-page="add">${i18n.t('admin.add_vehicle')}</a></td></tr>`
  } else {
    tbody.innerHTML = vehicles.map(v => tableRow(v)).join('')
  }
}

function tableRow(v) {
  const badgeHtml = v.badge
    ? `<span class="badge badge-${v.badge}">${i18n.t('admin.' + v.badge + '_upper')}</span>`
    : `<span class="badge badge-none">-</span>`
  const featuredHtml = v.featured ? '<span class="featured-star" title="' + i18n.t('admin.featured') + '">&#9733;</span>' : ''
  const price = `€ ${formatNum(v.price)}`
  const t = (key) => i18n.t(key)
  const thumbSrc = v.image && v.image !== '/assets/images/placeholder-car.svg' ? v.image : (v.gallery && v.gallery[0]) || v.image
  return `
    <tr>
      <td data-label="${t('admin.photo')}"><img src="${thumbSrc}" alt="${v.brand} ${v.model}" class="thumb" loading="lazy"></td>
      <td data-label="${t('admin.brand_model')}"><strong>${v.brand}</strong> ${v.model} ${featuredHtml}</td>
      <td data-label="${t('admin.year')}">${v.year}</td>
      <td data-label="${t('admin.price')}">${price}</td>
      <td data-label="${t('admin.fuel')}">${v.fuel}</td>
      <td data-label="${t('admin.status')}">${badgeHtml}</td>
      <td data-label="${t('admin.actions')}">
        <div class="actions">
          <button class="btn btn-outline btn-sm" onclick="editVehicle(${v.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span data-i18n-btn="admin.edit_vehicle">${t('admin.edit_vehicle')}</span>
          </button>
          <button class="btn btn-outline btn-sm" onclick="window.previewVehicle(${v.id})" title="${t('admin.preview')}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>${t('admin.preview')}</span>
          </button>

          <button class="btn btn-danger btn-sm" onclick="window.deleteVehicle(${v.id})">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            <span data-i18n-btn="admin.delete_vehicle">${t('admin.delete_vehicle')}</span>
          </button>
        </div>
      </td>
    </tr>`
}

function renderDashboard() {
  const total = vehicleData.vehicles.length
  const available = vehicleData.vehicles.filter(v => !v.badge).length
  const reserved = vehicleData.vehicles.filter(v => v.badge === 'reserved').length
  const sold = vehicleData.vehicles.filter(v => v.badge === 'sold').length

  document.getElementById('total-vehicles').textContent = total
  document.getElementById('available-vehicles').textContent = available
  document.getElementById('reserved-vehicles').textContent = reserved
  document.getElementById('sold-vehicles').textContent = sold

  const countEl = document.getElementById('dashboard-vehicle-count')
  if (countEl) countEl.textContent = `(${total} ${i18n.t('admin.vehicles_count')})`

  const tbody = document.getElementById('dashboard-table-body')
  if (total === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--color-gray-400);">${i18n.t('admin.no_vehicles')}</td></tr>`
  } else {
    tbody.innerHTML = vehicleData.vehicles.slice(0, 5).map(v => tableRow(v)).join('')
  }
}

window.editVehicle = function(id) {
  const v = vehicleData.getById(id)
  if (!v) return

  showView('add')

  editingId = id
  document.getElementById('form-title').textContent = i18n.t('admin.edit_vehicle')
  document.getElementById('vehicle-id').value = id
  document.getElementById('v-brand').value = v.brand
  document.getElementById('v-model').value = v.model
  document.getElementById('v-year').value = v.year
  document.getElementById('v-mileage').value = v.mileage
  document.getElementById('v-price').value = v.price
  document.getElementById('v-fuel').value = v.fuel
  document.getElementById('v-transmission').value = v.transmission
  document.getElementById('v-description-it').value = v.description?.it || ''
  document.getElementById('v-description-en').value = v.description?.en || ''
  document.getElementById('v-image').value = v.image
  const badgeRadio = document.querySelector(`input[name="badge"][value="${v.badge || ''}"]`)
  if (badgeRadio) badgeRadio.checked = true
  document.getElementById('v-featured').checked = v.featured || false

  document.getElementById('v-color-ext') && (document.getElementById('v-color-ext').value = v.color_ext || '')
  document.getElementById('v-color-int') && (document.getElementById('v-color-int').value = v.color_int || '')
  document.getElementById('v-doors') && (document.getElementById('v-doors').value = v.doors || '')
  document.getElementById('v-power-cv') && (document.getElementById('v-power-cv').value = v.power_cv || '')
  document.getElementById('v-power-kw') && (document.getElementById('v-power-kw').value = v.power_kw || '')
  document.getElementById('v-co2') && (document.getElementById('v-co2').value = v.co2 || '')
  document.getElementById('v-euro-class') && (document.getElementById('v-euro-class').value = v.euro_class || '')
  document.getElementById('v-consumption') && (document.getElementById('v-consumption').value = v.consumption || '')
  document.getElementById('v-registration') && (document.getElementById('v-registration').value = v.registration || '')
  document.getElementById('v-warranty') && (document.getElementById('v-warranty').checked = v.warranty || false)

  const preview = document.getElementById('file-upload-preview')
  if (v.image && v.image !== '/assets/images/placeholder-car.svg') {
    preview.src = v.image
    document.getElementById('file-upload-actions').style.display = ''
    document.getElementById('file-upload-text').style.display = 'none'
  }

  galleryData = v.gallery ? [...v.gallery] : []
  renderGalleryGrid()

  clearErrors()
  formDirty = false
}

window.deleteVehicle = async function(id) {
  openModal(
    i18n.t('admin.confirm_delete'),
    async function() {
      try {
        const res = await fetch('/api/vehicles/' + id, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error((json.error || 'Errore eliminazione') + ' (HTTP ' + res.status + ')')
        }
        await vehicleData.loadVehicles(true)
        showToast(i18n.t('admin.deleted'), 'info')
        refreshViews()
      } catch (e) {
        showToast(e.message || i18n.t('contact.error'), 'error')
      }
      closeModal()
    }
  )
}

window.previewVehicle = function(id) {
  const basePath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '../pages/vehicle-detail.html'
    : '/pages/vehicle-detail.html'
  window.open(basePath + '?id=' + id, '_blank')
}

function refreshViews() {
  const dashVisible = document.getElementById('view-dashboard').style.display !== 'none'
  const listVisible = document.getElementById('view-list').style.display !== 'none'
  if (dashVisible) renderDashboard()
  if (listVisible) renderListTable()
}

function resetForm() {
  editingId = null
  galleryData = []
  formDirty = false
  document.getElementById('form-title').textContent = i18n.t('admin.add_vehicle')
  document.getElementById('vehicle-form').reset()
  document.getElementById('vehicle-id').value = ''
  document.getElementById('v-image').value = '/assets/images/placeholder-car.svg'
  document.getElementById('file-upload-actions').style.display = 'none'
  document.getElementById('file-upload-text').style.display = 'block'
  document.getElementById('file-upload-text').textContent = i18n.t('admin.upload_image')

  document.querySelectorAll('.form-collapsible input, .form-collapsible select').forEach(el => {
    if (el.type !== 'checkbox') el.value = ''
    else el.checked = false
  })

  renderGalleryGrid()
  clearErrors()
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '')
}

function validateField(id, errorId, check) {
  const el = document.getElementById(id)
  const err = document.getElementById(errorId)
  const msg = check(el.value)
  err.textContent = msg || ''
  el.style.borderColor = msg ? 'var(--color-danger)' : ''
  return !msg
}

function validateForm() {
  const required = () => i18n.t('admin.validation_required')
  const checks = [
    validateField('v-brand', 'err-brand', v => v.trim() ? '' : required()),
    validateField('v-model', 'err-model', v => v.trim() ? '' : required()),
    validateField('v-year', 'err-year', v => {
      const n = parseInt(v)
      if (!v) return required()
      if (isNaN(n) || n < 2000 || n > 2030) return i18n.t('admin.validation_year')
      return ''
    }),
    validateField('v-price', 'err-price', v => {
      const n = parseInt(v)
      if (!v) return required()
      if (isNaN(n) || n <= 0) return i18n.t('admin.validation_price')
      return ''
    }),
    validateField('v-mileage', 'err-mileage', v => {
      const n = parseInt(v)
      if (v === '') return required()
      if (isNaN(n) || n < 0) return i18n.t('admin.validation_mileage')
      return ''
    })
  ]
  return checks.every(Boolean)
}

let dragIndex = null

function renderGalleryGrid() {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return
  if (galleryData.length === 0) {
    grid.innerHTML = ''
    document.getElementById('gallery-add-btn').style.display = ''
    return
  }
  grid.innerHTML = galleryData.map((img, i) => `
    <div class="gallery-item" draggable="true" data-index="${i}">
      <img src="${img}" alt="Foto ${i+1}">
      <button type="button" class="gallery-item-remove" data-index="${i}">&times;</button>
    </div>
  `).join('')
  document.getElementById('gallery-add-btn').style.display = galleryData.length >= 10 ? 'none' : ''

  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('dragstart', function(e) {
      dragIndex = parseInt(this.dataset.index)
      e.dataTransfer.effectAllowed = 'move'
    })
    item.addEventListener('dragover', function(e) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    })
    item.addEventListener('drop', function(e) {
      e.preventDefault()
      const toIndex = parseInt(this.dataset.index)
      if (dragIndex !== null && dragIndex !== toIndex) {
        const [moved] = galleryData.splice(dragIndex, 1)
        galleryData.splice(toIndex, 0, moved)
        renderGalleryGrid()
      }
      dragIndex = null
    })
  })

  grid.querySelectorAll('.gallery-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.index)
      galleryData.splice(idx, 1)
      renderGalleryGrid()
    })
  })
}

async function syncToServer(vehicle, editingId) {
  const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() }
  const url = editingId ? `/api/vehicles/${editingId}` : '/api/vehicles'
  const method = editingId ? 'PUT' : 'POST'
  const res = await fetch(url, { method, headers, body: JSON.stringify(vehicle) })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error((json.error || 'Errore salvataggio veicolo') + ' (HTTP ' + res.status + ')')
  }
}

async function uploadVehicleImages(vehicle) {
  const uploadHeaders = { 'Content-Type': 'application/json', ...getAuthHeaders() }

  if (vehicle.image && vehicle.image.startsWith('data:')) {
    const res = await fetch('/api/upload', {
      method: 'POST', headers: uploadHeaders,
      body: JSON.stringify({ image: vehicle.image })
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error((json.error || 'Errore upload immagine') + ' (HTTP ' + res.status + ')')
    }
    const json = await res.json()
    if (json.success) vehicle.image = json.image
  }

  const hasNewGallery = vehicle.gallery && vehicle.gallery.some(u => u.startsWith('data:'))
  if (hasNewGallery) {
    const res = await fetch('/api/upload', {
      method: 'POST', headers: uploadHeaders,
      body: JSON.stringify({ gallery: vehicle.gallery })
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error((json.error || 'Errore upload gallery') + ' (HTTP ' + res.status + ')')
    }
    const json = await res.json()
    if (json.success && json.gallery) vehicle.gallery = json.gallery
  }

  if ((!vehicle.image || vehicle.image === '/assets/images/placeholder-car.svg') && vehicle.gallery && vehicle.gallery.length) {
    vehicle.image = vehicle.gallery[0]
  }
}

function showToast(message, type = 'info') {
  const container = document.querySelector('.toast-container') || (() => {
    const div = document.createElement('div')
    div.className = 'toast-container'
    document.body.appendChild(div)
    return div
  })()

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  container.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('toast-fade')
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}

/* ---- Modal ---- */
function openModal(message, onConfirm, confirmText) {
  const modal = document.getElementById('confirm-modal')
  const msgEl = document.getElementById('modal-message')
  if (!modal || !msgEl) return
  msgEl.textContent = message
  modal.style.display = 'flex'
  modalCallback = onConfirm
  const confirmBtn = document.getElementById('modal-confirm')
  if (confirmBtn) confirmBtn.textContent = confirmText || i18n.t('admin.confirm_delete_btn')
}

function closeModal() {
  const modal = document.getElementById('confirm-modal')
  if (modal) modal.style.display = 'none'
  modalCallback = null
}

/* ---- API Helpers ---- */
function getAuthHeaders() {
  try {
    const admin = JSON.parse(localStorage.getItem('dcr-admin') || '{}')
    if (admin.email && admin.password) {
      const token = btoa(admin.email + ':' + admin.password)
      return { 'Authorization': 'Basic ' + token }
    }
  } catch (e) {}
  return {}
}

/* ---- Messages ---- */
let messagesLoading = false
async function loadMessages() {
  if (messagesLoading) return
  messagesLoading = true
  try {
    const res = await fetch('/api/messages', { headers: getAuthHeaders() })
    const json = await res.json()
    if (json.success) {
      messages = json.messages || []
    } else {
      messages = []
    }
  } catch (e) { messages = [] }
  finally {
    messagesLoading = false
  }
  renderMessages()
  updateMessagesBadge()
}

function updateMessagesBadge() {
  const badge = document.getElementById('msg-badge')
  if (!badge) return
  const unread = messages.filter(m => !m.read).length
  badge.textContent = unread
  badge.style.display = unread > 0 ? '' : 'none'
}

function renderMessages() {
  const tbody = document.getElementById('messages-table-body')
  if (!tbody) return
  if (messages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--color-gray-400);">${i18n.t('admin.no_messages')}</td></tr>`
    return
  }
  const t = (key) => i18n.t(key)
  tbody.innerHTML = messages.map(m => `
    <tr class="${m.read ? '' : 'msg-unread'}">
      <td data-label="${t('admin.message_date')}">${m.date || ''}</td>
      <td data-label="${t('admin.message_name')}">${m.name || ''}</td>
      <td data-label="${t('admin.message_email')}">${m.email || ''}</td>
      <td data-label="${t('admin.message_subject')}">${m.subject || ''}</td>
      <td data-label="${t('admin.message_preview')}">${(m.message || '').substring(0, 60)}${(m.message || '').length > 60 ? '...' : ''}</td>
      <td data-label="${t('admin.actions')}">
        <div class="actions">
          <button class="btn btn-outline btn-sm" onclick="window.viewMessage(${m.id})">${t('admin.view')}</button>
          <button class="btn btn-danger btn-sm" onclick="window.deleteMessage(${m.id})">${t('admin.delete')}</button>
        </div>
      </td>
    </tr>
  `).join('')
}

window.viewMessage = async function(id) {
  const m = messages.find(msg => msg.id === id)
  if (!m) return
  if (!m.read) {
    m.read = true
    try {
      await fetch('/api/messages/' + id, {
        method: 'PATCH',
        headers: getAuthHeaders()
      })
    } catch (e) {}
    renderMessages()
    updateMessagesBadge()
  }
  const content = `<strong>${i18n.t('admin.message_name')}:</strong> ${m.name || '-'}<br>
<strong>${i18n.t('admin.message_email')}:</strong> ${m.email || '-'}<br>
<strong>${i18n.t('admin.message_subject')}:</strong> ${m.subject || '-'}<br>
<strong>${i18n.t('admin.message_date')}:</strong> ${m.date || '-'}<br><br>
<strong>${i18n.t('admin.message_preview')}:</strong><br>${m.message || '-'}`
  openModal(content, function() { closeModal() }, i18n.t('admin.close'))
}

window.deleteMessage = async function(id) {
  openModal(i18n.t('admin.confirm_delete_msg'), async function() {
    try {
      await fetch('/api/messages/' + id, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      messages = messages.filter(m => m.id !== id)
      renderMessages()
      updateMessagesBadge()
      showToast(i18n.t('admin.deleted'), 'info')
    } catch (e) {
      showToast(i18n.t('contact.error'), 'error')
    }
    closeModal()
  })
}

/* ---- Language Switcher ---- */
function initLangSwitcher() {
  const btns = document.querySelectorAll('.lang-btn')
  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.dataset.lang
      btns.forEach(b => b.classList.remove('active'))
      this.classList.add('active')
      i18n.setLang(lang)
    })
  })
}

/* ---- Sortable Columns ---- */
function initSortable() {
  document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', function() {
      const col = this.dataset.sort
      if (sortState.column === col) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc'
      } else {
        sortState.column = col
        sortState.direction = 'asc'
      }
      document.querySelectorAll('.sortable').forEach(h => h.classList.remove('sort-asc', 'sort-desc'))
      this.classList.add('sort-' + sortState.direction)
      renderListTable(getSortedVehicles())
    })
  })
}

function getSortedVehicles() {
  let vehicles = [...vehicleData.vehicles]
  if (!sortState.column) return vehicles
  vehicles.sort((a, b) => {
    let va = a[sortState.column]
    let vb = b[sortState.column]
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    if (va < vb) return sortState.direction === 'asc' ? -1 : 1
    if (va > vb) return sortState.direction === 'asc' ? 1 : -1
    return 0
  })
  return vehicles
}

function applyI18n() {
  if (typeof i18n !== 'undefined' && i18n.applyLanguage) {
    i18n.applyLanguage()
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const admin = JSON.parse(localStorage.getItem('dcr-admin') || '{}')
  if (!admin.loggedIn) {
    window.location.href = 'login.html'
    return
  }

  await i18n.init()
  await vehicleData.loadVehicles()

  function confirmNav(targetView) {
    if (formDirty) {
      pendingView = targetView
      openModal(i18n.t('admin.unsaved_changes'), function() {
        closeModal()
        formDirty = false
        showView(pendingView)
        pendingView = null
      })
      document.getElementById('modal-confirm').textContent = i18n.t('admin.confirm_leave')
    } else {
      showView(targetView)
    }
  }

  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      confirmNav(link.dataset.page)
    })
  })

  document.getElementById('form-cancel')?.addEventListener('click', () => confirmNav('dashboard'))

  // Real-time validation on blur
  function vCheck(id, err, checkFn) {
    document.getElementById(id)?.addEventListener('blur', function() { validateField(id, err, checkFn) })
    document.getElementById(id)?.addEventListener('input', function() {
      const errEl = document.getElementById(err)
      if (errEl.textContent) validateField(id, err, checkFn)
    })
  }
  const required = () => i18n.t('admin.validation_required')
  vCheck('v-brand', 'err-brand', v => v.trim() ? '' : required())
  vCheck('v-model', 'err-model', v => v.trim() ? '' : required())
  vCheck('v-year', 'err-year', v => {
    const n = parseInt(v)
    if (!v) return required()
    if (isNaN(n) || n < 2000 || n > 2030) return i18n.t('admin.validation_year')
    return ''
  })
  vCheck('v-price', 'err-price', v => {
    const n = parseInt(v)
    if (!v) return required()
    if (isNaN(n) || n <= 0) return i18n.t('admin.validation_price')
    return ''
  })
  vCheck('v-mileage', 'err-mileage', v => {
    const n = parseInt(v)
    if (v === '') return required()
    if (isNaN(n) || n < 0) return i18n.t('admin.validation_mileage')
    return ''
  })

  // Form dirty tracking
  document.querySelectorAll('#vehicle-form input, #vehicle-form select, #vehicle-form textarea').forEach(el => {
    el.addEventListener('change', () => { formDirty = true })
    el.addEventListener('input', () => { formDirty = true })
  })

  document.getElementById('vehicle-form')?.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast(i18n.t('admin.validation_form_errors'), 'error')
      return
    }

    const vehicle = {}

    vehicle.brand = document.getElementById('v-brand').value.trim()
    vehicle.model = document.getElementById('v-model').value.trim()
    vehicle.year = parseInt(document.getElementById('v-year').value)
    vehicle.mileage = parseInt(document.getElementById('v-mileage').value)
    vehicle.price = parseInt(document.getElementById('v-price').value)
    vehicle.fuel = document.getElementById('v-fuel').value
    vehicle.transmission = document.getElementById('v-transmission').value
    vehicle.image = document.getElementById('v-image').value
    vehicle.gallery = galleryData
    const checkedBadge = document.querySelector('input[name="badge"]:checked')
    vehicle.badge = checkedBadge?.value || null
    vehicle.featured = document.getElementById('v-featured').checked
    vehicle.description = {
      it: document.getElementById('v-description-it').value.trim(),
      en: document.getElementById('v-description-en').value.trim()
    }

    vehicle.color_ext = document.getElementById('v-color-ext')?.value.trim() || ''
    vehicle.color_int = document.getElementById('v-color-int')?.value.trim() || ''
    const doors = parseInt(document.getElementById('v-doors')?.value)
    vehicle.doors = isNaN(doors) ? '' : doors
    const cv = parseInt(document.getElementById('v-power-cv')?.value)
    vehicle.power_cv = isNaN(cv) ? '' : cv
    const kw = parseInt(document.getElementById('v-power-kw')?.value)
    vehicle.power_kw = isNaN(kw) ? '' : kw
    const co2 = parseInt(document.getElementById('v-co2')?.value)
    vehicle.co2 = isNaN(co2) ? '' : co2
    vehicle.euro_class = document.getElementById('v-euro-class')?.value || ''
    vehicle.consumption = document.getElementById('v-consumption')?.value.trim() || ''
    vehicle.registration = document.getElementById('v-registration')?.value.trim() || ''
    vehicle.warranty = document.getElementById('v-warranty')?.checked || false

    const submitBtn = document.querySelector('#vehicle-form button[type="submit"]')
    if (submitBtn) submitBtn.disabled = true

    uploadVehicleImages(vehicle).then(() => {
      return syncToServer(vehicle, editingId)
    }).then(() => {
      return vehicleData.loadVehicles(true)
    }).then(() => {
      formDirty = false
      showToast(i18n.t('admin.saved'), 'success')
      showView('dashboard')
    }).catch((err) => {
      showToast(err.message || i18n.t('contact.error'), 'error')
    }).finally(() => {
      if (submitBtn) submitBtn.disabled = false
    })
  })

  // Main image upload (click and drag-and-drop)
  const uploadArea = document.getElementById('file-upload-area')
  const fileInput = document.getElementById('v-image-input')

  uploadArea?.addEventListener('click', (e) => {
    if (e.target.closest('#file-upload-remove')) return
    fileInput.click()
  })

  uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = 'var(--color-accent)'
    uploadArea.style.background = 'var(--color-accent-light, #e8f0ff)'
  })

  uploadArea?.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = ''
    uploadArea.style.background = ''
  })

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024
  const MAX_IMAGE_DIM = 1200
  const IMAGE_QUALITY = 0.8

  async function loadImageFile(file) {
    let targetFile = file
    const isHeic = /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name) ||
      file.type === 'image/heic' || file.type === 'image/heif'

    if (isHeic) {
      try {
        const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: IMAGE_QUALITY })
        const blob = Array.isArray(result) ? result[0] : result
        targetFile = new File([blob], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' })
      } catch (e) {
        throw new Error(i18n.t('admin.error_heic'))
      }
    }

    if (targetFile.size > MAX_IMAGE_SIZE) {
      throw new Error(i18n.t('admin.error_image_size'))
    }
    if (!targetFile.type.startsWith('image/')) {
      throw new Error(i18n.t('admin.error_image_type'))
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error(i18n.t('admin.error_file_read')))
      reader.readAsDataURL(targetFile)
    })
  }

  function resizeToDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        let srcW = img.naturalWidth || img.width
        let srcH = img.naturalHeight || img.height
        let finalW = srcW
        let finalH = srcH
        if (finalW > MAX_IMAGE_DIM || finalH > MAX_IMAGE_DIM) {
          const ratio = Math.min(MAX_IMAGE_DIM / finalW, MAX_IMAGE_DIM / finalH)
          finalW = Math.round(finalW * ratio)
          finalH = Math.round(finalH * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = finalW
        canvas.height = finalH
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, srcW, srcH, 0, 0, finalW, finalH)
        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY))
      }
      img.onerror = () => reject(new Error(i18n.t('admin.error_image_read')))
      img.src = dataUrl
    })
  }

  async function compressImage(file) {
    const dataUrl = await loadImageFile(file)
    return resizeToDataUrl(dataUrl)
  }

  function handleImageError(msg) {
    showToast(msg, 'error')
  }

  uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault()
    uploadArea.style.borderColor = ''
    uploadArea.style.background = ''
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      loadImageFile(file).then(openMainImageCrop).catch(handleImageError)
    }
  })

  document.getElementById('v-image-input')?.addEventListener('change', function() {
    const file = this.files[0]
    if (!file) return
    loadImageFile(file).then(openMainImageCrop).catch(handleImageError)
  })

  function setMainImagePreview(dataUrl) {
    const preview = document.getElementById('file-upload-preview')
    preview.src = dataUrl
    document.getElementById('file-upload-actions').style.display = ''
    document.getElementById('file-upload-text').style.display = 'none'
    document.getElementById('v-image').value = dataUrl
  }

  let cropperInstance = null
  let cropResolve = null

  function destroyCropper() {
    if (cropperInstance) {
      cropperInstance.destroy()
      cropperInstance = null
    }
  }

  function openCropModal(dataUrl) {
    return new Promise((resolve) => {
      cropResolve = resolve
      const modal = document.getElementById('crop-modal')
      const img = document.getElementById('crop-image')
      const portraitHint = document.getElementById('crop-portrait-hint')
      if (portraitHint) portraitHint.style.display = 'none'
      destroyCropper()
      let started = false
      const initCropper = () => {
        if (started) return
        started = true
        if (portraitHint) {
          portraitHint.style.display = (img.naturalHeight || 0) > (img.naturalWidth || 0) ? '' : 'none'
        }
        cropperInstance = new Cropper(img, {
          aspectRatio: 4 / 3,
          viewMode: 1,
          autoCropArea: 1,
          dragMode: 'move',
          background: true,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
          checkCrossOrigin: false,
          preview: '.crop-preview'
        })
      }
      img.onload = initCropper
      img.onerror = () => {
        closeCropModal()
        cropResolve = null
        showToast(i18n.t('admin.error_image_read'), 'error')
      }
      img.src = dataUrl
      modal.style.display = 'flex'
      if (img.complete && img.naturalWidth > 0) {
        queueMicrotask(initCropper)
      }
    })
  }

  function closeCropModal() {
    destroyCropper()
    document.getElementById('crop-modal').style.display = 'none'
  }

  function applyCrop() {
    if (!cropperInstance) return
    const canvas = cropperInstance.getCroppedCanvas({ maxWidth: MAX_IMAGE_DIM, maxHeight: Math.round(MAX_IMAGE_DIM * 3 / 4), imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/jpeg', IMAGE_QUALITY)
    const resolve = cropResolve
    closeCropModal()
    if (resolve) resolve(dataUrl)
  }

  document.getElementById('crop-apply')?.addEventListener('click', applyCrop)
  document.getElementById('crop-zoom-in')?.addEventListener('click', () => {
    cropperInstance?.zoom(0.1)
  })
  document.getElementById('crop-zoom-out')?.addEventListener('click', () => {
    cropperInstance?.zoom(-0.1)
  })
  document.getElementById('crop-fit')?.addEventListener('click', () => {
    cropperInstance?.reset()
  })
  document.getElementById('crop-cancel')?.addEventListener('click', () => {
    const resolve = cropResolve
    closeCropModal()
    if (resolve) resolve(null)
  })
  document.getElementById('crop-modal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      const resolve = cropResolve
      closeCropModal()
      if (resolve) resolve(null)
    }
  })

  function openMainImageCrop(dataUrl) {
    openCropModal(dataUrl).then((cropped) => {
      if (cropped) setMainImagePreview(cropped)
    })
  }

  document.getElementById('file-upload-crop')?.addEventListener('click', (e) => {
    e.stopPropagation()
    const current = document.getElementById('v-image').value
    if (current && current !== '/assets/images/placeholder-car.svg') {
      openMainImageCrop(current)
    }
  })

  document.getElementById('file-upload-remove')?.addEventListener('click', (e) => {
    e.stopPropagation()
    document.getElementById('v-image').value = '/assets/images/placeholder-car.svg'
    document.getElementById('file-upload-actions').style.display = 'none'
    document.getElementById('file-upload-text').style.display = 'block'
    fileInput.value = ''
  })

  // Gallery upload
  document.getElementById('gallery-add-btn')?.addEventListener('click', () => {
    document.getElementById('gallery-image-input').click()
  })

  document.getElementById('gallery-image-input')?.addEventListener('change', function() {
    const files = Array.from(this.files)
    const remaining = 10 - galleryData.length
    const toProcess = files.slice(0, remaining)
    let processed = 0

    toProcess.forEach(file => {
      compressImage(file).then(dataUrl => {
        galleryData.push(dataUrl)
        processed++
        if (processed === toProcess.length) {
          renderGalleryGrid()
        }
      }).catch(err => {
        showToast(file.name + ': ' + err.message, 'error')
        processed++
        if (processed === toProcess.length) {
          renderGalleryGrid()
        }
      })
    })
    this.value = ''
  })

  // Gallery item drag and drop (reorder via simple move)
  const galleryGrid = document.getElementById('gallery-grid')
  galleryGrid?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.gallery-item-remove')
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.index)
      galleryData.splice(idx, 1)
      renderGalleryGrid()
    }
  })

  // List search and filter
  const listSearch = document.getElementById('list-search')
  const listStatusFilter = document.getElementById('list-status-filter')

  function filterList() {
    const q = (listSearch?.value || '').toLowerCase()
    const status = listStatusFilter?.value || ''

    let filtered = vehicleData.vehicles

    if (q) {
      filtered = filtered.filter(v =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        `${v.year}`.includes(q)
      )
    }

    if (status) {
      if (status === 'available') filtered = filtered.filter(v => !v.badge)
      else filtered = filtered.filter(v => v.badge === status)
    }

    renderListTable(filtered)
  }

  listSearch?.addEventListener('input', debounce(filterList, 300))
  listStatusFilter?.addEventListener('change', filterList)

  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('dcr-admin')
    window.location.href = 'login.html'
  })

  // Modal buttons
  document.getElementById('modal-cancel')?.addEventListener('click', closeModal)
  document.getElementById('modal-confirm')?.addEventListener('click', function() {
    if (modalCallback) modalCallback()
  })

  // Close modal on overlay click
  document.getElementById('confirm-modal')?.addEventListener('click', function(e) {
    if (e.target === this) closeModal()
  })

  // Sortable columns
  initSortable()

  // Load messages
  loadMessages()

  // Periodic refresh for unread messages badge
  setInterval(loadMessages, 60000)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') loadMessages()
  })

  // Apply i18n after page render
  setTimeout(applyI18n, 100)

  // Update file upload text for i18n
  const uploadText = document.getElementById('file-upload-text')
  if (uploadText && uploadText.textContent.includes('Trascina')) {
    uploadText.textContent = i18n.t('admin.upload_image')
  }

  showView('dashboard')
})
