# Ta Matete – Ristorante Bistrot

Sito web multilingue per **Ta Matete – Ristorante Bistrot** situato a Oristano, in Piazza Giovanni Corrias 2/A.

## Tecnologie

- HTML5, CSS3, JavaScript (vanilla)
- Font: Cabin, Roboto, Lato (Google Fonts)
- Icone: Font Awesome 6
- Nessun framework — tutto custom

## Pagine

| Pagina | File | Contenuto |
|--------|------|-----------|
| Home | `index.html` | Hero con logo, Chi siamo, Stats, Galleria carosello + lightbox |
| Menu | `menu.html` | 11 categorie (antipasti, primi, secondi, contorni, dessert, baby, vini, cocktails, birre) con sotto-categorie |
| Contatti | `contatti.html` | Form prenotazione + schede contatto + mappa |
| Cookie Policy | `cookie.html` | Informativa sui cookie |
| Privacy Policy | `privacy.html` | Informativa privacy |

## Sistema menu dinamico (Area Admin)

Il sito include un sistema completo per gestire il menu **senza toccare codice**: un'area admin protetta, un backend PHP che salva i dati su file JSON e uno script JS che mostra il menu sul sito pubblico.

### 1. Come impostare username/password admin la prima volta

1. Apri `config.php`.
2. Modifica il valore di `ADMIN_USERNAME` (default: `admin`).
3. Genera un nuovo hash della password con PHP da terminale:

   ```bash
   php -r "echo password_hash('TUA_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
   ```

4. Incolla l'hash restituito al posto di `ADMIN_PASSWORD_HASH`.

> **Password predefinita di esempio:** `tamatete2026` (hash già incluso in `config.php`). Cambiala subito in produzione!

### 2. Come testare tutto in locale

Serve **PHP 7.4 o superiore** (già presente su qualsiasi hosting condiviso, es. Aruba). Dalla cartella radice del progetto:

```bash
php -S localhost:8000
```

Poi apri nel browser:

- **Area admin:** <http://localhost:8000/admin/login.php>
- **Anteprima menu pubblico:** aggiungi un contenitore in una pagina, es. `http://localhost:8000/menu.html`
- **API:** <http://localhost:8000/api/get-menu.php> (restituisce il menu in JSON)

> **Nota:** con `php -S` la protezione di `data/.htaccess` **non viene applicata** (Apache fa finta di niente): è normale e non è un problema, serve solo per il deploy su hosting reale.

### 3. Come integrare lo script pubblico in una pagina HTML esistente

> **Nota:** nella pagina `menu.html` del sito l'integrazione è **già fatta**:
> il menu si carica automaticamente dall'editor e risponde anche al cambio
> lingua (IT/EN/FR/ES). Di seguito le istruzioni per usare il widget in
> qualunque altra pagina.

Inserisci un contenitore nel punto in cui vuoi mostrare il menu e carica lo script:

```html
<div id="menu-container"></div>
<script src="/assets/menu-public.js"></script>
<script>
  initMenu('#menu-container');
</script>
```

Opzioni avanzate:

```html
<script>
  var widget = initMenu('#menu-container', {
    lang: 'it',                    // lingua iniziale: it/en/fr/es
    categories: {                  // traduzioni dei nomi delle categorie
      'Antipasti': { it: 'Antipasti', en: 'Starters', fr: 'Entrées', es: 'Entrantes' }
    },
    showUnavailable: false,        // true per mostrare anche i piatti esauriti
    pricePrefix: '€',              // prefisso dei prezzi
    accentColor: '#9c922c',        // colore della linea sotto il titolo categoria
    errorMessage: 'Menu momentaneamente non disponibile.',
    onReady: function (menu) { console.log('menu caricato', menu); }
  });
  widget.setLang('en');            // cambia lingua a runtime
  widget.refresh();                // ricarica i dati dal server
</script>
```

Il rendering usa lo stile del sito (tabs per categoria), i piatti non disponibili vengono nascosti automaticamente e in caso di errore la pagina non si rompe.

### Struttura del sistema menu

```
/
├── config.php            → credenziali admin (hash), percorsi, helper sessione/CSRF/JSON
├── admin/
│   ├── login.php         → form di accesso protetto con password_verify()
│   ├── logout.php        → termina la sessione
│   └── editor.php        → editor visuale del menu (add/edit/delete, drag & drop, salvataggio)
├── api/
│   ├── get-menu.php      → endpoint pubblico che restituisce data/menu.json
│   └── save-menu.php     → salvataggio (solo POST, richiede sessione + token CSRF, sanitizza)
├── data/
│   ├── menu.json         → il menu vero e proprio (categorie → piatti)
│   └── .htaccess         → blocca l'accesso diretto ai JSON da browser
└── assets/
    └── menu-public.js    → renderer pubblico con initMenu(selector)
```

**Flusso:** `editor.php` → carica da `api/get-menu.php` → salva su `api/save-menu.php` → `data/menu.json` → `assets/menu-public.js` lo mostra sul sito.

### Sicurezza

- La password è salvata **solo come hash** (`password_hash` / `password_verify`), mai in chiaro.
- L'editor e il salvataggio richiedono sessione attiva e token **CSRF** (confronto a tempo costante).
- `save-menu.php` accetta **solo POST**, valida la struttura JSON e **sanitizza** tutti i campi testo (`strip_tags`).
- `data/.htaccess` impedisce il download diretto di `menu.json` e il listing della cartella: i dati passano esclusivamente dalle API.

## Funzionalità

- **Multilingua**: IT, EN, FR, ES — cambio lingua istantaneo via JS
- **Menu dinamico**: renderizzato da JavaScript con 80+ piatti, prezzi reali, toggle allergeni
- **Galleria**: carosello con 27 foto, frecce, pagination dots, lightbox con navigazione (tastiera/click)
- **Animazioni**: scroll reveal, contatore stats, transizioni menu, lightbox fade
- **Responsive**: 1024, 900, 768, 480, 380 px — hamburger menu, griglie che si impilano
- **Preloader**, back-to-top, overlay hero con immagine sfondo

## Palette colori

- Accento: `#9c922c` (oro/verde logo)
- Sfondo: `#ffffff`
- Testo: `#383838`
- Scuro: `#152943`

## Struttura file

```
/
├── index.html
├── menu.html
├── contatti.html
├── cookie.html
├── privacy.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── img/
│   ├── logo.png
│   ├── logo-senza-sfondo.png
│   ├── sfondo.png
│   ├── prova.png
│   ├── luogo.jpg
│   ├── 1.jpg … 27.jpg
│   └── ...
├── admin/            → area admin (login, logout, editor)
├── api/              → endpoint PHP (get-menu, save-menu)
├── data/             → menu.json + .htaccess protettivo
├── assets/           → menu-public.js
├── config.php        → credenziali admin e configurazione
└── README.md
```

## Crediti

Realizzato da [Mockly](https://mockly.it)
