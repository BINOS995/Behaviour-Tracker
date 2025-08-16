# Firebase Deployment Guide

## Prerequisites
1. Make sure you have Firebase CLI installed globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Make sure you're logged in to Firebase:
   ```bash
   firebase login
   ```

## Step-by-Step Deployment

### 1. Update Firebase Project Configuration
Replace `your-project-id` in `.firebaserc` with your actual Firebase project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### 2. Initialize Firebase (if not already done)
```bash
firebase init hosting
```

When prompted:
- Select your Firebase project
- Use `.` as your public directory
- Configure as a single-page app: **Yes**
- Overwrite existing files: **No**

### 3. Deploy to Firebase
```bash
firebase deploy
```

### 4. Verify Deployment
After successful deployment, you'll see:
- **Hosting URL**: `https://your-project-id.web.app`
- **Hosting URL**: `https://your-project-id.firebaseapp.com`

### 5. Update Security Rules
After deployment, update your Firestore security rules in the Firebase Console:

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with the rules from `ADMIN_SETUP.md`
3. Click **Publish**

## Post-Deployment Checklist

### Verify Admin Management
1. Access your deployed app
2. Log in with the initial admin account (fobiblankson95@gmail.com)
3. Navigate to Admin panel
4. Test granting admin privileges to another user
5. Test revoking admin privileges (except system admin)

### Verify Authentication Flow
1. Test login/logout functionality
2. Test redirect behavior:
   - Logged-in users should redirect to dashboard
   - Non-logged-in users should stay on login page
   - Back button should redirect to login for non-authenticated users

### Verify Real-time Updates
1. Open the app in multiple browser tabs
2. Make changes in one tab (add/remove classes)
3. Verify changes appear instantly in other tabs

## Troubleshooting

### Common Issues
1. **404 errors**: Check that `firebase.json` has the correct rewrites
2. **Authentication not working**: Verify Firebase config in `firebaseauth.js`
3. **Admin features not visible**: Check Firestore security rules
4. **Real-time updates not working**: Verify Firestore permissions

### Firebase CLI Commands
- **Deploy hosting only**: `firebase deploy --only hosting`
- **Deploy firestore rules**: `firebase deploy --only firestore:rules`
- **Check deployment status**: `firebase hosting:channel:list`

## Files Added/Modified for Deployment
- ✅ `firebase.json` - Firebase hosting configuration
- ✅ `.firebaserc` - Firebase project configuration
- ✅ `ADMIN_SETUP.md` - Admin system documentation
- ✅ `DEPLOYMENT_GUIDE.md` - This deployment guide
- ✅ Updated `dashboard.html` with admin management system
- ✅ Updated `index.html` with authentication redirects
- ✅ Updated `firebaseauth.js` with global exports

## Next Steps
1. Run `firebase login` if not already logged in
2. Update `.firebaserc` with your actual project ID
3. Run `firebase deploy`
4. Test all functionality on the live deployment
5. Share the deployed URL with your team/users