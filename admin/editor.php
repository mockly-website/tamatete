<?php
/**
 * editor.php — Editor del menu di Ta Matete
 *
 * Carica il menu da /api/get-menu.php, permette di modificarlo
 * (categorie, piatti, prezzi, disponibilità, riordino con drag & drop)
 * e salva il tutto via POST su /api/save-menu.php.
 */
require_once __DIR__ . '/../config.php';

start_secure_session();
require_login();

// Token CSRF incorporato nella pagina per proteggere il salvataggio.
$csrf = csrf_token();
?>
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title>Editor Menu – Ta Matete</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0d12;
      --surface: #14171f;
      --surface-2: #1a1e28;
      --border: #232833;
      --border-soft: #1d222e;
      --text: #e8eaf0;
      --muted: #8b93a7;
      --volt: #d3f24b;
      --violet: #8b5cf6;
      --coral: #ff7a6e;
      --green: #3ddc84;
      --danger: #ff5d5d;
      --radius: 12px;
      --header-h: 64px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
      background:
        radial-gradient(900px 400px at 85% -10%, rgba(139, 92, 246, 0.10), transparent 60%),
        radial-gradient(700px 400px at 5% 110%, rgba(211, 242, 75, 0.05), transparent 60%),
        var(--bg);
      color: var(--text);
      min-height: 100vh;
    }

    /* ---------- Header ---------- */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 50;
      height: var(--header-h);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      background: rgba(11, 13, 18, 0.85);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .brand { font-size: 17px; font-weight: 800; letter-spacing: 0.02em; }
    .brand span { color: var(--volt); }
    .brand .label {
      display: inline-block;
      margin-left: 10px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .topbar-actions { display: flex; align-items: center; gap: 10px; }
    .link-btn {
      color: var(--muted);
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }
    .link-btn:hover { color: var(--text); border-color: var(--border); background: var(--surface-2); }

    /* ---------- Layout ---------- */
    main { max-width: 1080px; margin: 0 auto; padding: 28px 24px 140px; }
    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 22px;
    }
    .toolbar h1 { font-size: 22px; font-weight: 700; }
    .toolbar .count { color: var(--muted); font-size: 13px; margin-top: 4px; }
    .toolbar .count b { color: var(--volt); font-weight: 700; }

    /* ---------- Bottoni ---------- */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      color: #0b0d12;
      background: var(--volt);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: filter 0.15s, transform 0.05s, background 0.15s;
    }
    .btn:hover { filter: brightness(1.08); }
    .btn:active { transform: scale(0.98); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; filter: none; }
    .btn--ghost {
      background: transparent;
      color: var(--muted);
      border: 1px solid var(--border);
    }
    .btn--ghost:hover { color: var(--text); background: var(--surface-2); }
    .btn--violet { background: var(--violet); color: #fff; }
    .btn--small { padding: 6px 10px; font-size: 12px; border-radius: 6px; }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      font-size: 14px;
      color: var(--muted);
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      cursor: pointer;
      transition: color 0.15s, background 0.15s, border-color 0.15s;
    }
    .icon-btn:hover { color: var(--text); background: var(--surface-2); border-color: var(--border); }
    .icon-btn--del:hover { color: var(--danger); border-color: rgba(255, 93, 93, 0.4); }

    /* ---------- Categorie ---------- */
    .cat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 18px;
      overflow: hidden;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .cat-card.drag-over { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.18); }
    .cat-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      background: var(--surface-2);
      border-bottom: 1px solid var(--border-soft);
      cursor: default;
    }
    .cat-head .grip { cursor: grab; color: var(--muted); font-size: 15px; user-select: none; }
    .cat-head .grip:active { cursor: grabbing; }
    .cat-name {
      flex: 1;
      min-width: 0;
      padding: 9px 12px;
      font-size: 15px;
      font-weight: 700;
      font-family: inherit;
      color: var(--text);
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s, background 0.15s;
    }
    .cat-name:hover { background: var(--surface); }
    .cat-name:focus { border-color: var(--violet); background: var(--surface); }
    .cat-actions { display: flex; align-items: center; gap: 4px; }

    /* ---------- Piatti ---------- */
    .dish-list { padding: 6px 14px; }
    .dish-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--border-soft);
    }
    .dish-row:last-child { border-bottom: none; }
    .dish-row.drag-over { outline: 2px dashed var(--violet); outline-offset: 4px; border-radius: 8px; }
    .dish-row.dragging { opacity: 0.4; }
    .dish-row .grip { cursor: grab; color: var(--muted); font-size: 14px; user-select: none; }
    .dish-row .grip:active { cursor: grabbing; }
    .dish-main { flex: 1.4; min-width: 0; }
    .dish-main input {
      width: 100%;
      padding: 8px 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      color: var(--text);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s;
    }
    .dish-main input:focus { border-color: var(--violet); }
    .dish-desc { flex: 2; min-width: 0; }
    .dish-desc textarea {
      width: 100%;
      padding: 8px 10px;
      font-size: 12.5px;
      line-height: 1.4;
      font-family: inherit;
      color: var(--muted);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      outline: none;
      resize: vertical;
      min-height: 38px;
      max-height: 90px;
      transition: border-color 0.15s;
    }
    .dish-desc textarea:focus { border-color: var(--violet); }
    .dish-price { flex: 0 0 92px; }
    .dish-price input {
      width: 100%;
      padding: 8px 10px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      text-align: right;
      color: var(--volt);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 6px;
      outline: none;
      transition: border-color 0.15s;
    }
    .dish-price input:focus { border-color: var(--violet); }
    .dish-avail {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
    }
    .dish-avail input { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; }
    .dish-actions { flex: 0 0 auto; display: flex; align-items: center; gap: 2px; }

    .add-dish-btn {
      display: block;
      width: 100%;
      margin: 4px 14px 12px;
      width: calc(100% - 28px);
      padding: 9px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      color: var(--muted);
      background: transparent;
      border: 1px dashed var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
    }
    .add-dish-btn:hover { color: var(--text); border-color: var(--violet); background: rgba(139, 92, 246, 0.06); }

    /* ---------- Barra salvataggio ---------- */
    .savebar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 14px 24px;
      background: rgba(11, 13, 18, 0.92);
      backdrop-filter: blur(10px);
      border-top: 1px solid var(--border);
    }
    .savebar .meta { font-size: 12.5px; color: var(--muted); }
    .savebar .meta b { color: var(--text); font-weight: 600; }
    .savebar-actions { display: flex; align-items: center; gap: 10px; }

    /* ---------- Toast ---------- */
    .toast {
      position: fixed;
      right: 24px;
      bottom: 84px;
      z-index: 70;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: 380px;
      padding: 13px 18px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
      opacity: 0;
      transform: translateY(12px);
      pointer-events: none;
      transition: opacity 0.25s, transform 0.25s;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.success { border-color: rgba(61, 220, 132, 0.5); }
    .toast.error { border-color: rgba(255, 93, 93, 0.5); }
    .toast .dot { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; }
    .toast.success .dot { background: var(--green); }
    .toast.error .dot { background: var(--coral); }

    /* ---------- Loading / vuoto ---------- */
    .empty-state {
      text-align: center;
      color: var(--muted);
      padding: 80px 20px;
      font-size: 15px;
    }
    .empty-state .spin {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-bottom: 14px;
      border: 3px solid var(--border);
      border-top-color: var(--violet);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ---------- Stato "Esaurito" ---------- */
    .dish-row.unavailable { opacity: 0.62; }
    .dish-row.unavailable .dish-main input { color: var(--muted); text-decoration: line-through; }
    .dish-row.unavailable .dish-price input { color: var(--muted); text-decoration: line-through; }
    .avail-label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; user-select: none; }
    .avail-label .state-text { font-weight: 600; transition: color 0.15s; }
    .avail-label .state-text.on { color: var(--green); }
    .avail-label .state-text.off { color: var(--coral); }
    .hint {
      display: block;
      font-size: 11px;
      color: var(--muted);
      margin-top: 4px;
      font-weight: 400;
      letter-spacing: 0;
      text-transform: none;
    }

    /* ---------- Modale ---------- */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 80;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(5, 6, 10, 0.72);
      backdrop-filter: blur(4px);
    }
    .modal-overlay.open { display: flex; }
    .modal {
      width: 100%;
      max-width: 400px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 26px 24px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
    }
    .modal h3 { font-size: 17px; font-weight: 700; margin-bottom: 16px; }
    .modal p { font-size: 13px; color: var(--muted); margin-bottom: 16px; line-height: 1.5; }
    .modal input[type="text"] {
      width: 100%;
      padding: 11px 14px;
      font-size: 15px;
      font-family: inherit;
      color: var(--text);
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .modal input[type="text"]:focus { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

    /* ---------- Responsive ---------- */
    @media (max-width: 760px) {
      .dish-row { flex-wrap: wrap; }
      .dish-main { flex: 1 1 100%; order: 1; }
      .dish-desc { flex: 1 1 100%; order: 2; }
      .dish-price { flex: 1 1 80px; order: 3; }
      .dish-avail { order: 4; }
      .dish-actions { order: 5; margin-left: auto; }
      .savebar { flex-direction: column; align-items: stretch; }
      .savebar-actions { justify-content: flex-end; }
    }
  </style>
</head>
<body>

  <header class="topbar">
    <div class="brand">Ta <span>Matete</span><span class="label">Editor Menu</span></div>
    <div class="topbar-actions">
      <a class="link-btn" href="../menu.html" target="_blank" rel="noopener">Vedi sito &nearr;</a>
      <a class="link-btn" href="logout.php">Esci</a>
    </div>
  </header>

  <main>
    <div class="toolbar">
      <div>
        <h1>Gestione del menu</h1>
        <p class="count"><b id="statCount">0</b> piatti in <b id="statCats">0</b> categorie</p>
        <p class="hint">Prezzo: usa la virgola (es. 16,00) &middot; Togli &ldquo;Disponibile&rdquo; per nascondere un piatto dal sito</p>
      </div>
      <button class="btn btn--violet" id="btnAddCategory" type="button">+ Aggiungi categoria</button>
    </div>

    <div id="editor"><div class="empty-state"><div class="spin"></div>Caricamento del menu…</div></div>
  </main>

  <div class="savebar">
    <div class="meta">
      Modifiche non ancora salvate &middot; ultimo salvataggio: <b id="lastSaved">mai</b>
    </div>
    <div class="savebar-actions">
      <button class="btn btn--ghost" id="btnReload" type="button">Ricarica</button>
      <button class="btn" id="btnSave" type="button">Salva modifiche</button>
    </div>
  </div>

  <div class="toast" id="toast" role="status" aria-live="polite"><span class="dot"></span><span class="msg"></span></div>

  <!-- Modale "Nuova categoria" -->
  <div class="modal-overlay" id="modalCat" role="dialog" aria-modal="true" aria-labelledby="modalCatTitle">
    <div class="modal">
      <h3 id="modalCatTitle">Nuova categoria</h3>
      <p>Inserisci il nome della nuova categoria, per esempio &ldquo;Dolci&rdquo; o &ldquo;Caffè&rdquo;.</p>
      <input type="text" id="modalCatName" placeholder="Nome categoria" maxlength="60" autocomplete="off">
      <div class="modal-actions">
        <button class="btn btn--ghost btn--small" id="modalCatCancel" type="button">Annulla</button>
        <button class="btn btn--violet btn--small" id="modalCatOk" type="button">Aggiungi</button>
      </div>
    </div>
  </div>

  <script>
    'use strict';

    // Token CSRF fornito da PHP per autenticare il salvataggio.
    var CSRF_TOKEN = <?= json_encode($csrf) ?>;
    var API_GET = <?= json_encode('/api/get-menu.php') ?>;
    var API_SAVE = <?= json_encode('/api/save-menu.php') ?>;

    // Stato del menu: fonte di verità dell'editor.
    var menu = { categorie: [] };
    var dirty = false;
    var lastSaved = null;

    var elEditor = document.getElementById('editor');
    var elToast = document.getElementById('toast');

    // -----------------------------------------------------------------
    //  Toast (feedback visivo, mai alert)
    // -----------------------------------------------------------------
    var toastTimer = null;
    function showToast(message, type) {
      elToast.className = 'toast ' + (type || '');
      elToast.querySelector('.msg').textContent = message;
      requestAnimationFrame(function () { elToast.classList.add('show'); });
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { elToast.classList.remove('show'); }, 3200);
    }

    // -----------------------------------------------------------------
    //  Statistiche
    // -----------------------------------------------------------------
    function updateStats() {
      var dishes = menu.categorie.reduce(function (sum, c) { return sum + c.piatti.length; }, 0);
      document.getElementById('statCount').textContent = dishes;
      document.getElementById('statCats').textContent = menu.categorie.length;
      document.getElementById('lastSaved').textContent = lastSaved || 'mai';
    }

    // -----------------------------------------------------------------
    //  Caricamento iniziale
    // -----------------------------------------------------------------
    function loadMenu() {
      elEditor.innerHTML = '<div class="empty-state"><div class="spin"></div>Caricamento del menu…</div>';
      fetch(API_GET, { cache: 'no-store' })
        .then(function (res) {
          if (!res.ok) throw new Error('Risposta del server non valida (' + res.status + ')');
          return res.json();
        })
        .then(function (data) {
          if (!data || !Array.isArray(data.categorie)) throw new Error('Struttura JSON inattesa.');
          menu = data;
          dirty = false;
          render();
          updateStats();
        })
        .catch(function (err) {
          elEditor.innerHTML = '<div class="empty-state">Impossibile caricare il menu.<br>Verifica che il server PHP sia attivo e riprova con "Ricarica".</div>';
          showToast('Errore di caricamento: ' + err.message, 'error');
        });
    }

    // -----------------------------------------------------------------
    //  Rendering
    // -----------------------------------------------------------------
    function render() {
      if (menu.categorie.length === 0) {
        elEditor.innerHTML =
          '<div class="empty-state">Il menu è vuoto.<br>Usa "Aggiungi categoria" per iniziare.</div>';
        return;
      }
      elEditor.innerHTML = '';
      menu.categorie.forEach(function (cat, ci) {
        elEditor.appendChild(buildCategory(cat, ci));
      });
      updateStats();
    }

    function buildCategory(cat, ci) {
      var card = document.createElement('section');
      card.className = 'cat-card';
      card.dataset.catIndex = ci;

      // Testata categoria
      var head = document.createElement('div');
      head.className = 'cat-head';

      var grip = document.createElement('span');
      grip.className = 'grip';
      grip.textContent = '⠿';
      grip.title = 'Trascina per riordinare';
      grip.draggable = true;

      var nameInput = document.createElement('input');
      nameInput.className = 'cat-name';
      nameInput.type = 'text';
      nameInput.value = cat.nome;
      nameInput.dataset.field = 'cat-name';
      nameInput.placeholder = 'Nome categoria';

      var actions = document.createElement('div');
      actions.className = 'cat-actions';

      actions.appendChild(makeIconBtn('↑', 'Sposta su', 'cat-up'));
      actions.appendChild(makeIconBtn('↓', 'Sposta giù', 'cat-down'));
      actions.appendChild(makeIconBtn('×', 'Elimina categoria', 'cat-del', 'icon-btn--del'));

      head.appendChild(grip);
      head.appendChild(nameInput);
      head.appendChild(actions);
      card.appendChild(head);

      // Lista piatti
      var list = document.createElement('div');
      list.className = 'dish-list';
      list.dataset.catIndex = ci;
      cat.piatti.forEach(function (dish, di) {
        list.appendChild(buildDish(dish, ci, di));
      });
      card.appendChild(list);

      // Aggiungi piatto
      var addBtn = document.createElement('button');
      addBtn.className = 'add-dish-btn';
      addBtn.type = 'button';
      addBtn.dataset.action = 'add-dish';
      addBtn.dataset.catIndex = ci;
      addBtn.textContent = '+ Aggiungi piatto';
      card.appendChild(addBtn);

      return card;
    }

    function buildDish(dish, ci, di) {
      var row = document.createElement('div');
      row.className = 'dish-row';
      row.dataset.catIndex = ci;
      row.dataset.dishIndex = di;

      var grip = document.createElement('span');
      grip.className = 'grip';
      grip.textContent = '⠿';
      grip.title = 'Trascina per riordinare';
      grip.draggable = true;

      var main = document.createElement('div');
      main.className = 'dish-main';
      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = dish.nome;
      nameInput.dataset.field = 'dish-name';
      nameInput.placeholder = 'Nome piatto';
      main.appendChild(nameInput);

      var desc = document.createElement('div');
      desc.className = 'dish-desc';
      var descInput = document.createElement('textarea');
      descInput.value = dish.descrizione;
      descInput.dataset.field = 'dish-desc';
      descInput.placeholder = 'Descrizione (facoltativa)';
      desc.appendChild(descInput);

      var price = document.createElement('div');
      price.className = 'dish-price';
      var priceInput = document.createElement('input');
      priceInput.type = 'text';
      priceInput.inputMode = 'decimal';
      priceInput.value = dish.prezzo;
      priceInput.dataset.field = 'dish-price';
      priceInput.placeholder = '0,00';
      price.appendChild(priceInput);

      var avail = document.createElement('label');
      avail.className = 'dish-avail avail-label';
      var availInput = document.createElement('input');
      availInput.type = 'checkbox';
      availInput.checked = dish.disponibile !== false;
      availInput.dataset.field = 'dish-avail';
      var stateText = document.createElement('span');
      stateText.className = 'state-text ' + (dish.disponibile !== false ? 'on' : 'off');
      stateText.textContent = dish.disponibile !== false ? 'Disponibile' : 'Esaurito';
      avail.appendChild(availInput);
      avail.appendChild(stateText);

      var actions = document.createElement('div');
      actions.className = 'dish-actions';
      actions.appendChild(makeIconBtn('↑', 'Sposta su', 'dish-up'));
      actions.appendChild(makeIconBtn('↓', 'Sposta giù', 'dish-down'));
      actions.appendChild(makeIconBtn('×', 'Elimina piatto', 'dish-del', 'icon-btn--del'));

      row.appendChild(grip);
      row.appendChild(main);
      row.appendChild(desc);
      row.appendChild(price);
      row.appendChild(avail);
      row.appendChild(actions);

      // Evidenzia i piatti esauriti.
      if (dish.disponibile === false) row.classList.add('unavailable');

      return row;
    }

    function makeIconBtn(label, title, action, extraClass) {
      var btn = document.createElement('button');
      btn.className = 'icon-btn' + (extraClass ? ' ' + extraClass : '');
      btn.type = 'button';
      btn.textContent = label;
      btn.title = title;
      btn.dataset.action = action;
      return btn;
    }

    // -----------------------------------------------------------------
    //  Sincronizzazione input -> stato
    // -----------------------------------------------------------------
    elEditor.addEventListener('input', function (e) {
      var t = e.target;
      var field = t.dataset.field;
      if (!field) return;
      var row = t.closest('[data-cat-index]');
      if (!row) return;
      var ci = parseInt(row.dataset.catIndex, 10);
      var cat = menu.categorie[ci];
      if (!cat) return;

      if (field === 'cat-name') {
        cat.nome = t.value;
      } else {
        var di = parseInt(row.dataset.dishIndex, 10);
        var dish = cat.piatti[di];
        if (!dish) return;
        if (field === 'dish-name') dish.nome = t.value;
        else if (field === 'dish-desc') dish.descrizione = t.value;
        else if (field === 'dish-price') dish.prezzo = t.value;
      }
      markDirty();
    });

    elEditor.addEventListener('change', function (e) {
      var t = e.target;
      if (t.dataset.field === 'dish-avail') {
        var row = t.closest('[data-cat-index]');
        var ci = parseInt(row.dataset.catIndex, 10);
        var di = parseInt(row.dataset.dishIndex, 10);
        var dish = menu.categorie[ci].piatti[di];
        if (dish) {
          dish.disponibile = t.checked;
          row.classList.toggle('unavailable', !t.checked);
          var st = row.querySelector('.state-text');
          if (st) {
            st.className = 'state-text ' + (t.checked ? 'on' : 'off');
            st.textContent = t.checked ? 'Disponibile' : 'Esaurito';
          }
          markDirty();
        }
      }
    });

    // -----------------------------------------------------------------
    //  Azioni (aggiungi/elimina/sposta)
    // -----------------------------------------------------------------
    elEditor.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;

      var card = btn.closest('.cat-card');
      var ci = card ? parseInt(card.dataset.catIndex, 10) : null;
      var action = btn.dataset.action;

      if (action === 'add-category') {
        addCategory();
      } else if (action === 'add-dish') {
        if (ci === null) return;
        addDish(ci);
      } else if (action === 'cat-up') { if (ci !== null) moveCategory(ci, -1); }
      else if (action === 'cat-down') { if (ci !== null) moveCategory(ci, 1); }
      else if (action === 'cat-del') { if (ci !== null) deleteCategory(ci); }
      else if (action === 'dish-up' || action === 'dish-down') {
        var row = btn.closest('.dish-row');
        if (!row || ci === null) return;
        var di = parseInt(row.dataset.dishIndex, 10);
        moveDish(ci, di, action === 'dish-up' ? -1 : 1);
      } else if (action === 'dish-del') {
        var row = btn.closest('.dish-row');
        if (!row || ci === null) return;
        var di = parseInt(row.dataset.dishIndex, 10);
        deleteDish(ci, di);
      }
    });

    document.getElementById('btnAddCategory').addEventListener('click', addCategory);
    document.getElementById('btnSave').addEventListener('click', saveMenu);
    document.getElementById('btnReload').addEventListener('click', function () {
      if (dirty && !window.confirm('Le modifiche non salvate andranno perse. Continuare?')) return;
      loadMenu();
    });

    function markDirty() {
      dirty = true;
    }

    function addCategory() {
      openCatModal();
    }

    // ---- Modale "Nuova categoria" ----
    var modalCat = document.getElementById('modalCat');
    var modalCatName = document.getElementById('modalCatName');
    var modalCatOk = document.getElementById('modalCatOk');
    var modalCatCancel = document.getElementById('modalCatCancel');

    function openCatModal() {
      modalCatName.value = '';
      modalCat.classList.add('open');
      setTimeout(function () { modalCatName.focus(); }, 50);
    }
    function closeCatModal() {
      modalCat.classList.remove('open');
    }
    modalCatOk.addEventListener('click', function () {
      var nome = modalCatName.value.trim();
      if (!nome) {
        showToast('Il nome della categoria non può essere vuoto.', 'error');
        modalCatName.focus();
        return;
      }
      menu.categorie.push({ nome: nome, piatti: [] });
      render();
      markDirty();
      closeCatModal();
      showToast('Categoria aggiunta.', 'success');
    });
    modalCatCancel.addEventListener('click', closeCatModal);
    modalCat.addEventListener('click', function (e) {
      if (e.target === modalCat) closeCatModal();
    });
    modalCatName.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') modalCatOk.click();
      if (e.key === 'Escape') closeCatModal();
    });

    // Avviso se si chiude la pagina con modifiche non salvate.
    window.addEventListener('beforeunload', function (e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    });

    function deleteCategory(ci) {
      var cat = menu.categorie[ci];
      if (!cat) return;
      if (!window.confirm('Eliminare la categoria "' + cat.nome + '" e tutti i suoi piatti?')) return;
      menu.categorie.splice(ci, 1);
      render();
      markDirty();
      showToast('Categoria eliminata.', 'success');
    }

    function moveCategory(ci, dir) {
      var target = ci + dir;
      if (target < 0 || target >= menu.categorie.length) return;
      swapArray(menu.categorie, ci, target);
      render();
      markDirty();
    }

    function addDish(ci) {
      var cat = menu.categorie[ci];
      if (!cat) return;
      cat.piatti.push({ nome: '', descrizione: '', prezzo: '', disponibile: true });
      render();
      markDirty();
      // Focus sul nuovo piatto (ultima riga della categoria appena modificata).
      var card = elEditor.querySelector('.cat-card[data-cat-index="' + ci + '"]');
      if (card) {
        var rows = card.querySelectorAll('.dish-row');
        var row = rows[rows.length - 1];
        if (row) {
          var first = row.querySelector('input');
          if (first) first.focus();
        }
      }
    }

    function deleteDish(ci, di) {
      var cat = menu.categorie[ci];
      if (!cat || !cat.piatti[di]) return;
      if (!window.confirm('Eliminare il piatto "' + (cat.piatti[di].nome || 'senza nome') + '"?')) return;
      cat.piatti.splice(di, 1);
      render();
      markDirty();
      showToast('Piatto eliminato.', 'success');
    }

    function moveDish(ci, di, dir) {
      var cat = menu.categorie[ci];
      var target = di + dir;
      if (!cat || target < 0 || target >= cat.piatti.length) return;
      swapArray(cat.piatti, di, target);
      render();
      markDirty();
    }

    function swapArray(arr, a, b) {
      var tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
    }

    // -----------------------------------------------------------------
    //  Drag & drop (riordino categorie e piatti)
    // -----------------------------------------------------------------
    var dragData = null;

    elEditor.addEventListener('dragstart', function (e) {
      var el = e.target.closest('.cat-card, .dish-row');
      if (!el) return;
      if (el.classList.contains('cat-card')) {
        dragData = { type: 'cat', catIndex: parseInt(el.dataset.catIndex, 10) };
      } else {
        dragData = { type: 'dish', catIndex: parseInt(el.dataset.catIndex, 10), dishIndex: parseInt(el.dataset.dishIndex, 10) };
      }
      el.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', ''); } catch (err) {}
    });

    elEditor.addEventListener('dragend', function (e) {
      var el = e.target.closest('.cat-card, .dish-row');
      if (el) el.classList.remove('dragging');
      clearDragOver();
      dragData = null;
    });

    elEditor.addEventListener('dragover', function (e) {
      if (!dragData) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var target = e.target.closest('.cat-card, .dish-row');
      clearDragOver();
      if (target) target.classList.add('drag-over');
    });

    elEditor.addEventListener('drop', function (e) {
      e.preventDefault();
      if (!dragData) return;
      var target = e.target.closest('.cat-card, .dish-row');
      clearDragOver();
      if (!target) { dragData = null; return; }

      if (dragData.type === 'cat') {
        var fromCat = dragData.catIndex;
        var toCat = parseInt(target.closest('.cat-card').dataset.catIndex, 10);
        if (fromCat !== toCat) {
          swapArray(menu.categorie, fromCat, toCat);
          render();
          markDirty();
        }
      } else {
        var fromCat2 = dragData.catIndex;
        var fromDish = dragData.dishIndex;
        var targetCard = target.closest('.cat-card');
        var toCat2 = parseInt(targetCard.dataset.catIndex, 10);

        if (target.classList.contains('cat-card')) {
          // Droppato sulla testata della categoria -> aggiungi in fondo
          var dish = menu.categorie[fromCat2].piatti.splice(fromDish, 1)[0];
          if (dish) {
            menu.categorie[toCat2].piatti.push(dish);
            render();
            markDirty();
          }
        } else {
          var toDish = parseInt(target.dataset.dishIndex, 10);
          var dish2 = menu.categorie[fromCat2].piatti.splice(fromDish, 1)[0];
          if (dish2) {
            var targetList = menu.categorie[toCat2].piatti;
            // Correzione indice dopo la rimozione se stessa categoria
            var insertAt = toDish;
            if (fromCat2 === toCat2 && fromDish < toDish) insertAt = toDish - 1;
            targetList.splice(insertAt, 0, dish2);
            render();
            markDirty();
          }
        }
      }
      dragData = null;
    });

    function clearDragOver() {
      elEditor.querySelectorAll('.drag-over').forEach(function (el) { el.classList.remove('drag-over'); });
    }

    // -----------------------------------------------------------------
    //  Salvataggio
    // -----------------------------------------------------------------
    function saveMenu() {
      var btn = document.getElementById('btnSave');
      btn.disabled = true;
      btn.textContent = 'Salvataggio…';

      fetch(API_SAVE, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': CSRF_TOKEN
        },
        body: JSON.stringify(menu)
      })
        .then(function (res) {
          return res.json().catch(function () {
            throw new Error('Risposta non valida dal server (' + res.status + ')');
          }).then(function (data) {
            if (!res.ok) {
              var err = new Error((data && data.message) || 'Errore durante il salvataggio.');
              err.status = res.status;
              throw err;
            }
            return data;
          });
        })
        .then(function () {
          dirty = false;
          var now = new Date();
          lastSaved = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          updateStats();
          showToast('Menu salvato con successo!', 'success');
        })
        .catch(function (err) {
          showToast(err.message, 'error');
          if (err.status === 403) {
            // Sessione scaduta: rimanda al login.
            setTimeout(function () { window.location.href = 'login.php'; }, 1600);
          }
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = 'Salva modifiche';
        });
    }

    // Avvio
    loadMenu();
  </script>
</body>
</html>