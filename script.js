/* SCROLL SUAVE PARA LINKS ÂNCORA */
/* global document, window, navigator, console, confirm */
// Cacheia altura da navbar (evita reflow repetido)
/* global document, window, navigator, console, confirm */

// Cache global (evita leituras repetidas que causam reflow)
let cachedWindowWidth;
let cachedNavbarHeight = null;

// Função cacheada para altura da navbar
function getNavbarHeight() {
    if (cachedNavbarHeight === null) {
        const navbar = document.querySelector('.navbar');
        cachedNavbarHeight = navbar ? navbar.offsetHeight : 60;
    }
    return cachedNavbarHeight;
}

// Atualiza cache no resize (com debounce)
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cachedWindowWidth = window.innerWidth;
        cachedNavbarHeight = null; // força recálculo na próxima chamada
    }, 250);
});

/* SCROLL SUAVE PARA LINKS ÂNCORA */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const navbarHeight = getNavbarHeight();
            const extraSpace = 20;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - extraSpace;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            const mobileNav = document.querySelector('.navbar-desktop-nav');
            if (cachedWindowWidth < 768 && mobileNav) {
                mobileNav.style.display = 'none';
            }
        }
    });
});

/* MENU MOBILE */
const mobileMenuButton = document.querySelector('.navbar-mobile-menu-button');
const mobileNav = document.querySelector('.navbar-desktop-nav');

if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener('click', function() {
        mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
    });
}

class TestimonialsCarousel {
    constructor() {
        this.grid = document.querySelector('.depoimentos-grid');
        this.cards = document.querySelectorAll('.card-testimonial');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevBtn = document.querySelector('.carousel-arrow-prev');
        this.nextBtn = document.querySelector('.carousel-arrow-next');

        this.isMobile = cachedWindowWidth < 768;
        this.currentPage = 0;
        this.cardsPerPage = this.getCardsPerPage();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
        this.cardWidth = this.cards.length > 0 ? this.cards[0].offsetWidth : 0;

        this.init();
    }

    getCardsPerPage() {
        return cachedWindowWidth >= 768 ? 2 : 1;
    }

    init() {
        this.createDots();
        this.updateCarousel();
        this.addEventListeners();

        if (this.isMobile && !document.querySelector('.drag-hint')) {
            const hint = document.createElement('p');
            hint.className = 'drag-hint';
            hint.innerText = 'Arraste para o lado para ver mais depoimentos →';
            this.grid.parentNode.insertBefore(hint, this.dotsContainer);
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        const numDots = this.isMobile ? this.cards.length : this.totalPages;

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
        this.updateDots();
    }

    updateCarousel() {
        if (this.isMobile) {
            this.syncDotsWithScroll();
        } else {
            this.cards.forEach(card => card.classList.remove('active'));
            const startIndex = this.currentPage * this.cardsPerPage;
            const endIndex = startIndex + this.cardsPerPage;

            for (let i = startIndex; i < endIndex && i < this.cards.length; i++) {
                this.cards[i].classList.add('active');
            }
            this.updateDots();
            this.updateArrows();
        }
    }

    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPage);
        });
    }

    updateArrows() {
        if (!this.prevBtn || !this.nextBtn) return;
        this.prevBtn.classList.toggle('disabled', this.currentPage === 0);
        this.nextBtn.classList.toggle('disabled', this.currentPage === this.totalPages - 1);
    }

    goToPage(index) {
        this.currentPage = index;
        if (this.isMobile) {
            this.grid.scrollTo({
                left: index * this.cardWidth,
                behavior: 'smooth'
            });
        } else {
            this.updateCarousel();
        }
    }

    syncDotsWithScroll() {
        if (!this.isMobile || !this.grid) return;

        let scrollTimeout;
        this.grid.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                const scrollLeft = this.grid.scrollLeft;
                const newIndex = Math.round(scrollLeft / this.cardWidth);

                if (newIndex !== this.currentPage) {
                    this.currentPage = newIndex;
                    this.updateDots();
                }
                scrollTimeout = null;
            }, 80);
        }, { passive: true });
    }

    addEventListeners() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => {
            if (this.currentPage > 0) this.goToPage(this.currentPage - 1);
        });

        if (this.nextBtn) this.nextBtn.addEventListener('click', () => {
            if (this.currentPage < (this.isMobile ? this.cards.length - 1 : this.totalPages - 1)) {
                this.goToPage(this.currentPage + 1);
            }
        });

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = cachedWindowWidth < 768;
                const newCardsPerPage = this.getCardsPerPage();

                if (newCardsPerPage !== this.cardsPerPage || wasMobile !== this.isMobile) {
                    this.cardsPerPage = newCardsPerPage;
                    this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
                    this.currentPage = 0;
                    this.cardWidth = this.cards.length > 0 ? this.cards[0].offsetWidth : 0;
                    this.createDots();
                    this.updateCarousel();
                }
            }, 250);
        });
    }
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
    cachedWindowWidth = window.innerWidth; // ← leitura movida para cá (DOM pronto)
    new TestimonialsCarousel();
});

/* Registro do Service Worker */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);

                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 Nova versão disponível! Recarregue a página.');

                            if (confirm('Nova versão disponível! Deseja atualizar?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.error('❌ Erro ao registrar Service Worker:', error);
            });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}