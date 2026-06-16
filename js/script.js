document.addEventListener('DOMContentLoaded', () => {

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

  const menuCategories = ['antipasti-mare','antipasti-terra','primi','secondi-carne','secondi-pesce','contorni','dessert','baby','vini','cocktails','birre'];

  const menuCatNames = {
    it: ['Antipasti di mare','Antipasti di terra','Primi','Secondi di carne','Secondi di pesce','Contorni','Dessert','Menù Baby','Vini','Cocktails','Birre'],
    en: ['Seafood Starters','Land Starters','First Courses','Meat Mains','Fish Mains','Side Dishes','Desserts','Baby Menu','Wines','Cocktails','Beers'],
    fr: ['Entrées de mer','Entrées de terre','Premiers plats','Plats de viande','Plats de poisson','Accompagnements','Desserts','Menu Enfant','Vins','Cocktails','Bières'],
    es: ['Entrantes de mar','Entrantes de tierra','Primeros platos','Platos de carne','Platos de pescado','Acompañamientos','Postres','Menú Infantil','Vinos','Cócteles','Cervezas']
  };
  const menuSubcats = {
    'calice-rossi': { it:'Vini al calice rossi', en:'Red wines by the glass', fr:'Vins rouges au verre', es:'Vinos tintos al vaso' },
    'calice-bianchi': { it:'Vini al calice bianchi', en:'White wines by the glass', fr:'Vins blancs au verre', es:'Vinos blancos al vaso' },
    'rossi-bottiglia': { it:'Vini rossi', en:'Red wines', fr:'Vins rouges', es:'Vinos tintos' },
    'bianchi-bottiglia': { it:'Vini bianchi e bollicine', en:'White wines and sparkling', fr:'Vins blancs et bulles', es:'Vinos blancos y burbujas' },
    'cocktails-alcolici': { it:'Cocktails', en:'Cocktails', fr:'Cocktails', es:'Cócteles' },
    'cocktails-analcolici': { it:'Cocktails Analcolici', en:'Non-alcoholic Cocktails', fr:'Cocktails sans alcool', es:'Cócteles sin alcohol' },
    'gin-tonic': { it:'Gin Tonic', en:'Gin Tonic', fr:'Gin Tonic', es:'Gin Tonic' }
  };

  const menuItems = [
    { cat:'antipasti-mare', price:'€16,00', aller:'(14-9)', name:{ it:'Insalata di mare', en:'Seafood Salad', fr:'Salade de fruits de mer', es:'Ensalada de mariscos' }, desc:{ it:'polpo, pomodorini, sedano, olivette taggiasche', en:'octopus, cherry tomatoes, celery, Taggiasca olives', fr:'poulpe, tomates cerises, céleri, olives de Taggiasca', es:'pulpo, tomates cherry, apio, aceitunas taggiasche' } },
    { cat:'antipasti-mare', price:'€16,00', aller:'(14)', name:{ it:'Zuppa di cozze e vongole in rosso', en:'Mussel and Clam Soup in Tomato Sauce', fr:'Soupe de moules et palourdes à la tomate', es:'Sopa de mejillones y almejas en salsa roja' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'antipasti-mare', price:'€16,00', aller:'(4)', name:{ it:'Salmone fresco marinato agli agrumi', en:'Fresh Citrus-Marinated Salmon', fr:'Saumon frais mariné aux agrumes', es:'Salmón fresco marinado en cítricos' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'antipasti-terra', price:'€25,00', aller:'(7)', name:{ it:'Tagliere grande di salumi e formaggi nostrani', en:'Large Platter of Local Cured Meats and Cheeses', fr:'Grand plateau de charcuteries et fromages locaux', es:'Tabla grande de embutidos y quesos locales' }, desc:{ it:'3/4 persone', en:'3/4 people', fr:'3/4 personnes', es:'3/4 personas' } },
    { cat:'antipasti-terra', price:'€15,00', aller:'(7)', name:{ it:'Tagliere piccolo di salumi e formaggi nostrani', en:'Small Platter of Local Cured Meats and Cheeses', fr:'Petit plateau de charcuteries et fromages locaux', es:'Tabla pequeña de embutidos y quesos locales' }, desc:{ it:'1/2 persone', en:'1/2 people', fr:'1/2 personnes', es:'1/2 personas' } },
    { cat:'antipasti-terra', price:'€14,00', aller:'(7)', name:{ it:'Insalata caprese', en:'Caprese Salad', fr:'Salade Caprese', es:'Ensalada Caprese' }, desc:{ it:'mozzarella di bufala, prosciutto crudo, pomodoro, basilico', en:'buffalo mozzarella, cured ham, tomato, basil', fr:'mozzarella de bufflonne, jambon cru, tomate, basilic', es:'mozzarella de búfala, jamón crudo, tomate, albahaca' } },
    { cat:'primi', price:'€20,00', aller:'(1-4-14)', name:{ it:'Linguine con vongole e bottarga', en:'Linguine with Clams and Bottarga', fr:'Linguine aux palourdes et boutargue', es:'Linguine con almejas y bottarga' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'primi', price:'€18,00', aller:'(1-7)', name:{ it:'Fregola con ragù di stinco di vitello', en:'Fregola with Veal Shank Ragù', fr:'Fregola au ragù de jarret de veau', es:'Fregola con ragú de jarrete de ternera' }, desc:{ it:'fondo bruno e maggiorana', en:'brown stock and marjoram', fr:'fond brun et marjolaine', es:'fondo oscuro y mejorana' } },
    { cat:'primi', price:'€16,00', aller:'(1-3)', name:{ it:'Ravioli artigianali ripieni al tartufo', en:'Handmade Truffle-Filled Ravioli', fr:'Ravioli artisanaux farcis à la truffe', es:'Raviolis artesanales rellenos de trufa' }, desc:{ it:'con ragù di cinghiale', en:'with wild boar ragù', fr:'au ragù de sanglier', es:'con ragú de jabalí' } },
    { cat:'primi', price:'€18,00', aller:'(1-14)', name:{ it:'Tagliolini al nero di seppia con ragù di seppia fresca', en:'Squid-Ink Tagliolini with Fresh Squid Ragù', fr:'Tagliolini à l\'encre de seiche avec ragù de seiche fraîche', es:'Tagliolini al negro de sepia con ragú de sepia fresca' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-carne', price:'€22,00', aller:'(8)', name:{ it:'Porchetta arrosto con riduzione al mirto', en:'Roast Porchetta with Myrtle Reduction', fr:'Porchetta rôtie à la réduction de myrte', es:'Porchetta asada con reducción de mirto' }, desc:{ it:'e patate al forno', en:'and oven-baked potatoes', fr:'et pommes de terre au four', es:'y patatas al horno' } },
    { cat:'secondi-carne', price:'€22,00', aller:'(1)', name:{ it:'Gulash di Angus Irlandese', en:'Irish Angus Goulash', fr:'Goulasch d\'Angus irlandais', es:'Gulash de Angus irlandés' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-carne', price:'€22,00', aller:'', name:{ it:'Tagliata di manzo e contorno', en:'Beef Tagliata with Side Dish', fr:'Tagliata de bœuf avec accompagnement', es:'Tagliata de ternera con acompañamiento' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-carne', price:'€22,00', aller:'', name:{ it:'Bistecca di manzo e contorno', en:'Beef Steak with Side Dish', fr:'Steak de bœuf avec accompagnement', es:'Filete de ternera con acompañamiento' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-carne', price:'€16,00', aller:'', name:{ it:'Hamburger "Ta Matete"', en:'"Ta Matete" Burger', fr:'Hamburger "Ta Matete"', es:'Hamburguesa "Ta Matete"' }, desc:{ it:'misto manzo e maiale e contorno', en:'beef and pork mix with side dish', fr:'mélange bœuf-porc avec accompagnement', es:'mezcla de res y cerdo con acompañamiento' } },
    { cat:'secondi-carne', price:'€16,00', aller:'', name:{ it:'Straccetti di cavallo e contorno', en:'Horse Meat Strips with Side Dish', fr:'Straccetti de cheval avec accompagnement', es:'Straccetti de caballo con acompañamiento' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-pesce', price:'€22,00', aller:'(4)', name:{ it:'Filetto di ombrina in salsa mediterranea', en:'Meagre Fillet in Mediterranean Sauce', fr:'Filet d\'ombrine en sauce méditerranéenne', es:'Filete de corvina en salsa mediterránea' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-pesce', price:'€20,00', aller:'(1-4-14)', name:{ it:'Frittura di calamari', en:'Fried Calamari', fr:'Friture de calamars', es:'Fritura de calamares' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'secondi-pesce', price:'€20,00', aller:'(4)', name:{ it:'Pesce spada alla griglia con olivette taggiasche', en:'Grilled Swordfish with Taggiasca Olives', fr:'Espadon grillé aux olives de Taggiasca', es:'Pez espada a la parrilla con aceitunas taggiasche' }, desc:{ it:'sfumato alla vernaccia di Oristano e bieta al vapore', en:'flambéed with Vernaccia di Oristano and steamed chard', fr:'déglacé à la vernaccia di Oristano et blettes vapeur', es:'flameado con vernaccia de Oristano y acelgas al vapor' } },
    { cat:'contorni', price:'€5,00', aller:'', name:{ it:'Patate al forno', en:'Oven-Baked Potatoes', fr:'Pommes de terre au four', es:'Patatas al horno' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'contorni', price:'€5,00', aller:'(5)', name:{ it:'Patate fritte', en:'French Fries', fr:'Frites', es:'Patatas fritas' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'contorni', price:'€5,00', aller:'', name:{ it:'Verdure grigliate', en:'Grilled Vegetables', fr:'Légumes grillés', es:'Verduras a la parrilla' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'contorni', price:'€5,00', aller:'', name:{ it:'Insalata mista', en:'Mixed Salad', fr:'Salade mixte', es:'Ensalada mixta' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'contorni', price:'€4,00', aller:'', name:{ it:'Insalata verde', en:'Green Salad', fr:'Salade verte', es:'Ensalada verde' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'dessert', price:'€6,00', aller:'(3-7-8)', name:{ it:'Dessert della casa', en:'Homemade Dessert', fr:'Dessert maison', es:'Postre de la casa' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'baby', price:'€10,00', aller:'(1-3-5)', name:{ it:'Cotoletta di pollo e patatine fritte', en:'Chicken Cutlet with French Fries', fr:'Escalope de poulet avec frites', es:'Milanesa de pollo con patatas fritas' }, desc:{ it:'', en:'', fr:'', es:'' } },

    // ---- VINI ----
    { cat:'vini', subcat:'calice-rossi', price:'€5,00', name:{ it:'Grotta Rossa', en:'Grotta Rossa', fr:'Grotta Rossa', es:'Grotta Rossa' }, desc:{ it:'(Carignano del Sulcis DOC) Cantina Santadi', en:'(Carignano del Sulcis DOC) Cantina Santadi', fr:'(Carignano del Sulcis DOC) Cantina Santadi', es:'(Carignano del Sulcis DOC) Cantina Santadi' } },
    { cat:'vini', subcat:'calice-rossi', price:'€5,00', name:{ it:'Cardanera', en:'Cardanera', fr:'Cardanera', es:'Cardanera' }, desc:{ it:'(Carignano del Sulcis DOC) Cantina Argiolas (Serdiana)', en:'(Carignano del Sulcis DOC) Cantina Argiolas (Serdiana)', fr:'(Carignano del Sulcis DOC) Cantina Argiolas (Serdiana)', es:'(Carignano del Sulcis DOC) Cantina Argiolas (Serdiana)' } },
    { cat:'vini', subcat:'calice-rossi', price:'€5,00', name:{ it:'Carpante', en:'Carpante', fr:'Carpante', es:'Carpante' }, desc:{ it:'(Cagnulari IGT) Carpante (Usini)', en:'(Cagnulari IGT) Carpante (Usini)', fr:'(Cagnulari IGT) Carpante (Usini)', es:'(Cagnulari IGT) Carpante (Usini)' } },
    { cat:'vini', subcat:'calice-rossi', price:'€5,00', name:{ it:'Tiernu', en:'Tiernu', fr:'Tiernu', es:'Tiernu' }, desc:{ it:'(Bovale DOC) Cantina di Mogoro (Mogoro)', en:'(Bovale DOC) Cantina di Mogoro (Mogoro)', fr:'(Bovale DOC) Cantina di Mogoro (Mogoro)', es:'(Bovale DOC) Cantina di Mogoro (Mogoro)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€5,00', name:{ it:'Karmis Cuvèe', en:'Karmis Cuvèe', fr:'Karmis Cuvèe', es:'Karmis Cuvèe' }, desc:{ it:'(Vernaccia/Vermentino) Contini (Cabras)', en:'(Vernaccia/Vermentino) Contini (Cabras)', fr:'(Vernaccia/Vermentino) Contini (Cabras)', es:'(Vernaccia/Vermentino) Contini (Cabras)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€5,00', name:{ it:'Tyrsos', en:'Tyrsos', fr:'Tyrsos', es:'Tyrsos' }, desc:{ it:'(Vermentino DOC) Contini (Cabras)', en:'(Vermentino DOC) Contini (Cabras)', fr:'(Vermentino DOC) Contini (Cabras)', es:'(Vermentino DOC) Contini (Cabras)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€5,00', name:{ it:'Funtanaliras', en:'Funtanaliras', fr:'Funtanaliras', es:'Funtanaliras' }, desc:{ it:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', en:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', fr:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', es:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€5,00', name:{ it:'Istrale', en:'Istrale', fr:'Istrale', es:'Istrale' }, desc:{ it:'(Vermentino DOC) Nuovi Poderi (Senorbì)', en:'(Vermentino DOC) Nuovi Poderi (Senorbì)', fr:'(Vermentino DOC) Nuovi Poderi (Senorbì)', es:'(Vermentino DOC) Nuovi Poderi (Senorbì)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€5,00', name:{ it:'Terre Bianche', en:'Terre Bianche', fr:'Terre Bianche', es:'Terre Bianche' }, desc:{ it:'(Torbato DOC) Sella & Mosca (Alghero)', en:'(Torbato DOC) Sella & Mosca (Alghero)', fr:'(Torbato DOC) Sella & Mosca (Alghero)', es:'(Torbato DOC) Sella & Mosca (Alghero)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€4,00', name:{ it:'Nieddera Rose', en:'Nieddera Rose', fr:'Nieddera Rose', es:'Nieddera Rose' }, desc:{ it:'(Nieddera) Contini (Cabras)', en:'(Nieddera) Contini (Cabras)', fr:'(Nieddera) Contini (Cabras)', es:'(Nieddera) Contini (Cabras)' } },
    { cat:'vini', subcat:'calice-bianchi', price:'€4,00', name:{ it:'Prosecco', en:'Prosecco', fr:'Prosecco', es:'Prosecco' }, desc:{ it:'Valdobbiadene', en:'Valdobbiadene', fr:'Valdobbiadene', es:'Valdobbiadene' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€20,00', name:{ it:'Grotta Rossa', en:'Grotta Rossa', fr:'Grotta Rossa', es:'Grotta Rossa' }, desc:{ it:'(Carignano del Sulcis DOC) Cantina Santadi', en:'(Carignano del Sulcis DOC) Cantina Santadi', fr:'(Carignano del Sulcis DOC) Cantina Santadi', es:'(Carignano del Sulcis DOC) Cantina Santadi' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€24,00', name:{ it:'Cardanera', en:'Cardanera', fr:'Cardanera', es:'Cardanera' }, desc:{ it:'(Carignano del Sulcis DOC) Argiolas (Serdiana)', en:'(Carignano del Sulcis DOC) Argiolas (Serdiana)', fr:'(Carignano del Sulcis DOC) Argiolas (Serdiana)', es:'(Carignano del Sulcis DOC) Argiolas (Serdiana)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€35,00', name:{ it:'Rocca Rubia', en:'Rocca Rubia', fr:'Rocca Rubia', es:'Rocca Rubia' }, desc:{ it:'(Carignano del Sulcis Riserva 2021) Cantina Santadi (Santadi)', en:'(Carignano del Sulcis Riserva 2021) Cantina Santadi (Santadi)', fr:'(Carignano del Sulcis Riserva 2021) Cantina Santadi (Santadi)', es:'(Carignano del Sulcis Riserva 2021) Cantina Santadi (Santadi)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€20,00', name:{ it:'Sartiglia', en:'Sartiglia', fr:'Sartiglia', es:'Sartiglia' }, desc:{ it:'(Cannonau di Sardegna) Cantina Contini (Cabras)', en:'(Cannonau di Sardegna) Cantina Contini (Cabras)', fr:'(Cannonau di Sardegna) Cantina Contini (Cabras)', es:'(Cannonau di Sardegna) Cantina Contini (Cabras)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€26,00', name:{ it:'INU', en:'INU', fr:'INU', es:'INU' }, desc:{ it:'(Cannonau) Contini (Cabras)', en:'(Cannonau) Contini (Cabras)', fr:'(Cannonau) Contini (Cabras)', es:'(Cannonau) Contini (Cabras)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€32,00', name:{ it:'Carros', en:'Carros', fr:'Carros', es:'Carros' }, desc:{ it:'(Cannonau DOC) Flli.Puddu (Oliena)', en:'(Cannonau DOC) Flli.Puddu (Oliena)', fr:'(Cannonau DOC) Flli.Puddu (Oliena)', es:'(Cannonau DOC) Flli.Puddu (Oliena)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€24,00', name:{ it:'Carpante', en:'Carpante', fr:'Carpante', es:'Carpante' }, desc:{ it:'(Cagnulari IGT) Carpante (Usini)', en:'(Cagnulari IGT) Carpante (Usini)', fr:'(Cagnulari IGT) Carpante (Usini)', es:'(Cagnulari IGT) Carpante (Usini)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€19,00', name:{ it:'Tiernu', en:'Tiernu', fr:'Tiernu', es:'Tiernu' }, desc:{ it:'(Bovale DOC) Cantina di Mogoro (Mogoro)', en:'(Bovale DOC) Cantina di Mogoro (Mogoro)', fr:'(Bovale DOC) Cantina di Mogoro (Mogoro)', es:'(Bovale DOC) Cantina di Mogoro (Mogoro)' } },
    { cat:'vini', subcat:'rossi-bottiglia', price:'€25,00', name:{ it:'Iselis', en:'Iselis', fr:'Iselis', es:'Iselis' }, desc:{ it:'(Monica Doc Superiore) Argiolas (Serdiana)', en:'(Monica Doc Superiore) Argiolas (Serdiana)', fr:'(Monica Doc Superiore) Argiolas (Serdiana)', es:'(Monica Doc Superiore) Argiolas (Serdiana)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Karmis Cuvèe', en:'Karmis Cuvèe', fr:'Karmis Cuvèe', es:'Karmis Cuvèe' }, desc:{ it:'(Vernaccia/Vermentino) Contini (Cabras)', en:'(Vernaccia/Vermentino) Contini (Cabras)', fr:'(Vernaccia/Vermentino) Contini (Cabras)', es:'(Vernaccia/Vermentino) Contini (Cabras)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€18,00', name:{ it:'Tyrsos', en:'Tyrsos', fr:'Tyrsos', es:'Tyrsos' }, desc:{ it:'(Vermentino DOC) Contini (Cabras)', en:'(Vermentino DOC) Contini (Cabras)', fr:'(Vermentino DOC) Contini (Cabras)', es:'(Vermentino DOC) Contini (Cabras)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€28,00', name:{ it:'Nudo Rosè', en:'Nudo Rosè', fr:'Nudo Rosè', es:'Nudo Rosè' }, desc:{ it:'(Cannonau) Cantine Siddura (Luogosanto)', en:'(Cannonau) Cantine Siddura (Luogosanto)', fr:'(Cannonau) Cantine Siddura (Luogosanto)', es:'(Cannonau) Cantine Siddura (Luogosanto)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Funtanaliras', en:'Funtanaliras', fr:'Funtanaliras', es:'Funtanaliras' }, desc:{ it:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', en:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', fr:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)', es:'(Vermentino di Gallura DOCG) Cantina Soc. Vermentino (Monti)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Istrale', en:'Istrale', fr:'Istrale', es:'Istrale' }, desc:{ it:'(Vermentino DOC) Nuovi Poderi (Senorbì)', en:'(Vermentino DOC) Nuovi Poderi (Senorbì)', fr:'(Vermentino DOC) Nuovi Poderi (Senorbì)', es:'(Vermentino DOC) Nuovi Poderi (Senorbì)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Akenta Cuvèe 71', en:'Akenta Cuvèe 71', fr:'Akenta Cuvèe 71', es:'Akenta Cuvèe 71' }, desc:{ it:'(Vermentino DOC) Santa M. La Palma (Alghero)', en:'(Vermentino DOC) Santa M. La Palma (Alghero)', fr:'(Vermentino DOC) Santa M. La Palma (Alghero)', es:'(Vermentino DOC) Santa M. La Palma (Alghero)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Terre Bianche', en:'Terre Bianche', fr:'Terre Bianche', es:'Terre Bianche' }, desc:{ it:'(Torbato DOC) Sella & Mosca (Alghero)', en:'(Torbato DOC) Sella & Mosca (Alghero)', fr:'(Torbato DOC) Sella & Mosca (Alghero)', es:'(Torbato DOC) Sella & Mosca (Alghero)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€20,00', name:{ it:'Audarya', en:'Audarya', fr:'Audarya', es:'Audarya' }, desc:{ it:'(Nuragus DOC) Audarya (Serdiana)', en:'(Nuragus DOC) Audarya (Serdiana)', fr:'(Nuragus DOC) Audarya (Serdiana)', es:'(Nuragus DOC) Audarya (Serdiana)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€20,00', name:{ it:'0789', en:'0789', fr:'0789', es:'0789' }, desc:{ it:'(Vermentino di Gallura DOCG) Cantina Pedres (Olbia)', en:'(Vermentino di Gallura DOCG) Cantina Pedres (Olbia)', fr:'(Vermentino di Gallura DOCG) Cantina Pedres (Olbia)', es:'(Vermentino di Gallura DOCG) Cantina Pedres (Olbia)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€32,00', name:{ it:'Gewurztraminer', en:'Gewurztraminer', fr:'Gewurztraminer', es:'Gewurztraminer' }, desc:{ it:'(Gewurztraminer) Cantine Terlan (Terlano BZ)', en:'(Gewurztraminer) Cantine Terlan (Terlano BZ)', fr:'(Gewurztraminer) Cantine Terlan (Terlano BZ)', es:'(Gewurztraminer) Cantine Terlan (Terlano BZ)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€32,00', name:{ it:'Greco di tufo', en:'Greco di tufo', fr:'Greco di tufo', es:'Greco di tufo' }, desc:{ it:'(Alabastra)', en:'(Alabastra)', fr:'(Alabastra)', es:'(Alabastra)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€18,00', name:{ it:'Nieddera Rose', en:'Nieddera Rose', fr:'Nieddera Rose', es:'Nieddera Rose' }, desc:{ it:'(Nieddera) Contini (Cabras)', en:'(Nieddera) Contini (Cabras)', fr:'(Nieddera) Contini (Cabras)', es:'(Nieddera) Contini (Cabras)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€16,00', name:{ it:'Prosecco', en:'Prosecco', fr:'Prosecco', es:'Prosecco' }, desc:{ it:'Valdobbiadene', en:'Valdobbiadene', fr:'Valdobbiadene', es:'Valdobbiadene' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€28,00', name:{ it:'Ruggeri Prosecco Superiore', en:'Ruggeri Prosecco Superiore', fr:'Ruggeri Prosecco Superiore', es:'Ruggeri Prosecco Superiore' }, desc:{ it:'(Prosecco) Cantine Ruggeri (Valdobbiadene)', en:'(Prosecco) Cantine Ruggeri (Valdobbiadene)', fr:'(Prosecco) Cantine Ruggeri (Valdobbiadene)', es:'(Prosecco) Cantine Ruggeri (Valdobbiadene)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€40,00', name:{ it:'Ferghettina', en:'Ferghettina', fr:'Ferghettina', es:'Ferghettina' }, desc:{ it:'Franciacorta', en:'Franciacorta', fr:'Franciacorta', es:'Franciacorta' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Attilio Brut', en:'Attilio Brut', fr:'Attilio Brut', es:'Attilio Brut' }, desc:{ it:'Contini (Cabras)', en:'Contini (Cabras)', fr:'Contini (Cabras)', es:'Contini (Cabras)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€22,00', name:{ it:'Attilio Brut Rosè', en:'Attilio Brut Rosè', fr:'Attilio Brut Rosè', es:'Attilio Brut Rosè' }, desc:{ it:'Contini (Cabras)', en:'Contini (Cabras)', fr:'Contini (Cabras)', es:'Contini (Cabras)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€25,00', name:{ it:'Akenta', en:'Akenta', fr:'Akenta', es:'Akenta' }, desc:{ it:'Extra Dry Millesimato Santa M.La Palma (Alghero)', en:'Extra Dry Millesimato Santa M.La Palma (Alghero)', fr:'Extra Dry Millesimato Santa M.La Palma (Alghero)', es:'Extra Dry Millesimato Santa M.La Palma (Alghero)' } },
    { cat:'vini', subcat:'bianchi-bottiglia', price:'€25,00', name:{ it:'Akenta Rosè', en:'Akenta Rosè', fr:'Akenta Rosè', es:'Akenta Rosè' }, desc:{ it:'Rosè Millesimato Santa M. La Palma (Alghero)', en:'Rosè Millesimato Santa M. La Palma (Alghero)', fr:'Rosè Millesimato Santa M. La Palma (Alghero)', es:'Rosè Millesimato Santa M. La Palma (Alghero)' } },

    // ---- COCKTAILS ----
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€6,00', name:{ it:'Aperol Spritz', en:'Aperol Spritz', fr:'Aperol Spritz', es:'Aperol Spritz' }, desc:{ it:'Aperol – Prosecco – Seltz o acqua gas', en:'Aperol – Prosecco – Seltz or sparkling water', fr:'Aperol – Prosecco – Seltz ou eau gazeuse', es:'Aperol – Prosecco – Seltz o agua con gas' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€6,00', name:{ it:'Campari Spritz', en:'Campari Spritz', fr:'Campari Spritz', es:'Campari Spritz' }, desc:{ it:'Campari Bitter – Prosecco – Seltz o acqua gas', en:'Campari Bitter – Prosecco – Seltz or sparkling water', fr:'Campari Bitter – Prosecco – Seltz ou eau gazeuse', es:'Campari Bitter – Prosecco – Seltz o agua con gas' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€6,00', name:{ it:'Limoncello Spritz', en:'Limoncello Spritz', fr:'Limoncello Spritz', es:'Limoncello Spritz' }, desc:{ it:'Limoncello – Prosecco – Seltz o acqua gas', en:'Limoncello – Prosecco – Seltz or sparkling water', fr:'Limoncello – Prosecco – Seltz ou eau gazeuse', es:'Limoncello – Prosecco – Seltz o agua con gas' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Ta Matete', en:'Ta Matete', fr:'Ta Matete', es:'Ta Matete' }, desc:{ it:'Vodka – succo d\'ananas – basilico zenzero – Ginger Beer', en:'Vodka – pineapple juice – basil ginger – Ginger Beer', fr:'Vodka – jus d\'ananas – basilic gingembre – Ginger Beer', es:'Vodka – jugo de piña – albahaca jengibre – Ginger Beer' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Americano', en:'Americano', fr:'Americano', es:'Americano' }, desc:{ it:'Campari Bitter – Vermouth rosso – Seltz o acqua gas', en:'Campari Bitter – Red Vermouth – Seltz or sparkling water', fr:'Campari Bitter – Vermouth rouge – Seltz ou eau gazeuse', es:'Campari Bitter – Vermut rojo – Seltz o agua con gas' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Negroni', en:'Negroni', fr:'Negroni', es:'Negroni' }, desc:{ it:'Campari Bitter – Vermouth rosso – Gin', en:'Campari Bitter – Red Vermouth – Gin', fr:'Campari Bitter – Vermouth rouge – Gin', es:'Campari Bitter – Vermut rojo – Ginebra' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Negroni sbagliato', en:'Negroni sbagliato', fr:'Negroni sbagliato', es:'Negroni sbagliato' }, desc:{ it:'Campari Bitter – Vermouth rosso – Prosecco', en:'Campari Bitter – Red Vermouth – Prosecco', fr:'Campari Bitter – Vermouth rouge – Prosecco', es:'Campari Bitter – Vermut rojo – Prosecco' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Garibaldi', en:'Garibaldi', fr:'Garibaldi', es:'Garibaldi' }, desc:{ it:'Campari Bitter – succo d\'arancia', en:'Campari Bitter – orange juice', fr:'Campari Bitter – jus d\'orange', es:'Campari Bitter – jugo de naranja' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Mojito', en:'Mojito', fr:'Mojito', es:'Mojito' }, desc:{ it:'Rum bianco – lime – zucchero di canna – menta – Seltz o acqua gas o acqua tonica', en:'White rum – lime – cane sugar – mint – Seltz or sparkling water or tonic', fr:'Rhum blanc – lime – sucre de canne – menthe – Seltz ou eau gazeuse ou tonic', es:'Ron blanco – lima – azúcar de caña – menta – Seltz o agua con gas o tónica' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Caipirinha', en:'Caipirinha', fr:'Caipirinha', es:'Caipirinha' }, desc:{ it:'Cachaca – lime – zucchero di canna', en:'Cachaca – lime – cane sugar', fr:'Cachaca – lime – sucre de canne', es:'Cachaca – lima – azúcar de caña' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Caipiroska alla fragola', en:'Strawberry Caipiroska', fr:'Caipiroska à la fraise', es:'Caipiroska de fresa' }, desc:{ it:'Vodka – mix fragola – lime – zucchero di canna', en:'Vodka – strawberry mix – lime – cane sugar', fr:'Vodka – mélange fraise – lime – sucre de canne', es:'Vodka – mezcla fresa – lima – azúcar de caña' } },
    { cat:'cocktails', subcat:'cocktails-alcolici', price:'€7,00', name:{ it:'Margarita', en:'Margarita', fr:'Margarita', es:'Margarita' }, desc:{ it:'Tequila – Triple sec – succo di lime – sale', en:'Tequila – Triple sec – lime juice – salt', fr:'Tequila – Triple sec – jus de lime – sel', es:'Tequila – Triple sec – jugo de lima – sal' } },
    { cat:'cocktails', subcat:'cocktails-analcolici', price:'€7,00', name:{ it:'Ta Matete Zero', en:'Ta Matete Zero', fr:'Ta Matete Zero', es:'Ta Matete Zero' }, desc:{ it:'Succo d\'ananas – zenzero – basilico – succo di lime – Ginger Ale', en:'Pineapple juice – ginger – basil – lime juice – Ginger Ale', fr:'Jus d\'ananas – gingembre – basilic – jus de lime – Ginger Ale', es:'Jugo de piña – jengibre – albahaca – jugo de lima – Ginger Ale' } },
    { cat:'cocktails', subcat:'cocktails-analcolici', price:'€7,00', name:{ it:'Mojito Zero', en:'Mojito Zero', fr:'Mojito Zero', es:'Mojito Zero' }, desc:{ it:'Succo di lime – limonata – menta – tonica', en:'Lime juice – lemonade – mint – tonic', fr:'Jus de lime – limonade – menthe – tonic', es:'Jugo de lima – limonada – menta – tónica' } },
    { cat:'cocktails', subcat:'cocktails-analcolici', price:'€7,00', name:{ it:'Virgin Caipiroska fragola', en:'Virgin Strawberry Caipiroska', fr:'Virgin Caipiroska fraise', es:'Virgin Caipiroska fresa' }, desc:{ it:'Fragole – lime – zucchero di canna – soda', en:'Strawberries – lime – cane sugar – soda', fr:'Fraises – lime – sucre de canne – soda', es:'Fresas – lima – azúcar de caña – soda' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€7,00', name:{ it:'Bombay Gin Tonic', en:'Bombay Gin Tonic', fr:'Bombay Gin Tonic', es:'Bombay Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€7,00', name:{ it:'Tanqueray Gin Tonic', en:'Tanqueray Gin Tonic', fr:'Tanqueray Gin Tonic', es:'Tanqueray Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€8,00', name:{ it:'Grifu (Sardinian Gin) Gin Tonic', en:'Grifu (Sardinian Gin) Gin Tonic', fr:'Grifu (Sardinian Gin) Gin Tonic', es:'Grifu (Ginebra Sarda) Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€8,00', name:{ it:'Gin Mare Gin Tonic', en:'Gin Mare Gin Tonic', fr:'Gin Mare Gin Tonic', es:'Gin Mare Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€8,00', name:{ it:'Bulldog Gin Tonic', en:'Bulldog Gin Tonic', fr:'Bulldog Gin Tonic', es:'Bulldog Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€8,00', name:{ it:'Hendricks Gin Tonic', en:'Hendricks Gin Tonic', fr:'Hendricks Gin Tonic', es:'Hendricks Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€10,00', name:{ it:'Monkey 47 Gin Tonic', en:'Monkey 47 Gin Tonic', fr:'Monkey 47 Gin Tonic', es:'Monkey 47 Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'cocktails', subcat:'gin-tonic', price:'€8,00', name:{ it:'Roku Gin Tonic', en:'Roku Gin Tonic', fr:'Roku Gin Tonic', es:'Roku Gin Tonic' }, desc:{ it:'', en:'', fr:'', es:'' } },

    // ---- BIRRE ----
    { cat:'birre', price:'€5,00', name:{ it:'Golden Ale 33 cl – Birrificio Puddu (Oristano)', en:'Golden Ale 33 cl – Puddu Brewery (Oristano)', fr:'Golden Ale 33 cl – Brasserie Puddu (Oristano)', es:'Golden Ale 33 cl – Cervecería Puddu (Oristano)' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€5,00', name:{ it:'IPA 33 cl – Birrificio Puddu (Oristano)', en:'IPA 33 cl – Puddu Brewery (Oristano)', fr:'IPA 33 cl – Brasserie Puddu (Oristano)', es:'IPA 33 cl – Cervecería Puddu (Oristano)' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,50', name:{ it:'Corona 33 cl', en:'Corona 33 cl', fr:'Corona 33 cl', es:'Corona 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,50', name:{ it:'Heineken 33 cl', en:'Heineken 33 cl', fr:'Heineken 33 cl', es:'Heineken 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,00', name:{ it:'Ichnusa 33 cl', en:'Ichnusa 33 cl', fr:'Ichnusa 33 cl', es:'Ichnusa 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€4,00', name:{ it:'Moretti IPA 33 cl', en:'Moretti IPA 33 cl', fr:'Moretti IPA 33 cl', es:'Moretti IPA 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€4,50', name:{ it:'Moretti Rossa 33 cl', en:'Moretti Rossa 33 cl', fr:'Moretti Rossa 33 cl', es:'Moretti Rossa 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,50', name:{ it:'Peroni senza glutine 33 cl', en:'Peroni gluten-free 33 cl', fr:'Peroni sans gluten 33 cl', es:'Peroni sin gluten 33 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€2,50', name:{ it:'Moretti bionda alla spina 0,20 cl', en:'Moretti blonde draught 0,20 cl', fr:'Moretti blonde pression 0,20 cl', es:'Moretti rubia de barril 0,20 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,50', name:{ it:'Moretti bionda alla spina 0,30 cl', en:'Moretti blonde draught 0,30 cl', fr:'Moretti blonde pression 0,30 cl', es:'Moretti rubia de barril 0,30 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€4,50', name:{ it:'Moretti bionda alla spina 0,40 cl', en:'Moretti blonde draught 0,40 cl', fr:'Moretti blonde pression 0,40 cl', es:'Moretti rubia de barril 0,40 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€2,50', name:{ it:'Ichnusa non filtrata alla spina 0,20 cl', en:'Ichnusa unfiltered draught 0,20 cl', fr:'Ichnusa non filtrée pression 0,20 cl', es:'Ichnusa sin filtrar de barril 0,20 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€3,50', name:{ it:'Ichnusa non filtrata alla spina 0,30 cl', en:'Ichnusa unfiltered draught 0,30 cl', fr:'Ichnusa non filtrée pression 0,30 cl', es:'Ichnusa sin filtrar de barril 0,30 cl' }, desc:{ it:'', en:'', fr:'', es:'' } },
    { cat:'birre', price:'€4,50', name:{ it:'Ichnusa non filtrata alla spina 0,40 cl', en:'Ichnusa unfiltered draught 0,40 cl', fr:'Ichnusa non filtrée pression 0,40 cl', es:'Ichnusa sin filtrar de barril 0,40 cl' }, desc:{ it:'', en:'', fr:'', es:'' } }
  ];

  const allergensList = {
    it: ['1 – Cereali contenenti glutine (grano, segale, orzo, avena, kamut)','2 – Crostacei e prodotti a base di crostacei','3 – Uova e prodotti a base di uova','4 – Pesce e prodotti a base di pesce','5 – Arachidi e prodotti a base di arachidi','6 – Soia e prodotti a base di soia','7 – Latte e prodotti a base di latte (incluso lattosio)','8 – Frutta a guscio (mandorle, nocciole, noci, anacardi)','9 – Sedano e prodotti a base di sedano','10 – Senape e prodotti a base di senape','11 – Semi di sesamo e prodotti a base di sesamo','12 – Anidride solforosa e solfiti (>10mg/kg)','13 – Lupini e prodotti a base di lupini','14 – Molluschi e prodotti a base di molluschi'],
    en: ['1 – Gluten-containing cereals (wheat, rye, barley, oats, kamut)','2 – Crustaceans and crustacean products','3 – Eggs and egg products','4 – Fish and fish products','5 – Peanuts and peanut products','6 – Soy and soy products','7 – Milk and milk products (including lactose)','8 – Tree nuts (almonds, hazelnuts, walnuts, cashews)','9 – Celery and celery products','10 – Mustard and mustard products','11 – Sesame seeds and sesame products','12 – Sulphur dioxide and sulphites (>10mg/kg)','13 – Lupin and lupin products','14 – Molluscs and mollusc products'],
    fr: ['1 – Céréales contenant du gluten (blé, seigle, orge, avoine, kamut)','2 – Crustacés et produits à base de crustacés','3 – Œufs et produits à base d\'œufs','4 – Poissons et produits à base de poissons','5 – Arachides et produits à base d\'arachides','6 – Soja et produits à base de soja','7 – Lait et produits à base de lait (dont lactose)','8 – Fruits à coque (amandes, noisettes, noix, noix de cajou)','9 – Céleri et produits à base de céleri','10 – Moutarde et produits à base de moutarde','11 – Graines de sésame et produits à base de sésame','12 – Anhydride sulfureux et sulfites (>10mg/kg)','13 – Lupin et produits à base de lupin','14 – Mollusques et produits à base de mollusques'],
    es: ['1 – Cereales con gluten (trigo, centeno, cebada, avena, kamut)','2 – Crustáceos y productos a base de crustáceos','3 – Huevos y productos a base de huevo','4 – Pescado y productos a base de pescado','5 – Cacahuetes y productos a base de cacahuete','6 – Soja y productos a base de soja','7 – Leche y productos lácteos (incluyendo lactosa)','8 – Frutos secos (almendras, avellanas, nueces, anacardos)','9 – Apio y productos a base de apio','10 – Mostaza y productos a base de mostaza','11 – Semillas de sésamo y productos a base de sésamo','12 – Anhídrido sulfuroso y sulfitos (>10mg/kg)','13 – Altramuces y productos a base de altramuces','14 – Moluscos y productos a base de moluscos']
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
  //  RENDER MENU (menu.html only)
  // =====================================================
  function renderMenu(lang) {
    currentLang = lang;
    const tabsContainer = document.getElementById('menuTabs');
    const panelsContainer = document.getElementById('menuPanels');
    if (!tabsContainer || !panelsContainer) return;

    tabsContainer.innerHTML = menuCategories.map((cat, i) =>
      `<button class="menu-tab${i === 0 ? ' active' : ''}" role="tab" data-cat="${cat}" aria-selected="${i === 0}">${menuCatNames[lang][i]}</button>`
    ).join('');

    const catColors = {
      'antipasti-mare': '#db4424',
      'antipasti-terra': '#eca424',
      'primi': '#7c6c74',
      'secondi-carne': '#635939',
      'secondi-pesce': '#204638',
      'contorni': '#eca424',
      'dessert': '#7c6c74',
      'baby': '#db4424',
      'vini': '#722f37',
      'cocktails': '#d4a574',
      'birre': '#c8a84c'
    };

    panelsContainer.innerHTML = menuCategories.map((cat, i) => {
      const items = menuItems.filter(item => item.cat === cat);
      const color = catColors[cat] || '#9c922c';
      let itemsHtml = `<div class="menu-items">`;
      let lastSubcat = null;
      items.forEach(item => {
        if (item.subcat && item.subcat !== lastSubcat) {
          const label = menuSubcats[item.subcat] ? (menuSubcats[item.subcat][lang] || menuSubcats[item.subcat].it) : '';
          if (label) itemsHtml += `<h4 class="menu-subcat-header">${label}</h4>`;
          lastSubcat = item.subcat;
        }
        const name = item.name[lang] || item.name.it;
        const desc = item.desc[lang] || item.desc.it;
        const aller = item.aller ? `<span class="menu-item-allergen">${item.aller}</span>` : '';
        itemsHtml += `<div class="menu-item reveal-stagger">
          <div class="menu-item-info">
            <div class="menu-item-header">
              <h4>${name}</h4>
              <span class="menu-item-price">${item.price}</span>
            </div>
            ${desc ? `<p class="menu-item-desc">${desc}</p>` : ''}
            ${aller}
          </div>
        </div>`;
      });
      itemsHtml += `</div>`;

      return `<div class="menu-panel${i === 0 ? ' active' : ''}" role="tabpanel" data-panel="${cat}">
        <div class="menu-category-header">
          <h3>${menuCatNames[lang][i]}</h3>
          <span class="menu-category-divider" style="background:${color}"></span>
        </div>
        ${itemsHtml}
      </div>`;
    }).join('');

    tabsContainer.querySelectorAll('.menu-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;
        tabsContainer.querySelectorAll('.menu-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        const cat = tab.dataset.cat;
        panelsContainer.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
        const target = panelsContainer.querySelector(`.menu-panel[data-panel="${cat}"]`);
        if (target) target.classList.add('active');
      });
    });

    panelsContainer.querySelectorAll('.menu-items').forEach(el => {
      el.querySelectorAll('.reveal-stagger').forEach(item => item.classList.remove('visible'));
      staggerObserver.observe(el);
    });

    renderAllergens(lang);
    translateStatic(lang);
  }

  function renderAllergens(lang) {
    const container = document.getElementById('allergensContent');
    if (!container) return;
    container.innerHTML = allergensList[lang].map(a => `<div>${a}</div>`).join('');
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
      if (document.getElementById('menuTabs')) {
        renderMenu(lang);
      } else {
        currentLang = lang;
        translateStatic(lang);
      }
    });
  });

  // ----- ALLERGENS TOGGLE -----
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('#allergensToggle');
    if (toggle) document.getElementById('allergensContent').classList.toggle('open');
  });

  // =====================================================
  //  MENU INIT (only on menu.html)
  // =====================================================
  if (document.getElementById('menuTabs')) {
    renderMenu('it');
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
