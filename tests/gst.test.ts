import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeGSTFromInclusive,
  computeGSTFromExclusive,
  isInterStateSupply,
  computeOrderGST,
  validateGSTIN,
  formatINR,
  rupeesToPaise,
  paiseToRupees,
  SELLER_STATE,
  LAPTOP_HSN,
} from '../src/lib/gst';

describe('GST Calculation Engine (HSN 8471 & Indian Tax Compliance)', () => {
  it('correctly calculates intra-state GST (CGST 9% + SGST 9%) from inclusive price', () => {
    // ₹50,000 inclusive = 5,000,000 paise
    const inclusivePricePaise = 5000000;
    const isInterState = false;

    const breakdown = computeGSTFromInclusive(inclusivePricePaise, 18, isInterState);

    // base = Math.round(5000000 / 1.18) = 4237288 paise (₹42,372.88)
    assert.equal(breakdown.baseAmount, 4237288);
    // total GST = 5000000 - 4237288 = 762712 paise (₹7,627.12)
    assert.equal(breakdown.totalGst, 762712);
    // CGST = Math.round(762712 / 2) = 381356 paise (₹3,813.56)
    assert.equal(breakdown.cgst, 381356);
    // SGST = 762712 - 381356 = 381356 paise
    assert.equal(breakdown.sgst, 381356);
    assert.equal(breakdown.igst, 0);
    assert.equal(breakdown.total, 5000000);
    assert.equal(breakdown.cgst + breakdown.sgst, breakdown.totalGst);
  });

  it('correctly calculates inter-state GST (IGST 18%) from inclusive price', () => {
    // ₹35,400 inclusive = 3,540,000 paise (exact: base 30,000 + 18% GST 5,400)
    const inclusivePricePaise = 3540000;
    const isInterState = true;

    const breakdown = computeGSTFromInclusive(inclusivePricePaise, 18, isInterState);

    assert.equal(breakdown.baseAmount, 3000000);
    assert.equal(breakdown.totalGst, 540000);
    assert.equal(breakdown.igst, 540000);
    assert.equal(breakdown.cgst, 0);
    assert.equal(breakdown.sgst, 0);
    assert.equal(breakdown.total, 3540000);
  });

  it('correctly calculates GST from exclusive base price', () => {
    // Base ₹40,000 = 4,000,000 paise
    const exclusivePricePaise = 4000000;

    // Intra-state
    const intra = computeGSTFromExclusive(exclusivePricePaise, 18, false);
    assert.equal(intra.baseAmount, 4000000);
    assert.equal(intra.totalGst, 720000); // 18% of 40,000 is 7,200
    assert.equal(intra.cgst, 360000); // 9% is 3,600
    assert.equal(intra.sgst, 360000);
    assert.equal(intra.igst, 0);
    assert.equal(intra.total, 4720000);

    // Inter-state
    const inter = computeGSTFromExclusive(exclusivePricePaise, 18, true);
    assert.equal(inter.igst, 720000);
    assert.equal(inter.cgst, 0);
    assert.equal(inter.sgst, 0);
    assert.equal(inter.total, 4720000);
  });

  it('accurately identifies intra-state vs inter-state supply', () => {
    assert.equal(SELLER_STATE, 'Maharashtra');

    // Intra-state (same state as seller)
    assert.equal(isInterStateSupply('Maharashtra', 'Maharashtra'), false);
    assert.equal(isInterStateSupply('Maharashtra', '  maharashtra '), false);

    // Inter-state (different state)
    assert.equal(isInterStateSupply('Maharashtra', 'Karnataka'), true);
    assert.equal(isInterStateSupply('Maharashtra', 'Delhi'), true);
    assert.equal(isInterStateSupply('Maharashtra', 'Tamil Nadu'), true);
    assert.equal(isInterStateSupply('Maharashtra', 'Gujarat'), true);
  });

  it('computes multi-item order GST without rounding drift', () => {
    const items = [
      { sellingPrice: 2500000, quantity: 2, gstRate: 18 }, // 2x ₹25,000 = ₹50,000
      { sellingPrice: 1500000, quantity: 1, gstRate: 18 }, // 1x ₹15,000 = ₹15,000
    ];

    const orderMaharashtra = computeOrderGST(items, 'Maharashtra');
    assert.equal(orderMaharashtra.total, 6500000); // ₹65,000 total
    assert.equal(orderMaharashtra.cgst + orderMaharashtra.sgst, orderMaharashtra.totalGst);
    assert.equal(orderMaharashtra.igst, 0);

    const orderBangalore = computeOrderGST(items, 'Karnataka');
    assert.equal(orderBangalore.total, 6500000);
    assert.equal(orderBangalore.igst, orderBangalore.totalGst);
    assert.equal(orderBangalore.cgst, 0);
    assert.equal(orderBangalore.sgst, 0);
  });

  it('validates 15-character Indian GSTIN format correctly', () => {
    // Valid GSTINs (State code + PAN + entity + Z + checksum)
    assert.equal(validateGSTIN('27AAAAA0000A1Z5'), true);
    assert.equal(validateGSTIN('29ABCDE1234F2Z8'), true);
    assert.equal(validateGSTIN('07AAAAA0000A1Z2'), true);

    // Invalid GSTINs
    assert.equal(validateGSTIN(''), false);
    assert.equal(validateGSTIN('12345'), false);
    assert.equal(validateGSTIN('27AAAAA0000A1Z'), false); // 14 chars
    assert.equal(validateGSTIN('27AAAAA0000A1Z55'), false); // 16 chars
    assert.equal(validateGSTIN('XXAAAAA0000A1Z5'), false); // non-numeric state code
    assert.equal(validateGSTIN('27AAAAA0000A1X5'), false); // missing standard 'Z'
  });

  it('formats currency conversions properly between rupees and paise', () => {
    assert.equal(rupeesToPaise(500), 50000);
    assert.equal(rupeesToPaise(49999.99), 4999999);
    assert.equal(rupeesToPaise(50000), 5000000);
    assert.equal(paiseToRupees(50000), 500);
    assert.equal(LAPTOP_HSN, '8471');

    const formatted = formatINR(5000000);
    assert.match(formatted, /50,000/);
  });

  it('handles bulk volume tier discount pricing accurately', () => {
    function getBulkDiscountPercent(quantity: number): number {
      if (quantity >= 25) return 15;
      if (quantity >= 10) return 10;
      if (quantity >= 5) return 5;
      return 0;
    }

    assert.equal(getBulkDiscountPercent(1), 0);
    assert.equal(getBulkDiscountPercent(4), 0);
    assert.equal(getBulkDiscountPercent(5), 5);
    assert.equal(getBulkDiscountPercent(9), 5);
    assert.equal(getBulkDiscountPercent(10), 10);
    assert.equal(getBulkDiscountPercent(24), 10);
    assert.equal(getBulkDiscountPercent(25), 15);
    assert.equal(getBulkDiscountPercent(100), 15);
  });
});
