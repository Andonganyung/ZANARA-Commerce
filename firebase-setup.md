# Firebase Setup Guide for ZANARA Commerce

## Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name: "ZANARA-Commerce"
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Services

### 2.1 Firestore Database
1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location: us-central (or nearest to you)
5. Click "Enable"

### 2.2 Authentication
1. Click "Authentication" in sidebar
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

### 2.3 Storage
1. Click "Storage" in sidebar
2. Click "Get started"
3. Start in production mode
4. Click "Done"

## Step 3: Get Firebase Config

1. Click gear icon ⚙️ → Project settings
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app name: "ZANARA Admin"
5. Click "Register app"
6. Copy the config object (looks like below)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

7. **PASTE THIS CONFIG INTO `admin/js/firebase-config.js`** (I'll create this file)

## Step 4: Set Firestore Security Rules

1. Go to Firestore Database → Rules tab
2. Replace with this (I'll create this file too):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated admins can read/write
    match /products/{productId} {
      allow read: if true; // Public can read products
      allow write: if request.auth != null; // Only logged-in admins can write
    }
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 5: Create Admin User

1. Go to Authentication → Users tab
2. Click "Add user"
3. Email: `admin@zanaracommerce.com` (or your email)
4. Password: Create a strong password (save it!)
5. Click "Add user"

## Step 6: Configure Storage Rules

1. Go to Storage → Rules tab
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Update Your Config

After I create the files, you need to:
1. Open `admin/js/firebase-config.js`
2. Paste your Firebase config from Step 3
3. Save the file
4. Commit and push to GitHub

## Complete! 

Once you've done steps 1-6 above, tell me and I'll verify everything is working.

**Estimated time:** 10-15 minutes
**Cost:** $0 (Free tier: 50K reads/day, 20K writes/day, 5GB storage)
