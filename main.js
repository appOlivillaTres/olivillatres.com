// Menú móvil
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Revelado suave al hacer scroll (respeta prefers-reduced-motion)
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  // Carrusel de fotos del hero (portada)
  var slides = document.querySelectorAll('.hero-real .slide');
  var dots = document.querySelectorAll('.hero-dots span');
  if (slides.length > 1) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      dots[current] && dots[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
      dots[current] && dots[current].classList.add('is-active');
    }, 4500);
  }

  // Carrusel de "Nuestras áreas" — con autoplay y flechas manuales
// Carrusel de "Nuestras áreas"
var areasViewport = document.querySelector('.areas-grid');
var areasPrev = document.querySelector('.areas-nav button[aria-label="Anterior"]');
var areasNext = document.querySelector('.areas-nav button[aria-label="Siguiente"]');

if (areasViewport && areasPrev && areasNext) {

  var track = document.createElement('div');
  track.className = 'areas-track';

  // Guardamos las tarjetas originales
  var items = Array.from(areasViewport.children);

  // Metemos las tarjetas dentro del track
  items.forEach(function (item) {
    track.appendChild(item);
  });

  areasViewport.appendChild(track);

  var animating = false;

  // Mover una tarjeta hacia delante
  var goNext = function () {

    if (animating) return;
    animating = true;

    var first = track.firstElementChild;

    // Calculamos cuánto mide una tarjeta + el espacio entre ellas
    var style = getComputedStyle(track);
    var gap = parseFloat(style.gap) || 0;
    var width = first.getBoundingClientRect().width + gap;

    // Desplazamos el track
    track.style.transition = 'transform .5s ease';
    track.style.transform = 'translateX(-' + width + 'px)';

    // Cuando termina la animación:
    track.addEventListener('transitionend', function handler() {

      track.removeEventListener('transitionend', handler);

      // Quitamos la primera
      track.removeChild(first);

      // Y la ponemos al final
      track.appendChild(first);

      // Volvemos a la posición inicial sin animación
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';

      animating = false;
    });
  };


  // Mover una tarjeta hacia atrás
  var goPrev = function () {

    if (animating) return;
    animating = true;

    var last = track.lastElementChild;

    var style = getComputedStyle(track);
    var gap = parseFloat(style.gap) || 0;
    var width = last.getBoundingClientRect().width + gap;

    // Ponemos la última tarjeta delante
    track.insertBefore(last, track.firstElementChild);

    // La colocamos desplazada hacia la izquierda
    track.style.transition = 'none';
    track.style.transform = 'translateX(-' + width + 'px)';

    // Forzamos al navegador a aplicar esa posición
    track.offsetHeight;

    // Animamos hasta 0
    track.style.transition = 'transform .5s ease';
    track.style.transform = 'translateX(0)';

    track.addEventListener('transitionend', function handler() {

      track.removeEventListener('transitionend', handler);

      animating = false;
    });
  };


  // Flechas
  areasNext.addEventListener('click', function () {
    stopAreasAutoplay();
    goNext();
    startAreasAutoplay();
  });

  areasPrev.addEventListener('click', function () {
    stopAreasAutoplay();
    goPrev();
    startAreasAutoplay();
  });


  // Autoplay
  var areasTimer;

  var startAreasAutoplay = function () {
    clearInterval(areasTimer);
    areasTimer = setInterval(goNext, 4000);
  };

  var stopAreasAutoplay = function () {
    clearInterval(areasTimer);
  };


  // Pausar al pasar el ratón
  areasViewport.addEventListener('mouseenter', stopAreasAutoplay);
  areasViewport.addEventListener('mouseleave', startAreasAutoplay);

  // Touch
  areasViewport.addEventListener('touchstart', stopAreasAutoplay, {
    passive: true
  });

  areasViewport.addEventListener('touchend', startAreasAutoplay, {
    passive: true
  });


  // Iniciar
  startAreasAutoplay();
}

  // Carrusel de reseñas (rellena este array con más reseñas reales de Google)
  var reviews = [
    {
      initial: 'J',
      name: 'Juan Manzano',
      time: 'hace 4 años',
      stars: 5,
      text: 'Aislamientos, rejillas, pladur, etc. Lo que necesites. Son unos máquinas.'
    }
    // { initial:'M', name:'María ...', time:'hace 1 año', stars:5, text:'...' },
  ];
  var reviewIndex = 0;
  var reviewCard = document.querySelector('.review-card');
  if (reviewCard && reviews.length > 1) {
    var avatarEl = reviewCard.querySelector('.review-avatar');
    var nameEl = reviewCard.querySelector('.review-who strong');
    var timeEl = reviewCard.querySelector('.review-who span');
    var starsEl = reviewCard.querySelector('.stars');
    var textEl = reviewCard.querySelector('.review-box p');

    var renderReview = function () {
      var r = reviews[reviewIndex];
      avatarEl.textContent = r.initial;
      nameEl.textContent = r.name;
      timeEl.textContent = r.time;
      starsEl.textContent = '★★★★★'.slice(0, r.stars);
      textEl.textContent = r.text;
    };

    var reviewsPrev = document.querySelector('.reviews-nav button[aria-label="Reseña anterior"]');
    var reviewsNext = document.querySelector('.reviews-nav button[aria-label="Reseña siguiente"]');
    reviewsPrev.addEventListener('click', function () {
      reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
      renderReview();
    });
    reviewsNext.addEventListener('click', function () {
      reviewIndex = (reviewIndex + 1) % reviews.length;
      renderReview();
    });
  }

  // Formulario de contacto/presupuesto: envío real a Web3Forms mediante AJAX
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Evita la recarga de página convencional

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;

      // Estado visual de carga
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      // Recopilar los datos del HTML de manera dinámica
      var formData = new FormData(form);
      var object = Object.fromEntries(formData);
      var json = JSON.stringify(object);

      // Petición a la API de Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async function (response) {
        var jsonRes = await response.json();
        if (response.status === 200) {
          // Éxito: el correo se ha procesado correctamente
          btn.textContent = 'Mensaje enviado ✓';
          form.reset();
        } else {
          // Error controlado por la API (ej. clave incorrecta)
          btn.textContent = 'Error al enviar ✕';
          console.error('Error Web3Forms:', jsonRes.message);
        }
      })
      .catch(function (error) {
        // Error de red (sin conexión a internet, caída de servidor, etc.)
        btn.textContent = 'Error de conexión ✕';
        console.error('Error de red:', error);
      })
      .then(function () {
        // Devolver el botón a su estado original pasados 4 segundos
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 4000);
      });
    });
  }
});