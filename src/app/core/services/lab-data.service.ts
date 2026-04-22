import { Injectable, signal, computed } from '@angular/core';
import { LabTest, LabCategory, LabPackage, NearbyLab, CartItem, LabOrder } from '../models/lab-test.model';

@Injectable({ providedIn: 'root' })
export class LabDataService {

  // ─── Categories ───────────────────────────────────────────────────────────
  readonly categories: LabCategory[] = [
    { id: 'full-body', name: 'Full Body Checkup', emoji: '🫀', color: '#e53e3e', bgGradient: 'linear-gradient(135deg,#fff5f5,#fed7d7)', testCount: 12, description: 'Comprehensive health screening covering all major organs' },
    { id: 'blood', name: 'Blood Tests', emoji: '🩸', color: '#dd6b20', bgGradient: 'linear-gradient(135deg,#fffaf0,#fbd38d)', testCount: 28, description: 'CBC, ESR, Blood Group and more blood panel tests' },
    { id: 'diabetes', name: 'Diabetes', emoji: '🍬', color: '#d69e2e', bgGradient: 'linear-gradient(135deg,#fffff0,#faf089)', testCount: 8, description: 'HbA1c, Fasting Glucose, Insulin, PPBS' },
    { id: 'thyroid', name: 'Thyroid', emoji: '🦋', color: '#2b6cb0', bgGradient: 'linear-gradient(135deg,#ebf8ff,#bee3f8)', testCount: 6, description: 'T3, T4, TSH and thyroid antibody tests' },
    { id: 'covid', name: 'Covid / Viral', emoji: '🦠', color: '#6b46c1', bgGradient: 'linear-gradient(135deg,#faf5ff,#e9d8fd)', testCount: 10, description: 'RT-PCR, Rapid Antigen, Antibody and viral tests' },
    { id: 'cardiac', name: 'Cardiac', emoji: '❤️', color: '#c53030', bgGradient: 'linear-gradient(135deg,#fff5f5,#fc8181)', testCount: 9, description: 'Cholesterol, Lipid Profile, Troponin, ECG' },
    { id: 'liver', name: 'Liver Function', emoji: '🟢', color: '#276749', bgGradient: 'linear-gradient(135deg,#f0fff4,#9ae6b4)', testCount: 7, description: 'LFT, SGOT, SGPT, Bilirubin and liver enzymes' },
    { id: 'kidney', name: 'Kidney Function', emoji: '🫘', color: '#744210', bgGradient: 'linear-gradient(135deg,#fffbeb,#fbd38d)', testCount: 7, description: 'KFT, Creatinine, Urea, Uric Acid' },
    { id: 'vitamin', name: 'Vitamin Tests', emoji: '☀️', color: '#975a16', bgGradient: 'linear-gradient(135deg,#fffff0,#f6e05e)', testCount: 5, description: 'Vitamin D, B12, Folate and micronutrient panel' },
    { id: 'urine', name: 'Urine Tests', emoji: '🧪', color: '#2c7a7b', bgGradient: 'linear-gradient(135deg,#e6fffa,#81e6d9)', testCount: 6, description: 'Urine routine, microalbumin, 24hr urine tests' },
    { id: 'allergy', name: 'Allergy', emoji: '🌸', color: '#97266d', bgGradient: 'linear-gradient(135deg,#fff5f7,#fed7e2)', testCount: 8, description: 'Food, pollen, dust and comprehensive allergy panels' },
    { id: 'cancer', name: 'Cancer Markers', emoji: '🔬', color: '#553c9a', bgGradient: 'linear-gradient(135deg,#faf5ff,#d6bcfa)', testCount: 11, description: 'PSA, CEA, AFP, CA-125 and tumour marker tests' },
  ];

