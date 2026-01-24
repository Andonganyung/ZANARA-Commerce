// ZANARA Commerce - Main JavaScript
// Modern Luxury E-Commerce with Rose Gold & Navy Theme
// Fully Optimized for All Devices

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // MOBILE NAVIGATION
    // =============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Handle dropdown on mobile
        const dropdowns = navMenu.querySelectorAll('.has-dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close menu on link click
        navMenu.querySelectorAll('a:not(.has-dropdown > a)').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =============================================
    // NAVBAR SCROLL EFFECT
    // =============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.scrollY;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // =============================================
    // SEARCH OVERLAY
    // =============================================
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');

    if (searchToggle && searchOverlay) {
        searchToggle.addEventListener('click', function() {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const searchInput = searchOverlay.querySelector('input');
                if (searchInput) searchInput.focus();
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

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // =============================================
    // BACK TO TOP BUTTON
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
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // CART FUNCTIONALITY
    // =============================================
    let cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
    updateCartCount();

    // Add to Cart buttons
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
            
            // Button animation
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#4caf50';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
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
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = total;
            
            // Add bounce animation
            cartCount.style.animation = 'none';
            cartCount.offsetHeight;
            cartCount.style.animation = 'bounce 0.5s ease';
        }
    }

    // Add bounce animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
    `;
    document.head.appendChild(style);

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
                icon.style.color = '#e91e63';
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
    // NOTIFICATION SYSTEM
    // =============================================
    function showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: linear-gradient(135deg, #1a2744 0%, #2d3f5e 100%);
            color: white;
            padding: 18px 35px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 10px 40px rgba(26, 39, 68, 0.4);
            z-index: 9999;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            font-size: 15px;
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Make showNotification globally available
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation to elements
    const animateElements = document.querySelectorAll(
        '.product-card, .category-card, .feature-item, .stat-item, .banner-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s, 
                              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
        observer.observe(el);
    });

    // Add animation class
    const animStyle = document.createElement('style');
    animStyle.textContent = `
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animStyle);

    // =============================================
    // COUNTER ANIMATION FOR STATS
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number, .hero-stat-number');
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
                const duration = 2000;
                const increment = number / (duration / 16);
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        current = number;
                        clearInterval(timer);
                    }
                    
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
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =============================================
    // TOUCH DEVICE DETECTION
    // =============================================
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }

    // =============================================
    // LAZY LOADING IMAGES
    // =============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // =============================================
    // PREVENT ZOOM ON DOUBLE TAP (iOS)
    // =============================================
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // =============================================
    // HANDLE ORIENTATION CHANGE
    // =============================================
    window.addEventListener('orientationchange', function() {
        // Close mobile menu on orientation change
        if (navMenu) {
            navMenu.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // =============================================
    // PRODUCT IMAGE HOVER EFFECT (Desktop)
    // =============================================
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.product-image').forEach(imageContainer => {
            imageContainer.addEventListener('mousemove', function(e) {
                const img = this.querySelector('img');
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            });
        });
    }

    console.log('ZANARA Commerce initialized successfully');
});
