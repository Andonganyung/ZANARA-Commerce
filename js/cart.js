// ZANARA Commerce - Cart Functionality
// Handles cart operations, display, and checkout

document.addEventListener('DOMContentLoaded', function() {
    const cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
    
    // Check if we're on the cart page
    const cartContent = document.getElementById('cartContent');
    if (cartContent) {
        renderCart();
    }

    function renderCart() {
        const emptyCart = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        const cartItems = document.getElementById('cartItems');
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            cartWithItems.style.display = 'none';
        } else {
            emptyCart.style.display = 'none';
            cartWithItems.style.display = 'block';
            
            let html = '';
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                const itemTotal = price * item.quantity;
                subtotal += itemTotal;
                
                html += `
                    <tr>
                        <td>
                            <div class="cart-product">
                                <img src="${item.image}" alt="${item.title}">
                                <div class="cart-product-info">
                                    <h4>${item.title}</h4>
                                    <span>SKU: ZC-${1000 + index}</span>
                                </div>
                            </div>
                        </td>
                        <td>$${price.toFixed(2)}</td>
                        <td>
                            <div class="quantity-selector">
                                <button class="qty-btn minus" data-index="${index}">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="10" class="qty-input" data-index="${index}">
                                <button class="qty-btn plus" data-index="${index}">+</button>
                            </div>
                        </td>
                        <td><strong>$${itemTotal.toFixed(2)}</strong></td>
                        <td>
                            <button class="remove-btn" data-index="${index}">
                                <i class="fas fa-times"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            cartItems.innerHTML = html;
            
            // Calculate totals
            const shipping = subtotal >= 100 ? 0 : 15;
            const tax = subtotal * 0.08;
            const total = subtotal + shipping + tax;
            
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
            
            // Attach event listeners
            attachCartListeners();
        }
        
        updateCartCount();
    }

    function attachCartListeners() {
        // Quantity buttons
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity < 10) {
                    cart[index].quantity++;
                    saveCart();
                    renderCart();
                }
            });
        });

        // Quantity input
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.dataset.index);
                let value = parseInt(this.value);
                if (value < 1) value = 1;
                if (value > 10) value = 10;
                cart[index].quantity = value;
                saveCart();
                renderCart();
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                saveCart();
                renderCart();
                showNotification('Item removed from cart');
            });
        });
    }

    // Clear cart button
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart.length = 0;
                saveCart();
                renderCart();
                showNotification('Cart cleared');
            }
        });
    }

    function saveCart() {
        localStorage.setItem('zanaraCart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = total;
        }
    }

    function showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
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
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
});
