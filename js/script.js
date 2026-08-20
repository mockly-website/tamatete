document.addEventListener('DOMContentLoaded', () => {

  // ----- READING PROGRESS -----
  (function(){
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = 'scaleX(' + progress + ')';
    }, { passive: true });
  })();

  // ----- PRELOADER -----
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => preloader.classList.add('hidden'));
    setTimeout(() => preloader.classList.add('hidden'), 2500);
  }

  // ----- NAVBAR -----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 80);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ----- SMOOTH SCROLL (same-page anchors) -----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
      }
    });
  });

  // ----- SCROLL REVEAL -----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.reveal-stagger').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.contatti-info').forEach(el => staggerObserver.observe(el));
  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) staggerObserver.observe(galleryGrid);

  // =====================================================
  //  MENU DATA & MULTILINGUAL SYSTEM
  // =====================================================


  // Nomi delle categorie del menu dinamico (quello salvato nell'editor)
  // tradotti nelle 4 lingue del sito. Le chiavi devono coincidere con i
  // nomi delle categorie in data/menu.json.
  const menuDynamicCatNames = {
    'Antipasti di mare': { it:'Antipasti di mare', en:'Seafood Starters', fr:'Entrées de mer', es:'Entrantes de mar' },
    'Antipasti di terra': { it:'Antipasti di terra', en:'Land Starters', fr:'Entrées de terre', es:'Entrantes de tierra' },
    'Primi': { it:'Primi', en:'First Courses', fr:'Premiers plats', es:'Primeros platos' },
    'Secondi di carne': { it:'Secondi di carne', en:'Meat Mains', fr:'Plats de viande', es:'Platos de carne' },
    'Secondi di pesce': { it:'Secondi di pesce', en:'Fish Mains', fr:'Plats de poisson', es:'Platos de pescado' },
    'Contorni': { it:'Contorni', en:'Side Dishes', fr:'Accompagnements', es:'Acompañamientos' },
    'Dessert': { it:'Dessert', en:'Desserts', fr:'Desserts', es:'Postres' },
    'Menù Baby': { it:'Menù Baby', en:'Baby Menu', fr:'Menu Enfant', es:'Menú Infantil' },
    'Vini al calice': { it:'Vini al calice', en:'Wines by the Glass', fr:'Vins au verre', es:'Vinos al vaso' },
    'Vini in bottiglia': { it:'Vini in bottiglia', en:'Wines (Bottle)', fr:'Vins (bouteille)', es:'Vinos (botella)' },
    'Cocktails': { it:'Cocktails', en:'Cocktails', fr:'Cocktails', es:'Cócteles' },
    'Cocktails analcolici': { it:'Cocktails analcolici', en:'Non-alcoholic Cocktails', fr:'Cocktails sans alcool', es:'Cócteles sin alcohol' },
    'Gin Tonic': { it:'Gin Tonic', en:'Gin Tonic', fr:'Gin Tonic', es:'Gin Tonic' },
    'Birre': { it:'Birre', en:'Beers', fr:'Bières', es:'Cervezas' }
  };


  // =====================================================
  //  FULL SITE TRANSLATIONS
  // =====================================================
  const i18n = {
    'nav.about':       { it:'Chi siamo', en:'About Us', fr:'Qui sommes-nous', es:'Quiénes somos' },
    'nav.menu':        { it:'Menu', en:'Menu', fr:'Menu', es:'Menú' },
    'nav.gallery':     { it:'Galleria', en:'Gallery', fr:'Galerie', es:'Galería' },
    'nav.contact':     { it:'Contatti', en:'Contact', fr:'Contact', es:'Contacto' },
    'nav.reserve':     { it:'Prenota', en:'Book', fr:'Réserver', es:'Reservar' },
    'hero.badge':      { it:'Ristorante Bistrot', en:'Restaurant Bistrot', fr:'Restaurant Bistrot', es:'Restaurante Bistrot' },
    'hero.sub':        { it:'Nel cuore storico di Oristano, tradizione e innovazione si incontrano.', en:'In the historic heart of Oristano, tradition and innovation meet.', fr:'Dans le cœur historique d\'Oristano, tradition et innovation se rencontrent.', es:'En el corazón histórico de Oristano, la tradición y la innovación se encuentran.' },
    'hero.btn1':       { it:'Prenota un tavolo', en:'Book a Table', fr:'Réserver une table', es:'Reservar una mesa' },
    'hero.btn2':       { it:'Scopri il menu', en:'Discover the Menu', fr:'Découvrir le menu', es:'Descubrir el menú' },
    'hero.scroll':     { it:'Scopri', en:'Discover', fr:'Découvrir', es:'Descubrir' },
    'about.tag':       { it:'La nostra storia', en:'Our Story', fr:'Notre histoire', es:'Nuestra historia' },
    'about.title':     { it:'Benvenuti da <span class="text-accent">Ta Matete</span>', en:'Welcome to <span class="text-accent">Ta Matete</span>', fr:'Bienvenue chez <span class="text-accent">Ta Matete</span>', es:'Bienvenidos a <span class="text-accent">Ta Matete</span>' },
    'about.p1':        { it:'Ta Matete nasce nel cuore di Oristano, nell\'elegante <strong>Piazza Giovanni Corrias</strong>, la stessa che ospita il Museo Antiquarium Arborense. Un luogo dove la tradizione culinaria sarda e mediterranea si fonde con influenze internazionali per offrire un\'esperienza unica.', en:'Ta Matete is located in the heart of Oristano, on the elegant <strong>Piazza Giovanni Corrias</strong>, the same square that houses the Museo Antiquarium Arborense. A place where Sardinian and Mediterranean culinary traditions blend with international influences to offer a unique experience.', fr:'Ta Matete est situé au cœur d\'Oristano, sur l\'élégante <strong>Piazza Giovanni Corrias</strong>, la même place qui abrite le Musée Antiquarium Arborense. Un lieu où la tradition culinaire sarde et méditerranéenne se mêle aux influences internationales pour offrir une expérience unique.', es:'Ta Matete se encuentra en el corazón de Oristano, en la elegante <strong>Piazza Giovanni Corrias</strong>, la misma plaza que alberga el Museo Antiquarium Arborense. Un lugar donde la tradición culinaria sarda y mediterránea se fusiona con influencias internacionales para ofrecer una experiencia única.' },
    'about.p2':        { it:'A guidare il locale è <strong>Paolo</strong>, la cui passione per l\'accoglienza e la cucina di qualità si riflette in ogni piatto e in ogni dettaglio del servizio. L\'atmosfera raccolta della sala interna si alterna alla suggestione del cortile esterno e dei tavoli in piazza, illuminati la sera per una cena all\'insegna della convivialità.', en:'The restaurant is led by <strong>Paolo</strong>, whose passion for hospitality and quality cuisine is reflected in every dish and every detail of the service. The intimate atmosphere of the indoor dining room alternates with the charm of the outdoor courtyard and the tables in the square, illuminated in the evening for a dinner of true conviviality.', fr:'Le restaurant est dirigé par <strong>Paolo</strong>, dont la passion pour l\'accueil et la cuisine de qualité se reflète dans chaque plat et chaque détail du service. L\'atmosphère intime de la salle intérieure alterne avec le charme de la cour extérieure et des tables sur la place, illuminées le soir pour un dîner placé sous le signe de la convivialité.', es:'El restaurante está dirigido por <strong>Paolo</strong>, cuya pasión por la hospitalidad y la cocina de calidad se refleja en cada plato y en cada detalle del servicio. La atmósfera íntima del comedor interior se alterna con el encanto del patio exterior y las mesas en la plaza, iluminadas por la noche para una cena llena de convivialidad.' },
    'about.f1':        { it:'Cucina mediterranea e specialità di pesce', en:'Mediterranean cuisine and seafood specialties', fr:'Cuisine méditerranéenne et spécialités de poisson', es:'Cocina mediterránea y especialidades de pescado' },
    'about.f2':        { it:'Opzioni vegetariane e senza glutine', en:'Vegetarian and gluten-free options', fr:'Options végétariennes et sans gluten', es:'Opciones vegetarianas y sin gluten' },
    'about.f3':        { it:'Selezione di vini locali e birre artigianali', en:'Selection of local wines and craft beers', fr:'Sélection de vins locaux et bières artisanales', es:'Selección de vinos locales y cervezas artesanales' },
    'about.badge':     { it:'Centro storico, Oristano', en:'Historic center, Oristano', fr:'Centre historique, Oristano', es:'Centro histórico, Oristano' },
    'menu.tag':        { it:'Le nostre specialità', en:'Our Specialties', fr:'Nos spécialités', es:'Nuestras especialidades' },
    'menu.title':      { it:'Scopri il <span class="text-accent">Menu</span>', en:'Discover the <span class="text-accent">Menu</span>', fr:'Découvrez le <span class="text-accent">Menu</span>', es:'Descubre el <span class="text-accent">Menú</span>' },
    'menu.desc':       { it:'Tradizione sarda, freschezza del mare e un tocco di innovazione.', en:'Sardinian tradition, sea freshness and a touch of innovation.', fr:'Tradition sarde, fraîcheur de la mer et une touche d\'innovation.', es:'Tradición sarda, frescura del mar y un toque de innovación.' },
    'menu.allergens':  { it:'Allergeni', en:'Allergens', fr:'Allergènes', es:'Alérgenos' },
    'stats.rating':    { it:'Rating medio', en:'Average Rating', fr:'Note moyenne', es:'Valoración media' },
    'stats.reviews':   { it:'Recensioni', en:'Reviews', fr:'Avis', es:'Reseñas' },
    'stats.year':      { it:'Anno di apertura', en:'Year of Opening', fr:'Année d\'ouverture', es:'Año de apertura' },
    'gallery.tag':     { it:'Galleria', en:'Gallery', fr:'Galerie', es:'Galería' },
    'gallery.title':   { it:'Scatti dal <span class="text-accent">Ristorante</span>', en:'Shots from the <span class="text-accent">Restaurant</span>', fr:'Photos du <span class="text-accent">Restaurant</span>', es:'Fotos del <span class="text-accent">Restaurante</span>' },
    'gallery.desc':    { it:'Piatti, atmosfere e momenti conviviali da Ta Matete.', en:'Dishes, atmospheres and convivial moments at Ta Matete.', fr:'Plats, ambiances et moments conviviaux chez Ta Matete.', es:'Platos, ambientes y momentos de convivencia en Ta Matete.' },
    'reserve.tag':     { it:'Prenota', en:'Book', fr:'Réserver', es:'Reservar' },
    'reserve.title':   { it:'Prenota il tuo <span class="text-accent">tavolo</span>', en:'Book your <span class="text-accent">table</span>', fr:'Réservez votre <span class="text-accent">table</span>', es:'Reserva tu <span class="text-accent">mesa</span>' },
    'reserve.desc':    { it:'Contattaci direttamente su WhatsApp o telefona per assicurarti un posto nella nostra sala o nel cortile.', en:'Contact us directly on WhatsApp or call to secure a spot in our dining room or courtyard.', fr:'Contactez-nous directement sur WhatsApp ou appelez pour réserver une place dans notre salle ou notre cour.', es:'Contáctanos directamente por WhatsApp o llama para asegurar un lugar en nuestro comedor o patio.' },
    'reserve.form.name':     { it:'Nome', en:'Name', fr:'Nom', es:'Nombre' },
    'reserve.form.phone':    { it:'Telefono', en:'Phone', fr:'Téléphone', es:'Teléfono' },
    'reserve.form.date':     { it:'Data', en:'Date', fr:'Date', es:'Fecha' },
    'reserve.form.time':     { it:'Ora', en:'Time', fr:'Heure', es:'Hora' },
    'reserve.form.guests':   { it:'Coperti', en:'Guests', fr:'Couverts', es:'Comensales' },
    'reserve.form.notes':    { it:'Note (opzionale)', en:'Notes (optional)', fr:'Notes (optionnel)', es:'Notas (opcional)' },
    'reserve.form.name_ph':  { it:'Il tuo nome', en:'Your name', fr:'Votre nom', es:'Tu nombre' },
    'reserve.form.phone_ph': { it:'+39 3XX XXX XXXX', en:'+39 3XX XXX XXXX', fr:'+39 3XX XXX XXXX', es:'+39 3XX XXX XXXX' },
    'reserve.form.notes_ph': { it:'Allergie, richieste speciali…', en:'Allergies, special requests…', fr:'Allergies, demandes spéciales…', es:'Alergias, peticiones especiales…' },
    'reserve.form.submit':   { it:'Richiedi prenotazione', en:'Request Booking', fr:'Demander une réservation', es:'Solicitar reserva' },
    'reserve.form.disclaimer':{ it:'Oppure scrivici su <a href="https://wa.me/393477490289" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a> o chiama il <a href="tel:+393477490289"><i class="fas fa-phone"></i> +39 347 749 0289</a>', en:'Or write to us on <a href="https://wa.me/393477490289" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a> or call <a href="tel:+393477490289"><i class="fas fa-phone"></i> +39 347 749 0289</a>', fr:'Ou écrivez-nous sur <a href="https://wa.me/393477490289" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a> ou appelez le <a href="tel:+393477490289"><i class="fas fa-phone"></i> +39 347 749 0289</a>', es:'O escríbenos por <a href="https://wa.me/393477490289" target="_blank" rel="noopener"><i class="fab fa-whatsapp"></i> WhatsApp</a> o llama al <a href="tel:+393477490289"><i class="fas fa-phone"></i> +39 347 749 0289</a>' },
    'contact.tag':         { it:'Contatti', en:'Contact', fr:'Contact', es:'Contacto' },
    'contact.title':       { it:'Trova <span class="text-accent">Ta Matete</span>', en:'Find <span class="text-accent">Ta Matete</span>', fr:'Trouvez <span class="text-accent">Ta Matete</span>', es:'Encuentra <span class="text-accent">Ta Matete</span>' },
    'contact.desc':        { it:'Siamo nel centro storico di Oristano, nella stessa piazza del Museo Antiquarium Arborense.', en:'We are in the historic center of Oristano, on the same square as the Museo Antiquarium Arborense.', fr:'Nous sommes dans le centre historique d\'Oristano, sur la même place que le Musée Antiquarium Arborense.', es:'Estamos en el centro histórico de Oristano, en la misma plaza que el Museo Antiquarium Arborense.' },
    'contact.address_title': { it:'Indirizzo', en:'Address', fr:'Adresse', es:'Dirección' },
    'contact.address_link':  { it:'Apri in Maps →', en:'Open in Maps →', fr:'Ouvrir dans Maps →', es:'Abrir en Maps →' },
    'contact.phone_title':   { it:'Telefono / WhatsApp', en:'Phone / WhatsApp', fr:'Téléphone / WhatsApp', es:'Teléfono / WhatsApp' },
    'contact.email_title':   { it:'Email', en:'Email', fr:'Email', es:'Email' },
    'contact.hours_title':   { it:'Orari di apertura', en:'Opening Hours', fr:'Horaires d\'ouverture', es:'Horario de apertura' },
    'contact.hours_lunch':   { it:'Pranzo: 12:00 – 15:00', en:'Lunch: 12:00 – 15:00', fr:'Déjeuner: 12h00 – 15h00', es:'Almuerzo: 12:00 – 15:00' },
    'contact.hours_dinner':  { it:'Cena: 19:00 – 23:00', en:'Dinner: 19:00 – 23:00', fr:'Dîner: 19h00 – 23h00', es:'Cena: 19:00 – 23:00' },
    'contact.social_label':  { it:'Seguici su', en:'Follow us on', fr:'Suivez-nous sur', es:'Síguenos en' },
    'footer.brand_subtitle': { it:'Ristorante Bistrot – Oristano', en:'Restaurant Bistrot – Oristano', fr:'Restaurant Bistrot – Oristano', es:'Restaurante Bistrot – Oristano' },
    'footer.col1_title':    { it:'Menu', en:'Menu', fr:'Menu', es:'Menú' },
    'footer.col2_title':    { it:'Contatti', en:'Contacts', fr:'Contacts', es:'Contactos' },
    'footer.col3_title':    { it:'Social', en:'Social', fr:'Social', es:'Social' },
    'footer.info_title':   { it:'Informazioni', en:'Info', fr:'Infos', es:'Información' },
    'footer.cookie':       { it:'Cookie Policy', en:'Cookie Policy', fr:'Politique des cookies', es:'Política de cookies' },
    'footer.privacy':      { it:'Privacy Policy', en:'Privacy Policy', fr:'Politique de confidentialité', es:'Política de privacidad' },
    'footer.credit':       { it:'Realizzato da <a href="https://mockly.it" target="_blank" rel="noopener">Mockly</a>', en:'Made by <a href="https://mockly.it" target="_blank" rel="noopener">Mockly</a>', fr:'Réalisé par <a href="https://mockly.it" target="_blank" rel="noopener">Mockly</a>', es:'Realizado por <a href="https://mockly.it" target="_blank" rel="noopener">Mockly</a>' },
    'footer.whatsapp':      { it:'WhatsApp', en:'WhatsApp', fr:'WhatsApp', es:'WhatsApp' },
    'footer.copyright':     { it:'&copy; 2026 Ta Matete – Ristorante Bistrot. Tutti i diritti riservati.', en:'&copy; 2026 Ta Matete – Restaurant Bistrot. All rights reserved.', fr:'&copy; 2026 Ta Matete – Restaurant Bistrot. Tous droits réservés.', es:'&copy; 2026 Ta Matete – Restaurante Bistrot. Todos los derechos reservados.' },
    'cookie.tag':          { it:'Cookie Policy', en:'Cookie Policy', fr:'Politique des cookies', es:'Política de cookies' },
    'cookie.title':        { it:'Cookie <span class="text-accent">Policy</span>', en:'Cookie <span class="text-accent">Policy</span>', fr:'Politique des <span class="text-accent">cookies</span>', es:'Política de <span class="text-accent">cookies</span>' },
    'privacy.tag':         { it:'Privacy Policy', en:'Privacy Policy', fr:'Politique de confidentialité', es:'Política de privacidad' },
    'privacy.title':       { it:'Privacy <span class="text-accent">Policy</span>', en:'Privacy <span class="text-accent">Policy</span>', fr:'Politique de <span class="text-accent">confidentialité</span>', es:'Política de <span class="text-accent">privacidad</span>' }
  };
  i18n['_backToTop'] = { it:'Torna su', en:'Back to top', fr:'Retour en haut', es:'Volver arriba' };

  // ----- LANGUAGE STATE -----
  let currentLang = 'it';

  // =====================================================
  //  TRANSLATE STATIC ELEMENTS
  // =====================================================
  function translateStatic(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (i18n[key]) {
        el.innerHTML = i18n[key][lang] || i18n[key].it;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (i18n[key]) {
        el.placeholder = i18n[key][lang] || i18n[key].it;
      }
    });
    document.documentElement.lang = lang;
    const titles = {
      it: document.querySelector('meta[name="description"]') ? null : '',
      en: ''
    };
    const page = document.body.dataset.page || 'home';
    if (page !== 'legal') {
      const pageTitles = {
        home: { it:'Ta Matete – Ristorante Bistrot | Oristano', en:'Ta Matete – Restaurant Bistrot | Oristano', fr:'Ta Matete – Restaurant Bistrot | Oristano', es:'Ta Matete – Restaurante Bistrot | Oristano' },
        menu: { it:'Menu – Ta Matete | Oristano', en:'Menu – Ta Matete | Oristano', fr:'Menu – Ta Matete | Oristano', es:'Menú – Ta Matete | Oristano' },
        contatti: { it:'Contatti e Prenotazioni – Ta Matete | Oristano', en:'Contact & Booking – Ta Matete | Oristano', fr:'Contact & Réservation – Ta Matete | Oristano', es:'Contacto y Reservas – Ta Matete | Oristano' }
      };
      const pt = pageTitles[page] || pageTitles.home;
      document.title = pt[lang] || pt.it;
    }
    const btt = document.getElementById('backToTop');
    if (btt) btt.setAttribute('aria-label', i18n._backToTop[lang] || i18n._backToTop.it);
    const nav = document.getElementById('navbar');
    if (nav) {
      const labels = { it:'Navigazione principale', en:'Main navigation', fr:'Navigation principale', es:'Navegación principal' };
      nav.setAttribute('aria-label', labels[lang] || labels.it);
    }
  }


  // =====================================================
  //  LANGUAGE SWITCHER
  // =====================================================
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = lang;
      const widget = window.__menuWidget;
      if (widget && typeof widget.setLang === 'function') {
        // Menu dinamico attivo (menu.html): cambia lingua al volo.
        widget.setLang(lang);
      } else {
        translateStatic(lang);
      }
    });
  });

  // =====================================================
  //  MENU INIT (menu.html only)
  // =====================================================
  // Se la pagina usa il menu dinamico, inizializza il widget di
  // menu-public.js appena il DOM è pronto (dopo che tutti i
  // <script defer> sono stati eseguiti).
  function initDynamicMenu() {
    if (!window.initMenu || !document.getElementById('menu-container')) return;
    window.__menuWidget = window.initMenu('#menu-container', {
      lang: currentLang,
      categories: menuDynamicCatNames,
      accentColor: '#9c922c',
      errorMessage: 'Menu momentaneamente non disponibile. Riprova più tardi.'
    });
  }
  if (document.getElementById('menu-container')) {
    if (window.initMenu) {
      initDynamicMenu();
    } else {
      window.addEventListener('DOMContentLoaded', initDynamicMenu);
    }
  }

  // =====================================================
  //  HOME PAGE ONLY — STATS COUNTER
  // =====================================================
  const statsSection = document.querySelector('.section-stats');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(num => {
            const target = parseFloat(num.dataset.target);
            const isFloat = target % 1 !== 0;
            const duration = 2000;
            const startTime = performance.now();
            const update = (currentTime) => {
              const progress = Math.min((currentTime - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * target;
              num.textContent = isFloat ? current.toFixed(1) : Math.round(current);
              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                num.textContent = isFloat ? target.toFixed(1) : target;
              }
            };
            requestAnimationFrame(update);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }

  // ----- BACK TO TOP -----
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.pageYOffset > 500);
    }, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // =====================================================
  //  CONTATTI PAGE — RESERVATION FORM
  // =====================================================
  const form = document.getElementById('reservationForm');
  if (form) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = form.querySelector('#formDate');
    const timeInput = form.querySelector('#formTime');
    if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];
    if (timeInput) timeInput.value = '20:00';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#formName').value.trim();
      const phone = form.querySelector('#formPhone').value.trim();
      const date = form.querySelector('#formDate').value;
      const time = form.querySelector('#formTime').value;
      const guests = form.querySelector('#formGuests').value;
      const notes = form.querySelector('#formNotes').value.trim();

      if (!name || !phone || !date || !time) {
        form.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = '#e74c3c';
            setTimeout(() => { field.style.borderColor = ''; }, 3000);
          }
        });
        return;
      }

      const msg = encodeURIComponent(
        `Ciao Ta Matete! Vorrei prenotare un tavolo.\n\nNome: ${name}\nTelefono: ${phone}\nData: ${date}\nOra: ${time}\nCoperti: ${guests}${notes ? `\nNote: ${notes}` : ''}\n\nGrazie!`
      );
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reindirizzamento…';
      btn.disabled = true;
      setTimeout(() => {
        window.open(`https://wa.me/393477490289?text=${msg}`, '_blank');
        btn.innerHTML = '<i class="fas fa-check"></i> Richiesta inviata!';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
      }, 800);
    });
  }

  // =====================================================
  //  HOME PAGE ONLY — PARALLAX HERO
  // =====================================================
  const hero = document.getElementById('hero');
  if (hero && window.innerWidth > 768) {
    const particles = document.getElementById('heroParticles');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (particles) particles.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    });
  }

  // =====================================================
  //  HOME PAGE ONLY — ACTIVE NAV LINK
  // =====================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a:not(.nav-cta)');
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === '#' + id ? '#9c922c' : '';
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  // ----- RESIZE -----
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, 200);
  });

  // ----- LIGHTBOX -----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let currentIdx = -1;

  const allGallerySrcs = [
    'img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg',
    'img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg',
    'img/11.jpg','img/12.jpg','img/13.jpg','img/14.jpg','img/15.jpg',
    'img/16.jpg','img/17.jpg','img/18.jpg','img/19.jpg','img/20.jpg',
    'img/21.jpg','img/22.jpg','img/23.jpg','img/24.jpg','img/25.jpg',
    'img/26.jpg','img/27.jpg'
  ];
  const totalGallery = allGallerySrcs.length;

  if (lightbox) {
    function updateCounter() {
      if (lightboxCounter) lightboxCounter.textContent = (currentIdx + 1) + ' / ' + totalGallery;
    }

    function openLightbox(idx) {
      currentIdx = idx;
      lightboxImg.src = allGallerySrcs[currentIdx];
      lightboxImg.alt = '';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      updateCounter();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function showImage(dir) {
      currentIdx = (currentIdx + dir + totalGallery) % totalGallery;
      lightboxImg.src = allGallerySrcs[currentIdx];
      lightboxImg.alt = '';
      updateCounter();
    }

    document.querySelectorAll('.gallery-slide').forEach(slide => {
      slide.addEventListener('click', () => {
        const img = slide.querySelector('img');
        if (!img) return;
        const src = img.getAttribute('src');
        const found = allGallerySrcs.indexOf(src);
        openLightbox(found !== -1 ? found : 0);
      });
    });

    document.getElementById('galleryAllBtn')?.addEventListener('click', () => openLightbox(0));

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => showImage(-1));
    lightboxNext.addEventListener('click', () => showImage(1));
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(-1);
      if (e.key === 'ArrowRight') showImage(1);
    });
  }

  // ----- GALLERY CAROUSEL -----
  (function() {
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const dotsContainer = document.getElementById('galleryDots');
    if (!track) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;

    function getVisibleCount() {
      const w = window.innerWidth;
      if (w <= 380) return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    let currentPage = 0;
    let visible = getVisibleCount();
    const totalPages = Math.ceil(totalSlides / visible);

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Vai a slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }

    function goTo(page) {
      currentPage = Math.max(0, Math.min(page, totalPages - 1));
      const targetSlide = slides[Math.min(currentPage * visible, totalSlides - 1)];
      const offset = -(targetSlide.offsetLeft);
      track.style.transform = 'translateX(' + offset + 'px)';
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentPage);
        });
      }
    }

    function recalc() {
      const newVisible = getVisibleCount();
      if (newVisible !== visible) {
        visible = newVisible;
        buildDots();
        goTo(0);
      } else {
        goTo(currentPage);
      }
    }

    buildDots();
    goTo(0);

    prevBtn?.addEventListener('click', () => goTo(currentPage - 1));
    nextBtn?.addEventListener('click', () => goTo(currentPage + 1));
    window.addEventListener('resize', recalc);
  })();

});
