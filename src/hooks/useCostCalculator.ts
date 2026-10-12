import { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants/categories';
import { useExchangeRate } from '../context/ExchangeRateContext';
import {
  CURRENT_EXCHANGE_RATE,
  AIR_EXPRESS_RATE_PER_100G,
  AIR_REGULAR_RATE_PER_100G,
  HANDCARRY_RATE_PER_100G,
  CARGO_EXPRESS_RATE_PER_100G,
  REINFORCED_BOX_FEE,
  DESTINATION_ZONES,
} from '../constants/rates';
import { ShippingMethod, PackagingOption, CalculationResult } from '../types/calculator';

interface UseCostCalculatorProps {
  initialPriceJpy?: number;
  initialCategoryId?: string;
  initialWeightG?: number;
  initialShippingMethod?: ShippingMethod;
  initialPackaging?: PackagingOption;
  initialDestinationId?: string;
  customRate?: number;
}

export function useCostCalculator({
  initialPriceJpy = 5000,
  initialCategoryId = 'skincare',
  initialWeightG = 300,
  initialShippingMethod = 'express',
  initialPackaging = 'standard',
  initialDestinationId = 'jabodetabek',
  customRate,
}: UseCostCalculatorProps = {}) {
  const { rate: liveRate, isLive } = useExchangeRate();
  const effectiveRate = customRate ?? (liveRate || CURRENT_EXCHANGE_RATE);
  const [itemName, setItemName] = useState('Onitsuka Tiger Mexico 66');
  const [storeName, setStoreName] = useState('Toko Fisik / Butik Resmi (Shibuya/Ginza)');
  const [priceJpy, setPriceJpy] = useState<number>(initialPriceJpy);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);
  const [weightG, setWeightG] = useState<number>(initialWeightG);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(initialShippingMethod);
  const [packaging, setPackaging] = useState<PackagingOption>(initialPackaging);
  const [destinationId, setDestinationId] = useState<string>(initialDestinationId);

  const selectedCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategoryId) || CATEGORIES[0];
  }, [selectedCategoryId]);

  const selectedDestination = useMemo(() => {
    return DESTINATION_ZONES.find(d => d.id === destinationId) || DESTINATION_ZONES[0];
  }, [destinationId]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategoryId(catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) {
      setWeightG(cat.estWeightG);
    }
  };

  const calculation = useMemo<CalculationResult>(() => {
    const rate = effectiveRate;
    const safeJpy = Math.max(0, priceJpy || 0);
    const idrRaw = safeJpy * rate;
    const feePct = selectedCategory.feePct;
    const feeAmount = (idrRaw * feePct) / 100;

    let shippingRatePer100g = AIR_EXPRESS_RATE_PER_100G;
    if (shippingMethod === 'regular') {
      shippingRatePer100g = AIR_REGULAR_RATE_PER_100G;
    } else if (shippingMethod === 'handcarry') {
      shippingRatePer100g = HANDCARRY_RATE_PER_100G;
    } else if (shippingMethod === 'cargo') {
      shippingRatePer100g = CARGO_EXPRESS_RATE_PER_100G;
    }

    const shippingCost = (weightG / 100) * shippingRatePer100g;
    // Standar toleransi berat kurir ekspedisi riil Indonesia (toleransi +300g per kg, contoh: <= 1.300g = 1 kg)
    const kgUnits = Math.max(1, Math.ceil(Math.max(0, weightG - 300) / 1000));
    const domesticShippingCost = kgUnits * (selectedDestination?.ratePerKg || 10000);

    const packagingCost = packaging === 'reinforced' ? REINFORCED_BOX_FEE : 0;

    // ── KALKULASI PAJAK & BEA CUKAI INDONESIA (SESUAI PMK BEA CUKAI) ──
    const baseTaxPct = selectedCategory.customsTaxPct ?? 18.5;
    let customsTaxPct = 0;
    let customsTaxAmount = 0;
    let customsTaxNote = '';

    if (shippingMethod === 'handcarry') {
      // Fasilitas Bebas Bea Cukai Handcarry Penumpang (Maksimal USD 500 / ±Rp 8.000.000)
      if (idrRaw <= 8000000) {
        customsTaxPct = 0;
        customsTaxAmount = 0;
        customsTaxNote = 'BEBAS PAJAK (Fasilitas Handcarry Penumpang s.d. $500 / Rp 8 Juta)';
      } else {
        // Dikenakan tarif flat atas selisih kelebihan nilai barang di atas USD 500
        const excess = idrRaw - 8000000;
        customsTaxPct = 10;
        customsTaxAmount = Math.round(excess * 0.21); // BM flat 10% + PPN 11%
        customsTaxNote = `Pajak atas selisih kelebihan nilai barang di atas kuota $500 (${selectedCategory.name})`;
      }
    } else {
      // Jalur Kargo / Kurir Paket Impor (EMS / Cargo): Kena tarif resmi PMK sesuai jenis komoditas
      customsTaxPct = baseTaxPct;
      customsTaxAmount = Math.round((idrRaw + shippingCost) * (baseTaxPct / 100));
      customsTaxNote = `Tarif Resmi PMK Bea Cukai untuk ${selectedCategory.name} (${baseTaxPct}%)`;
    }

    const totalCost = idrRaw + feeAmount + shippingCost + packagingCost + customsTaxAmount;

    return {
      priceJpy: safeJpy,
      exchangeRate: rate,
      priceIdr: idrRaw,
      feePct,
      feeAmount,
      weightG,
      shippingRatePer100g,
      shippingCost,
      packagingCost,
      customsTaxPct,
      customsTaxAmount,
      customsTaxNote,
      domesticShippingCost,
      domesticKgUnits: kgUnits,
      totalCost,
    };
  }, [effectiveRate, priceJpy, selectedCategory, weightG, shippingMethod, packaging, selectedDestination]);

  return {
    itemName,
    setItemName,
    storeName,
    setStoreName,
    priceJpy,
    setPriceJpy,
    selectedCategoryId,
    selectedCategory,
    handleSelectCategory,
    weightG,
    setWeightG,
    shippingMethod,
    setShippingMethod,
    packaging,
    setPackaging,
    destinationId,
    setDestinationId,
    selectedDestination,
    calculation,
    isLiveRate: isLive,
  };
};
