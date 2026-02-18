/* ===========================
   CapCut Master — script.js
   Lógica interativa do guia
   =========================== */

// ===== VARIÁVEIS GLOBAIS =====
let currentOpen = null; // ID do tutorial atualmente aberto

// ===== ABRIR O GUIA =====
function openGuide() {
  const hero = document.getElementById('hero');
  const guide = document.getElementById('guide');
  const btn = document.getElementById('btnEntrar');

  // Animação de saída no hero
  btn.style.transform = 'scale(0.95)';
  btn.disabled = true;

  setTimeout(() => {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-20px)';
    hero.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  }, 100);

  setTimeout(() => {
    hero.classList.add('hidden');

    // Mostrar o guia com animação
    guide.classList.remove('hidden');
    guide.style.opacity = '0';
    guide.style.transform = 'translateY(20px)';

    requestAnimationFrame(() => {
      guide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      guide.style.opacity = '1';
      guide.style.transform = 'translateY(0)';
    });

    // Rolar para o topo suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 500);
}

// ===== ALTERNAR TUTORIAL (ACORDEÃO) =====
function toggleTutorial(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  const content = document.getElementById(`tutorial-${id}`);

  if (!card || !content) return;

  const isOpen = content.classList.contains('open');

  // Fechar o tutorial anteriormente aberto (se diferente)
  if (currentOpen !== null && currentOpen !== id) {
    const prevCard = document.querySelector(`[data-id="${currentOpen}"]`);
    const prevContent = document.getElementById(`tutorial-${currentOpen}`);
    if (prevContent && prevCard) {
      prevContent.classList.remove('open');
      prevCard.classList.remove('active');
    }
  }

  if (isOpen) {
    // Fechar este tutorial
    content.classList.remove('open');
    card.classList.remove('active');
    currentOpen = null;
  } else {
    // Abrir este tutorial
    content.classList.add('open');
    card.classList.add('active');
    currentOpen = id;

    // Rolagem suave para o card aberto após pequeno delay
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// ===== PESQUISA DE TUTORIAIS =====
const searchInput = document.getElementById('searchInput');

if (searchInput) {
  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;

    // Se não há pesquisa, mostrar todos
    if (query === '') {
      cards.forEach(card => {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.3s ease both';
      });
      if (noResults) noResults.classList.add('hidden');
      return;
    }

    // Filtrar cards pelo conteúdo
    cards.forEach((card, index) => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const keywords = card.getAttribute('data-keywords') || '';
      const content = card.querySelector('.tutorial-inner')?.textContent.toLowerCase() || '';

      const match = title.includes(query) || keywords.includes(query) || content.includes(query);

      if (match) {
        card.style.display = '';
        card.style.animationDelay = `${index * 0.05}s`;
        card.style.animation = 'fadeInUp 0.3s ease both';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Exibir mensagem de "nenhum resultado"
    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  });
}

// ===== BOTÃO VOLTAR AO TOPO =====
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backToTopBtn) return;
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ANIMAÇÃO AO ROLAR (Intersection Observer) =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Inicializar observação após abertura do guia
function initScrollAnimations() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    // Resetar para estado inicial para animação
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`;
    observer.observe(card);
  });
}

// Disparar animações depois que o guia aparecer
setTimeout(initScrollAnimations, 600);

// ===== RIPPLE EFFECT NOS BOTÕES DOS CARDS =====
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.card-btn');
  if (!btn) return;

  // Criar elemento de ripple
  const ripple = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    border-radius: 50%;
    background: rgba(124, 92, 252, 0.15);
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    transform: scale(0);
    animation: ripple-anim 0.6s ease-out forwards;
  `;

  // Garantir posicionamento relativo no botão
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(ripple);

  // Remover após animação
  setTimeout(() => ripple.remove(), 600);
});

// Adicionar keyframe de ripple dinamicamente
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== ATALHO DE TECLADO: ESC fecha tutoriais abertos =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && currentOpen !== null) {
    toggleTutorial(currentOpen);
  }
});

// ===== LOG DE INICIALIZAÇÃO =====
console.log('%c🎬 CapCut Master carregado!', 'color: #7c5cfc; font-weight: bold; font-size: 14px;');
