export type UserRole = 'public_visitor' | 'registered_user' | 'paid_customer' | 'owner';

// Realistic Small Business Account Roles
export type AccountRole = 'PUBLIC_VISITOR' | 'REGISTERED_USER' | 'PAID_CUSTOMER' | 'OWNER';

export type CardFinish = 
  | 'Matte Obsidian Black'
  | 'Brushed Titanium Steel'
  | 'Champagne Gold Brass'
  | 'Frosted Crystal Hybrid'
  | '24K Gold Mirror Ingot'
  | 'Ceramic Polar White'
  | string;

// Real Order Lifecycle: REQUESTED -> PAYMENT_PENDING -> PAYMENT_CONFIRMED -> DESIGN_CONFIRMED -> PRODUCTION -> READY_TO_SHIP -> DELIVERED
export type PaymentStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'CANCELLED';
export type ProductionStatus = 
  | 'REQUESTED' 
  | 'PAYMENT_PENDING' 
  | 'PAYMENT_CONFIRMED' 
  | 'DESIGN_CONFIRMED'
  | 'PRODUCTION' 
  | 'PROGRAMMING'
  | 'READY_TO_SHIP' 
  | 'DELIVERED';
export type ShippingStatus = 'NOT_SHIPPED' | 'SHIPPED' | 'DELIVERED';

// NFC Card Status Lifecycle: AVAILABLE -> ASSIGNED -> ACTIVE (or SUSPENDED / LOCKED)
export type CardInventoryStatus = 'AVAILABLE' | 'ASSIGNED' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED';

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  shippingAddress: string;
}

export interface Order {
  id: string; // e.g. ORD-2026-101
  customer: OrderCustomer;
  selectedDesign: {
    id: string;
    name: string;
    finish: string;
    price: string;
  };
  engraving: {
    name: string;
    subtext: string;
  };
  quantity: number;
  price: string;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  shippingStatus: ShippingStatus;
  trackingNumber: string | null;
  associatedCardSerialNumber: string | null;
  createdDate: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType: 'REGISTERED_USER' | 'PAID_CUSTOMER';
  cardStatus: 'AVAILABLE' | 'ACTIVE' | 'SUSPENDED' | 'NO_CARD';
  orderStatus: 'NONE' | 'REQUESTED' | 'PENDING_PAYMENT' | 'PAYMENT_CONFIRMED' | 'PRODUCTION' | 'SHIPPED' | 'DELIVERED';
  createdDate: string;
  slug: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  activeCardSerial?: string;
}

export interface NfcCard {
  id?: string;
  serialNumber: string; // e.g. TLP-000001
  design: string;
  finish: string;
  status: CardInventoryStatus;
  customer: string | null; // Customer Name or null
  customerEmail: string | null;
  createdDate: string;
  activatedDate: string | null;
  activationCode?: string; // Plaintext code provided in customer packaging (e.g. A82K-X91P)
  activationCodeHash?: string; // SHA-256 hash stored in database
  isHardwareLocked?: boolean;
  tapCount?: number;
}

export interface PhysicalCard {
  id: string;
  serialNumber: string; // e.g. TLP-000001 or TLP-8824-M
  activationHash: string; // SHA-256 cryptographic hash representation
  activationCode?: string; // Plaintext code on physical packaging
  status: 'AVAILABLE' | 'ASSIGNED' | 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  designId: string;
  designName: string;
  finish: CardFinish;
  batchNumber?: string;
  nfcChipType?: string;
  activatedAt: string | null;
  linkedSlug: string | null;
  isHardwareLocked: boolean;
  tapCount?: number;
}

export interface CardDesign {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  availability: 'IN_STOCK' | 'PRE_ORDER' | 'WAITLIST' | 'DISABLED';
  price: string;
  finish: string;
  material?: string;
  cardColor?: string;
  accentColor?: string;
  weight?: string;
  tag?: string;
}

export interface AvatarCropData {
  x: number;
  y: number;
  zoom: number;
  rotate: number;
}

export interface UserContacts {
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  email?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
}

export interface UserPayment {
  enabled?: boolean;
  duitNow?: string;
  bankName?: string;
  bankAccount?: string;
  paypal?: string;
}

export interface UserAppearance {
  theme: 'obsidian' | 'ivory' | 'champagne' | 'titanium';
  cardStyle: 'executive' | 'minimal' | 'monogram';
}

export interface UserProfile {
  slug: string;
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  location?: string;
  avatarUrl: string;
  avatarCrop: AvatarCropData;
  contacts: UserContacts;
  appearance: UserAppearance;
  payment?: UserPayment;
  isDemo: boolean;
  updatedAt: string;
}
