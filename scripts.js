// ==================== UTILITY FUNCTIONS ====================

/**
 * Toast Notification System
 */
class ToastNotification {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        setTimeout(() => this.remove(toast), duration);
    }

    remove(toast) {
        toast.classList.add('exit');
        setTimeout(() => toast.remove(), 300);
    }
}

const toast = new ToastNotification();

/**
 * Confirmation Dialog System
 */
class ConfirmationDialog {
    constructor() {
        this.dialog = document.getElementById('confirmationDialog');
        this.titleEl = document.getElementById('dialogTitle');
        this.messageEl = document.getElementById('dialogMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.callback = null;
    }

    show(title, message, onConfirm) {
        this.titleEl.textContent = title;
        this.messageEl.textContent = message;
        this.callback = onConfirm;
        this.dialog.style.display = 'flex';

        this.confirmBtn.onclick = () => {
            this.dialog.style.display = 'none';
            this.callback(true);
        };

        this.cancelBtn.onclick = () => {
            this.dialog.style.display = 'none';
            this.callback(false);
        };
    }
}

const confirmDialog = new ConfirmationDialog();

/**
 * Form Validation System
 */
class FormValidator {
    constructor() {
        this.errors = {};
    }

    /**
     * Validate a single field
     */
    validateField(fieldName, value, rules) {
        this.errors[fieldName] = '';

        for (const rule of rules) {
            if (!rule.validate(value)) {
                this.errors[fieldName] = rule.message;
                return false;
            }
        }
        return true;
    }

    /**
     * Clear error message for a field
     */
    clearError(fieldName) {
        this.errors[fieldName] = '';
    }

    /**
     * Get all validation rules
     */
    static getRules() {
        return {
            required: {
                validate: (value) => {
                    if (typeof value === 'string') {
                        return value.trim() !== '';
                    }
                    return value !== '' && value !== null;
                },
                message: 'This field is required'
            },
            email: {
                validate: (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                },
                message: 'Please enter a valid email address'
            },
            minLength: (min) => ({
                validate: (value) => value.length >= min,
                message: `Minimum ${min} characters required`
            }),
            maxLength: (max) => ({
                validate: (value) => value.length <= max,
                message: `Maximum ${max} characters allowed`
            }),
            minValue: (min) => ({
                validate: (value) => parseFloat(value) >= min,
                message: `Minimum value is ${min}`
            }),
            maxValue: (max) => ({
                validate: (value) => parseFloat(value) <= max,
                message: `Maximum value is ${max}`
            }),
            number: {
                validate: (value) => !isNaN(value) && value !== '',
                message: 'Please enter a valid number'
            },
            positive: {
                validate: (value) => parseFloat(value) > 0,
                message: 'Value must be positive'
            }
        };
    }
}

/**
 * Display error message for a field
 */
function displayFieldError(fieldId, errorId, errorMessage) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorId);

    if (errorMessage) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    } else {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

// ==================== PERSONALIZATION FEATURES ====================

/**
 * Time-based Greeting System
 */
function initializeGreeting() {
    const greetingMessage = document.getElementById('greeting-message');
    const greetingTime = document.getElementById('greeting-time');

    function updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        let greeting = 'Welcome!';
        
        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning!';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon!';
        } else if (hour >= 17 || hour < 5) {
            greeting = 'Good Evening!';
        }

        // Get user name from localStorage if available
        const userName = localStorage.getItem('userName');
        if (userName) {
            greeting += ` ${userName}`;
        }

        greetingMessage.textContent = greeting;
        greetingTime.textContent = `${day} - ${time}`;
    }

    updateGreeting();
    // Update every minute
    setInterval(updateGreeting, 60000);
}

// ==================== PROFILE FORM ====================

