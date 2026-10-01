import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_NFC_CARDS } from '@/lib/initial-data';
import { NfcCard } from '@/types/taplink';

/**
 * NFC Card Vault Inventory API
 * Allows owner to list cards, add new minted cards, generate activation codes, and assign to orders.
 */
export async function GET() {
  return NextResponse.json({ success: true, cards: INITIAL_NFC_CARDS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, card, serialNumber, updates } = body;

    if (action === 'ADD_CARD') {
      const generatedCode =
        card.activationCode ||
        `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random()
          .toString(36)
          .substring(2, 6)
          .toUpperCase()}`;

      const newCard: NfcCard = {
        serialNumber: card.serialNumber || `TLP-00000${Math.floor(10 + Math.random() * 90)}`,
        design: card.design || 'The Obsidian Sovereign',
        finish: card.finish || 'Matte Obsidian Black',
        status: 'AVAILABLE',
        customer: null,
        customerEmail: null,
        createdDate: new Date().toISOString().split('T')[0],
        activatedDate: null,
        activationCode: generatedCode,
      };

      return NextResponse.json({
        success: true,
        card: newCard,
        message: `Card ${newCard.serialNumber} added with activation code ${newCard.activationCode}.`,
      });
    }

    if (action === 'UPDATE_CARD' && serialNumber) {
      return NextResponse.json({
        success: true,
        serialNumber,
        updates,
        message: 'Card inventory record updated.',
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid inventory action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, message: 'Failed to process inventory request.' }, { status: 500 });
  }
}
