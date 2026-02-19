// ========================================
// SCROLL SUAVE PARA LINKS ÂNCORA
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // Ignora se for apenas "#" 
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Calcula a posição desejada
            const navbarHeight = 10;
            const extraSpace = 0;
            const targetPosition = targetSection.offsetTop - navbarHeight - extraSpace;
            
            // Scroll suave
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Fecha o menu mobile se estiver aberto
            const mobileNav = document.querySelector('.navbar-desktop-nav');
            if (window.innerWidth < 768) {
                mobileNav.style.display = 'none';
            }
        }
    });
});

// ========================================
// MENU MOBILE
// ========================================
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

// ========================================
// CARROSSEL DE DEPOIMENTOS
// ========================================

class TestimonialsCarousel {
    constructor() {
        this.cards = document.querySelectorAll('.card-testimonial');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevBtn = document.querySelector('.carousel-arrow-prev');
        this.nextBtn = document.querySelector('.carousel-arrow-next');
        
        this.currentPage = 0;
        this.cardsPerPage = this.getCardsPerPage();
        this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
        
        this.init();
    }
    
    // Detecta quantos cards mostrar por página
    getCardsPerPage() {
        return window.innerWidth >= 768 ? 2 : 1;
    }
    
    // Inicializa o carrossel
    init() {
        this.createDots();
        this.updateCarousel();
        this.addEventListeners();
    }
    
    // Cria os dots dinamicamente
    createDots() {
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir para página ${i + 1}`);
            dot.addEventListener('click', () => this.goToPage(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    // Atualiza a visualização do carrossel
    updateCarousel() {
        // Esconde todos os cards
        this.cards.forEach(card => card.classList.remove('active'));
        
        // Mostra os cards da página atual
        const startIndex = this.currentPage * this.cardsPerPage;
        const endIndex = startIndex + this.cardsPerPage;
        
        for (let i = startIndex; i < endIndex && i < this.cards.length; i++) {
            this.cards[i].classList.add('active');
        }
        
        // Atualiza os dots
        this.updateDots();
        
        // Atualiza as setas
        this.updateArrows();
    }
    
    // Atualiza os dots ativos
    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === this.currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Atualiza visibilidade das setas
    updateArrows() {
        // Seta anterior
        if (this.currentPage === 0) {
            this.prevBtn.classList.add('disabled');
        } else {
            this.prevBtn.classList.remove('disabled');
        }
        
        // Seta próxima
        if (this.currentPage === this.totalPages - 1) {
            this.nextBtn.classList.add('disabled');
        } else {
            this.nextBtn.classList.remove('disabled');
        }
    }
    
    // Navega para página anterior
    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updateCarousel();
        }
    }
    
    // Navega para próxima página
    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.updateCarousel();
        }
    }
    
    // Vai para uma página específica
    goToPage(pageIndex) {
        this.currentPage = pageIndex;
        this.updateCarousel();
    }
    
    // Adiciona event listeners
    addEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Suporte para teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });
        
        // Reage ao resize da janela
        window.addEventListener('resize', () => {
            const newCardsPerPage = this.getCardsPerPage();
            
            // Se mudou de mobile para desktop ou vice-versa
            if (newCardsPerPage !== this.cardsPerPage) {
                this.cardsPerPage = newCardsPerPage;
                this.totalPages = Math.ceil(this.cards.length / this.cardsPerPage);
                this.currentPage = 0; // Volta para o início
                this.createDots();
                this.updateCarousel();
            }
        });
    }
}

// Inicializa o carrossel quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TestimonialsCarousel();
    });
} else {
    new TestimonialsCarousel();
}

/*/ Registro do Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration.scope);
                
                // Verifica atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 Nova versão disponível! Recarregue a página.');
                            
                            // Opcional: Notificar usuário
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
    });*/
    
    /*/ Recarrega quando novo SW assume controle
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}*/