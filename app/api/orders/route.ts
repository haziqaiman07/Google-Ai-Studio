import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/lib/initial-data';
import { Order } from '@/types/taplink';

/**
 * Small Business Orders API
 * Handles customer order requests and owner status lifecycle updates.
 */
export async function GET() {
  return NextResponse.json({ success: true, orders: INITIAL_ORDERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, order, orderId, updates } = body;

    if (action === 'CREATE_ORDER') {
      const newOrder: Order = {
        ...order,
        id: order.id || `ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
        createdDate: new Date().toISOString().split('T')[0],
        paymentStatus: 'PENDING',
        productionStatus: 'REQUESTED',
        shippingStatus: 'NOT_SHIPPED',
        trackingNumber: null,
        associatedCardSerialNumber: null,
      };

      return NextResponse.json({
        success: true,
        order: newOrder,
        message: 'Order request submitted successfully. Awaiting payment confirmation.',
      });
    }

    if (action === 'UPDATE_ORDER' && orderId) {
      return NextResponse.json({
        success: true,
        orderId,
        updates,
        message: 'Order status successfully updated.',
      });
    }

    return NextResponse.json({ success: false, message: 'Unknown order action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to process order.' }, { status: 500 });
  }
}
