'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  Palette,
  Search,
  Plus,
  Check,
  X,
  Truck,
  Package,
  Clock,
  AlertCircle,
  CheckCircle2,
  Eye,
  Edit3,
  Tag,
  KeyRound,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  Customer,
  Order,
  NfcCard,
  CardDesign,
  PaymentStatus,
  ProductionStatus,
  ShippingStatus,
  CardInventoryStatus,
} from '@/types/taplink';

interface OwnerDashboardProps {
  customers: Customer[];
  orders: Order[];
  cards: NfcCard[];
  designs: CardDesign[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
  onAddCard: (card: NfcCard) => void;
  onUpdateCard: (serialNumber: string, updates: Partial<NfcCard>) => void;
  onAddDesign: (design: CardDesign) => void;
  onUpdateDesign: (designId: string, updates: Partial<CardDesign>) => void;
  onToggleCustomerStatus?: (customerId: string) => void;
  onViewCustomerProfile?: (slug: string) => void;
}

type OwnerTab = 'overview' | 'customers' | 'orders' | 'inventory' | 'designs';

export function OwnerDashboard({
  customers,
  orders,
  cards,
  designs,
  onUpdateOrder,
  onAddCard,
  onUpdateCard,
  onAddDesign,
  onUpdateDesign,
  onViewCustomerProfile,
}: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<OwnerTab>('overview');

  // Customer Detail Drawer state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');

  // Order filters and Assign Card Modal state
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [selectedOrderForCardAssign, setSelectedOrderForCardAssign] = useState<Order | null>(null);
  const [assignCardSerial, setAssignCardSerial] = useState('');

  // Card Inventory Modal state
  const [addCardModalOpen, setAddCardModalOpen] = useState(false);
  const [newCardSerial, setNewCardSerial] = useState('');
  const [newCardDesign, setNewCardDesign] = useState(designs[0]?.name || 'The Obsidian Sovereign');
  const [newCardFinish, setNewCardFinish] = useState(designs[0]?.finish || 'Matte Obsidian Black');
  const [newCardCode, setNewCardCode] = useState('');

  // Design Catalog Modal state
  const [addDesignModalOpen, setAddDesignModalOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<CardDesign | null>(null);
  const [designForm, setDesignForm] = useState<Partial<CardDesign>>({
    name: '',
    category: 'Solid Metal',
    description: '',
    price: '$129 USD',
    finish: 'Matte Obsidian Black',
    availability: 'IN_STOCK',
  });

  // Calculate Real Business Metrics (no fake numbers)
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'PENDING' || o.productionStatus !== 'DELIVERED').length;
  const cardsAvailable = cards.filter((c) => c.status === 'AVAILABLE').length;
  const cardsActivated = cards.filter((c) => c.status === 'ACTIVE').length;

  // Filtered views
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.company?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.selectedDesign.name.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Available cards that can be assigned to an order
  const availableSerials = cards.filter((c) => c.status === 'AVAILABLE').map((c) => c.serialNumber);

  // Handle Add New Physical Card to Vault
  const handleCreateNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardSerial.trim()) return;
    const cleanSerial = newCardSerial.trim().toUpperCase();
    const cleanCode = newCardCode.trim().toUpperCase() || `KEY-${Math.floor(1000 + Math.random() * 9000)}-NFC`;

    onAddCard({
      serialNumber: cleanSerial,
      design: newCardDesign,
      finish: newCardFinish,
      status: 'AVAILABLE',
      customer: null,
      customerEmail: null,
      createdDate: new Date().toISOString().split('T')[0],
      activatedDate: null,
      activationCode: cleanCode,
    });

