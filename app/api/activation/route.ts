import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_NFC_CARDS, UNCLAIMED_TEST_CARDS } from '@/lib/initial-data';
import { NfcCard, PhysicalCard } from '@/types/taplink';

/**
 * NFC Card Activation API
 * Validates physical Serial Number and Activation Code (e.g. TLP-000001 + A82K-X91P).
 * Transitions card status from AVAILABLE/ASSIGNED -> ACTIVE.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serialNumber, activationCode, userSlug, userEmail, userName } = body;

    if (!serialNumber || !activationCode) {
      return NextResponse.json(
        { success: false, message: 'Card serial number and activation code are required.' },
        { status: 400 }
      );
    }

    const cleanSerial = String(serialNumber).trim().toUpperCase();
    const cleanCode = String(activationCode).trim().toUpperCase();

    // Check against inventory records
    const inventoryMatch = INITIAL_NFC_CARDS.find(
      (c) => c.serialNumber.toUpperCase() === cleanSerial && c.activationCode?.toUpperCase() === cleanCode
    );

    const unclaimedMatch = UNCLAIMED_TEST_CARDS.find(
      (c) => c.serialNumber.toUpperCase() === cleanSerial && c.activationCode?.toUpperCase() === cleanCode
    );

    // If valid registered card or custom valid serial/code pair (minimum format length)
    const isValidFormat = cleanSerial.startsWith('TLP-') && cleanCode.length >= 4;

    if (!inventoryMatch && !unclaimedMatch && !isValidFormat) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid serial number or activation code. Please check your physical packaging insert.',
        },
        { status: 401 }
      );
    }

    const designName = inventoryMatch?.design || unclaimedMatch?.designName || 'The Obsidian Sovereign';
    const finish = inventoryMatch?.finish || unclaimedMatch?.finish || 'Matte Obsidian Black';

    const activatedCard: PhysicalCard = {
      id: `card_${Date.now()}`,
      serialNumber: cleanSerial,
      activationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      activationCode: cleanCode,
      status: 'ACTIVE',
      designId: 'design-obsidian',
      designName,
      finish,
      batchNumber: 'BATCH-2026-Q1',
      nfcChipType: 'NXP NTAG424 DNA',
      activatedAt: new Date().toISOString(),
      linkedSlug: userSlug || 'haziq',
      isHardwareLocked: false,
      tapCount: 1,
    };

    return NextResponse.json({
      success: true,
      card: activatedCard,
      message: `Card ${cleanSerial} successfully activated and linked to ${userName || userSlug || 'account'}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error during card activation.' },
      { status: 500 }
    );
  }
}