function initializeProfileForm() {
    if (!document.getElementById('profileForm')) return;
    const profileForm = document.getElementById('profileForm');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');

    const profileDisplay = document.getElementById('profileDisplay');
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const editProfileBtn = document.getElementById('editProfileBtn');

    // Load saved profile data
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedName) userNameInput.value = savedName;
    if (savedEmail) userEmailInput.value = savedEmail;

    // If saved details exist, show the read-only display and hide the form
    function showDisplay() {
        if (profileDisplay) profileDisplay.style.display = 'block';
        if (displayName) displayName.textContent = savedName || '';
        if (displayEmail) displayEmail.textContent = savedEmail || '';
        if (profileForm) profileForm.style.display = 'none';
    }

    function showForm() {
        if (profileDisplay) profileDisplay.style.display = 'none';
        if (profileForm) profileForm.style.display = 'block';
    }

    if ((savedName && savedName.trim() !== '') || (savedEmail && savedEmail.trim() !== '')) {
        showDisplay();
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showForm();
        });
    }

    // Real-time validation
    const validator = new FormValidator();
    const rules = FormValidator.getRules();

    userNameInput.addEventListener('blur', () => {
        const isValid = validator.validateField('name', userNameInput.value, [
            rules.required,
            rules.minLength(2),
            rules.maxLength(50)
        ]);
        displayFieldError('userName', 'userNameError', validator.errors.name);
    });

    userEmailInput.addEventListener('blur', () => {
        const isValid = validator.validateField('email', userEmailInput.value, [
            rules.required,
            rules.email
        ]);
        displayFieldError('userEmail', 'userEmailError', validator.errors.email);
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate all fields
        const nameValid = validator.validateField('name', userNameInput.value, [
            rules.required,
            rules.minLength(2),
            rules.maxLength(50)
        ]);
        const emailValid = validator.validateField('email', userEmailInput.value, [
            rules.required,
            rules.email
        ]);

        displayFieldError('userName', 'userNameError', validator.errors.name);
        displayFieldError('userEmail', 'userEmailError', validator.errors.email);

        if (nameValid && emailValid) {
            confirmDialog.show(
                'Save Profile',
                `Save profile for ${userNameInput.value}?`,
                (confirmed) => {
                    if (confirmed) {
                        localStorage.setItem('userName', userNameInput.value);
                        localStorage.setItem('userEmail', userEmailInput.value);
                        toast.show('Profile saved successfully!', 'success');

                        // Update display block
                        if (displayName) displayName.textContent = userNameInput.value;
                        if (displayEmail) displayEmail.textContent = userEmailInput.value;
                        showDisplay();

                        // Update greeting
                        initializeGreeting();
                    }
                }
            );
        } else {
            toast.show('Please fix the errors in the form', 'error');
        }
    });
}

// ==================== BMI CALCULATOR ====================

/**
 * Convert height to cm
 */
function convertHeightToCm(height, unit) {
    if (unit === 'inches') {
        return height * 2.54;
    }
    return height;
}

/**
 * Convert weight to kg
 */
function convertWeightToKg(weight, unit) {
    if (unit === 'lbs') {
        return weight * 0.453592;
    }
    return weight;
}

/**
 * Calculate BMI
 */
function calculateBMI(height, weight) {
    // height should be in cm, weight in kg
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
}

/**
 * Get BMI category and color
 */
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return {
            category: 'Underweight',
            className: 'bmi-underweight',
            interpretation: 'You are underweight. Consider consulting a healthcare professional about a healthy diet and exercise plan.'
        };
    } else if (bmi < 25) {
        return {
            category: 'Normal Weight',
            className: 'bmi-normal',
            interpretation: 'You have a healthy weight! Keep up the good work with balanced diet and regular exercise.'
        };
    } else if (bmi < 30) {
        return {
            category: 'Overweight',
            className: 'bmi-overweight',
            interpretation: 'You are overweight. Consider increasing physical activity and adopting a balanced diet.'
        };
    } else {
        return {
            category: 'Obese',
            className: 'bmi-obese',
            interpretation: 'You are in the obese category. Consult a healthcare professional for personalized advice.'
        };
    }
}

