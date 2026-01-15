// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuBtn.classList.toggle('active');
        
        // Anima o hamburger para X
        const spans = menuBtn.querySelectorAll('span');
        if (menu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Fecha menu ao clicar em link
    const navLinks = menu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuBtn.classList.remove('active');
            
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ============================================
// DARK MODE TOGGLE
// ============================================
const darkModeBtn = document.getElementById('dark-mode-btn');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Verifica preferência salva ou do sistema
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        document.body.classList.add('dark-mode');
    }
}

// Toggle dark mode
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Salva preferência
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Inicializa tema ao carregar
initTheme();

// ============================================
// SCROLL EFFECTS
// ============================================

// Header transparente no topo
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Adiciona sombra ao header ao fazer scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Esconde header ao fazer scroll para baixo (opcional)
    // Descomenta se quiseres este efeito
    /*
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    */
    
    lastScroll = currentScroll;
});

// ============================================
// ANIMAÇÕES AO SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Anima barras de skill
            if (entry.target.classList.contains('skill-card')) {
                const skillBar = entry.target.querySelector('.skill-bar');
                if (skillBar) {
                    skillBar.style.width = skillBar.style.getPropertyValue('--skill-level');
                }
            }
            
            // Para de observar após animar
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observa elementos para animar
const animateElements = document.querySelectorAll('.skill-card, .projeto-card, .contacto-card, .stat-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// ACTIVE NAV LINK (baseado na seção visível)
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// SMOOTH SCROLL POLYFILL (para navegadores antigos)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// TYPING EFFECT NO HERO (Opcional)
// ============================================
const heroSubtitle = document.querySelector('.hero-subtitle');

if (heroSubtitle) {
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let i = 0;
    
    // Aguarda 1 segundo antes de começar
    setTimeout(() => {
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }, 1000);
}

// ============================================
// ANIMAÇÃO DE NÚMEROS (Stats)
// ============================================
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Anima stats quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const finalValue = statNumber.textContent;
                const numericValue = parseInt(finalValue);
                
                if (!isNaN(numericValue)) {
                    statNumber.textContent = '0';
                    animateNumber(statNumber, 0, numericValue, 2000);
                    statNumber.dataset.animated = 'true';
                }
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// LOADING STATE (quando página carrega)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading state após animações iniciais
    setTimeout(() => {
        document.body.style.overflow = 'visible';
    }, 500);
});

// ============================================
// FORMULÁRIO DE CONTACTO (se adicionar no futuro)
// ============================================
// Placeholder para quando adicionar formulário
/*
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Lógica de envio aqui
        console.log('Formulário enviado!');
    });
}
*/

// ============================================
// COPY EMAIL TO CLIPBOARD
// ============================================
const emailCard = document.querySelector('a[href^="mailto:"]');
if (emailCard) {
    // Adiciona tooltip de "copiado" (opcional)
    emailCard.addEventListener('click', (e) => {
        // Ainda permite o comportamento normal do mailto
        const email = emailCard.href.replace('mailto:', '');
        
        // Copia para clipboard (funcionalidade extra)
        navigator.clipboard.writeText(email).then(() => {
            // Feedback visual (pode adicionar um toast notification)
            console.log('Email copiado!');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
        });
    });
}

// ============================================
// PERFORMANCE: Lazy Loading de Imagens
// ============================================
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// EASTER EGG: Konami Code (opcional, divertido!)
// ============================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg ativado!
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Adiciona animação rainbow (para o easter egg)
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ============================================
// CONSOLE MESSAGE (Branding)
// ============================================
console.log(
    '%c👋 Olá, Developer! ',
    'color: #3b82f6; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cGostou do meu portfólio? Vamos trabalhar juntos! 🚀',
    'color: #10b981; font-size: 14px;'
);
console.log(
    '%cContacto: matosamuel2392@gmail.com',
    'color: #6b7280; font-size: 12px;'
);

// ============================================
// FIM DO SCRIPT
// ============================================