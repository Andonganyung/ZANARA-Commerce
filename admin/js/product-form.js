// Product Form Logic - Add/Edit Products
let uploadedImages = [];
let editingProductId = null;

auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    loadCategories();
    checkEditMode();
});

document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await auth.signOut();
});

// Check if editing existing product
async function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    editingProductId = urlParams.get('id');
    
    if (editingProductId) {
        document.querySelector('.admin-header h1').textContent = 'Edit Product';
        await loadProductData(editingProductId);
    }
}

// Load categories
async function loadCategories() {
    try {
        const snapshot = await db.collection('categories').get();
        const categories = snapshot.docs.map(doc => doc.data().name);
        const select = document.getElementById('category');
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load product data for editing
async function loadProductData(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        if (!doc.exists) {
            alert('Product not found');
            window.location.href = 'products.html';
            return;
        }
        
        const product = doc.data();
        
        // Fill form fields
        document.getElementById('title').value = product.title || '';
        document.getElementById('brand').value = product.brand || '';
        document.getElementById('category').value = product.category || '';
        document.getElementById('subcategory').value = product.subcategory || '';
        document.getElementById('description').value = product.description || '';
        document.getElementById('price').value = product.price || '';
        document.getElementById('originalPrice').value = product.originalPrice || '';
        document.getElementById('inStock').value = product.inStock ? 'true' : 'false';
        document.getElementById('status').value = product.status || 'published';
        document.getElementById('featured').checked = product.featured || false;
        
        // Show existing images
        if (product.images && product.images.length > 0) {
            uploadedImages = product.images;
            renderImagePreviews();
        }
        
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Error loading product data');
    }
}

// Image upload handler
document.getElementById('imageInput').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading images...';
    
    try {
        for (const file of files) {
            const url = await uploadImage(file);
            uploadedImages.push(url);
        }
        renderImagePreviews();
    } catch (error) {
        alert('Error uploading images: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
        e.target.value = ''; // Reset input
    }
});

// Upload image to Firebase Storage
async function uploadImage(file) {
    const fileName = `products/${Date.now()}_${file.name}`;
    const storageRef = storage.ref(fileName);
    
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
}

// Render image previews
function renderImagePreviews() {
    const container = document.getElementById('imagePreview');
    
    container.innerHTML = uploadedImages.map((url, index) => `
        <div class="image-preview-item">
            <img src="${url}" alt="Product image ${index + 1}">
            <button type="button" class="remove-image" onclick="removeImage(${index})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Remove image
function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImagePreviews();
}

// Form submission
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
        alert('Please upload at least one product image');
        return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const errorAlert = document.getElementById('errorAlert');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    errorAlert.style.display = 'none';
    
    try {
        const productData = {
            title: document.getElementById('title').value.trim(),
            brand: document.getElementById('brand').value.trim() || null,
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value.trim() || null,
            description: document.getElementById('description').value.trim(),
            price: parseFloat(document.getElementById('price').value),
            originalPrice: document.getElementById('originalPrice').value ? 
                          parseFloat(document.getElementById('originalPrice').value) : null,
            images: uploadedImages,
            image: uploadedImages[0], // Primary image
            inStock: document.getElementById('inStock').value === 'true',
            status: document.getElementById('status').value,
            featured: document.getElementById('featured').checked,
            rating: 0,
            reviews: 0,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Calculate discount if original price exists
        if (productData.originalPrice && productData.originalPrice > productData.price) {
            productData.discount = Math.round(
                ((productData.originalPrice - productData.price) / productData.originalPrice) * 100
            );
        } else {
            productData.discount = 0;
        }
        
        if (editingProductId) {
            // Update existing product
            await db.collection('products').doc(editingProductId).update(productData);
            alert('Product updated successfully!');
        } else {
            // Create new product
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('products').add(productData);
            alert('Product created successfully!');
        }
        
        window.location.href = 'products.html';
        
    } catch (error) {
        console.error('Error saving product:', error);
        errorAlert.textContent = 'Error saving product: ' + error.message;
        errorAlert.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
});

// Make removeImage globally accessible
window.removeImage = removeImage;
