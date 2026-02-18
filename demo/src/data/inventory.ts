import type { LocalizedText } from '@circle-oo/vitro';

export interface InventoryItem {
  id: string;
  name: LocalizedText;
  category: 'Protein' | 'Vegetable' | 'Seasoning' | 'Dairy';
  qty: LocalizedText;
  expiry: string;
  level: 'ok' | 'warn' | 'low';
}

export const inventoryItems: InventoryItem[] = [
  { id: 'i1', name: { ko: '연어 사쿠', en: 'Salmon Saku', fr: 'Saumon saku', ja: 'サーモン柵' }, category: 'Protein', qty: { ko: '200g', en: '200g', fr: '200 g', ja: '200g' }, expiry: '2026-02-19', level: 'warn' },
  { id: 'i2', name: { ko: '계란', en: 'Eggs', fr: 'Œufs', ja: '卵' }, category: 'Protein', qty: { ko: '6개', en: '6 pcs', fr: '6 pièces', ja: '6個' }, expiry: '2026-02-25', level: 'ok' },
  { id: 'i3', name: { ko: '올리브유 (EVO)', en: 'Olive Oil EVO', fr: 'Huile d\'olive EVO', ja: 'オリーブオイル (EVO)' }, category: 'Seasoning', qty: { ko: '~50ml', en: '~50ml', fr: '~50 ml', ja: '約50ml' }, expiry: '-', level: 'low' },
  { id: 'i4', name: { ko: '말돈 소금', en: 'Maldon Salt', fr: 'Sel Maldon', ja: 'マルドン塩' }, category: 'Seasoning', qty: { ko: '~30g', en: '~30g', fr: '~30 g', ja: '約30g' }, expiry: '-', level: 'low' },
  { id: 'i5', name: { ko: '이즈니 버터', en: 'Isigny Butter', fr: 'Beurre Isigny', ja: 'イズニーバター' }, category: 'Dairy', qty: { ko: '~20g', en: '~20g', fr: '~20 g', ja: '約20g' }, expiry: '2026-03-01', level: 'low' },
  { id: 'i6', name: { ko: '무', en: 'Radish', fr: 'Radis blanc', ja: '大根' }, category: 'Vegetable', qty: { ko: '1/2개', en: '1/2 pc', fr: '1/2 pièce', ja: '1/2本' }, expiry: '2026-02-22', level: 'ok' },
  { id: 'i7', name: { ko: '대파', en: 'Green Onion', fr: 'Ciboule', ja: '長ネギ' }, category: 'Vegetable', qty: { ko: '2대', en: '2 stalks', fr: '2 tiges', ja: '2本' }, expiry: '2026-02-20', level: 'warn' },
  { id: 'i8', name: { ko: '두부', en: 'Tofu', fr: 'Tofu', ja: '豆腐' }, category: 'Protein', qty: { ko: '1모', en: '1 block', fr: '1 bloc', ja: '1丁' }, expiry: '2026-02-21', level: 'ok' },
];
