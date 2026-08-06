# Guida al Deploy — DCR Sicily Cars

## 1. Acquisto del dominio

**Opzione A — Cloudflare Registrar (consigliato)**
- Vantaggio: prezzo di costo, nessun ricarico, integrazione immediata
- Andare su [dash.cloudflare.com](https://dash.cloudflare.com) → Registrar → Acquista dominio
- Cercare `dcrsicilycars.it` o `dcrsicilycars.com`
- Completare l'acquisto (pagamento una tantum annuale)

**Opzione B — Altro registrar (Aruba, Register, ecc.)**
- Acquistare il dominio sul sito del registrar
- Durante la configurazione di Cloudflare Pages, seguire le istruzioni per cambiare i nameserver
- Nameserver Cloudflare: verranno forniti dopo aver aggiunto il dominio a Cloudflare

---

## 2. Installare le dipendenze

```bash
npm install
```

Questo installerà anche `wrangler` (CLI di Cloudflare).

---

## 3. Creare il database D1 (messaggi)

```bash
# Creazione del database
npx wrangler d1 create dcr-messages
```

L'output sarà simile a:

```
✅ Successfully created DB 'dcr-messages' in region WEUR
Created your database using D1's new storage backend.
[[d1_databases]]
binding = "DB"
database_name = "dcr-messages"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Importante:** copiare il `database_id` e incollarlo in `wrangler.toml` al posto di `<YOUR_DATABASE_ID>`.

Poi inizializzare la tabella:

```bash
npm run db:init
```

---

## 4. Configurare variabili d'ambiente (segrete)

Queste servono per autenticare l'admin dashboard quando legge/elimina messaggi:

```bash
# Email admin (la stessa usata per il login)
npx wrangler pages secret put ADMIN_EMAIL
# → Inserisci: dcrsicilycars@gmail.com

# Password admin
npx wrangler pages secret put ADMIN_PASSWORD
# → Inserisci: la password che usi per accedere all'admin dashboard
```

> **Nota:** Se in futuro cambi la password di accesso, ricordati di aggiornare anche questo segreto.

---

## 5. Configurare il binding D1 su Cloudflare Dashboard

Dopo aver fatto il primo deploy (punto 6), andare su:

1. [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Pages** → `dcr-sicily-cars` → **Settings** → **Functions**
3. Sezione **D1 Database Bindings**
4. Cliccare **Add binding**
   - **Variable name:** `DB`
   - **D1 database:** selezionare `dcr-messages`
5. Salvare

Dopo aver aggiunto il binding, il sito va **ridistribuito** (punto 6).

---

## 6. Build e deploy

```bash
# Compilare il sito (produce la cartella dist/)
npm run build

# Deploy su Cloudflare Pages
npm run deploy
```

Wrangler chiederà di autenticarsi la prima volta (apre il browser per il login Cloudflare).

Dopo il deploy, verrà mostrato l'URL di pubblicazione:
```
https://dcr-sicily-cars-xxx.pages.dev
```

---

## 7. Configurare il dominio personalizzato

1. Dashboard Cloudflare → **Pages** → `dcr-sicily-cars` → **Custom domains**
2. Cliccare **Set up a custom domain**
3. Inserire il dominio acquistato (es. `dcrsicilycars.it`)
4. Seguire le istruzioni per configurare i DNS

Cloudflare gestirà automaticamente il DNS e il certificato SSL (gratuito).

---

## Verifica finale

- [ ] Il sito è raggiungibile dal dominio personalizzato
- [ ] Il form contatti invia e i messaggi appaiono nella dashboard admin
- [ ] La dashboard admin può visualizzare ed eliminare messaggi
- [ ] Il badge "Venduta" e "Prenotata" funzionano correttamente
- [ ] La lingua IT/EN funziona su tutte le pagine
- [ ] La mappa Google Maps si carica dopo il consenso cookie
