export interface LabCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgGradient: string;
  testCount: number;
  description: string;
}

export interface LabTest {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  price: number;
  discountPercent: number;
  discountedPrice: number;
  popular: boolean;
  homeCollection: boolean;
  fastingRequired: boolean;
  duration: string;
  description: string;
  preparation: string;
  parameters: string[];
  reviews: LabTestReview[];
  rating: number;
  totalReviews: number;
  labName: string;
  reportDelivery: string;
  recommended?: boolean;
  tubeColor?: string;
}

export interface LabTestReview {
  id: string;
  userName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface LabPackage {
  id: string;
  name: string;
  tests: string[];
  testCount: number;
  price: number;
  discountPercent: number;
  discountedPrice: number;
  description: string;
  popular: boolean;
  gradient: string;
  emoji: string;
}

export interface CartItem {
  testId: string;
  testName: string;
  price: number;
  discountedPrice: number;
  homeCollection: boolean;
  labName: string;
  quantity: number;
}

export interface LabOrder {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  address: string;
  appointmentDate: string;
  appointmentSlot: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  technicianName?: string;
  reportUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NearbyLab {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  totalReviews: number;
  homeCollection: boolean;
  timings: string;
  specialties: string[];
  emoji: string;
}