function initializeBMIForm() {
    if (!document.getElementById('bmiForm')) return;
    const bmiForm = document.getElementById('bmiForm');
    const heightInput = document.getElementById('bmiHeight');
    const weightInput = document.getElementById('bmiWeight');
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');
    const bmiResult = document.getElementById('bmiResult');

    const validator = new FormValidator();
    const rules = FormValidator.getRules();

    // Real-time validation
    heightInput.addEventListener('blur', () => {
        const isValid = validator.validateField('height', heightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(300)
        ]);
        displayFieldError('bmiHeight', 'bmiHeightError', validator.errors.height);
    });

    weightInput.addEventListener('blur', () => {
        const isValid = validator.validateField('weight', weightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(500)
        ]);
        displayFieldError('bmiWeight', 'bmiWeightError', validator.errors.weight);
    });

    // Real-time calculation on input change
    heightInput.addEventListener('input', () => {
        if (heightInput.value && weightInput.value) {
            const height = convertHeightToCm(parseFloat(heightInput.value), heightUnit.value);
            const weight = convertWeightToKg(parseFloat(weightInput.value), weightUnit.value);
            
            if (height > 0 && weight > 0) {
                const bmi = calculateBMI(height, weight);
                displayBMIResult(bmi);
            }
        }
    });

    weightInput.addEventListener('input', () => {
        if (heightInput.value && weightInput.value) {
            const height = convertHeightToCm(parseFloat(heightInput.value), heightUnit.value);
            const weight = convertWeightToKg(parseFloat(weightInput.value), weightUnit.value);
            
            if (height > 0 && weight > 0) {
                const bmi = calculateBMI(height, weight);
                displayBMIResult(bmi);
            }
        }
    });

    heightUnit.addEventListener('change', () => {
        if (heightInput.value && weightInput.value) {
            const height = convertHeightToCm(parseFloat(heightInput.value), heightUnit.value);
            const weight = convertWeightToKg(parseFloat(weightInput.value), weightUnit.value);
            
            if (height > 0 && weight > 0) {
                const bmi = calculateBMI(height, weight);
                displayBMIResult(bmi);
            }
        }
    });

    weightUnit.addEventListener('change', () => {
        if (heightInput.value && weightInput.value) {
            const height = convertHeightToCm(parseFloat(heightInput.value), heightUnit.value);
            const weight = convertWeightToKg(parseFloat(weightInput.value), weightUnit.value);
            
            if (height > 0 && weight > 0) {
                const bmi = calculateBMI(height, weight);
                displayBMIResult(bmi);
            }
        }
    });

    function displayBMIResult(bmi) {
        const categoryInfo = getBMICategory(bmi);
        const categoryEl = document.getElementById('bmiCategory');
        const interpretationEl = document.getElementById('bmiInterpretation');
        const valueEl = document.getElementById('bmiValue');

        valueEl.textContent = bmi.toFixed(1);
        categoryEl.className = 'bmi-category ' + categoryInfo.className;
        categoryEl.textContent = categoryInfo.category;
        interpretationEl.textContent = categoryInfo.interpretation;
        
        bmiResult.style.display = 'block';
    }

    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const heightValid = validator.validateField('height', heightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(300)
        ]);

        const weightValid = validator.validateField('weight', weightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(500)
        ]);

        displayFieldError('bmiHeight', 'bmiHeightError', validator.errors.height);
        displayFieldError('bmiWeight', 'bmiWeightError', validator.errors.weight);

        if (heightValid && weightValid) {
            const height = convertHeightToCm(parseFloat(heightInput.value), heightUnit.value);
            const weight = convertWeightToKg(parseFloat(weightInput.value), weightUnit.value);
            const bmi = calculateBMI(height, weight);
            
            confirmDialog.show(
                'BMI Calculation',
                `Your BMI is ${bmi.toFixed(1)}. Is this correct?`,
                (confirmed) => {
                    if (confirmed) {
                        displayBMIResult(bmi);
                        toast.show('BMI calculated and saved!', 'success');
                    }
                }
            );
        } else {
            toast.show('Please fix the errors in the form', 'error');
        }
    });
}

// ==================== CALORIE TRACKER ====================

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
 */
function calculateBMR(age, gender, weight, height) {
    // weight in kg, height in cm
    let bmr;
    
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    
    return bmr;
}

/**
 * Calculate daily calorie needs based on activity level
 */
function calculateDailyCalories(bmr, activityLevel) {
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'veryactive': 1.9
    };

    return bmr * (activityMultipliers[activityLevel] || 1.2);
}

/**
 * Get activity level description
 */
function getActivityLevelDescription(level) {
    const descriptions = {
        'sedentary': 'Little or no exercise',
        'light': 'Light exercise (1-3 days/week)',
        'moderate': 'Moderate exercise (3-5 days/week)',
        'active': 'Active (6-7 days/week)',
        'veryactive': 'Very active (intense exercise daily)'
    };
    return descriptions[level] || '';
}