    setNewCardSerial('');
    setNewCardCode('');
    setAddCardModalOpen(false);
  };

  // Handle Save Design (Add or Edit)
  const handleSaveDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designForm.name || !designForm.price) return;

    if (editingDesign) {
      onUpdateDesign(editingDesign.id, designForm);
    } else {
      const newId = `design-${designForm.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      onAddDesign({
        id: newId,
        name: designForm.name,
        category: designForm.category || 'Solid Metal',
        description: designForm.description || '',
        price: designForm.price,
        finish: designForm.finish || 'Custom Bespoke',
        availability: (designForm.availability as any) || 'IN_STOCK',
        cardColor: '#161514',
        accentColor: '#C9A24B',
      });
    }

    setEditingDesign(null);
    setAddDesignModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121110] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#181716] text-[#C9A24B]">
                Owner Dashboard
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-amber-100 text-amber-800 border border-amber-300">
                DEMO MODE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#121110] mt-2">
              TapLinkPro Operations Control
            </h1>
            <p className="text-xs text-[#736E66] mt-1">
              Fulfillment, client registration, card inventory, and bespoke catalog management.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#EFECE6] border border-[#E5DFD5] overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Customers ({customers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Orders ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'inventory'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Card Inventory ({cards.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'designs'
                  ? 'bg-[#181716] text-[#FAF8F5] shadow-sm'
                  : 'text-[#736E66] hover:text-[#121110]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Designs ({designs.length})</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: OVERVIEW SECTION */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Core Operational Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#736E66] uppercase tracking-wider">
                    Total Customers
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center text-[#181716]">
                    <Users className="w-4 h-4 text-[#C9A24B]" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold font-serif-display text-[#121110]">
                    {totalCustomers}
                  </span>
                  <p className="text-[11px] text-[#736E66] mt-1">
                    {customers.filter((c) => c.accountType === 'PAID_CUSTOMER').length} active cardholders
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#736E66] uppercase tracking-wider">
                    Pending Orders
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center text-[#181716]">
                    <ShoppingBag className="w-4 h-4 text-[#C9A24B]" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold font-serif-display text-[#121110]">
                    {pendingOrders}
                  </span>
                  <p className="text-[11px] text-[#736E66] mt-1">
                    Requires payment or fabrication
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#736E66] uppercase tracking-wider">
                    Cards Available
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center text-[#181716]">
                    <CreditCard className="w-4 h-4 text-[#C9A24B]" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold font-serif-display text-[#121110]">
                    {cardsAvailable}
                  </span>
                  <p className="text-[11px] text-[#736E66] mt-1">
                    Unclaimed in hardware vault
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E5DFD5] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#736E66] uppercase tracking-wider">
                    Activated Cards
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-center text-[#181716]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold font-serif-display text-[#121110]">
                    {cardsActivated}
                  </span>
                  <p className="text-[11px] text-[#736E66] mt-1">
                    Bound and actively tapping
                  </p>
                </div>
              </div>
            </div>

            {/* Action Required: Real operational tasks */}
            <div className="bg-white rounded-2xl border border-[#E5DFD5] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
                <div>
                  <h3 className="text-base font-serif-display font-bold text-[#121110] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#C9A24B]" />
                    <span>Action Required</span>
                  </h3>
                  <p className="text-xs text-[#736E66] mt-0.5">
                    Items needing direct owner attention (orders, payment verification, and dispatch).
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5DFD5] text-[#736E66]">
                  Real-time pipeline
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. Payment Pending Orders */}
                {orders
                  .filter((o) => o.paymentStatus === 'PENDING')
                  .map((ord) => (
                    <div
                      key={`pending-${ord.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#121110]">{ord.customer.name}</span>
                            <span className="font-mono text-[11px] text-[#736E66]">({ord.id})</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Payment Pending
                            </span>
                          </div>
                          <p className="text-[11px] text-[#736E66] mt-0.5">
                            {ord.selectedDesign.name} ({ord.price}) • Awaiting owner bank verification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onUpdateOrder(ord.id, { paymentStatus: 'PAID', productionStatus: 'DESIGN_CONFIRMED' });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#C9A24B]" />
                          <span>Confirm Payment</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {/* 2. Paid Orders Ready for Production / Serial Assignment */}
                {orders
                  .filter((o) => o.paymentStatus === 'PAID' && o.productionStatus !== 'READY_TO_SHIP' && o.productionStatus !== 'DELIVERED')
                  .map((ord) => (
                    <div
                      key={`prod-${ord.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F1EB] border border-[#E5DFD5] text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#121110]">{ord.customer.name}</span>
                            <span className="font-mono text-[11px] text-[#736E66]">({ord.id})</span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                              Production: {ord.productionStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#736E66] mt-0.5">
                            Laser Engraving: &ldquo;{ord.engraving.name}&rdquo; ({ord.engraving.subtext}) • {ord.selectedDesign.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ord.productionStatus === 'REQUESTED' && (
                          <button
                            onClick={() => onUpdateOrder(ord.id, { productionStatus: 'DESIGN_CONFIRMED' })}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-xs font-medium hover:border-[#C9A24B]"
                          >
                            Approve Design
                          </button>
                        )}
                        {ord.productionStatus === 'DESIGN_CONFIRMED' && (
                          <button
                            onClick={() => onUpdateOrder(ord.id, { productionStatus: 'PRODUCTION' })}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-xs font-medium hover:border-[#C9A24B]"
                          >
                            Send to Production
                          </button>
                        )}
                        {ord.productionStatus === 'PRODUCTION' && (
                          <button
                            onClick={() => onUpdateOrder(ord.id, { productionStatus: 'READY_TO_SHIP' })}
                            className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                          >
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                {/* 3. Ready Orders Waiting to be Shipped */}
                {orders
                  .filter((o) => o.productionStatus === 'READY_TO_SHIP' && o.shippingStatus === 'NOT_SHIPPED')
                  .map((ord) => (
                    <div
                      key={`ship-${ord.id}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#121110]">{ord.customer.name}</span>
                            <span className="font-mono text-[11px] text-[#736E66]">({ord.id})</span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                              Ready for Courier
                            </span>
                          </div>
                          <p className="text-[11px] text-[#736E66] mt-0.5">
                            Destination: {ord.customer.shippingAddress}
                            {ord.associatedCardSerialNumber
                              ? ` • Bound Serial: ${ord.associatedCardSerialNumber}`
                              : ' • Hardware serial not assigned yet'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!ord.associatedCardSerialNumber && (
                          <button
                            onClick={() => {
                              setSelectedOrderForCardAssign(ord);
                              setAssignCardSerial(availableSerials[0] || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-xs font-medium hover:border-[#C9A24B]"
                          >
                            Assign Card
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedOrderForTracking(ord);
                            setTrackingInput(ord.trackingNumber || `MY-DHL-${Math.floor(10000 + Math.random() * 90000)}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#C9A24B]" />
                          <span>Dispatch &amp; Add Tracking</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {orders.every(
                  (o) =>
                    o.paymentStatus === 'PAID' &&
                    (o.productionStatus === 'READY_TO_SHIP' || o.productionStatus === 'DELIVERED') &&
                    o.shippingStatus === 'DELIVERED'
                ) && (
                  <div className="py-6 text-center text-xs text-[#736E66]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    All existing customer orders are completely fulfilled and delivered.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CUSTOMERS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-serif-display font-bold text-[#121110]">
                  Customer Directory
                </h3>
                <p className="text-xs text-[#736E66]">
                  Full client records, active account type, linked physical card, and delivery state.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#736E66] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer name, email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5DFD5] bg-[#FAF8F5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[#736E66] font-mono text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Account Type</th>
                    <th className="py-3 px-4">Card Status</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]/70">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#121110]">
                        <div>
                          <span>{cust.name}</span>
                          {cust.company && (
                            <span className="block text-[10px] text-[#736E66] font-normal">
                              {cust.company}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-[#736E66]">{cust.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            cust.accountType === 'PAID_CUSTOMER'
                              ? 'bg-[#181716] text-[#C9A24B]'
                              : 'bg-[#E5DFD5]/60 text-[#736E66]'
                          }`}
                        >
                          {cust.accountType === 'PAID_CUSTOMER' ? 'PAID CUSTOMER' : 'REGISTERED USER'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            cust.cardStatus === 'ACTIVE'
                              ? 'text-emerald-700'
                              : cust.cardStatus === 'AVAILABLE'
                              ? 'text-amber-700'
                              : 'text-[#736E66]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cust.cardStatus === 'ACTIVE'
                                ? 'bg-emerald-500'
                                : cust.cardStatus === 'AVAILABLE'
                                ? 'bg-amber-500'
                                : 'bg-gray-400'
                            }`}
                          />
                          {cust.cardStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-mono text-[#121110]">
                          {cust.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#736E66] font-mono text-[11px]">{cust.createdDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 rounded-lg border border-[#E5DFD5] text-[11px] font-medium hover:border-[#C9A24B] hover:text-[#121110] transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden animate-fade-in space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-4">
              <div>
                <h3 className="text-lg font-serif-display font-bold text-[#121110]">
                  Bespoke Card Orders
                </h3>
                <p className="text-xs text-[#736E66]">
                  Manage the purchase lifecycle from payment confirmation, CNC milling, engraving, to shipping.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#736E66] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search order ID, client..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E5DFD5] bg-[#FAF8F5] text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
            </div>

            {/* Orders Cards / Table */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#E5DFD5] rounded-xl p-4 bg-[#FAF8F5]/40 hover:bg-[#FAF8F5] transition-all text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD5]/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#121110]">{order.id}</span>
                      <span className="text-[#736E66] font-mono text-[11px]">{order.createdDate}</span>
                      <span className="font-bold text-[#C9A24B] font-mono">{order.price}</span>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.paymentStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        PAYMENT: {order.paymentStatus}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                        PROD: {order.productionStatus}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.shippingStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.shippingStatus === 'SHIPPED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        SHIP: {order.shippingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#736E66] block">Customer</span>
                      <p className="font-semibold text-[#121110] mt-0.5">{order.customer.name}</p>
                      <p className="text-[11px] text-[#736E66] font-mono">{order.customer.email}</p>
                      <p className="text-[11px] text-[#736E66] font-mono">{order.customer.phone}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#736E66] block">Hardware Design &amp; Engraving</span>
                      <p className="font-semibold text-[#121110] mt-0.5">{order.selectedDesign.name}</p>
                      <p className="text-[11px] text-[#736E66]">Finish: {order.selectedDesign.finish}</p>
                      <p className="text-[11px] text-[#C9A24B] font-mono">
                        Engraved: &ldquo;{order.engraving.name}&rdquo; ({order.engraving.subtext})
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#736E66] block">Shipping &amp; Hardware Serial</span>
                      <p className="text-[11px] text-[#121110] mt-0.5 line-clamp-2">{order.customer.shippingAddress}</p>
                      <p className="text-[11px] text-[#736E66] mt-1 font-mono">
                        Serial: <strong className="text-[#121110]">{order.associatedCardSerialNumber || 'Unassigned'}</strong>
                      </p>
                      {order.trackingNumber && (
                        <p className="text-[11px] text-purple-700 font-mono">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Operational Action Workflow Controls */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#E5DFD5]/40">
                    {/* 1. Payment Toggle */}
                    {order.paymentStatus === 'PENDING' ? (
                      <button
                        onClick={() => onUpdateOrder(order.id, { paymentStatus: 'PAID', productionStatus: 'DESIGN_CONFIRMED' })}
                        className="px-3 py-1.5 rounded-lg bg-[#181716] text-[#FAF8F5] text-[11px] font-semibold hover:bg-[#2B2927] flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-[#C9A24B]" />
                        <span>Confirm Payment ($)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateOrder(order.id, { paymentStatus: 'PENDING' })}
                        className="px-2.5 py-1 rounded-lg border border-[#E5DFD5] text-[10px] text-[#736E66] hover:text-[#121110]"
                      >
                        Revert to Pending
                      </button>
                    )}

                    {/* 2. Production Progression */}
                    <div className="flex items-center gap-1 bg-white border border-[#E5DFD5] rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateOrder(order.id, { productionStatus: 'REQUESTED' })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          order.productionStatus === 'REQUESTED' ? 'bg-[#181716] text-white font-bold' : 'text-[#736E66]'
                        }`}
                      >
                        Req
                      </button>
                      <button
                        onClick={() => onUpdateOrder(order.id, { productionStatus: 'DESIGN_CONFIRMED' })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          order.productionStatus === 'DESIGN_CONFIRMED' ? 'bg-[#181716] text-white font-bold' : 'text-[#736E66]'
                        }`}
                      >
                        Confirmed
                      </button>
                      <button
                        onClick={() => onUpdateOrder(order.id, { productionStatus: 'PRODUCTION' })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          order.productionStatus === 'PRODUCTION' ? 'bg-[#181716] text-white font-bold' : 'text-[#736E66]'
                        }`}
                      >
                        In Mill
                      </button>
                      <button
                        onClick={() => onUpdateOrder(order.id, { productionStatus: 'READY_TO_SHIP' })}
                        className={`px-2 py-1 rounded text-[10px] font-medium ${
                          order.productionStatus === 'READY_TO_SHIP' ? 'bg-emerald-700 text-white font-bold' : 'text-[#736E66]'
                        }`}
                      >
                        Ready
                      </button>
                    </div>

                    {/* 3. Assign Card Serial */}
                    <button
                      onClick={() => {
                        setSelectedOrderForCardAssign(order);
                        setAssignCardSerial(order.associatedCardSerialNumber || availableSerials[0] || '');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E5DFD5] text-[11px] font-medium hover:border-[#C9A24B] flex items-center gap-1"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span>{order.associatedCardSerialNumber ? 'Change Serial' : 'Assign Serial'}</span>
                    </button>

                    {/* 4. Shipping / Tracking */}
                    <button
                      onClick={() => {
                        setSelectedOrderForTracking(order);
                        setTrackingInput(order.trackingNumber || `MY-DHL-${Math.floor(10000 + Math.random() * 90000)}`);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#181716] text-[#FAF8F5] text-[11px] font-semibold hover:bg-[#2B2927] flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span>{order.shippingStatus === 'NOT_SHIPPED' ? 'Ship Order' : 'Update Tracking'}</span>
                    </button>

                    {order.shippingStatus === 'SHIPPED' && (
                      <button
                        onClick={() => onUpdateOrder(order.id, { shippingStatus: 'DELIVERED' })}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: CARD INVENTORY TRACKING */}
        {/* ============================================================ */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden animate-fade-in space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-4">
              <div>
                <h3 className="text-lg font-serif-display font-bold text-[#121110]">
                  Physical Card Inventory Vault
                </h3>
                <p className="text-xs text-[#736E66]">
                  Track circulating and unclaimed physical NFC cards provided by external supplier.
                </p>
              </div>

              <button
                onClick={() => setAddCardModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all inline-flex items-center gap-2 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Add Physical Card to Vault</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[#736E66] font-mono text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Design &amp; Finish</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4">Activated Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DFD5]/70">
                  {cards.map((item) => (
                    <tr key={item.serialNumber} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#121110]">
                        {item.serialNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#121110]">{item.design}</span>
                        <span className="block text-[10px] text-[#736E66]">{item.finish}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'AVAILABLE'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'ASSIGNED'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.customer ? (
                          <div>
                            <span className="font-semibold text-[#121110]">{item.customer}</span>
                            {item.customerEmail && (
                              <span className="block text-[10px] text-[#736E66] font-mono">
                                {item.customerEmail}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#736E66] italic text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#736E66] font-mono text-[11px]">
                        {item.createdDate}
                      </td>
                      <td className="py-3 px-4 text-[#736E66] font-mono text-[11px]">
                        {item.activatedDate || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {item.status === 'AVAILABLE' && (
                          <button
                            onClick={() => {
                              onUpdateCard(item.serialNumber, {
                                status: 'ACTIVE',
                                activatedDate: new Date().toISOString().split('T')[0],
                                customer: 'Direct In-Person Client',
                              });
                            }}
                            className="px-2 py-1 rounded bg-[#181716] text-[#C9A24B] text-[10px] font-semibold hover:bg-[#2B2927]"
                          >
                            Activate Manually
                          </button>
                        )}
                        {item.status === 'ACTIVE' && (
                          <button
                            onClick={() => {
                              onUpdateCard(item.serialNumber, { status: 'SUSPENDED' });
                            }}
                            className="px-2 py-1 rounded border border-rose-300 text-rose-700 text-[10px] font-medium hover:bg-rose-50"
                          >
                            Suspend
                          </button>
                        )}
                        {item.status === 'SUSPENDED' && (
                          <button
                            onClick={() => {
                              onUpdateCard(item.serialNumber, { status: 'ACTIVE' });
                            }}
                            className="px-2 py-1 rounded border border-emerald-300 text-emerald-700 text-[10px] font-medium hover:bg-emerald-50"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: DESIGNS CATALOG */}
        {/* ============================================================ */}
        {activeTab === 'designs' && (
          <div className="bg-white rounded-2xl border border-[#E5DFD5] shadow-xs overflow-hidden animate-fade-in space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD5] pb-4">
              <div>
                <h3 className="text-lg font-serif-display font-bold text-[#121110]">
                  Physical Card Design Catalog
                </h3>
                <p className="text-xs text-[#736E66]">
                  Control showroom materials, retail prices, description copy, and customer availability.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingDesign(null);
                  setDesignForm({
                    name: '',
                    category: 'Solid Metal',
                    description: '',
                    price: '$129 USD',
                    finish: 'Matte Obsidian Black',
                    availability: 'IN_STOCK',
                  });
                  setAddDesignModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] transition-all inline-flex items-center gap-2 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Add New Design</span>
              </button>
            </div>

            {/* Designs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="border border-[#E5DFD5] rounded-xl p-4 bg-[#FAF8F5]/50 flex flex-col justify-between text-xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#E5DFD5]/70 text-[#121110]">
                        {design.category}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md font-bold ${
                          design.availability === 'IN_STOCK'
                            ? 'bg-emerald-100 text-emerald-800'
                            : design.availability === 'PRE_ORDER'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {design.availability.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-base font-serif-display font-bold text-[#121110] mt-2">
                      {design.name}
                    </h4>
                    <p className="text-[11px] text-[#C9A24B] font-medium">{design.finish}</p>
                    <p className="text-xs text-[#736E66] mt-2 line-clamp-2 leading-relaxed">
                      {design.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5DFD5] flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-[#121110]">{design.price}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingDesign(design);
                          setDesignForm({ ...design });
                          setAddDesignModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg border border-[#E5DFD5] text-[11px] font-medium hover:border-[#C9A24B]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          onUpdateDesign(design.id, {
                            availability: design.availability === 'DISABLED' ? 'IN_STOCK' : 'DISABLED',
                          });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                          design.availability === 'DISABLED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {design.availability === 'DISABLED' ? 'Enable' : 'Disable'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* CUSTOMER DETAIL DRAWER / MODAL */}
        {/* ============================================================ */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A24B] block">
                    Customer Account Record
                  </span>
                  <h3 className="text-xl font-serif-display font-bold text-[#121110]">
                    {selectedCustomer.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 rounded-full hover:bg-[#E5DFD5]/60 text-[#736E66]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-xl border border-[#E5DFD5] p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Email Address:</span>
                  <span className="font-mono font-medium">{selectedCustomer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Phone Line:</span>
                  <span className="font-mono">{selectedCustomer.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Company / Role:</span>
                  <span>{selectedCustomer.company || 'Independent'} ({selectedCustomer.jobTitle || 'Executive'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Account Type:</span>
                  <span className="font-bold text-[#C9A24B]">{selectedCustomer.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Physical Card Status:</span>
                  <span className="font-semibold">{selectedCustomer.cardStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#736E66]">Linked Card Serial:</span>
                  <span className="font-mono font-bold text-[#121110]">
                    {selectedCustomer.activeCardSerial || 'No card bound'}
                  </span>
                </div>
              </div>

              {/* Related Orders for this customer */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#736E66]">
                  Purchase &amp; Delivery History
                </h4>
                {orders
                  .filter((o) => o.customer.email.toLowerCase() === selectedCustomer.email.toLowerCase())
                  .map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-white border border-[#E5DFD5] text-xs flex justify-between items-center"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold">{o.id}</span>
                          <span className="text-[11px] font-semibold">{o.selectedDesign.name}</span>
                        </div>
                        <p className="text-[10px] text-[#736E66] mt-0.5">
                          Paid: {o.paymentStatus} • Shipping: {o.shippingStatus}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[#C9A24B]">{o.price}</span>
                    </div>
                  ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                {onViewCustomerProfile && (
                  <button
                    onClick={() => {
                      onViewCustomerProfile(selectedCustomer.slug);
                      setSelectedCustomer(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] flex items-center justify-center gap-2"
                  >
                    <span>Inspect Public NFC Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A24B]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ADD TRACKING NUMBER MODAL */}
        {/* ============================================================ */}
        {selectedOrderForTracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                <h3 className="text-base font-serif-display font-bold">
                  Courier Shipping &amp; Tracking
                </h3>
                <button
                  onClick={() => setSelectedOrderForTracking(null)}
                  className="p-1 rounded-full text-[#736E66] hover:bg-[#E5DFD5]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#736E66] space-y-1">
                <p>Order: <strong>{selectedOrderForTracking.id}</strong></p>
                <p>Recipient: <strong>{selectedOrderForTracking.customer.name}</strong></p>
                <p>Destination: {selectedOrderForTracking.customer.shippingAddress}</p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                  Courier Tracking Code (e.g. DHL, FedEx, J&amp;T)
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. MY-DHL-992182"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white font-mono text-[#121110] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForTracking(null)}
                  className="w-1/2 py-2 rounded-xl border border-[#E5DFD5] text-xs text-[#736E66]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateOrder(selectedOrderForTracking.id, {
                      trackingNumber: trackingInput,
                      shippingStatus: 'SHIPPED',
                    });
                    setSelectedOrderForTracking(null);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
                >
                  Save &amp; Mark Shipped
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ASSIGN HARDWARE SERIAL MODAL */}
        {/* ============================================================ */}
        {selectedOrderForCardAssign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                <h3 className="text-base font-serif-display font-bold">
                  Assign Card Serial to Order
                </h3>
                <button
                  onClick={() => setSelectedOrderForCardAssign(null)}
                  className="p-1 rounded-full text-[#736E66] hover:bg-[#E5DFD5]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-[#736E66]">
                <p>Order: <strong>{selectedOrderForCardAssign.id}</strong></p>
                <p>Recipient: <strong>{selectedOrderForCardAssign.customer.name}</strong></p>
                <p>Design: <strong>{selectedOrderForCardAssign.selectedDesign.name}</strong></p>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                  Select Available Card from Vault
                </label>
                {availableSerials.length > 0 ? (
                  <select
                    value={assignCardSerial}
                    onChange={(e) => setAssignCardSerial(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white text-[#121110] font-mono focus:outline-none focus:border-[#C9A24B]"
                  >
                    {availableSerials.map((sn) => (
                      <option key={sn} value={sn}>
                        {sn}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-rose-600">
                    No unclaimed cards available in vault. Please add a new card to vault first.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrderForCardAssign(null)}
                  className="w-1/2 py-2 rounded-xl border border-[#E5DFD5] text-xs text-[#736E66]"
                >
                  Cancel
                </button>
                <button
                  disabled={!assignCardSerial}
                  onClick={() => {
                    onUpdateOrder(selectedOrderForCardAssign.id, {
                      associatedCardSerialNumber: assignCardSerial,
                    });
                    onUpdateCard(assignCardSerial, {
                      status: 'ASSIGNED',
                      customer: selectedOrderForCardAssign.customer.name,
                      customerEmail: selectedOrderForCardAssign.customer.email,
                    });
                    setSelectedOrderForCardAssign(null);
                  }}
                  className="w-1/2 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927] disabled:opacity-50"
                >
                  Bind Serial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ADD PHYSICAL CARD TO VAULT MODAL */}
        {/* ============================================================ */}
        {addCardModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                <h3 className="text-base font-serif-display font-bold">
                  Register Supplier Card to Inventory
                </h3>
                <button
                  onClick={() => setAddCardModalOpen(false)}
                  className="p-1 rounded-full text-[#736E66] hover:bg-[#E5DFD5]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNewCard} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Card Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TLP-7721-STEALTH"
                    value={newCardSerial}
                    onChange={(e) => setNewCardSerial(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white font-mono uppercase focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Card Design Model
                  </label>
                  <select
                    value={newCardDesign}
                    onChange={(e) => {
                      setNewCardDesign(e.target.value);
                      const match = designs.find((d) => d.name === e.target.value);
                      if (match) setNewCardFinish(match.finish);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                  >
                    {designs.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.finish})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Hashed Activation Code / Verification Key
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KEY-8821-DNA (auto-generated if empty)"
                    value={newCardCode}
                    onChange={(e) => setNewCardCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white font-mono uppercase focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setAddCardModalOpen(false)}
                    className="w-1/2 py-2 rounded-xl border border-[#E5DFD5] text-xs text-[#736E66]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
                  >
                    Save to Vault
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ADD / EDIT DESIGN MODAL */}
        {/* ============================================================ */}
        {addDesignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md bg-[#FAF8F5] text-[#121110] rounded-2xl border border-[#E5DFD5] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
                <h3 className="text-base font-serif-display font-bold">
                  {editingDesign ? 'Edit Showroom Design' : 'Add New Card Design'}
                </h3>
                <button
                  onClick={() => setAddDesignModalOpen(false)}
                  className="p-1 rounded-full text-[#736E66] hover:bg-[#E5DFD5]/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDesign} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Design Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Damascus Phantom"
                    value={designForm.name || ''}
                    onChange={(e) => setDesignForm({ ...designForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Solid Metal"
                      value={designForm.category || ''}
                      onChange={(e) => setDesignForm({ ...designForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $149 USD"
                      value={designForm.price || ''}
                      onChange={(e) => setDesignForm({ ...designForm, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white font-mono focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Finish Specification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Brushed Titanium Steel"
                    value={designForm.finish || ''}
                    onChange={(e) => setDesignForm({ ...designForm, finish: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tactile luxury description for showroom..."
                    value={designForm.description || ''}
                    onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#736E66] block mb-1">
                    Availability State
                  </label>
                  <select
                    value={designForm.availability || 'IN_STOCK'}
                    onChange={(e) => setDesignForm({ ...designForm, availability: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5DFD5] bg-white focus:outline-none focus:border-[#C9A24B]"
                  >
                    <option value="IN_STOCK">In Stock (Available immediately)</option>
                    <option value="PRE_ORDER">Pre-Order (Bespoke milling)</option>
                    <option value="DISABLED">Disabled (Hidden from Showroom)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setAddDesignModalOpen(false)}
                    className="w-1/2 py-2 rounded-xl border border-[#E5DFD5] text-xs text-[#736E66]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-[#181716] text-[#FAF8F5] text-xs font-semibold hover:bg-[#2B2927]"
                  >
                    Save Design
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
