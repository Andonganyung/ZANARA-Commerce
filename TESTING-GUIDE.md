# ZANARA Commerce - Testing Guide

## Live Site
**URL:** https://andonganyung.github.io/ZANARA-Commerce/

## Test Account Credentials
**Password:** `Admin@123`

---

## ✅ CORE FUNCTIONALITY TEST CHECKLIST

### 1. 🔐 Login System
- [ ] Navigate to the live site
- [ ] Enter password: `Admin@123`
- [ ] Verify successful login and redirect to homepage

### 2. 🏠 Homepage Tests
- [ ] Hero slider auto-rotates every 5 seconds
- [ ] Click hero dots to manually change slides
- [ ] Click prev/next arrows on hero
- [ ] Category cards (4 grid) display correctly
- [ ] Product carousels show "Trending Products" and "New Arrivals"
- [ ] Deal of the Day section displays
- [ ] Footer displays with 4 columns
- [ ] Back-to-top bar appears when scrolling down

### 3. 🔍 Search Functionality
**Location:** Header search bar (all pages)
- [ ] Type "laptop" → Products filter in real-time
- [ ] Type "watch" → Results update immediately
- [ ] Type "shoe" → Should show running shoes
- [ ] Clear search → All products return
- [ ] Search works on homepage
- [ ] Search works on shop page

### 4. 🛒 Shop Page - Filters & Sort
**Location:** /shop.html
- [ ] Sidebar filters display on left
- [ ] **Category Filter:** Click "Electronics" → Products filter
- [ ] **Brand Filter:** Check "Premium Collection" → Filter applied
- [ ] **Price Range Slider:** Drag to $500 → Expensive products hidden
- [ ] **Sort Dropdown:** Select "Price: Low to High" → Products reorder
- [ ] **Sort Dropdown:** Select "Sort by Rating" → High-rated products first
- [ ] **Pagination:** Click page 2 → New products load
- [ ] **Results Count:** "Showing X-Y of Z results" updates correctly

### 5. 👁️ Quick View Modal
**Location:** Any product card (eye icon)
- [ ] Click eye icon on any product
- [ ] Modal opens with product preview
- [ ] Product image, title, price display
- [ ] Rating stars show correctly
- [ ] "Add to Cart" button works in modal
- [ ] "View Full Details" link navigates to product page
- [ ] Click X or overlay to close modal
- [ ] Press ESC key to close modal

### 6. 🛍️ Add to Cart
**Location:** Any product card
- [ ] Click "Add to Cart" on a product
- [ ] Button shows "✓ Added!" feedback
- [ ] Cart count badge updates in header
- [ ] Notification appears at bottom
- [ ] Add multiple products
- [ ] Cart count increases correctly

### 7. 🛒 Cart Page
**Location:** /cart.html
- [ ] Cart displays all added products
- [ ] Product image, title, price show correctly
- [ ] **Quantity Controls:** Click + to increase
- [ ] **Quantity Controls:** Click - to decrease
- [ ] **Remove Button:** Click X to remove item
- [ ] Subtotal calculates correctly
- [ ] Shipping: FREE if >$100, $15 otherwise
- [ ] Tax: 8% of subtotal
- [ ] Total = Subtotal + Shipping + Tax
- [ ] "Clear Cart" button works
- [ ] Empty cart shows "Your cart is empty" message

### 8. ❤️ Wishlist System
**Location:** Heart icon on products
- [ ] Click heart icon on a product
- [ ] Icon fills and turns red
- [ ] Notification: "Added to wishlist!"
- [ ] **Refresh page** → Heart stays filled (persistence test)
- [ ] Click heart again → Removes from wishlist
- [ ] Go to /wishlist.html
- [ ] Wishlist page shows all saved items
- [ ] Click "Add to Cart" from wishlist → Moves to cart
- [ ] Click X to remove from wishlist

### 9. 📦 Product Detail Page
**Location:** Click any product title or image
- [ ] URL shows ?id=1 (or other number)
- [ ] Product loads dynamically from JSON
- [ ] Main product image displays
- [ ] **Image Gallery:** Click thumbnails → Main image changes
- [ ] Product title, price, rating display
- [ ] **Color Variants:** Click color buttons → Selection changes
- [ ] **Size Variants:** Click size buttons → Selection changes
- [ ] **Quantity:** Click +/- to adjust quantity
- [ ] **Add to Cart:** Adds correct quantity
- [ ] **Wishlist Button:** Toggles wishlist state
- [ ] **Tabs:** Click "Description", "Specifications", "Reviews"
- [ ] Related products section shows at bottom

