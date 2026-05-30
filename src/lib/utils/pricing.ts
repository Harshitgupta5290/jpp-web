import type { PricingSlab, PriceCalculationResult } from '@/types/product'

export function calculatePrice(
  quantity: number,
  slabs: PricingSlab[],
  basePrice?: number | null
): PriceCalculationResult {
  if (slabs.length === 0) {
    const unit = basePrice ?? 0
    return {
      unitPrice: unit,
      totalPrice: unit * quantity,
      slab: null,
      savingsPercent: null,
    }
  }

  const sorted = [...slabs].sort((a, b) => a.min_qty - b.min_qty)

  const matchingSlab = sorted.reduce<PricingSlab | null>((best, slab) => {
    if (quantity >= slab.min_qty) {
      if (slab.max_qty === null || quantity <= slab.max_qty) {
        return slab
      }
      // Past max — keep as candidate only if it's the last slab
      return best
    }
    return best
  }, null)

  const activeSlab = matchingSlab ?? sorted[0] ?? null
  const unitPrice = activeSlab?.price_per_unit ?? basePrice ?? 0

  // Calculate savings relative to the most expensive slab
  const maxUnitPrice = sorted[0]?.price_per_unit ?? unitPrice
  const savingsPercent =
    unitPrice < maxUnitPrice
      ? Math.round(((maxUnitPrice - unitPrice) / maxUnitPrice) * 100)
      : null

  return {
    unitPrice,
    totalPrice: unitPrice * quantity,
    slab: activeSlab,
    savingsPercent,
  }
}

export function getAdvanceAmount(total: number): number {
  return Math.ceil(total * 0.5)
}

export function getBalanceAmount(total: number, advance: number): number {
  return total - advance
}
