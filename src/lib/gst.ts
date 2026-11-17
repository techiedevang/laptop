/**
 * GST calculation helpers for NextGen IT Hub (India).
 *
 * Rules:
 *  - Intra-state supply: CGST (9%) + SGST (9%) for 18% GST
 *  - Inter-state supply: IGST (18%)
 *  - Laptops fall under HSN 8471, typically 18% GST
 *  - All amounts in PAISE (1 INR = 100 paise)
 */

export type GSTBreakdown = {
  baseAmount: number; // pre-GST amount in paise
  gstRate: number; // e.g. 18
  cgst: number; // paise, intra-state
  sgst: number; // paise, intra-state
  igst: number; // paise, inter-state
  totalGst: number; // paise
  total: number; // base + gst in paise
  isInterState: boolean;
};

/**
 * Compute GST breakdown from an INCLUSIVE price (the price already includes GST).
 *
 * @param inclusivePrice - Price in paise (GST included)
 * @param gstRate        - GST rate as integer (e.g. 18 for 18%)
 * @param isInterState   - True for IGST, false for CGST+SGST
 */
export function computeGSTFromInclusive(
  inclusivePrice: number,
  gstRate: number,
  isInterState: boolean,
): GSTBreakdown {
  // base = inclusive / (1 + gstRate/100)
  const base = Math.round(inclusivePrice / (1 + gstRate / 100));
  const totalGst = inclusivePrice - base;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = totalGst;
  } else {
    cgst = Math.round(totalGst / 2);
    sgst = totalGst - cgst; // avoid rounding drift
  }

  return {
    baseAmount: base,
    gstRate,
    cgst,
    sgst,
    igst,
    totalGst,
    total: inclusivePrice,
    isInterState,
  };
}

/**
 * Compute GST breakdown from an EXCLUSIVE price (GST needs to be added on top).
 *
 * @param exclusivePrice - Base price in paise (before GST)
 * @param gstRate        - GST rate as integer
 * @param isInterState   - True for IGST, false for CGST+SGST
 */
export function computeGSTFromExclusive(
  exclusivePrice: number,
  gstRate: number,
  isInterState: boolean,
): GSTBreakdown {
  const totalGst = Math.round(exclusivePrice * gstRate / 100);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = totalGst;
  } else {
    cgst = Math.round(totalGst / 2);
    sgst = totalGst - cgst;
  }

  return {
    baseAmount: exclusivePrice,
    gstRate,
    cgst,
    sgst,
    igst,
    totalGst,
    total: exclusivePrice + totalGst,
    isInterState,
  };
}

/**
 * Determine if a supply is inter-state based on buyer and seller states.
 */
export function isInterStateSupply(sellerState: string, buyerState: string): boolean {
  return sellerState.trim().toLowerCase() !== buyerState.trim().toLowerCase();
}

/** NextGen IT Hub default seller state */
export const SELLER_STATE = 'Maharashtra';

/**
 * Format paise to INR string.
 * e.g. 150000 -> "₹1,500.00"
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Convert rupees to paise.
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert paise to rupees.
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Compute GST for an entire order.
 * sellingPrices are assumed to be inclusive of GST.
 */
export function computeOrderGST(
  items: { sellingPrice: number; quantity: number; gstRate: number }[],
  buyerState: string,
): {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  total: number;
} {
  const interState = isInterStateSupply(SELLER_STATE, buyerState);

  let subtotal = 0;
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  for (const item of items) {
    const lineTotal = item.sellingPrice * item.quantity;
    const breakdown = computeGSTFromInclusive(lineTotal, item.gstRate, interState);
    subtotal += breakdown.baseAmount;
    cgst += breakdown.cgst;
    sgst += breakdown.sgst;
    igst += breakdown.igst;
  }

  const totalGst = cgst + sgst + igst;

  return {
    subtotal,
    cgst,
    sgst,
    igst,
    totalGst,
    total: subtotal + totalGst,
  };
}

/**
 * HSN code for laptops
 */
export const LAPTOP_HSN = '8471';

/**
 * Validate GSTIN format (India).
 * Pattern: 2-digit state code + 10-char PAN + 1 entity + 1 Z + 1 checksum
 */
export function validateGSTIN(gstin: string): boolean {
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return regex.test(gstin.toUpperCase());
}