  // ─── Tests ────────────────────────────────────────────────────────────────
  readonly tests: LabTest[] = [
    // Full Body
    { id: 'fb-01', name: 'Complete Full Body Checkup', categoryId: 'full-body', category: 'Full Body Checkup', price: 2999, discountPercent: 40, discountedPrice: 1799, popular: true, homeCollection: true, fastingRequired: true, duration: '24-48 hrs', description: 'A comprehensive 72-parameter health checkup covering CBC, liver, kidney, thyroid, diabetes, lipid, and more.', preparation: 'Requires 10-12 hours fasting. Drink water freely. Avoid strenuous exercise before sample collection.', parameters: ['CBC (28 parameters)', 'Liver Function Test', 'Kidney Function Test', 'Thyroid (T3,T4,TSH)', 'Lipid Profile', 'Blood Sugar Fasting', 'HbA1c', 'Urine Routine', 'Vitamin D', 'Vitamin B12'], reviews: [ { id: 'r1', userName: 'Priya S.', avatar: 'PS', rating: 5, comment: 'Very smooth experience, reports on time!', date: '12 Apr 2025' }, { id: 'r2', userName: 'Amit K.', avatar: 'AK', rating: 4, comment: 'Good package, great value for money.', date: '8 Apr 2025' } ], rating: 4.7, totalReviews: 1243, labName: 'Apollo Diagnostics', reportDelivery: '48 hours', recommended: true },
    { id: 'fb-02', name: 'Basic Health Checkup', categoryId: 'full-body', category: 'Full Body Checkup', price: 999, discountPercent: 20, discountedPrice: 799, popular: false, homeCollection: true, fastingRequired: true, duration: '24 hrs', description: 'Essential 30-parameter checkup ideal for annual screening.', preparation: '8-10 hours fasting required.', parameters: ['CBC', 'Blood Sugar', 'Urine Routine', 'Lipid Profile', 'Kidney Function'], reviews: [], rating: 4.3, totalReviews: 542, labName: 'Thyrocare', reportDelivery: '24 hours' },
    { id: 'fb-03', name: 'Senior Citizen Package', categoryId: 'full-body', category: 'Full Body Checkup', price: 3499, discountPercent: 35, discountedPrice: 2274, popular: true, homeCollection: true, fastingRequired: true, duration: '48 hrs', description: 'Specially designed for individuals above 60 years. 85+ parameters.', preparation: '12 hours fasting recommended.', parameters: ['Cardiac Risk Panel', 'Bone Density (Calcium/Phosphorus)', 'Vitamin D & B12', 'Thyroid', 'Diabetes', 'Liver & Kidney', 'CBC', 'Urine Routine', 'PSA (Males)'], reviews: [], rating: 4.8, totalReviews: 312, labName: 'SRL Diagnostics', reportDelivery: '48 hours', recommended: true },
    // Blood Tests
    { id: 'bl-01', name: 'Complete Blood Count (CBC)', categoryId: 'blood', category: 'Blood Tests', price: 299, discountPercent: 25, discountedPrice: 224, popular: true, homeCollection: true, fastingRequired: false, duration: '6-8 hrs', description: 'CBC includes RBC, WBC, platelets and haemoglobin levels.', preparation: 'No fasting required.', parameters: ['Haemoglobin', 'RBC Count', 'WBC Count', 'Platelet Count', 'Haematocrit', 'MCV, MCH, MCHC', 'Differential Count'], reviews: [ { id: 'r3', userName: 'Neha R.', avatar: 'NR', rating: 5, comment: 'Accurate results, fast turnaround.', date: '15 Apr 2025' } ], rating: 4.9, totalReviews: 8543, labName: 'Lal PathLabs', reportDelivery: '8 hours' },
    { id: 'bl-02', name: 'Lipid Profile', categoryId: 'blood', category: 'Blood Tests', price: 499, discountPercent: 30, discountedPrice: 349, popular: true, homeCollection: true, fastingRequired: true, duration: '8-12 hrs', description: 'Measures cholesterol levels to assess cardiovascular risk.', preparation: '10-12 hours fasting required before sample collection.', parameters: ['Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol', 'VLDL', 'Triglycerides', 'Cholesterol/HDL Ratio'], reviews: [], rating: 4.6, totalReviews: 3210, labName: 'Apollo Diagnostics', reportDelivery: '12 hours' },
    { id: 'bl-03', name: 'Blood Group & Rh Factor', categoryId: 'blood', category: 'Blood Tests', price: 149, discountPercent: 0, discountedPrice: 149, popular: false, homeCollection: true, fastingRequired: false, duration: '4 hrs', description: 'Determines your ABO blood group and Rh factor.', preparation: 'No fasting required.', parameters: ['ABO Grouping', 'Rh Typing'], reviews: [], rating: 4.8, totalReviews: 5621, labName: 'Thyrocare', reportDelivery: '4 hours' },
    { id: 'bl-04', name: 'ESR Test', categoryId: 'blood', category: 'Blood Tests', price: 199, discountPercent: 10, discountedPrice: 179, popular: false, homeCollection: true, fastingRequired: false, duration: '6 hrs', description: 'Erythrocyte Sedimentation Rate — detects inflammation.', preparation: 'No fasting required.', parameters: ['ESR (Westergren Method)'], reviews: [], rating: 4.4, totalReviews: 1102, labName: 'Lal PathLabs', reportDelivery: '6 hours' },
    // Diabetes
    { id: 'db-01', name: 'HbA1c (Glycated Haemoglobin)', categoryId: 'diabetes', category: 'Diabetes', price: 499, discountPercent: 20, discountedPrice: 399, popular: true, homeCollection: true, fastingRequired: false, duration: '8 hrs', description: 'Measures average blood sugar over 3 months. Key test for diabetes management.', preparation: 'No fasting required. Can be taken any time of day.', parameters: ['HbA1c %', 'Estimated Average Glucose (eAG)'], reviews: [ { id: 'r4', userName: 'Rajesh M.', avatar: 'RM', rating: 5, comment: 'Very important test, reports were clear.', date: '18 Apr 2025' } ], rating: 4.8, totalReviews: 4321, labName: 'Metropolis', reportDelivery: '8 hours', recommended: true },
    { id: 'db-02', name: 'Diabetes Screening Package', categoryId: 'diabetes', category: 'Diabetes', price: 999, discountPercent: 30, discountedPrice: 699, popular: true, homeCollection: true, fastingRequired: true, duration: '12 hrs', description: 'Complete diabetes evaluation including fasting, post-meal and HbA1c.', preparation: '8-10 hours fasting. Sample collected before and 2 hours after a meal.', parameters: ['Fasting Blood Sugar', 'PP Blood Sugar (2hr)', 'HbA1c', 'Serum Insulin Fasting', 'Urine Microalbumin'], reviews: [], rating: 4.7, totalReviews: 2134, labName: 'SRL Diagnostics', reportDelivery: '12 hours' },
    { id: 'db-03', name: 'Fasting Blood Glucose', categoryId: 'diabetes', category: 'Diabetes', price: 149, discountPercent: 0, discountedPrice: 149, popular: false, homeCollection: true, fastingRequired: true, duration: '4 hrs', description: 'Measures blood glucose level after fasting.', preparation: '8+ hours fasting required.', parameters: ['Blood Glucose Fasting'], reviews: [], rating: 4.5, totalReviews: 9821, labName: 'Thyrocare', reportDelivery: '4 hours' },
    // Thyroid
    { id: 'th-01', name: 'Thyroid Profile (T3, T4, TSH)', categoryId: 'thyroid', category: 'Thyroid', price: 599, discountPercent: 30, discountedPrice: 419, popular: true, homeCollection: true, fastingRequired: false, duration: '8 hrs', description: 'Evaluates thyroid gland function — identifies hypo/hyperthyroidism.', preparation: 'No fasting required. Avoid thyroid medication before test (consult doctor).', parameters: ['T3 (Triiodothyronine)', 'T4 (Thyroxine)', 'TSH (Thyroid Stimulating Hormone)'], reviews: [ { id: 'r5', userName: 'Sujata P.', avatar: 'SP', rating: 5, comment: 'Reports explained clearly, very helpful.', date: '11 Apr 2025' } ], rating: 4.8, totalReviews: 6123, labName: 'Apollo Diagnostics', reportDelivery: '8 hours', recommended: true },
    { id: 'th-02', name: 'TSH (Ultra-sensitive)', categoryId: 'thyroid', category: 'Thyroid', price: 299, discountPercent: 0, discountedPrice: 299, popular: false, homeCollection: true, fastingRequired: false, duration: '6 hrs', description: 'Highly sensitive TSH measurement for early thyroid dysfunction detection.', preparation: 'No fasting required.', parameters: ['TSH (3rd Generation)'], reviews: [], rating: 4.7, totalReviews: 3421, labName: 'Lal PathLabs', reportDelivery: '6 hours' },
    // Covid / Viral
    { id: 'cv-01', name: 'RT-PCR Covid Test', categoryId: 'covid', category: 'Covid / Viral', price: 799, discountPercent: 25, discountedPrice: 599, popular: true, homeCollection: true, fastingRequired: false, duration: '24 hrs', description: 'Gold standard PCR test for active COVID-19 detection.', preparation: 'Avoid eating, drinking or smoking 30 minutes before swab collection.', parameters: ['SARS-CoV-2 RNA Detection', 'Ct Value Reporting'], reviews: [], rating: 4.6, totalReviews: 12543, labName: 'SRL Diagnostics', reportDelivery: '24 hours' },
    { id: 'cv-02', name: 'COVID Antibody Test (IgG)', categoryId: 'covid', category: 'Covid / Viral', price: 999, discountPercent: 20, discountedPrice: 799, popular: false, homeCollection: true, fastingRequired: false, duration: '12 hrs', description: 'Detects IgG antibodies indicating past COVID-19 infection or vaccination.', preparation: 'No fasting required.', parameters: ['IgG Antibody Titre', 'Interpretation Report'], reviews: [], rating: 4.5, totalReviews: 4321, labName: 'Metropolis', reportDelivery: '12 hours' },
    // Cardiac
    { id: 'ca-01', name: 'Cardiac Risk Assessment', categoryId: 'cardiac', category: 'Cardiac', price: 1499, discountPercent: 35, discountedPrice: 974, popular: true, homeCollection: true, fastingRequired: true, duration: '24 hrs', description: 'Comprehensive cardiac panel to evaluate heart disease risk.', preparation: '10-12 hours fasting required.', parameters: ['Total Cholesterol', 'HDL/LDL', 'Triglycerides', 'hs-CRP', 'Homocysteine', 'Apolipoprotein A & B', 'Lipoprotein(a)'], reviews: [ { id: 'r6', userName: 'Vivek D.', avatar: 'VD', rating: 5, comment: 'Great panel, found hidden risk factors!', date: '5 Apr 2025' } ], rating: 4.9, totalReviews: 1542, labName: 'Apollo Diagnostics', reportDelivery: '24 hours', recommended: true },
    // Liver
    { id: 'lv-01', name: 'Liver Function Test (LFT)', categoryId: 'liver', category: 'Liver Function', price: 499, discountPercent: 20, discountedPrice: 399, popular: true, homeCollection: true, fastingRequired: false, duration: '8 hrs', description: 'Complete evaluation of liver health including enzymes and bilirubin.', preparation: 'No fasting required.', parameters: ['SGOT (AST)', 'SGPT (ALT)', 'Total Bilirubin', 'Direct Bilirubin', 'Alkaline Phosphatase', 'Total Protein', 'Albumin', 'Globulin'], reviews: [], rating: 4.7, totalReviews: 3456, labName: 'Thyrocare', reportDelivery: '8 hours' },
    // Kidney
    { id: 'kd-01', name: 'Kidney Function Test (KFT)', categoryId: 'kidney', category: 'Kidney Function', price: 499, discountPercent: 20, discountedPrice: 399, popular: true, homeCollection: true, fastingRequired: false, duration: '8 hrs', description: 'Evaluates kidney health with creatinine, urea and electrolytes.', preparation: 'No fasting required. Stay well hydrated.', parameters: ['Creatinine', 'Blood Urea', 'Uric Acid', 'Sodium', 'Potassium', 'Calcium', 'BUN/Creatinine Ratio', 'eGFR'], reviews: [], rating: 4.8, totalReviews: 2987, labName: 'SRL Diagnostics', reportDelivery: '8 hours' },
    // Vitamins
    { id: 'vt-01', name: 'Vitamin D Test', categoryId: 'vitamin', category: 'Vitamin Tests', price: 899, discountPercent: 30, discountedPrice: 629, popular: true, homeCollection: true, fastingRequired: false, duration: '24 hrs', description: '25-OH Vitamin D — the most reliable marker of Vitamin D status.', preparation: 'No fasting required.', parameters: ['25-Hydroxy Vitamin D Total'], reviews: [ { id: 'r7', userName: 'Kavita T.', avatar: 'KT', rating: 5, comment: 'Got deficiency detected early, very helpful!', date: '14 Apr 2025' } ], rating: 4.7, totalReviews: 8123, labName: 'Metropolis', reportDelivery: '24 hours', recommended: true },
    { id: 'vt-02', name: 'Vitamin B12 Test', categoryId: 'vitamin', category: 'Vitamin Tests', price: 699, discountPercent: 15, discountedPrice: 594, popular: false, homeCollection: true, fastingRequired: false, duration: '24 hrs', description: 'Measures Vitamin B12 levels — important for nerve and blood cell health.', preparation: 'No fasting required.', parameters: ['Vitamin B12 (Cobalamin)'], reviews: [], rating: 4.6, totalReviews: 4321, labName: 'Lal PathLabs', reportDelivery: '24 hours' },
  ];

