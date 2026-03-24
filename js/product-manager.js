// ZANARA Commerce - Product Manager
// Handles dynamic product loading, search, filtering, and pagination

class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.brands = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            category: null,
            subcategory: null,
            brand: [],
            priceMin: 0,
            priceMax: 5000,
            rating: 0,
            search: '',
            sort: 'default'
        };
    }

    async init() {
        await this.loadProducts();
        this.detectPageCategory();
        this.setupEventListeners();
        this.applyFilters();
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            this.products = data.products;
            this.categories = data.categories;
            this.brands = data.brands;
            this.filteredProducts = [...this.products];
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    detectPageCategory() {
        // Auto-detect category based on current page URL
        const path = window.location.pathname;
        const fileName = path.substring(path.lastIndexOf('/') + 1);
        
        if (fileName.includes('african-food')) {
            this.filters.category = 'African Food';
        } else if (fileName.includes('african-fashion')) {
            this.filters.category = 'African Fashion';
        } else if (fileName.includes('african-traditional-designs')) {
            this.filters.category = 'African Traditional Designs';
        } else if (fileName.includes('african-beauty')) {
            this.filters.category = 'African Beauty';
        }
    }

    setupEventListeners() {
        // Search
        const searchInputs = document.querySelectorAll('.header-search input, #headerSearchInput');
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        });

        // Sort dropdown
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.applyFilters();
            });
        }

        // Price range slider
        const priceRange = document.querySelector('.price-range');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.filters.priceMax = parseInt(e.target.value);
                document.querySelector('.price-inputs span:last-child').textContent = `$${e.target.value}`;
                this.applyFilters();
            });
        }

        // Brand checkboxes
        document.querySelectorAll('.checkbox-list input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const brand = e.target.parentElement.textContent.trim();
                if (e.target.checked) {
                    this.filters.brand.push(brand);
                } else {
                    this.filters.brand = this.filters.brand.filter(b => b !== brand);
                }
                this.applyFilters();
            });
        });

        // Category filters
        document.querySelectorAll('.filter-list a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.textContent.split('(')[0].trim();
                this.filters.category = category;
                this.applyFilters();
            });
        });

        // Pagination
        document.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.textContent);
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.renderProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    handleSearch(query) {
        this.filters.search = query.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        let results = [...this.products];

        // Search filter
        if (this.filters.search) {
            results = results.filter(p => 
                p.title.toLowerCase().includes(this.filters.search) ||
                p.description.toLowerCase().includes(this.filters.search) ||
                p.category.toLowerCase().includes(this.filters.search)
            );
        }

        // Category filter
        if (this.filters.category) {
            results = results.filter(p => p.category === this.filters.category);
        }

        // Brand filter
        if (this.filters.brand.length > 0) {
            results = results.filter(p => this.filters.brand.includes(p.brand));
        }

        // Price filter
        results = results.filter(p => 
            p.price >= this.filters.priceMin && p.price <= this.filters.priceMax
        );

        // Rating filter
        if (this.filters.rating > 0) {
            results = results.filter(p => p.rating >= this.filters.rating);
        }

        // Sort
        switch (this.filters.sort) {
            case 'Sort by Popularity':
                results.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'Sort by Rating':
                results.sort((a, b) => b.rating - a.rating);
                break;
            case 'Sort by Latest':
                results.sort((a, b) => b.id - a.id);
                break;
            case 'Price: Low to High':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'Price: High to Low':
                results.sort((a, b) => b.price - a.price);
                break;
        }

        this.filteredProducts = results;
        this.renderProducts();
        this.updateResultsCount();
    }

    renderProducts() {
        const container = document.querySelector('.products-grid');
        if (!container) return;

        const start = (this.currentPage - 1) * this.productsPerPage;
        const end = start + this.productsPerPage;
        const pageProducts = this.filteredProducts.slice(start, end);

        if (pageProducts.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:60px 20px;"><h3>No products found</h3><p style="color:var(--text-muted); margin-top:10px;">Try adjusting your filters or search terms.</p></div>';
            return;
        }

        container.innerHTML = pageProducts.map(product => this.createProductCard(product)).join('');
        
        // Re-attach cart listeners
        this.attachCartListeners();
        this.renderPagination();
    }

    createProductCard(product) {
        const badgeHTML = product.badge ? `<span class="product-badge ${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : '';
        const discountHTML = product.discount > 0 ? `<span class="product-badge sale">-${product.discount}%</span>` : '';
        const oldPriceHTML = product.originalPrice ? `<span class="old-price">$${product.originalPrice.toFixed(2)}</span>` : '';
        
        const stars = this.renderStars(product.rating);

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    ${badgeHTML}${discountHTML}
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-actions">
                        <button class="action-btn wishlist-btn"><i class="far fa-heart"></i></button>
                        <button class="action-btn quickview-btn" data-id="${product.id}"><i class="far fa-eye"></i></button>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
                    <div class="product-rating">
                        ${stars}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        ${oldPriceHTML}
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="product-delivery"><span class="free">FREE Delivery</span> ${this.getDeliveryDate()}</div>
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

    getDeliveryDate() {
        const date = new Date();
        date.setDate(date.getDate() + 3); // 3 days from now
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    updateResultsCount() {
        const toolbar = document.querySelector('.toolbar-left span');
        if (toolbar) {
            const start = (this.currentPage - 1) * this.productsPerPage + 1;
            const end = Math.min(start + this.productsPerPage - 1, this.filteredProducts.length);
            toolbar.textContent = `Showing ${start}-${end} of ${this.filteredProducts.length} results`;
        }
    }

    renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        let html = '';

        // Previous button
        if (this.currentPage > 1) {
            html += `<a href="#" class="page-link" data-page="${this.currentPage - 1}"><i class="fas fa-arrow-left"></i></a>`;
        }

        // Page numbers
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            const active = i === this.currentPage ? 'active' : '';
            html += `<a href="#" class="page-link ${active}" data-page="${i}">${i}</a>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            html += `<a href="#" class="page-link" data-page="${this.currentPage + 1}"><i class="fas fa-arrow-right"></i></a>`;
        }

        paginationContainer.innerHTML = html;

        // Re-attach pagination listeners
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.currentTarget.dataset.page);
                if (!isNaN(page)) {
                    this.currentPage = page;
                    this.renderProducts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    attachCartListeners() {
        // Add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(e.target.dataset.id);
                this.addToCart(productId);
            });
        });

        // Wishlist
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const icon = e.currentTarget.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.style.color = '#cc0c39';
                    this.showNotification('Added to wishlist!');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    icon.style.color = '';
                    this.showNotification('Removed from wishlist');
                }
            });
        });

        // Quick view
        document.querySelectorAll('.quickview-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(e.currentTarget.dataset.id);
                this.showQuickView(productId);
            });
        });
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
        const existing = cart.find(item => item.id === productId);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: `$${product.price.toFixed(2)}`,
                image: product.image,
                quantity: 1
            });
        }

        localStorage.setItem('zanaraCart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification('Added to cart!');

        // Visual feedback on button
        const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Added!';
            btn.style.background = '#067d62';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('#cartCount, .cart-count').forEach(el => {
            el.textContent = total;
        });
    }

    showNotification(message) {
        if (window.showNotification) {
            window.showNotification(message);
        }
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-overlay"></div>
            <div class="quick-view-content">
                <button class="quick-view-close"><i class="fas fa-times"></i></button>
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="quick-view-info">
                        <span class="product-category">${product.category}</span>
                        <h3>${product.title}</h3>
                        <div class="product-rating">
                            ${this.renderStars(product.rating)}
                            <span>(${product.reviews})</span>
                        </div>
                        <div class="product-price" style="margin:20px 0;">
                            ${product.originalPrice ? `<span class="old-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                        </div>
                        <p style="color:var(--text-secondary);line-height:1.7;margin-bottom:20px;">${product.description}</p>
                        <button class="btn btn-cta btn-block" onclick="productManager.addToCart(${product.id});document.querySelector('.quick-view-modal').remove();">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-outline btn-block" style="margin-top:10px;">View Full Details</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        // Close handlers
        modal.querySelector('.quick-view-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.quick-view-overlay').addEventListener('click', () => modal.remove());
    }

    getProduct(id) {
        return this.products.find(p => p.id === parseInt(id));
    }
}

// Initialize on page load
const productManager = new ProductManager();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => productManager.init());
} else {
    productManager.init();
}

// Make available globally
window.productManager = productManager;
