import React, { useState, useEffect } from 'react';
import { Product, Outlet } from '../data/strawberryData';
import { saveOrder, type OrderInsert } from '../lib/supabase';
import { X, MessageCircle, ShoppingBag, Check, Copy, Plus, Minus } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProductId?: string;
  initialMethod?: string;
  initialOutlet?: string;
  products?: Product[];
  outlets?: Outlet[];
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  initialProductId,
  initialMethod = 'pickup',
  initialOutlet,
  products = [],
  outlets = [],
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [method, setMethod] = useState<'pickup' | 'delivery'>(
    initialMethod === 'delivery' ? 'delivery' : 'pickup'
  );
  const [selectedOutlet, setSelectedOutlet] = useState<string>(
    initialOutlet || outlets[0]?.name || ''
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSavingOrder, setIsSavingOrder] = useState<boolean>(false);
  const [orderSaveStatus, setOrderSaveStatus] = useState<string>('');

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
    if (initialOutlet) {
      setSelectedOutlet(initialOutlet);
      setMethod('pickup');
    }
  }, [initialProductId, initialOutlet]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const estimatedTotal = (currentProduct?.price || 0) * quantity;
  if (!currentProduct) return null;

  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  const buildOrderMessage = () => {
    const pickupOrDeliveryText =
      method === 'pickup'
        ? `Pickup di ${selectedOutlet}`
        : `Delivery ke: ${deliveryAddress.trim() || '[Alamat Pengiriman]'}`;

    const namaText = customerName.trim() ? `Nama: ${customerName.trim()}\n` : '';
    const catatanText = notes.trim() ? `\nCatatan: ${notes.trim()}` : '';

    return (
`Halo BITE'S, saya ingin memesan strawberry.

${namaText}Produk: ${currentProduct.name}
Jumlah pesanan: ${quantity} item
Metode pengambilan: ${pickupOrDeliveryText}${catatanText}

Mohon informasi ketersediaan produk dan total harga. Terima kasih.`
    );
  };

  const handleSendWhatsApp = () => {
    if (isSavingOrder) return;

    if (!currentProduct) return;
    const message = buildOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281818193311?text=${encodedMessage}`;

    // Open WhatsApp synchronously so browser popup blockers do not block the tab.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    const order: OrderInsert = {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      quantity,
      unit: currentProduct.unit,
      unit_price: currentProduct.price,
      subtotal: estimatedTotal,
      fulfillment_method: method,
      pickup_outlet: method === 'pickup' ? selectedOutlet : null,
      delivery_address: method === 'delivery' ? deliveryAddress.trim() || null : null,
      customer_name: customerName.trim() || null,
      notes: notes.trim() || null,
    };

    setIsSavingOrder(true);
    setOrderSaveStatus('');
    void saveOrder(order)
      .then(() => setOrderSaveStatus('Pesanan berhasil dicatat.'))
      .catch((error: unknown) => {
        console.error('Gagal menyimpan pesanan ke Supabase:', error);
        setOrderSaveStatus('WhatsApp tetap terbuka, tetapi pesanan belum berhasil dicatat.');
      })
      .finally(() => setIsSavingOrder(false));
  };

  const handleCopyMessage = () => {
    if (!currentProduct) return;
    const message = buildOrderMessage();
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E83E5B]/10 text-[#E83E5B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-[#172A5A]">
                Pemesanan Strawberry
              </h3>
              <p className="text-xs text-[#172A5A]/70 font-semibold">
                Langsung terhubung ke WhatsApp BITE'S
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 items-end">
            {/* 1. Pilih Produk */}
            <div className="min-w-0">
              <label className="block text-xs font-black uppercase tracking-wider text-[#172A5A] mb-2">
                1. Pilih Produk Strawberry
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full min-w-0 px-4 py-3 bg-[#FFF9EF] border border-[#172A5A]/15 rounded-2xl text-sm font-bold text-[#172A5A] focus:outline-none focus:ring-2 focus:ring-[#E83E5B]"
              >
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} — {formatRupiah(prod.price)} {prod.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Jumlah Pesanan */}
            <div className="min-w-0">
              <label className="block text-xs font-black uppercase tracking-wider text-[#172A5A] mb-2">
                2. Jumlah Pesanan
              </label>
              <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  aria-label="Kurangi jumlah pesanan"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 shrink-0 rounded-xl bg-white text-[#172A5A] hover:bg-gray-100 flex items-center justify-center font-bold shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-[2rem] flex-1 text-center font-heading font-black text-lg text-[#172A5A]">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Tambah jumlah pesanan"
                  onClick={() => setQuantity(Math.min(1000, quantity + 1))}
                  className="w-10 h-10 shrink-0 rounded-xl bg-white text-[#172A5A] hover:bg-gray-100 flex items-center justify-center font-bold shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product preview: full width so name, price, and unit are not cut off */}
          <div className="flex w-full min-w-0 items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold leading-snug text-[#172A5A] whitespace-normal break-words">
                {currentProduct.name}
              </h4>
              <p className="mt-1 text-sm text-[#E83E5B] font-extrabold font-heading">
                {formatRupiah(currentProduct.price)}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {currentProduct.unit}
              </p>
            </div>
          </div>

          {/* 3. Metode Pengambilan */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#172A5A] mb-2">
              3. Metode Pengambilan
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setMethod('pickup')}
                className={`py-3 px-4 rounded-2xl border text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  method === 'pickup'
                    ? 'border-[#E83E5B] bg-[#E83E5B]/10 text-[#E83E5B]'
                    : 'border-gray-200 bg-white text-[#172A5A] hover:bg-gray-50'
                }`}
              >
                <span>Pickup di Outlet</span>
                <span className="text-[11px] font-normal opacity-80">Ambil sendiri</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('delivery')}
                className={`py-3 px-4 rounded-2xl border text-sm font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  method === 'delivery'
                    ? 'border-[#E83E5B] bg-[#E83E5B]/10 text-[#E83E5B]'
                    : 'border-gray-200 bg-white text-[#172A5A] hover:bg-gray-50'
                }`}
              >
                <span>Delivery Antar</span>
                <span className="text-[11px] font-normal opacity-80">Area Salatiga</span>
              </button>
            </div>

            {/* Sub-inputs based on method */}
            {method === 'pickup' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Pilih Titik Outlet Pickup:</label>
                <select
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#172A5A] focus:outline-none focus:ring-2 focus:ring-[#E83E5B]"
                >
                  {outlets.map((out) => (
                    <option key={out.id} value={out.name}>
                      {out.name} ({out.landmark})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 font-medium pt-1">
                  ⏰ Jam pickup: 06.00 – 17.00 WIB setiap hari.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">
                    Alamat Lengkap Pengiriman (Kota Salatiga):
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    maxLength={1000}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Contoh: Jl. Diponegoro No. 45, Sidorejo Lor, Salatiga (Pagar Hitam)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#172A5A] focus:outline-none focus:ring-2 focus:ring-[#E83E5B]"
                  />
                </div>
                <div className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Promo Bebas Ongkir untuk pembelian minimal 3 box ke area Salatiga Kota!</span>
                </div>
              </div>
            )}
          </div>

          {/* 4. Nama & Catatan Tambahan (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#172A5A] mb-1">
                Nama Pemesan (Opsional)
              </label>
              <input
                type="text"
                value={customerName}
                maxLength={120}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama kamu"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#172A5A] focus:outline-none focus:ring-2 focus:ring-[#E83E5B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#172A5A] mb-1">
                Catatan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                maxLength={1000}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pilih yang manis"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-[#172A5A] focus:outline-none focus:ring-2 focus:ring-[#E83E5B]"
              />
            </div>
          </div>

          {/* Estimasi Ringkasan Pesanan */}
          <div className="bg-[#FFF9EF] p-4 rounded-2xl border border-[#E83E5B]/15">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Estimasi Subtotal:</span>
              <span>{quantity} x {formatRupiah(currentProduct.price)}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E83E5B]/10">
              <span className="font-bold text-sm text-[#172A5A]">Estimasi Total Biaya:</span>
              <span className="font-heading font-black text-xl text-[#E83E5B]">
                {formatRupiah(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Pratinjau Pesan Otomatis */}
          <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Pratinjau Pesan WhatsApp Otomatis:
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-bold text-[#172A5A] hover:text-[#E83E5B] flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Pesan</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-700 font-mono whitespace-pre-line bg-white p-2.5 rounded-xl border border-gray-100">
              {buildOrderMessage()}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              disabled={isSavingOrder}
              className="flex-grow inline-flex flex-col items-center justify-center gap-0.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70 disabled:cursor-wait"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isSavingOrder ? 'Mencatat pesanan...' : 'Kirim Pesanan'}</span>
              <span className="text-[11px] font-semibold text-white/90">Via WhatsApp</span>
            </button>
          </div>
          {orderSaveStatus && (
            <p role="status" className="pt-2 text-center text-xs font-semibold text-[#172A5A]/70">
              {orderSaveStatus}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
