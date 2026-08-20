# Ta Matete – Ristorante Bistrot

Sito web multilingue per **Ta Matete – Ristorante Bistrot** (Oristano, Piazza Giovanni Corrias 2/A).

## Tecnologie

- HTML5, CSS3, JavaScript (vanilla)
- Font: Cabin, Roboto, Lato (Google Fonts)
- Icone: Font Awesome 6
- Menu gestito via **Supabase** (stessa base dati del Mockly Portal)

## Pagine

| Pagina | File | Contenuto |
|--------|------|-----------|
| Home | `index.html` | Hero con logo, Chi siamo, Stats, Galleria carosello + lightbox |
| Menu | `menu.html` | Menu dinamico caricato da Supabase (categorie + piatti) |
| Contatti | `contatti.html` | Form prenotazione + schede contatto + mappa |
| Cookie Policy | `cookie.html` | Informativa sui cookie |
| Privacy Policy | `privacy.html` | Informativa privacy |

## Come funziona il menu

- Il menu vive su **Supabase** (tabelle `menu_categories` e `menu_items`, filtrate dal client `Ta matete`).
- Il titolare lo modifica dal **Mockly Portal**: le modifiche sono subito visibili sul sito, senza deploy.
- `assets/menu-public.js` scarica i dati da Supabase (endpoint REST pubblico, con chiave anon) e li disegna nello stile del sito: tabs per categoria, piatti esauriti nascosti, 4 lingue (IT/EN/FR/ES) via `js/script.js`.

### Widget menu in altre pagine

```html
<div id="menu-container"></div>
<script src="/assets/menu-public.js"></script>
<script>
  initMenu('#menu-container', { lang: 'it' });
</script>
```

Opzioni: `lang`, `categories` (traduzioni nomi categorie), `showUnavailable`, `pricePrefix`, `accentColor`, `errorMessage`, `onReady`. `widget.setLang('en')` e `widget.refresh()` per cambio lingua e ricarica.

## Sviluppo locale

Basta un server statico qualsiasi:

```bash
npx serve .
```

Poi apri `http://localhost:3000/menu.html`.

## Deploy

Statico: va bene GitHub Pages, Netlify, Vercel o qualsiasi hosting (non serve PHP). Il menu si carica direttamente da Supabase via browser.

## Crediti

Realizzato da [Mockly](https://mockly.it)