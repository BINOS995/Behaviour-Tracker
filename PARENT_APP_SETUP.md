# Parent App Setup Guide

## Overview
The Parent Portal app allows parents to monitor their children's academic progress and behavior points through a secure, read-only interface. Parents authenticate using their phone numbers, which must match the guardian phone number registered by teachers.

## Features
- **Phone-based Authentication**: Secure login with OTP verification
- **Real-time Monitoring**: View children's current points and behavior history
- **Read-only Access**: Parents can view but not modify any data
- **Multi-child Support**: Monitor multiple children from one account
- **Activity History**: Complete timeline of point adjustments with reasons
- **Responsive Design**: Works on mobile, tablet, and desktop

## Quick Start

### 1. Firebase Setup

#### Enable Phone Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Phone** provider
3. Configure your domain in **Authorized domains**

#### Update Firebase Configuration
Replace the Firebase config in `parent-app.html` with your actual project details:
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

#### Deploy Security Rules
Copy the rules from `firebase-rules.txt` to your Firebase Console:
1. Go to Firebase Console → Firestore → Rules
2. Replace existing rules with the content from `firebase-rules.txt`
3. Click **Publish**

### 2. Teacher Setup

#### Adding Guardian Phone Numbers
When adding students in the teacher dashboard:
1. Enter the student's name
2. Enter the guardian's phone number (with country code, e.g., +1234567890)
3. Click **Add Student**

**Important**: The phone number must include the country code (+1 for US, +27 for South Africa, etc.)

### 3. Parent Registration

#### For Parents
1. Open `parent-app.html` in a browser
2. Click **Register** if you're a new user
3. Enter your name exactly as registered by the teacher
4. Enter your phone number (must match the guardian phone registered by teacher)
5. Enter your child's guardian phone number (same as your phone)
6. Click **Register** and verify the OTP sent to your phone

#### For Existing Users
1. Open `parent-app.html`
2. Enter your phone number
3. Click **Send OTP**
4. Enter the 6-digit verification code
5. Click **Verify & Login**

## Usage Guide

### Dashboard Overview
- **Welcome Banner**: Personalized greeting with parent name
- **Child Cards**: Each child appears as a colorful card showing:
  - Name and class
  - Current points
  - Click to view detailed information

### Viewing Child Details
1. Click on any child's card
2. **Child Information**: Name, class, and current points
3. **Recent Activity**: Last 3 point adjustments
4. **Full History**: Complete timeline with dates, points, reasons, and who made the adjustment

### Security Features
- **Phone Authentication**: Only verified phone numbers can access
- **Guardian Link**: Only parents whose phone matches registered guardian numbers
- **Read-only Access**: Cannot modify any data
- **Session Management**: Automatic logout after inactivity

## Troubleshooting

### Common Issues

#### "No children found"
- Ensure your phone number exactly matches what the teacher registered
- Check country code format (+1234567890)
- Contact the teacher to verify the registered guardian phone

#### "Invalid OTP"
- Wait 60 seconds before requesting a new code
- Ensure you're entering the complete 6-digit code
- Check your phone's SMS inbox for the latest code

#### "Registration failed"
- Verify your phone number includes country code
- Ensure the guardian phone matches exactly what's registered for your child
- Check if your child has been added to any classes

### Testing Checklist

#### Teacher Testing
- [ ] Add a test student with a guardian phone number
- [ ] Verify the student appears in the class
- [ ] Check that guardianPhone field is populated

#### Parent Testing
- [ ] Register with the exact guardian phone number
- [ ] Verify OTP delivery and login
- [ ] Confirm child appears on dashboard
- [ ] Test viewing child details and history
- [ ] Test logout and re-login

#### Security Testing
- [ ] Attempt to access with non-matching phone number (should fail)
- [ ] Try to modify data (should be impossible)
- [ ] Test with multiple children having same guardian phone

## Technical Details

### Data Structure
```javascript
// Student document in Firestore
{
  name: "John Doe",
  points: 85,
  guardianPhone: "+1234567890",
  adjustments: [
    {
      date: "2024-01-15T10:30:00Z",
      points: 5,
      reason: "Helped classmate",
      adjustedBy: "Mrs. Smith"
    }
  ]
}

// Parent document in Firestore
{
  name: "Parent Name",
  phoneNumber: "+1234567890",
  guardianPhone: "+1234567890",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Notes
- Real-time updates when teachers modify points
- Optimized queries for fast loading
- Caching for offline capability
- Responsive images and lazy loading

## Support

For technical issues or questions:
1. Check this guide first
2. Verify Firebase configuration
3. Ensure security rules are properly deployed
4. Test with sample data before going live

Remember: The parent app is designed to be simple and secure. Parents only need their phone number to access their children's progress - no passwords to remember!