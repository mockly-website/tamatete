/**
 * menu-public.js — Menu dinamico di Ta Matete (versione integrata nel sito)
 *
 * Carica il menu dall'API /api/get-menu.php e lo disegna con lo stesso
 * stile del sito (tabs per categoria + pannelli). I piatti segnati come
 * "non disponibile" vengono nascosti automaticamente. In caso di errore
 * mostra un messaggio discreto senza rompere la pagina.
 *
 * Utilizzo:
 *   <div id="menu-container"></div>
 *   <script src="/assets/menu-public.js"></script>
 *   <script>
 *     var widget = initMenu('#menu-container', {
 *       lang: 'it',                          // lingua iniziale (it/en/fr/es)
 *       categories: { 'Antipasti': { it:'Antipasti', en:'Starters', fr:'Entrées', es:'Entrantes' } },
 *       showUnavailable: false,              // true per mostrare anche gli esauriti
 *       pricePrefix: '€',
 *       accentColor: '#9c922c',
 *       errorMessage: 'Menu momentaneamente non disponibile.',
 *       onReady: function (menu) { ... }
 *     });
 *     widget.setLang('en');   // cambia lingua a runtime
 *     widget.refresh();       // ricarica i dati dall'API
 *   </script>
 */
(function () {
  'use strict';

  var FETCH_TIMEOUT = 10000;

  // -----------------------------------------------------------------
  //  Utils
  // -----------------------------------------------------------------

  // Formatta il prezzo: "16,00" -> "€16,00" (accetta anche "16.5", "€10").
  function formatPrice(value, prefix) {
    var raw = String(value == null ? '' : value).trim();
    if (raw === '') return '';
    if (raw.indexOf('€') !== -1 || raw.indexOf('EUR') !== -1) return raw;
    var num = parseFloat(raw.replace(',', '.'));
    if (isNaN(num)) return prefix + raw;
    return prefix + num.toFixed(2).replace('.', ',');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null && text !== '') {
      node.textContent = text;
    }
    return node;
  }

  // -----------------------------------------------------------------
  //  initMenu — funzione principale
  // -----------------------------------------------------------------
  function initMenu(containerSelector, options) {
    options = options || {};

    var container = typeof containerSelector === 'string'
      ? document.querySelector(containerSelector)
      : containerSelector;

    if (!container) {
      if (typeof console !== 'undefined') {
        console.error('[menu-public] Contenitore non trovato: ' + containerSelector);
      }
      return null;
    }

    var state = {
      apiUrl: options.apiUrl || '/api/get-menu.php',
      lang: options.lang || 'it',
      categories: options.categories || {},   // mappa nome-categoria -> {it,en,fr,es}
      showUnavailable: !!options.showUnavailable,
      pricePrefix: options.pricePrefix || '€',
      errorMessage: options.errorMessage || 'Menu momentaneamente non disponibile. Riprova più tardi.',
      accent: options.accentColor || '#9c922c',
      onReady: typeof options.onReady === 'function' ? options.onReady : null,
      data: null,
      currentTab: 0
    };

    var widget = {
      // Cambia lingua e ridisegna (se i dati sono già stati caricati).
      setLang: function (lang) {
        state.lang = lang || 'it';
        if (state.data) render();
      },
      // Ricarica i dati dal server e ridisegna.
      refresh: function () {
        fetchData();
      },
      // Accesso diretto ai dati caricati.
      getData: function () {
        return state.data;
      }
    };

    // Nome categoria nella lingua corrente (con fallback all'italiano).
    function catName(cat) {
      var map = state.categories[cat.nome];
      if (typeof map === 'function') return map(state.lang, cat.nome);
      if (map && typeof map === 'object' && map[state.lang]) return map[state.lang];
      return cat.nome;
    }

    // -----------------------------------------------------------------
    //  Fetch dei dati
    // -----------------------------------------------------------------
    function fetchData() {
      container.innerHTML = '';
      var loading = el('div', 'menu-loading', 'Caricamento menu…');
      container.appendChild(loading);

      var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () {
        if (controller) controller.abort();
      }, FETCH_TIMEOUT);

      fetch(state.apiUrl, { cache: 'no-store', signal: controller ? controller.signal : undefined })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function (data) {
          clearTimeout(timer);
          if (!data || !Array.isArray(data.categorie)) throw new Error('Struttura dati non valida');
          state.data = data;
          render();
        })
        .catch(function () {
          clearTimeout(timer);
          container.innerHTML = '';
          container.appendChild(el('div', 'menu-error', state.errorMessage));
        });
    }

    // -----------------------------------------------------------------
    //  Rendering con lo stile del sito (tabs + pannelli)
    // -----------------------------------------------------------------
    function render() {
      var data = state.data;
      if (!data) return;

      container.innerHTML = '';

      // Piatti visibili per categoria (nasconde gli esauriti).
      var visibleCats = [];
      data.categorie.forEach(function (cat) {
        var dishes = cat.piatti.filter(function (dish) {
          return state.showUnavailable || dish.disponibile !== false;
        });
        if (dishes.length > 0) visibleCats.push({ cat: cat, dishes: dishes });
      });

      if (visibleCats.length === 0) {
        container.appendChild(el('div', 'menu-error', 'Il menu non è ancora disponibile.'));
        return;
      }

      // Tabellone categoria.
      var tabs = el('div', 'menu-tabs');
      tabs.setAttribute('role', 'tablist');

      // Pannelli categoria.
      var panels = el('div', 'menu-panels');

      visibleCats.forEach(function (entry, i) {
        var isActive = i === state.currentTab;

        var tab = el('button', 'menu-tab' + (isActive ? ' active' : ''), catName(entry.cat));
        tab.type = 'button';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.dataset.index = i;
        tabs.appendChild(tab);

        var panel = el('div', 'menu-panel' + (isActive ? ' active' : ''));
        panel.setAttribute('role', 'tabpanel');
        panel.dataset.index = i;

        // Testata categoria.
        var header = el('div', 'menu-category-header');
        header.appendChild(el('h3', null, catName(entry.cat)));
        var divider = el('span', 'menu-category-divider');
        divider.style.background = state.accent;
        header.appendChild(divider);
        panel.appendChild(header);

        // Lista piatti.
        var items = el('div', 'menu-items');
        entry.dishes.forEach(function (dish) {
          var item = el('div', 'menu-item');
          var info = el('div', 'menu-item-info');

          var itemHeader = el('div', 'menu-item-header');
          itemHeader.appendChild(el('h4', null, dish.nome));
          itemHeader.appendChild(el('span', 'menu-item-price', formatPrice(dish.prezzo, state.pricePrefix)));
          info.appendChild(itemHeader);

          if (dish.descrizione) {
            info.appendChild(el('p', 'menu-item-desc', dish.descrizione));
          }
          item.appendChild(info);
          items.appendChild(item);
        });
        panel.appendChild(items);

        panels.appendChild(panel);
      });

      container.appendChild(tabs);
      container.appendChild(panels);

      // Cambio tab.
      tabs.addEventListener('click', function (e) {
        var tab = e.target.closest('.menu-tab');
        if (!tab || tab.classList.contains('active')) return;
        var index = parseInt(tab.dataset.index, 10);
        state.currentTab = index;
        tabs.querySelectorAll('.menu-tab').forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        panels.querySelectorAll('.menu-panel').forEach(function (p) {
          p.classList.remove('active');
        });
        var target = panels.querySelector('.menu-panel[data-index="' + index + '"]');
        if (target) target.classList.add('active');
      });

      if (state.onReady) {
        try { state.onReady(data); } catch (err) {
          if (typeof console !== 'undefined') console.error('[menu-public] onReady:', err);
        }
      }
    }

    // Avvio.
    fetchData();
    return widget;
  }

  // Espone la funzione globalmente per le pagine HTML.
  if (typeof window !== 'undefined') {
    window.initMenu = initMenu;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMenu: initMenu, formatPrice: formatPrice };
  }
})();