function initializeCalorieForm() {
    if (!document.getElementById('calorieForm')) return;
    const calorieForm = document.getElementById('calorieForm');
    const ageInput = document.getElementById('calorieAge');
    const genderSelect = document.getElementById('calorieGender');
    const weightInput = document.getElementById('calorieWeight');
    const heightInput = document.getElementById('calorieHeight');
    const activitySelect = document.getElementById('activityLevel');
    const calorieResult = document.getElementById('calorieResult');
    const calorieGoalInput = document.getElementById('calorieGoal');
    const setGoalBtn = document.getElementById('setGoalBtn');

    const validator = new FormValidator();
    const rules = FormValidator.getRules();

    // Real-time validation
    ageInput.addEventListener('blur', () => {
        const isValid = validator.validateField('age', ageInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(120)
        ]);
        displayFieldError('calorieAge', 'calorieAgeError', validator.errors.age);
    });

    weightInput.addEventListener('blur', () => {
        const isValid = validator.validateField('weight', weightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(500)
        ]);
        displayFieldError('calorieWeight', 'calorieWeightError', validator.errors.weight);
    });

    heightInput.addEventListener('blur', () => {
        const isValid = validator.validateField('height', heightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(300)
        ]);
        displayFieldError('calorieHeight', 'calorieHeightError', validator.errors.height);
    });

    genderSelect.addEventListener('change', () => {
        const isValid = validator.validateField('gender', genderSelect.value, [rules.required]);
        displayFieldError('calorieGender', 'calorieGenderError', validator.errors.gender);
    });

    activitySelect.addEventListener('change', () => {
        const isValid = validator.validateField('activity', activitySelect.value, [rules.required]);
        displayFieldError('activityLevel', 'activityLevelError', validator.errors.activity);
    });

    calorieForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const ageValid = validator.validateField('age', ageInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(120)
        ]);

        const genderValid = validator.validateField('gender', genderSelect.value, [rules.required]);

        const weightValid = validator.validateField('weight', weightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(500)
        ]);

        const heightValid = validator.validateField('height', heightInput.value, [
            rules.required,
            rules.positive,
            rules.minValue(1),
            rules.maxValue(300)
        ]);

        const activityValid = validator.validateField('activity', activitySelect.value, [rules.required]);

        displayFieldError('calorieAge', 'calorieAgeError', validator.errors.age);
        displayFieldError('calorieGender', 'calorieGenderError', validator.errors.gender);
        displayFieldError('calorieWeight', 'calorieWeightError', validator.errors.weight);
        displayFieldError('calorieHeight', 'calorieHeightError', validator.errors.height);
        displayFieldError('activityLevel', 'activityLevelError', validator.errors.activity);

        if (ageValid && genderValid && weightValid && heightValid && activityValid) {
            const age = parseInt(ageInput.value);
            const gender = genderSelect.value;
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);
            const activityLevel = activitySelect.value;

            const bmr = calculateBMR(age, gender, weight, height);
            const dailyCalories = calculateDailyCalories(bmr, activityLevel);

            confirmDialog.show(
                'Calorie Calculation',
                `Your daily calorie needs are approximately ${Math.round(dailyCalories)} kcal. Continue?`,
                (confirmed) => {
                    if (confirmed) {
                        displayCalorieResult(dailyCalories);
                        toast.show('Calorie calculation completed!', 'success');
                    }
                }
            );
        } else {
            toast.show('Please fix the errors in the form', 'error');
        }
    });

    function displayCalorieResult(calories) {
        document.getElementById('calorieValue').textContent = Math.round(calories);
        calorieGoalInput.value = Math.round(calories);
        calorieResult.style.display = 'block';
    }

    setGoalBtn.addEventListener('click', () => {
        const goal = parseInt(calorieGoalInput.value);

        if (!goal || goal <= 0) {
            toast.show('Please enter a valid calorie goal', 'error');
            return;
        }

        confirmDialog.show(
            'Set Calorie Goal',
            `Set your daily calorie goal to ${goal} kcal?`,
            (confirmed) => {
                if (confirmed) {
                    localStorage.setItem('calorieGoal', goal);
                    const goalMessage = document.getElementById('goalMessage');
                    goalMessage.textContent = `✓ Goal set to ${goal} kcal/day`;
                    goalMessage.style.color = '#27ae60';
                    toast.show('Calorie goal saved!', 'success');
                }
            }
        );
    });

    // Load saved goal if exists
    const savedGoal = localStorage.getItem('calorieGoal');
    if (savedGoal && calorieResult.style.display !== 'none') {
        const goalMessage = document.getElementById('goalMessage');
        goalMessage.textContent = `✓ Goal set to ${savedGoal} kcal/day`;
        goalMessage.style.color = '#27ae60';
    }
}