  // ─── Packages ─────────────────────────────────────────────────────────────
  readonly packages: LabPackage[] = [
    { id: 'pkg-01', name: 'Aarogya Full Body', tests: ['CBC', 'LFT', 'KFT', 'Thyroid', 'Lipid Profile', 'Diabetes', 'Vitamin D & B12', 'Urine Routine'], testCount: 72, price: 3499, discountPercent: 50, discountedPrice: 1749, description: 'Most comprehensive wellness package for the whole family.', popular: true, gradient: 'linear-gradient(135deg,#667eea,#764ba2)', emoji: '🌟' },
    { id: 'pkg-02', name: 'Diabetes Care Pro', tests: ['HbA1c', 'Fasting Sugar', 'PP Sugar', 'Insulin', 'Urine Microalbumin', 'KFT'], testCount: 18, price: 1499, discountPercent: 40, discountedPrice: 899, description: 'Monitor and manage diabetes with precision.', popular: false, gradient: 'linear-gradient(135deg,#f6d365,#fda085)', emoji: '💉' },
    { id: 'pkg-03', name: 'Heart Health Package', tests: ['Lipid Profile', 'hs-CRP', 'Homocysteine', 'ECG', 'Troponin-I', 'BNP'], testCount: 25, price: 2499, discountPercent: 45, discountedPrice: 1374, description: 'Early detection of cardiac risk factors.', popular: true, gradient: 'linear-gradient(135deg,#ff416c,#ff4b2b)', emoji: '❤️' },
    { id: 'pkg-04', name: 'Women\'s Wellness Elite', tests: ['CBC', 'Thyroid', 'Iron Studies', 'CA-125', 'Pap Smear', 'Vitamin D', 'Prolactin', 'FSH/LH'], testCount: 38, price: 2999, discountPercent: 40, discountedPrice: 1799, description: 'Holistic health package designed for women.', popular: true, gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', emoji: '👩‍⚕️' },
  ];

  // ─── Nearby Labs ──────────────────────────────────────────────────────────
  readonly nearbyLabs: NearbyLab[] = [
    { id: 'lab-01', name: 'Apollo Diagnostics', address: 'Sector 18, Noida', distance: '0.8 km', rating: 4.9, totalReviews: 2341, homeCollection: true, timings: '7 AM – 9 PM', specialties: ['Blood Tests', 'Radiology', 'Pathology'], emoji: '🏥' },
    { id: 'lab-02', name: 'Lal PathLabs', address: 'MG Road, Gurugram', distance: '1.2 km', rating: 4.8, totalReviews: 5412, homeCollection: true, timings: '6 AM – 10 PM', specialties: ['Blood Tests', 'Covid Tests', 'Urine Tests'], emoji: '🔬' },
    { id: 'lab-03', name: 'Thyrocare', address: 'Andheri West, Mumbai', distance: '2.1 km', rating: 4.7, totalReviews: 8123, homeCollection: true, timings: '6 AM – 8 PM', specialties: ['Thyroid', 'Full Body', 'Allergy Tests'], emoji: '🧫' },
    { id: 'lab-04', name: 'SRL Diagnostics', address: 'Koramangala, Bengaluru', distance: '1.9 km', rating: 4.6, totalReviews: 3421, homeCollection: true, timings: '7 AM – 9 PM', specialties: ['Pathology', 'Biopsy', 'Microbiology'], emoji: '🧪' },
  ];

  // ─── Cart State ───────────────────────────────────────────────────────────
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().reduce((sum, i) => sum + i.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((sum, i) => sum + i.discountedPrice * i.quantity, 0));

  addToCart(test: LabTest) {
    const existing = this.cartItems().find(i => i.testId === test.id);
    if (existing) {
      this.cartItems.update(items => items.map(i => i.testId === test.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      this.cartItems.update(items => [...items, {
        testId: test.id, testName: test.name, price: test.price,
        discountedPrice: test.discountedPrice, homeCollection: test.homeCollection,
        labName: test.labName, quantity: 1
      }]);
    }
  }

  removeFromCart(testId: string) {
    this.cartItems.update(items => items.filter(i => i.testId !== testId));
  }

  clearCart() { this.cartItems.set([]); }

  isInCart(testId: string) { return this.cartItems().some(i => i.testId === testId); }

  // ─── Orders (mock) ─────────────────────────────────────────────────────────
  readonly mockOrders: LabOrder[] = [
    { id: 'ORD-1001', userId: 'u1', userName: 'Rahul Sharma', items: [{ testId: 'bl-01', testName: 'Complete Blood Count', price: 299, discountedPrice: 224, homeCollection: true, labName: 'Lal PathLabs', quantity: 1 }], totalAmount: 224, address: 'A-14, Sector 62, Noida – 201301', appointmentDate: '22 Apr 2025', appointmentSlot: '8:00 AM – 9:00 AM', paymentMethod: 'upi', paymentStatus: 'paid', status: 'completed', technicianName: 'Arun Kumar', reportUrl: '#', createdAt: '20 Apr 2025', updatedAt: '22 Apr 2025' },
    { id: 'ORD-1002', userId: 'u1', userName: 'Rahul Sharma', items: [{ testId: 'db-01', testName: 'HbA1c', price: 499, discountedPrice: 399, homeCollection: true, labName: 'Metropolis', quantity: 1 }, { testId: 'th-01', testName: 'Thyroid Profile', price: 599, discountedPrice: 419, homeCollection: true, labName: 'Apollo Diagnostics', quantity: 1 }], totalAmount: 818, address: 'A-14, Sector 62, Noida – 201301', appointmentDate: '25 Apr 2025', appointmentSlot: '9:00 AM – 10:00 AM', paymentMethod: 'card', paymentStatus: 'paid', status: 'processing', technicianName: 'Priya Singh', createdAt: '23 Apr 2025', updatedAt: '24 Apr 2025' },
    { id: 'ORD-1003', userId: 'u1', userName: 'Rahul Sharma', items: [{ testId: 'fb-01', testName: 'Complete Full Body Checkup', price: 2999, discountedPrice: 1799, homeCollection: true, labName: 'Apollo Diagnostics', quantity: 1 }], totalAmount: 1799, address: 'A-14, Sector 62, Noida – 201301', appointmentDate: '28 Apr 2025', appointmentSlot: '7:00 AM – 8:00 AM', paymentMethod: 'upi', paymentStatus: 'pending', status: 'pending', createdAt: '26 Apr 2025', updatedAt: '26 Apr 2025' },
  ];

  getTestsByCategory(categoryId: string): LabTest[] {
    return this.tests.filter(t => t.categoryId === categoryId);
  }

  getTestById(id: string): LabTest | undefined {
    return this.tests.find(t => t.id === id);
  }

  getCategoryById(id: string): LabCategory | undefined {
    return this.categories.find(c => c.id === id);
  }

  getPopularTests(): LabTest[] {
    return this.tests.filter(t => t.popular);
  }

  getRecommendedTests(): LabTest[] {
    return this.tests.filter(t => t.recommended);
  }
}
