# Health & Fitness Tracking Portal

## Project Overview
An interactive health and fitness tracking portal with real-time calculations, personalized user experiences, and comprehensive form validation. Built with HTML5, CSS3, and vanilla JavaScript.

## Features Implemented

### 1. **Personalization Features**
- **Time-Based Greeting System**: Dynamically displays greetings based on time of day
  - "Good morning" (5:00 AM - 11:59 AM)
  - "Good afternoon" (12:00 PM - 4:59 PM)
  - "Good evening" (5:00 PM - 4:59 AM)
  - Includes user's name if profile is saved
  - Real-time clock display with current date

### 2. **User Profile Management**
- Save and retrieve user name and email
- Real-time email validation
- Name length validation (2-50 characters)
- Persistent storage using browser's localStorage
- Profile greeting integration

### 3. **BMI Calculator**
- **Input Fields**:
  - Height (cm or inches with unit conversion)
  - Weight (kg or lbs with unit conversion)
- **Features**:
  - Real-time BMI calculation as user types
  - Color-coded results based on BMI category
  - Unit conversion support
  - Detailed interpretations for each category
  - Input validation with error messages
  
- **BMI Categories**:
  - Underweight (< 18.5) - Blue
  - Normal Weight (18.5 - 24.9) - Green
  - Overweight (25.0 - 29.9) - Orange
  - Obese (≥ 30.0) - Red

### 4. **Calorie Tracker**
- **Input Fields**:
  - Age (1-120 years)
  - Gender (Male/Female)
  - Weight (kg)
  - Height (cm)
  - Activity Level (5 options)
  
- **Features**:
  - Mifflin-St Jeor equation for BMR calculation
  - Activity level multipliers for daily calorie calculation
  - Calorie goal setting and persistence
  - Real-time validation
  - Goal tracking with localStorage

- **Activity Levels**:
  - Sedentary (1.2x BMR)
  - Light (1.375x BMR)
  - Moderate (1.55x BMR)
  - Active (1.725x BMR)
  - Very Active (1.9x BMR)

### 7. **Additional Tracking Features**
- **Progress Dashboard**: Log daily calorie intake and visualize progress against your saved calorie goal. Today's intake persists in `localStorage` and can be reset.
- **Water Tracker**: Simple cup-based water tracker (default goal 8 cups/day). Add/remove cups and persist today's count.
- **Activity Log**: Add activities with name, duration, and estimated calories burned. Activities persist in `localStorage` and can be deleted.
- **Sleep Tracker**: Log hours slept and see a short history of recent logs (keeps last 30 entries).

### 5. **Form Validation System**
- **Real-time Validation**:
  - Validates on blur and submit events
  - Field-level error messages
  - Visual error indicators (red borders)
  - Clear error messages below each field

- **Validation Rules**:
  - Required field validation
  - Email format validation
  - Min/Max length validation
  - Min/Max value validation
  - Positive number validation
  - Number type validation

- **Submit Button Management**:
  - Validates all fields before submission
  - Provides feedback on validation errors

### 6. **User Feedback System**

#### Toast Notifications
- Non-intrusive notifications in bottom-right corner
- **Types**:
  - Success (green, checkmark icon)
  - Error (red, X icon)
  - Info (blue, info icon)
- Auto-dismiss after 4 seconds
- Manual close button
- Smooth slide-in/out animations
- Multiple notifications stack vertically

#### Confirmation Dialogs
- Modal dialog for important actions
- Used for:
  - Profile save confirmation
  - BMI calculation confirmation
  - Calorie goal confirmation
- Prevents accidental submissions

## File Structure

```
vikas2/
├── index.html      - HTML structure with all forms and sections
├── styles.css      - Complete styling and responsive design
├── scripts.js      - All JavaScript functionality
└── README.md       - Project documentation
```

## Technical Specifications

### JavaScript Architecture
- **Modular Classes**:
  - `ToastNotification`: Toast notification system
  - `ConfirmationDialog`: Modal confirmation dialogs
  - `FormValidator`: Comprehensive form validation

- **Key Functions**:
  - `calculateBMI()`: BMI calculation formula
  - `calculateBMR()`: Basal Metabolic Rate (Mifflin-St Jeor)
  - `calculateDailyCalories()`: Daily calorie needs based on activity
  - `initializeGreeting()`: Time-based greeting with real-time updates
  - `initializeProfileForm()`: Profile management
  - `initializeBMIForm()`: BMI calculator with real-time calculations
  - `initializeCalorieForm()`: Calorie tracker with goal setting

### Storage
- Uses browser's `localStorage` for:
  - User name and email
  - Calorie goal
  - Persistent data across sessions

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Flexible layouts for all screen sizes
- Touch-friendly buttons and inputs

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Requires modern JavaScript (ES6+)
- No external dependencies

## Key Calculations

### BMI Formula
```
BMI = weight(kg) / (height(m)²)
```

### BMR (Basal Metabolic Rate) - Mifflin-St Jeor
```
For Men:   BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
For Women: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
```

### Daily Calorie Needs
```
Daily Calories = BMR × Activity Multiplier
```

## Usage Instructions

1. **Open the Portal**: Open `index.html` in a web browser
2. **Save Your Profile**: Enter your name and email, click "Save Profile"
3. **Calculate BMI**: Enter height and weight, see real-time results
4. **Track Calories**: Enter health data to calculate daily calorie needs
5. **Set Goals**: Save your calorie goal for future reference

## Validation Messages

The portal provides clear feedback for:
- Missing required fields: "This field is required"
- Invalid email format: "Please enter a valid email address"
- Invalid numeric values: "Please enter a valid number"
- Value out of range: "Minimum/Maximum value is X"
- String length: "Minimum/Maximum X characters required"

## Data Persistence

All user data is saved locally and persists across browser sessions:
- User Profile: Name and Email
- Calorie Goal: Custom calorie target

## Future Enhancements
- Database integration for multi-device sync
- Workout tracking
- Meal logging
- Progress charts and analytics
- User authentication
- Mobile app version
- Integration with fitness trackers

## Development Notes

### Code Organization
- HTML: Semantic structure with proper accessibility
- CSS: BEM-inspired naming, modular organization
- JavaScript: Object-oriented with clear separation of concerns

### Best Practices
- Form validation before submission
- User confirmation for important actions
- Non-intrusive notifications
- Accessible form labels and error messages
- Cross-browser compatible
- Performance optimized with efficient DOM manipulation

## Support
For issues or feature requests, please refer to the project documentation or contact the development team.

---
**Project Due Date**: 19-11-2025  
**Total Marks**: 50  
**Estimated Hours**: 25 hours
