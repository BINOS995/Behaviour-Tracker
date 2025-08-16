# Admin Management System Setup Guide

## Overview
This system allows multiple users to have admin privileges, with the ability to grant and revoke admin access dynamically.

## How It Works

### Admin Privileges Structure
- **Admins Collection**: Firestore collection `admins` stores all admin users
- **User Verification**: System checks `users` collection to verify user exists before granting admin privileges
- **Audit Trail**: Each admin record includes who granted the privileges and when

### Key Features
1. **Grant Admin Privileges**: Current admins can add new admins by email
2. **Revoke Admin Privileges**: Current admins can remove admin privileges (except system admin)
3. **Real-time Updates**: Admin list updates automatically when changes occur
4. **Security**: Only authenticated admins can access admin management

## Initial Setup

### 1. First Admin Setup
The system automatically sets up the first admin (fobiblankson95@gmail.com) when no admins exist. This happens:
- When the dashboard loads for the first time
- Only if the admin user exists in the users collection
- Creates a "System Admin" entry that cannot be revoked

### 2. Adding New Admins
1. Log in as an existing admin
2. Navigate to the Admin panel
3. Enter the email address of the user you want to make an admin
4. Click "Grant Admin"
5. The user must already have an account (be in the users collection)

### 3. Revoking Admin Privileges
1. Log in as an admin
2. Navigate to the Admin panel
3. Find the admin in the "Current Admins" list
4. Click "Revoke" next to their name
5. Confirm the action

## Firestore Structure

### Admins Collection
```javascript
{
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  grantedBy: "admin-user-id",
  grantedAt: "2024-01-15T10:30:00.000Z",
  isInitialAdmin: false // true for system admin
}
```

### Security Rules
To properly secure this system, add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin management rules
    match /admins/{userId} {
      allow read: if request.auth != null && 
                     exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow create: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      allow delete: if request.auth != null && 
                      exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
                      !resource.data.isInitialAdmin;
    }
    
    // Users collection rules
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Common Issues
1. **"User not found" error**: The user must first register and be in the users collection
2. **Can't revoke system admin**: The initial admin (fobiblankson95@gmail.com) cannot be revoked
3. **Admin button not visible**: Ensure you're logged in as an admin and refresh the page

### Manual Admin Setup
If the automatic setup fails, you can manually add the first admin:
1. Go to Firestore console
2. Create a document in `admins` collection
3. Use the admin user's UID as the document ID
4. Add required fields: email, firstName, lastName, grantedBy, grantedAt

## Testing
1. Create test user accounts
2. Log in as the initial admin
3. Test granting admin privileges to test users
4. Test revoking admin privileges
5. Verify non-admins cannot access admin features