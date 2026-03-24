// ZANARA Commerce - Wishlist Manager
// Handles wishlist persistence and display

class WishlistManager {
    constructor() {
        this.wishlist = this.loadWishlist();
        this.init();
    }

    init() {
        this.updateWishlistUI();
        this.setupEventListeners();
    }

    loadWishlist() {
        try {
            return JSON.parse(localStorage.getItem('zanaraWishlist')) || [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            return [];
        }
    }

    saveWishlist() {
        localStorage.setItem('zanaraWishlist', JSON.stringify(this.wishlist));
    }

    isInWishlist(productId) {
        return this.wishlist.some(item => item.id === productId);
    }

    addToWishlist(product) {
        if (!this.isInWishlist(product.id)) {
            this.wishlist.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                category: product.category,
                rating: product.rating,
                reviews: product.reviews,
                addedAt: new Date().toISOString()
            });
            this.saveWishlist();
            this.updateWishlistUI();
            return true;
        }
        return false;
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistUI();
    }

    toggleWishlist(product) {
        if (this.isInWishlist(product.id)) {
            this.removeFromWishlist(product.id);
            return false;
        } else {
            this.addToWishlist(product);
            return true;
        }
    }

    updateWishlistUI() {
        // Update wishlist count badge
        const badges = document.querySelectorAll('.wishlist-badge, .wishlist-count');
        badges.forEach(badge => {
            badge.textContent = this.wishlist.length;
        });

        // Update heart icons for products in wishlist
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productId = parseInt(productCard.dataset.id);
            const icon = btn.querySelector('i');
            
            if (this.isInWishlist(productId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#cc0c39';
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
            }
        });
    }

    setupEventListeners() {
        // Handle wishlist button clicks
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.wishlist-btn');
            if (!btn) return;

            e.preventDefault();
            e.stopPropagation();

            const productCard = btn.closest('.product-card');
            if (!productCard) return;

            const productId = parseInt(productCard.dataset.id);
            
            // Get product from productManager if available
            if (window.productManager) {
                const product = window.productManager.getProduct(productId);
                if (product) {
                    const added = this.toggleWishlist(product);
                    if (window.showNotification) {
                        window.showNotification(added ? 'Added to wishlist!' : 'Removed from wishlist');
                    }
                }
            }
        });
    }

    renderWishlistPage() {
        const container = document.getElementById('wishlistItems');
        if (!container) return;

        if (this.wishlist.length === 0) {
            document.getElementById('emptyWishlist').style.display = 'block';
            document.getElementById('wishlistWithItems').style.display = 'none';
            return;
        }

        document.getElementById('emptyWishlist').style.display = 'none';
        document.getElementById('wishlistWithItems').style.display = 'block';

        container.innerHTML = this.wishlist.map(item => this.createWishlistCard(item)).join('');
        
        // Attach remove and move to cart listeners
        this.attachWishlistListeners();
    }

    createWishlistCard(item) {
        const stars = this.renderStars(item.rating);
        
        return `
            <div class="product-card" data-id="${item.id}">
                <div class="product-image">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="product-actions">
                        <button class="action-btn remove-wishlist-btn" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${item.category}</span>
                    <h3 class="product-title"><a href="product.html?id=${item.id}">${item.title}</a></h3>
                    <div class="product-rating">
                        ${stars}
                        <span>(${item.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart-btn btn btn-primary btn-block" data-id="${item.id}" style="position:static;opacity:1;transform:none;margin-top:12px;">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        let html = '';
        
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        if (hasHalf) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = fullStars + (hasHalf ? 1 : 0); i < 5; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        return html;
    }

    attachWishlistListeners() {
        // Remove from wishlist
        document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(e.currentTarget.dataset.id);
                this.removeFromWishlist(productId);
                this.renderWishlistPage();
                if (window.showNotification) {
                    window.showNotification('Removed from wishlist');
                }
            });
        });

        // Add to cart from wishlist
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(e.currentTarget.dataset.id);
                
                if (window.productManager) {
                    const product = window.productManager.getProduct(productId);
                    if (product) {
                        window.productManager.addToCart(productId);
                        
                        // Optionally remove from wishlist after adding to cart
                        // this.removeFromWishlist(productId);
                        // this.renderWishlistPage();
                    }
                }
            });
        });
    }

    clearWishlist() {
        if (confirm('Are you sure you want to clear your wishlist?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.updateWishlistUI();
            if (window.location.pathname.includes('wishlist')) {
                this.renderWishlistPage();
            }
            if (window.showNotification) {
                window.showNotification('Wishlist cleared');
            }
        }
    }
}

// Initialize
const wishlistManager = new WishlistManager();

// Render wishlist page if we're on it
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.pathname.includes('wishlist')) {
            wishlistManager.renderWishlistPage();
        }
    });
} else {
    if (window.location.pathname.includes('wishlist')) {
        wishlistManager.renderWishlistPage();
    }
}

// Make available globally
window.wishlistManager = wishlistManager;
