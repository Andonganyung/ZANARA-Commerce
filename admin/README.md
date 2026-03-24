# ZANARA Commerce Admin Panel

## 🚀 Quick Start (15 minutes)

### Step 1: Complete Firebase Setup (10 min)
Follow instructions in `../firebase-setup.md`

### Step 2: Update Firebase Config (2 min)
1. Open `js/firebase-config.js`
2. Replace placeholder config with your Firebase project config
3. Save file

### Step 3: Migrate Data (2 min)
1. Open `admin/login.html` in browser
2. Login with admin account you created in Firebase
3. Go to `admin/migrate-data.html`
4. Click "Start Migration"
5. Wait for products to transfer to Firestore

### Step 4: Start Managing Products!
1. Go to `admin/index.html` - Dashboard
2. Click "Products" - View all products
3. Click "Add Product" - Create new product with images

---

## 📁 Admin Panel Structure

```
admin/
├── login.html              # Admin login page
├── index.html              # Dashboard (stats + recent products)
├── products.html           # Products list with filters
├── product-add.html        # Add new product
├── product-edit.html       # Edit existing product
├── categories.html         # View categories
├── orders.html             # Orders (placeholder)
├── migrate-data.html       # One-time data migration tool
├── css/
│   └── admin-style.css     # Admin panel styles
└── js/
    ├── firebase-config.js  # Firebase configuration (UPDATE THIS!)
    └── product-form.js     # Product add/edit logic
```

---

## ✨ Features

### Product Management
- ✅ Add products with image upload
- ✅ Edit product details
- ✅ Archive/restore products (soft delete)
- ✅ Delete products permanently
- ✅ Search products
- ✅ Filter by category & status
- ✅ Feature/unfeature products
- ✅ Upload multiple images per product
- ✅ Set original price for sale pricing
- ✅ Stock status management

### Security
- ✅ Firebase Authentication required
- ✅ Only logged-in admins can add/edit
- ✅ Public can only read products
- ✅ Secure image storage

### Safety Features
- ✅ Soft delete (archive) by default
- ✅ Double-confirm before permanent delete
- ✅ All changes tracked with timestamps
- ✅ Restore archived products anytime

---

## 🔐 Access URLs

**Live Admin Panel:**
- Login: `https://yourdomain.com/admin/login.html`
- Dashboard: `https://yourdomain.com/admin/index.html`

**Local Development:**
- Login: `file:///C:/Users/Andong/ZANARA-Commerce/admin/login.html`
- Or serve with: `python -m http.server 8000` then visit `http://localhost:8000/admin/`

---

## 📊 Product Data Structure

```javascript
{
  title: "Product Name",
  brand: "Brand Name",
  category: "African Food",
  subcategory: "Spices",
  description: "Full description...",
  price: 29.99,
  originalPrice: 39.99,  // optional
  discount: 25,          // auto-calculated
  images: ["url1", "url2"],
  image: "url1",         // primary image
  inStock: true,
  status: "published",   // or "archived"
  featured: false,
  rating: 4.5,
  reviews: 123,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🛡️ Safety Rules

1. **Archive instead of delete** - Products are soft-deleted by default
2. **Double confirmation** - Permanent deletes require 2 confirmations
3. **Image backup** - All images stored in Firebase Storage
4. **Change history** - Firestore tracks all updates automatically
5. **Reversible** - Archived products can be restored anytime

---

## 💰 Cost (Firebase Free Tier)

- **Firestore:** 50K reads/day, 20K writes/day
- **Storage:** 5GB images
- **Authentication:** Unlimited users
- **Hosting:** 10GB/month bandwidth

**Result:** FREE for small business (100-500 products, <10K visitors/day)

---

## 🔄 Update Frontend to Use Firebase

Replace this line in `js/product-manager.js`:

```javascript
// OLD: 
const response = await fetch('data/products.json');

// NEW:
const snapshot = await db.collection('products')
    .where('status', '==', 'published')
    .get();
const products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
}));
```

---

## 🆘 Troubleshooting

**"Firebase not configured"**
→ Update `js/firebase-config.js` with your Firebase project config

**"Permission denied"**
→ Update Firestore rules in Firebase Console (see firebase-setup.md)

**Images not uploading**
→ Update Storage rules in Firebase Console (see firebase-setup.md)

**Login not working**
→ Create admin user in Firebase Console → Authentication

---

## 🎯 Next Steps

1. ✅ Complete Firebase setup
2. ✅ Login and migrate data
3. ✅ Add/edit products via admin panel
4. 🔄 Update frontend to read from Firestore (optional now, required later)
5. 🔄 Deploy admin panel to Firebase Hosting
6. 🔄 Add payment processing (Stripe)
7. 🔄 Add vendor management for marketplace

---

## 📞 Support

Created by Factory Droid
Questions? Check `firebase-setup.md` or Firebase Console docs