// ==================== NAVBAR FEATURE ROTATOR ====================
function initializeFeatureRotator() {
    const el = document.getElementById('featureRotator');
    if (!el) return;

    const labels = [
        'BMI Calculator',
        'Calorie Tracker',
        'Profile',
        'Activity Log',
        'Sleep Tracker'
    ];

    // If we're on the homepage, remove the BMI label
    const path = (location.pathname || '').toLowerCase();
    const isHome = path === '/' || path.endsWith('/index.html') || path === '';
    let visibleLabels = labels.slice();
    if (isHome) {
        visibleLabels = visibleLabels.filter(l => l.toLowerCase() !== 'bmi calculator');
    }

    if (!visibleLabels.length) { el.style.display = 'none'; return; }

    let idx = 0;
    const inner = el.querySelector('.inner');
    if (!inner) return;
    inner.textContent = visibleLabels[0];

    function showNext() {
        // fade out
        el.classList.add('hidden');
        setTimeout(() => {
            idx = (idx + 1) % visibleLabels.length;
            inner.textContent = visibleLabels[idx];
            el.classList.remove('hidden');
        }, 420);
    }

    // cycle every 3s
    setInterval(showNext, 3000);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // ensure a demo account exists for quick access
    seedDemoAccount();
    initializeLogin();

    // If this is the login page, don't run the rest.
    if (location.pathname && location.pathname.includes('login.html')) {
        return;
    }

    // Only redirect to login from pages that require authentication.
    function pageRequiresAuth() {
        const path = (location.pathname || '').toLowerCase();
        return path.includes('dashboard.html') || path.includes('profile.html') || path.includes('activity.html') || path.includes('sleep.html') || path.includes('accounts.html');
    }

    if (pageRequiresAuth() && !isLoggedIn()) {
        // redirect to login page
        location.href = 'login.html';
        return;
    }

    // attach logout handler when present
    setupLogoutButton();

    initializeGreeting();
    initializeProfileForm();
    initializeBMIForm();
    initializeCalorieForm();
    initializeProgressDashboard();
    initializeActivityLog();
    initializeWaterTracker();
    initializeSleepTracker();
    // initialize navbar rotator (shows features one-by-one)
    initializeFeatureRotator();
});

// ==================== AUTH / LOGIN ====================
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === '1';
}

/**
 * Seed a demo account if none exists (for local demo/testing only)
 */
function seedDemoAccount() {
    try {
        const raw = localStorage.getItem('users');
        const users = raw ? JSON.parse(raw) : {};
        // create a predictable demo user if not present
        if (!users['demo']) {
            users['demo'] = { password: 'demo123' };
            localStorage.setItem('users', JSON.stringify(users));
            // non-intrusive feedback for developers
            console.log('Seeded demo account -> username: demo   password: demo123');
        }
    } catch (e) {
        console.warn('Failed to seed demo account', e);
    }
}

function setupLogoutButton() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        confirmDialog.show('Logout', 'Are you sure you want to sign out?', (ok) => {
            if (ok) {
                logout();
            }
        });
    });
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    // keep userName for convenience, but you can clear it if desired
    toast.show('Signed out', 'info');
    setTimeout(() => { location.href = 'login.html'; }, 600);
}

