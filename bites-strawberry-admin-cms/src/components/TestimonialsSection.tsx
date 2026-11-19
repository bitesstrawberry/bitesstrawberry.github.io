import React, { useState } from 'react';
import { TESTIMONIAL_SCREENSHOTS } from '../data/strawberryData';
import { MessageCircle, Maximize2, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = TESTIMONIAL_SCREENSHOTS.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i + 1) % total));
  };

  const active = activeIndex !== null ? TESTIMONIAL_SCREENSHOTS[activeIndex] : null;

  return (
    <section className="py-20 md:py-28 relative bg-white/60 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#E83E5B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-[#4D8B45]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/15 text-[#1b8743] text-xs sm:text-sm font-extrabold tracking-wide uppercase mb-3">
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>BUKTI CHAT ASLI WHATSAPP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#172A5A] tracking-tight">
            Kata Mereka tentang BITE'S
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#172A5A]/75 font-medium">
            Tangkapan layar langsung dari pelanggan yang sudah menikmati manis dan segarnya stroberi BITE'S.
          </p>
        </div>

        {/* Screenshot Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {TESTIMONIAL_SCREENSHOTS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer text-left"
            >
              {/* Tinggi mengikuti rasio asli screenshot, tidak terpotong */}
              <img
                src={item.imageUrl}
                alt={item.alt}
                loading="lazy"
                className="w-full h-auto block"
              />

              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                <Maximize2 className="w-4 h-4" />
                <span>Lihat Penuh</span>
              </div>
            </button>
          ))}
        </div>

        {/* Trust note */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white px-6 py-3.5 rounded-full border border-gray-100 shadow-sm text-xs sm:text-sm font-semibold text-[#172A5A]">
            <ShieldCheck className="w-4 h-4 text-[#4D8B45]" />
            <span>Semua testimoni merupakan chat asli dari pelanggan WhatsApp BITE'S di Salatiga.</span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            onClick={() => setActiveIndex(null)}
            aria-label="Tutup"
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-50 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {total > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Sebelumnya"
                className="absolute left-3 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Berikutnya"
                className="absolute right-3 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-50 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={active.imageUrl}
              alt={active.alt}
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <span className="mt-3 text-xs font-bold uppercase tracking-wider text-[#F28C18]">
              Testimoni {activeIndex! + 1} dari {total}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
