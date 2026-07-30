# 🚀 DEPLOY — DCR Sicily Cars
## GitHub + Cloudflare Pages

---

### FASE 1 — GitHub Repo
1. Creare/init repo GitHub
2. Push del progetto
3. Cloudflare non richiede Wrangler installato localmente — funziona via GitHub

### FASE 2 — Cloudflare Pages
1. Dashboard Cloudflare → **Pages** → **Connect to Git**
2. Selezionare la repo del cliente
3. Configurare:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy automatico ad ogni push

### FASE 3 — Database D1
1. Dashboard Cloudflare → **D1** → **Create database** → `dcr-messages`
2. Annotare il **database_id** (UUID)
3. Eseguire la migrazione:
   ```bash
   npx wrangler d1 execute dcr-messages --file=./schema.sql --remote
   ```
4. Tabella creata: `messages` (id, name, email, phone, subject, message, date, read, created_at)

### FASE 4 — wrangler.toml
Sostituire il placeholder nel file `wrangler.toml`:
```toml
database_id = "IL_TUO_ID_QUI"
```
Push → redeploy automatico

### FASE 5 — Variabili d'ambiente
Dashboard Cloudflare → Pages → **Settings** → **Environment variables**:
| Nome | Valore |
|---|---|
| `ADMIN_EMAIL` | email per login admin |
| `ADMIN_PASSWORD` | password per login admin |

### FASE 6 — Dominio
Dashboard Cloudflare → Pages → **Custom domains**
- Aggiungere `dcrsicilycars.it`

Cloudflare gestisce HTTPS automaticamente con certificato SSL.

---

## Verifica post-deploy
| Check | URL |
|---|---|
| Home | `https://dcrsicilycars.it/` |
| Chi Siamo | `/about.html` |
| Veicoli | `/vehicles.html` |
| Contatti | `/contact.html` |
| Privacy | `/privacy.html` |
| Cookies | `/cookies.html` |
| Dettaglio | `/vehicle-detail.html` |
| Admin | `/admin/` |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |

- [ ] Form contatto → invia messaggio
- [ ] Admin panel → login → messaggio visibile
- [ ] Google Maps → carica dopo consenso
- [ ] Cookie banner → appare e funziona
- [ ] Switch lingua IT/EN
- [ ] Responsive mobile/tablet