function initializeLogin() {
    if (!document.getElementById('loginForm')) return;
    const form = document.getElementById('loginForm');
    const user = document.getElementById('loginUser');
    const pass = document.getElementById('loginPass');
    const confirm = document.getElementById('loginConfirm');
    const createCheckbox = document.getElementById('createAccount');

    function loadUsers() {
        try {
            return JSON.parse(localStorage.getItem('users') || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveUsers(obj) {
        localStorage.setItem('users', JSON.stringify(obj));
    }

    function validatePassword(p) {
        return typeof p === 'string' && p.length >= 6;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = user.value && user.value.trim();
        const p = pass.value && pass.value.trim();
        const c = confirm.value && confirm.value.trim();
        const creating = createCheckbox.checked;

        // clear old errors
        document.getElementById('loginUserError').textContent = '';
        document.getElementById('loginPassError').textContent = '';
        document.getElementById('loginConfirmError').textContent = '';

        if (!u) {
            document.getElementById('loginUserError').textContent = 'Enter a username';
            toast.show('Enter a username', 'error');
            return;
        }

        if (creating) {
            if (!validatePassword(p)) {
                document.getElementById('loginPassError').textContent = 'Password must be at least 6 characters';
                toast.show('Password must be at least 6 characters', 'error');
                return;
            }
            if (p !== c) {
                document.getElementById('loginConfirmError').textContent = 'Passwords do not match';
                toast.show('Passwords do not match', 'error');
                return;
            }

            const users = loadUsers();
            if (users[u]) {
                document.getElementById('loginUserError').textContent = 'Username already exists';
                toast.show('Username already exists', 'error');
                return;
            }

            // Save user (NOTE: demo only — passwords stored in localStorage)
            users[u] = { password: p };
            saveUsers(users);
            localStorage.setItem('isLoggedIn', '1');
            localStorage.setItem('userName', u);
            toast.show('Account created and logged in', 'success');
            setTimeout(() => { location.href = 'index.html'; }, 600);
            return;
        }

        // Logging in
        if (!p) {
            document.getElementById('loginPassError').textContent = 'Enter a password';
            toast.show('Enter a password', 'error');
            return;
        }

        const users = loadUsers();
        if (!users[u] || users[u].password !== p) {
            toast.show('Invalid username or password', 'error');
            return;
        }

        // Success
        localStorage.setItem('isLoggedIn', '1');
        localStorage.setItem('userName', u);
        toast.show('Login successful', 'success');
        setTimeout(() => { location.href = 'index.html'; }, 600);
    });
}

// ==================== PROGRESS DASHBOARD ====================
function initializeProgressDashboard() {
    if (!document.getElementById('calorieProgressFill')) return;
    const logBtn = document.getElementById('logIntakeBtn');
    const intakeInput = document.getElementById('addIntake');
    const progressFill = document.getElementById('calorieProgressFill');
    const progressText = document.getElementById('calorieProgressText');
    const resetBtn = document.getElementById('resetIntakeBtn');

    const todayKey = `intake_${new Date().toISOString().slice(0,10)}`;

    function getGoal() {
        const g = localStorage.getItem('calorieGoal');
        return g ? parseInt(g, 10) : 0;
    }

    function getTodayIntake() {
        return parseInt(localStorage.getItem(todayKey) || '0', 10);
    }

    function setTodayIntake(val) {
        localStorage.setItem(todayKey, val);
    }

    function updateProgress() {
        const goal = getGoal();
        const intake = getTodayIntake();
        const pct = goal > 0 ? Math.min(100, Math.round((intake / goal) * 100)) : 0;
        progressFill.style.width = pct + '%';
        progressText.textContent = `${intake} / ${goal} kcal`;
    }

    logBtn.addEventListener('click', () => {
        const val = parseInt(intakeInput.value, 10);
        if (!val || val <= 0) {
            toast.show('Enter a valid calorie amount to log', 'error');
            return;
        }

        const current = getTodayIntake();
        setTodayIntake(current + val);
        intakeInput.value = '';
        updateProgress();
        toast.show('Calorie intake logged', 'success');
    });

    resetBtn.addEventListener('click', () => {
        confirmDialog.show('Reset Intake', 'Reset today\'s logged intake to 0?', (ok) => {
            if (ok) {
                setTodayIntake(0);
                updateProgress();
                toast.show('Today\'s intake reset', 'info');
            }
        });
    });

    // initial update
    updateProgress();
}

// ==================== ACTIVITY LOG ====================
function initializeActivityLog() {
    if (!document.getElementById('activityList')) return;
    const addBtn = document.getElementById('addActivityBtn');
    const nameInput = document.getElementById('activityName');
    const durationInput = document.getElementById('activityDuration');
    const caloriesInput = document.getElementById('activityCalories');
    const listEl = document.getElementById('activityList');

    const storageKey = 'activityLog';

    function loadActivities() {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : [];
    }

    function saveActivities(arr) {
        localStorage.setItem(storageKey, JSON.stringify(arr));
    }

    function render() {
        const activities = loadActivities();
        listEl.innerHTML = '';
        if (activities.length === 0) {
            listEl.innerHTML = '<p>No activities logged yet.</p>';
            return;
        }

        activities.forEach((a, idx) => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-main">
                    <strong>${a.name}</strong>
                    <span>${a.duration} min • ${a.calories} kcal</span>
                </div>
                <div class="activity-actions">
                    <button class="btn btn-secondary" data-idx="${idx}">Delete</button>
                </div>
            `;

            const delBtn = item.querySelector('button');
            delBtn.addEventListener('click', () => {
                confirmDialog.show('Delete Activity', `Delete ${a.name}?`, (ok) => {
                    if (ok) {
                        const acts = loadActivities();
                        acts.splice(idx, 1);
                        saveActivities(acts);
                        render();
                        toast.show('Activity removed', 'info');
                    }
                });
            });

            listEl.appendChild(item);
        });
    }

    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const duration = parseInt(durationInput.value, 10);
        const calories = parseInt(caloriesInput.value, 10) || 0;

        if (!name || !duration || duration <= 0) {
            toast.show('Please enter valid activity name and duration', 'error');
            return;
        }

        const activities = loadActivities();
        activities.unshift({ name, duration, calories, at: new Date().toISOString() });
        saveActivities(activities);
        nameInput.value = '';
        durationInput.value = '';
        caloriesInput.value = '';
        render();
        toast.show('Activity logged', 'success');
    });

    render();
}

// ==================== WATER TRACKER ====================
function initializeWaterTracker() {
    const addCupBtn = document.getElementById('addCupBtn');
    const removeCupBtn = document.getElementById('removeCupBtn');
    const resetBtn = document.getElementById('resetWaterBtn');
    const waterText = document.getElementById('waterText');

    const goal = 8; // cups default
    const key = `water_${new Date().toISOString().slice(0,10)}`;

    function getCups() {
        return parseInt(localStorage.getItem(key) || '0', 10);
    }
    function setCups(v) {
        localStorage.setItem(key, v);
    }
    function update() {
        const cups = getCups();
        waterText.textContent = `${cups} / ${goal} cups`;
    }

    addCupBtn.addEventListener('click', () => {
        const cups = Math.min(goal, getCups() + 1);
        setCups(cups);
        update();
        toast.show('Added one cup', 'success');
    });

    removeCupBtn.addEventListener('click', () => {
        const cups = Math.max(0, getCups() - 1);
        setCups(cups);
        update();
    });

    resetBtn.addEventListener('click', () => {
        confirmDialog.show('Reset Water', 'Reset water intake for today?', (ok) => {
            if (ok) {
                setCups(0);
                update();
                toast.show('Water intake reset', 'info');
            }
        });
    });

    update();
}

// ==================== SLEEP TRACKER ====================
function initializeSleepTracker() {
    if (!document.getElementById('sleepHistory')) return;
    const logBtn = document.getElementById('logSleepBtn');
    const clearBtn = document.getElementById('clearSleepBtn');
    const hoursInput = document.getElementById('sleepHours');
    const historyEl = document.getElementById('sleepHistory');

    const key = 'sleepHistory';

    function load() {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    }
    function save(arr) {
        localStorage.setItem(key, JSON.stringify(arr));
    }

    function render() {
        const items = load();
        historyEl.innerHTML = '';
        if (items.length === 0) {
            historyEl.innerHTML = '<p>No sleep logs yet.</p>';
            return;
        }

        items.forEach(it => {
            const div = document.createElement('div');
            div.className = 'sleep-item';
            const dt = new Date(it.at);
            div.innerHTML = `<strong>${dt.toLocaleDateString()}</strong>: ${it.hours} hrs`;
            historyEl.appendChild(div);
        });
    }

    logBtn.addEventListener('click', () => {
        const hrs = parseFloat(hoursInput.value);
        if (!hrs || hrs < 0 || hrs > 24) {
            toast.show('Enter a valid number of hours (0-24)', 'error');
            return;
        }
        const arr = load();
        arr.unshift({ hours: hrs, at: new Date().toISOString() });
        save(arr.slice(0, 30)); // keep last 30
        hoursInput.value = '';
        render();
        toast.show('Sleep logged', 'success');
    });

    clearBtn.addEventListener('click', () => {
        confirmDialog.show('Clear Sleep History', 'Clear all sleep history?', (ok) => {
            if (ok) {
                save([]);
                render();
                toast.show('Sleep history cleared', 'info');
            }
        });
    });

    render();
}