### 10. 💳 Checkout Page
**Location:** /checkout.html (from cart)
- [ ] Cart items display in order summary
- [ ] **Email Field:** Enter invalid email → Error on submit
- [ ] **Required Fields:** Leave fields empty → Error highlights
- [ ] **Name Fields:** Enter first and last name
- [ ] **Address Fields:** Fill complete address
- [ ] **Payment Method:** Select a payment option (radio button)
- [ ] **Submit:** Click "Place Order"
- [ ] Loading spinner shows: "Processing..."
- [ ] Success message appears
- [ ] Redirects after 2 seconds
- [ ] Cart clears after successful order

### 11. 📧 Contact Form
**Location:** /contact.html
- [ ] Fill in name field
- [ ] **Email Validation:** Enter invalid email → Error
- [ ] Enter valid email
- [ ] **Message Field:** Type message (min 10 chars)
- [ ] Select subject dropdown
- [ ] Click "Send Message"
- [ ] Button shows "Sending..." with spinner
- [ ] Success notification appears
- [ ] Form resets after submission

### 12. 📰 Newsletter Subscription
**Location:** Footer on any page
- [ ] Enter invalid email → Error notification
- [ ] Enter valid email
- [ ] Click "Subscribe"
- [ ] Button shows spinner
- [ ] Success: "Thank you for subscribing!"
- [ ] Form clears
- [ ] Check localStorage: `newsletterSubscribers` key exists

### 13. 📱 Mobile Responsive
**Test on mobile or use browser DevTools**
- [ ] Header collapses to hamburger menu
- [ ] Search bar visible on mobile
- [ ] Hamburger menu opens sidebar
- [ ] Product grid: 2 columns on mobile, 1 on very small
- [ ] Category cards: 2 columns on tablet, 1 on mobile
- [ ] Cart table converts to cards on mobile
- [ ] Checkout form stacks vertically
- [ ] All buttons are tappable (min 44px height)

### 14. 🔄 Sidebar Navigation
**Location:** Click "All" button in header nav
- [ ] Sidebar slides in from left
- [ ] Overlay appears behind sidebar
- [ ] Click overlay → Sidebar closes
- [ ] Click X button → Sidebar closes
- [ ] Press ESC → Sidebar closes
- [ ] Click any link → Navigates correctly

### 15. 🎨 UI/UX Elements
- [ ] All product images load
- [ ] Star ratings display correctly
- [ ] Hover effects work on product cards
- [ ] Buttons have hover states
- [ ] Colors match ZANARA branding (navy + gold)
- [ ] No console errors (F12 → Console tab)
- [ ] Scroll animations work (products fade in)
- [ ] Back-to-top button appears after scrolling

---

## 🐛 KNOWN ISSUES TO VERIFY

### Expected Behaviors:
1. **Product images** may take a moment to load (Unsplash CDN)
2. **Form submissions** are simulated (no real backend)
3. **Orders** save to localStorage only
4. **Payment processing** is simulated (no real payment)
5. **Account system** is password-only (no real auth)

### Check for Bugs:
- [ ] Do all 12 products display correctly?
- [ ] Does cart persist after page refresh?
- [ ] Does wishlist persist after page refresh?
- [ ] Do filters clear when navigating between pages?
- [ ] Do variants stay selected when quantity changes?

---

## 💾 LocalStorage Test
**Open browser DevTools → Application → Local Storage**

Should see these keys:
- [ ] `zanaraCart` - Shopping cart items
- [ ] `zanaraWishlist` - Wishlist items
- [ ] `newsletterSubscribers` - Email list
- [ ] `zanaraOrders` - Completed orders
- [ ] `zanaraAuth` - Login session

---

## 🚀 Performance Check
- [ ] Homepage loads in < 3 seconds
- [ ] Product images are lazy-loaded (check Network tab)
- [ ] No JavaScript errors in console
- [ ] All CSS loads correctly
- [ ] Fonts load (Inter + Playfair Display)

---

## 📊 Test Results Template

```
Test Date: _____________
Browser: _____________
Device: _____________

PASSED: ____ / 80 tests
FAILED: ____ tests

Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

Notes:
_______________________________________________
_______________________________________________
```

---

## 🔧 Debugging Tips

**If something doesn't work:**

1. **Open Console:** Press F12 → Console tab
2. **Check for errors:** Look for red error messages
3. **Check Network:** F12 → Network tab → Verify files loaded
4. **Clear cache:** Ctrl+Shift+Del → Clear browsing data
5. **Try incognito:** Rule out cache/extension issues
6. **Check localStorage:** F12 → Application → Local Storage

**Common fixes:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear localStorage: `localStorage.clear()` in console
- Check product JSON loaded: `console.log(productManager.products)` in console

---

## ✅ Success Criteria

**Site is fully functional if:**
- ✅ All 15 core test sections pass
- ✅ No critical console errors
- ✅ Cart and wishlist persist
- ✅ Forms validate and submit
- ✅ Products load dynamically
- ✅ Search and filters work
- ✅ Mobile responsive

---

**Start testing:** https://andonganyung.github.io/ZANARA-Commerce/

**Password:** `Admin@123`
