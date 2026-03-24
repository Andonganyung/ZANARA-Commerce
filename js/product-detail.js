// ZANARA Commerce - Product Detail Page Manager
// Handles product detail page rendering and variant selection

class ProductDetailManager {
    constructor() {
        this.product = null;
        this.selectedVariants = {
            color: null,
            size: null
        };
        this.quantity = 1;
        this.init();
    }

    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (!productId) {
            console.error('No product ID in URL');
            return;
        }

        // Wait for productManager to load
        if (window.productManager) {
            await this.loadProduct(productId);
        } else {
            // Wait for productManager to initialize
            setTimeout(() => this.init(), 100);
        }
    }

    async loadProduct(productId) {
        // Wait for products to load
        if (!window.productManager.products.length) {
            setTimeout(() => this.loadProduct(productId), 100);
            return;
        }

        this.product = window.productManager.getProduct(productId);
        
        if (!this.product) {
            console.error('Product not found');
            return;
        }

        this.renderProduct();
        this.setupEventListeners();
    }

    renderProduct() {
        if (!this.product) return;

        // Update page title
        document.title = `${this.product.title} | ZANARA Commerce`;

        // Update breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <a href="index.html">Home</a>
                <span>/</span>
                <a href="shop.html">Shop</a>
                <span>/</span>
                <a href="category.html">${this.product.category}</a>
                <span>/</span>
                <span>${this.product.title}</span>
            `;
        }

        // Update product gallery
        this.renderGallery();

        // Update product info
        this.renderProductInfo();
    }

    renderGallery() {
        const mainImage = document.querySelector('.gallery-main img');
        const thumbsContainer = document.querySelector('.gallery-thumbs');

        if (mainImage) {
            mainImage.src = this.product.images[0];
            mainImage.alt = this.product.title;
        }

        if (thumbsContainer && this.product.images) {
            thumbsContainer.innerHTML = this.product.images.map((img, index) => `
                <img src="${img}" alt="View ${index + 1}" class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
            `).join('');

            // Attach thumb click listeners
            thumbsContainer.querySelectorAll('.thumb').forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImage.src = thumb.src;
                    thumbsContainer.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
        }
    }

    renderProductInfo() {
        // Update badge
        const badgeContainer = document.querySelector('.product-detail-info .product-badge');
        if (badgeContainer && this.product.badge) {
            badgeContainer.textContent = this.product.badge;
            badgeContainer.className = `product-badge ${this.product.badge.toLowerCase().replace(' ', '-')}`;
        } else if (badgeContainer) {
            badgeContainer.style.display = 'none';
        }

        // Update title
        const title = document.querySelector('.product-detail-info h1');
        if (title) title.textContent = this.product.title;

        // Update rating
        const ratingStars = document.querySelector('.product-detail-info .product-rating .stars');
        if (ratingStars) {
            ratingStars.innerHTML = this.renderStars(this.product.rating);
        }
        const ratingText = document.querySelector('.rating-text');
        if (ratingText) {
            ratingText.textContent = `${this.product.rating} (${this.product.reviews} Reviews)`;
        }

        // Update price
        const currentPrice = document.querySelector('.product-price-large .current-price');
        if (currentPrice) {
            currentPrice.textContent = `$${this.product.price.toFixed(2)}`;
        }

        if (this.product.originalPrice) {
            const priceContainer = document.querySelector('.product-price-large');
            const oldPrice = document.createElement('span');
            oldPrice.className = 'old-price';
            oldPrice.textContent = `$${this.product.originalPrice.toFixed(2)}`;
            priceContainer.insertBefore(oldPrice, currentPrice);
        }

        // Update description
        const description = document.querySelector('.product-description p');
        if (description) {
            description.textContent = this.product.description;
        }

        // Update features in description tab
        const featuresContainer = document.querySelector('#description ul');
        if (featuresContainer && this.product.features) {
            featuresContainer.innerHTML = this.product.features.map(f => `<li>${f}</li>`).join('');
        }

        // Render variants
        if (this.product.variants) {
            this.renderVariants();
        }

        // Update meta
        const metaSKU = document.querySelector('.product-meta p:first-child');
        if (metaSKU) {
            metaSKU.innerHTML = `<strong>SKU:</strong> ZC-${this.product.id.toString().padStart(3, '0')}`;
        }
    }

    renderVariants() {
        // Colors
        if (this.product.variants.colors && this.product.variants.colors.length > 0) {
            const colorContainer = document.querySelector('.color-options');
            if (colorContainer) {
                colorContainer.innerHTML = this.product.variants.colors.map(color => `
                    <button class="color-btn" style="background-color: ${color.hex}" 
                            data-color="${color.name}" title="${color.name}"></button>
                `).join('');

                // Select first color by default
                colorContainer.querySelector('.color-btn').classList.add('active');
                this.selectedVariants.color = this.product.variants.colors[0].name;
            }
        }

        // Sizes
        if (this.product.variants.sizes && this.product.variants.sizes.length > 0) {
            const sizeContainer = document.querySelector('.size-options');
            if (sizeContainer) {
                sizeContainer.innerHTML = this.product.variants.sizes.map(size => `
                    <button class="size-btn" data-size="${size}">${size}</button>
                `).join('');

                // Select first size by default
                sizeContainer.querySelector('.size-btn').classList.add('active');
                this.selectedVariants.size = this.product.variants.sizes[0];
            }
        }
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

    setupEventListeners() {
        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedVariants.color = btn.dataset.color;
            });
        });

        // Size selection
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedVariants.size = btn.dataset.size;
            });
        });

        // Quantity buttons
        const qtyInput = document.querySelector('.qty-input');
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');

        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                if (this.quantity > 1) {
                    this.quantity--;
                    qtyInput.value = this.quantity;
                }
            });
        }

        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                if (this.quantity < 10) {
                    this.quantity++;
                    qtyInput.value = this.quantity;
                }
            });
        }

        if (qtyInput) {
            qtyInput.addEventListener('change', (e) => {
                let value = parseInt(e.target.value);
                if (value < 1) value = 1;
                if (value > 10) value = 10;
                this.quantity = value;
                qtyInput.value = value;
            });
        }

        // Add to cart button
        const addToCartBtn = document.querySelector('.product-actions-large .add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (!window.productManager) return;

                // Add to cart with selected variants
                for (let i = 0; i < this.quantity; i++) {
                    window.productManager.addToCart(this.product.id);
                }

                if (window.showNotification) {
                    window.showNotification(`Added ${this.quantity} item(s) to cart!`);
                }
            });
        }

        // Wishlist button
        const wishlistBtn = document.querySelector('.product-actions-large .wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                if (window.wishlistManager) {
                    const added = window.wishlistManager.toggleWishlist(this.product);
                    
                    const icon = wishlistBtn.querySelector('i');
                    if (added) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = '#cc0c39';
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '';
                    }

                    if (window.showNotification) {
                        window.showNotification(added ? 'Added to wishlist!' : 'Removed from wishlist');
                    }
                }
            });
        }

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProductDetailManager();
    });
} else {
    new ProductDetailManager();
}
