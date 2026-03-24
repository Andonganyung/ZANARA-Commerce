// ZANARA Commerce - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // HERO SLIDER
    // =============================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        if (heroSlides.length === 0) return;
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        currentSlide = (index + heroSlides.length) % heroSlides.length;
        heroSlides[currentSlide].classList.add('active');
        if (heroDots[currentSlide]) heroDots[currentSlide].classList.add('active');
    }
    
    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }
    
    function startAutoSlide() { slideInterval = setInterval(nextSlide, 5000); }
    function resetAutoSlide() { clearInterval(slideInterval); startAutoSlide(); }
    
    if (heroSlides.length > 1) {
        startAutoSlide();
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
        });
    }

    // =============================================
    // SIDEBAR MENU
    // =============================================
    const navAllBtn = document.getElementById('navAllBtn');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    function openSidebar() {
        if (sidebarMenu) sidebarMenu.classList.add('active');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (sidebarMenu) sidebarMenu.classList.remove('active');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navAllBtn) navAllBtn.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // =============================================
    // MOBILE NAVIGATION
    // =============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const headerNav = document.getElementById('headerNav');

    if (mobileToggle && headerNav) {
        mobileToggle.addEventListener('click', function() {
            if (headerNav.classList.contains('mobile-active')) {
                headerNav.classList.remove('mobile-active');
                document.body.style.overflow = '';
            } else {
                headerNav.classList.add('mobile-active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Legacy mobile nav support
    const navMenu = document.getElementById('navMenu');
    if (mobileToggle && navMenu && !headerNav) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // =============================================
    // BACK TO TOP
    // =============================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // SEARCH OVERLAY (Legacy pages)
    // =============================================
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const input = searchOverlay.querySelector('input');
                if (input) input.focus();
            }, 300);
        });
        if (searchClose) {
            searchClose.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =============================================
    // CART FUNCTIONALITY
    // =============================================
    let cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
    updateCartCount();

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.product-card');
            if (!card) return;
            
            const titleEl = card.querySelector('.product-title a');
            const priceEl = card.querySelector('.current-price');
            const imageEl = card.querySelector('.product-image img');
            
            if (!titleEl || !priceEl || !imageEl) return;
            
            const product = {
                id: Date.now(),
                title: titleEl.textContent.trim(),
                price: priceEl.textContent.trim(),
                image: imageEl.src,
                quantity: 1
            };
            
            addToCart(product);
            
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#067d62';
            this.style.color = '#fff';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.color = '';
            }, 1500);
        });
    });

    function addToCart(product) {
        const existing = cart.find(item => item.title === product.title);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem('zanaraCart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Added to cart!');
    }

    function updateCartCount() {
        const counts = document.querySelectorAll('#cartCount, .cart-count');
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        counts.forEach(el => { el.textContent = total; });
    }

    // =============================================
    // WISHLIST FUNCTIONALITY
    // =============================================
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#cc0c39';
                showNotification('Added to wishlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showNotification('Removed from wishlist');
            }
        });
    });

    // =============================================
    // NOTIFICATION
    // =============================================
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        notification.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        notification.style.cssText = `
            position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);
            background:#1a2744;color:white;padding:14px 28px;border-radius:8px;
            display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);
            z-index:9999;transition:transform 0.3s ease;font-size:14px;font-weight:500;
        `;
        document.body.appendChild(notification);
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(80px)';
            setTimeout(() => notification.remove(), 300);
        }, 2500);
    }

    window.showNotification = showNotification;

    // =============================================
    // NEWSLETTER FORM
    // =============================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (email) {
                showNotification('Thank you for subscribing!');
                this.reset();
            }
        });
    }

    // =============================================
    // SCROLL ANIMATIONS
    // =============================================
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.product-card, .cat-card, .feature-item, .stat-item, .promo-card').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
        observer.observe(el);
    });

    const animStyle = document.createElement('style');
    animStyle.textContent = `.fade-in-visible{opacity:1!important;transform:translateY(0)!important;}`;
    document.head.appendChild(animStyle);

    // =============================================
    // COUNTER ANIMATION
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.innerText;
                const hasPlus = text.includes('+');
                const hasK = text.includes('K');
                const hasM = text.includes('M');
                let number = parseFloat(text.replace(/[^0-9.]/g, ''));
                let current = 0;
                const increment = number / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) { current = number; clearInterval(timer); }
                    let display = Math.floor(current);
                    if (hasK) display += 'K';
                    if (hasM) display += 'M';
                    if (hasPlus) display += '+';
                    target.innerText = display;
                }, 16);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    // =============================================
    // TOUCH DEVICE
    // =============================================
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }

    // =============================================
    // ESCAPE KEY
    // =============================================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSidebar();
            if (searchOverlay && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});
