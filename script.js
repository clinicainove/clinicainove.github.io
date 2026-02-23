/* global document, window, navigator, console, confirm */

/* SCROLL SUAVE PARA LINKS ÂNCORA */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = anchor.getAttribute('href');

        /* Ignora se for apenas "#" */
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            /* Calcula a posição desejada considerando a navbar fixa */
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 60;
            const extraSpace = 20; // espaço extra para não ficar colado
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - extraSpace;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            /* Fecha o menu mobile se estiver aberto */
            const mobileNav = document.querySelector('.navbar-desktop-nav');
            if (window.innerWidth < 768 && mobileNav) {
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
        if (mobileNav.style.display === 'flex') {
            mobileNav.style.display = 'none';
        } else {
            mobileNav.style.display = 'flex';
        }
    });
}

/* CARROSSEL DE DEPOIMENTOS ADAPTADO (MOBILE + DESKTOP) */
class TestimonialsCarousel {
    constructor() {
        this.grid = document.querySelector('.depoimentos-grid');
        this.cards = document.querySelectorAll('.card-testimonial');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevBtn = document.querySelector('.carousel-arrow-prev');
        this.nextBtn = document.querySelector('.carousel-arrow-next');

        this.isMobile = window.innerWidth < 768;
        this.currentPage = 0;
        this.cardsPerPage = this.getCardsPerPage();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);

        this.init();
    }

    getCardsPerPage() {
        return window.innerWidth >= 768 ? 2 : 1;
    }

    init() {
        this.createDots();
        this.updateCarousel();
        this.addEventListeners();

        /* Se for mobile, adiciona a mensagem de arraste se não existir */
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

        /* No mobile, 1 dot por card. No desktop, 1 dot por página (2 cards). */
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
            /* No mobile usamos Scroll Snap do CSS, apenas sincronizamos os dots */
            this.syncDotsWithScroll();
        } else {
            /* No desktop usamos a lógica de classes active */
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
            const cardWidth = this.cards[0].offsetWidth;
            this.grid.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        } else {
            this.updateCarousel();
        }
    }

    syncDotsWithScroll() {
        if (!this.isMobile || !this.grid) return;

        this.grid.addEventListener('scroll', () => {
            const scrollLeft = this.grid.scrollLeft;
            const cardWidth = this.cards[0].offsetWidth;
            const newIndex = Math.round(scrollLeft / cardWidth);

            if (newIndex !== this.currentPage) {
                this.currentPage = newIndex;
                this.updateDots();
            }
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

        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth < 768;
            const newCardsPerPage = this.getCardsPerPage();

            if (newCardsPerPage !== this.cardsPerPage || wasMobile !== this.isMobile) {
                this.cardsPerPage = newCardsPerPage;
                this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
                this.currentPage = 0;
                this.createDots();
                this.updateCarousel();
            }
        });
    }
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsCarousel();
});

/* Registro do Service Worker */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);

                /* Verifica atualizações */
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 Nova versão disponível! Recarregue a página.');

                            /* Opcional: Notificar usuário */
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

    /* Recarrega quando novo SW assume controle */
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}