// Menú móvil
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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

  // Formulario de contacto: Envió REAL a Web3Forms mediante AJAX
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
      fetch('https://web3forms.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async function(response) {
        var jsonRes = await response.json();
        if (response.status === 200) {
          // Éxito: El correo se ha procesado correctamente
          btn.textContent = 'Mensaje enviado ✓';
          form.reset();
        } else {
          // Error controlado por la API (ej. clave incorrecta)
          btn.textContent = 'Error al enviar ✕';
          console.error('Error Web3Forms:', jsonRes.message);
        }
      })
      .catch(function(error) {
        // Error de red (sin conexión a internet, caída de servidor, etc.)
        btn.textContent = 'Error de conexión ✕';
        console.error('Error de red:', error);
      })
      .then(function() {
        // Devolver el botón a su estado original pasados 4 segundos
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 4000);
      });
    });
  }
});
