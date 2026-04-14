/* ============================================================
   CSJ ROCHA — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------
  // PRELOADER
  // --------------------------------------------------------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Aguarda a barra de loading animar (~1.6s) + pequena folga
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove do DOM após a transição
      setTimeout(() => preloader.remove(), 700);
    }, 1800);
  }

  // --------------------------------------------------------
  // AOS INIT
  // --------------------------------------------------------
  AOS.init({
    duration: 750,
    once: true,
    offset: 50,
    easing: 'ease-out-quart'
  });

  // --------------------------------------------------------
  // NAVBAR — scroll behavior
  // --------------------------------------------------------
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    if (window.scrollY > 70) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // --------------------------------------------------------
  // SCROLL SPY — active nav link
  // --------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  const spyScroll = () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const top = section.offsetTop - 110;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
        });
      }
    });
  };

  window.addEventListener('scroll', spyScroll, { passive: true });

  // --------------------------------------------------------
  // SMOOTH SCROLL
  // --------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Fecha menu mobile
      const collapse = document.getElementById('navMenu');
      if (collapse?.classList.contains('show')) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }

      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --------------------------------------------------------
  // HERO — parallax suave no background
  // --------------------------------------------------------
  const heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY;
      if (offset < window.innerHeight) {
        heroPhoto.style.transform = `translateY(${offset * 0.25}px)`;
      }
    }, { passive: true });
  }

  // --------------------------------------------------------
  // FORMULÁRIO → WHATSAPP
  // --------------------------------------------------------
  const form = document.getElementById('contatoForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const nome = document.getElementById('nome')?.value.trim();
      const telefone = document.getElementById('telefone')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const servico = document.getElementById('servico')?.value;
      const mensagem = document.getElementById('mensagem')?.value.trim();

      if (!nome || !telefone || !mensagem) {
        showToast('Preencha os campos obrigatórios (*).', 'error');
        return;
      }

      let msg = `Olá! Vim pelo site da CSJ Rocha.%0A%0A`;
      msg += `*Nome:* ${nome}%0A`;
      msg += `*Telefone:* ${telefone}%0A`;
      if (email) msg += `*E-mail:* ${email}%0A`;
      if (servico) msg += `*Serviço:* ${servico}%0A`;
      msg += `%0A*Mensagem:*%0A${mensagem}`;

      window.open(`https://wa.me/5511930710050?text=${msg}`, '_blank');
      form.reset();
      showToast('Redirecionando para o WhatsApp...', 'success');
    });
  }

  // --------------------------------------------------------
  // TOAST NOTIFICATION
  // --------------------------------------------------------
  const showToast = (msg, type = 'info') => {
    document.querySelector('.csj-toast')?.remove();

    const colors = {
      error: '#c0392b',
      success: '#1565C0',
      info: '#0D1B3A'
    };

    const toast = document.createElement('div');
    toast.className = 'csj-toast';
    toast.style.cssText = `
      position: fixed;
      top: 88px;
      right: 20px;
      z-index: 99998;
      background: ${colors[type]};
      color: #fff;
      padding: 14px 20px;
      border-radius: 10px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.3);
      animation: toastIn 0.3s ease forwards;
      max-width: 300px;
      border-left: 3px solid rgba(255,255,255,0.3);
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(-10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  };

  // --------------------------------------------------------
  // MÁSCARA DE TELEFONE
  // --------------------------------------------------------
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      e.target.value = v;
    });
  }

  // --------------------------------------------------------
  // ANIMAÇÃO DOS NÚMEROS DO HERO (kpis)
  // --------------------------------------------------------
  const kpiNumbers = document.querySelectorAll('.kpi-n');

  if (kpiNumbers.length) {
    const animateNum = (el, target) => {
      let start = null;
      const duration = 1600;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const small = el.querySelector('small');
        const smallText = small ? small.outerHTML : '';
        el.innerHTML = Math.round(ease * target) + smallText;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const small = el.querySelector('small');
          const text = el.textContent.replace(/[^0-9]/g, '');
          const num = parseInt(text);
          if (!isNaN(num) && num > 0) {
            animateNum(el, num);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.6 });

    kpiNumbers.forEach(el => observer.observe(el));
  }

  // --------------------------------------------------------
  // BOTÃO VOLTAR AO TOPO
  // --------------------------------------------------------
  const btnTop = document.getElementById('btnTop');
  if (btnTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btnTop.classList.add('visible');
      } else {
        btnTop.classList.remove('visible');
      }
    }, { passive: true });

    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------
  // CONSOLE SIGNATURE
  // --------------------------------------------------------
  console.log('%cCSJ ROCHA', 'color: #1976D2; font-size: 22px; font-weight: bold; font-family: monospace;');
  console.log('%cGuindastes & Transportes · São Paulo e Região', 'color: #90A4B7; font-size: 12px;');

});

// --------------------------------------------------------
// GALERIA — LIGHTBOX
// --------------------------------------------------------
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbCounter = document.getElementById('lb-counter');
const lbOverlay = lightbox?.querySelector('.lb-overlay');
const lbClose = lightbox?.querySelector('.lb-close');
const lbPrev = lightbox?.querySelector('.lb-prev');
const lbNext = lightbox?.querySelector('.lb-next');
const lbLoader = lightbox?.querySelector('.lb-loader');

const galItems = Array.from(document.querySelectorAll('.gal-item'));
let currentIndex = 0;

const openLightbox = (index) => {
  currentIndex = index;
  const item = galItems[index];
  const src = item.dataset.src;
  const cap = item.dataset.caption || '';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  lbImg.classList.remove('loaded');
  lbLoader.style.display = 'block';
  lbCaption.textContent = cap;
  lbCounter.textContent = `${index + 1} / ${galItems.length}`;

  const tempImg = new Image();
  tempImg.onload = () => {
    lbImg.src = src;
    lbImg.alt = cap;
    lbLoader.style.display = 'none';
    lbImg.classList.add('loaded');
  };
  tempImg.src = src;
};

const closeLightbox = () => {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; lbImg.classList.remove('loaded'); }, 300);
};

const showPrev = () => {
  currentIndex = (currentIndex - 1 + galItems.length) % galItems.length;
  openLightbox(currentIndex);
};
const showNext = () => {
  currentIndex = (currentIndex + 1) % galItems.length;
  openLightbox(currentIndex);
};

galItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose?.addEventListener('click', closeLightbox);
lbOverlay?.addEventListener('click', closeLightbox);
lbPrev?.addEventListener('click', showPrev);
lbNext?.addEventListener('click', showNext);

// Teclado: ESC fecha, setas navegam
document.addEventListener('keydown', (e) => {
  if (!lightbox?.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Swipe mobile no lightbox
let touchStartX = 0;
lightbox?.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});

