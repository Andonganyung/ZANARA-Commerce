// ZANARA Commerce - Forms Handler
// Handles contact form, newsletter, and checkout validation

class FormsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupNewsletterForms();
        this.setupCheckoutForm();
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form form, .contact-form-wrapper form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    setupNewsletterForms() {
        document.querySelectorAll('.newsletter-form, .coming-soon-form').forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        });
    }

    setupCheckoutForm() {
        const checkoutForm = document.querySelector('.checkout-form form, #checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckoutSubmit(e));
        }

        // Payment option selection
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                option.querySelector('input[type="radio"]').checked = true;
            });
        });
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate
        if (!this.validateEmail(data.email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (!data.name || data.name.length < 2) {
            this.showError('Please enter your name');
            return;
        }

        if (!data.message || data.message.length < 10) {
            this.showError('Please enter a message (at least 10 characters)');
            return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual endpoint)
        try {
            await this.simulateApiCall(data, 'contact');
            
            // Success
            this.showSuccess('Thank you! Your message has been sent. We\'ll get back to you soon.');
            form.reset();
        } catch (error) {
            this.showError('Failed to send message. Please try again or email us directly.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        // Validate
        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual newsletter service)
        try {
            await this.simulateApiCall({ email }, 'newsletter');
            
            // Save to localStorage as backup
            this.saveNewsletterSubscriber(email);
            
            // Success
            this.showSuccess('Thank you for subscribing! Check your email for confirmation.');
            form.reset();
        } catch (error) {
            this.showError('Subscription failed. Please try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate required fields
        const requiredFields = ['email', 'firstName', 'lastName', 'address', 'city', 'country', 'zipCode'];
        const errors = [];

        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                errors.push(field);
            }
        }

        if (!this.validateEmail(data.email)) {
            errors.push('email-invalid');
        }

        if (errors.length > 0) {
            this.showError('Please fill in all required fields correctly');
            // Highlight error fields
            errors.forEach(field => {
                const input = form.querySelector(`[name="${field}"]`);
                if (input) {
                    input.style.borderColor = '#cc0c39';
                    input.addEventListener('input', () => {
                        input.style.borderColor = '';
                    }, { once: true });
                }
            });
            return;
        }

        // Check payment method selected
        const paymentMethod = form.querySelector('input[name="payment"]:checked');
        if (!paymentMethod) {
            this.showError('Please select a payment method');
            return;
        }

        // Show loading
        const submitBtn = form.querySelector('button[type="submit"], .place-order-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate payment processing
        try {
            await this.simulateApiCall({ ...data, payment: paymentMethod.value }, 'checkout');
            
            // Save order to localStorage
            this.saveOrder(data);
            
            // Redirect to success page or show confirmation
            this.showSuccess('Order placed successfully! Redirecting to confirmation...');
            
            setTimeout(() => {
                // Clear cart
                localStorage.removeItem('zanaraCart');
                
                // Redirect (create order-confirmation.html or use existing page)
                window.location.href = 'coming-soon.html?order=success';
            }, 2000);
        } catch (error) {
            this.showError('Payment failed. Please check your details and try again.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    async simulateApiCall(data, type) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log to console (in production, send to actual API)
        console.log(`${type} submission:`, data);
        
        // Simulate 90% success rate
        if (Math.random() < 0.9) {
            return { success: true };
        } else {
            throw new Error('API Error');
        }
    }

    saveNewsletterSubscriber(email) {
        let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
        }
    }

    saveOrder(orderData) {
        const cart = JSON.parse(localStorage.getItem('zanaraCart')) || [];
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            customer: {
                name: `${orderData.firstName} ${orderData.lastName}`,
                email: orderData.email,
                phone: orderData.phone || ''
            },
            shipping: {
                address: orderData.address,
                city: orderData.city,
                state: orderData.state || '',
                country: orderData.country,
                zipCode: orderData.zipCode
            },
            items: cart,
            total: this.calculateTotal(cart),
            status: 'pending'
        };

        let orders = JSON.parse(localStorage.getItem('zanaraOrders')) || [];
        orders.push(order);
        localStorage.setItem('zanaraOrders', JSON.stringify(orders));
    }

    calculateTotal(cart) {
        const subtotal = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            return sum + (price * item.quantity);
        }, 0);
        const shipping = subtotal >= 100 ? 0 : 15;
        const tax = subtotal * 0.08;
        return subtotal + shipping + tax;
    }

    showSuccess(message) {
        if (window.showNotification) {
            window.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (window.showNotification) {
            window.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new FormsManager();
    });
} else {
    new FormsManager();
}
