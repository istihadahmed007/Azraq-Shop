import React, { useState } from 'react';
import { X, Download, Copy, Sparkles, Check, Package, Smartphone, Instagram, Palette, Type } from 'lucide-react';
import AzraqLogo from './AzraqLogo';
import { useShop } from '../context/ShopContext';

export default function BrandAssetsModal() {
  const { isBrandAssetsOpen, setIsBrandAssetsOpen, showToast, t } = useShop();
  const [copiedHex, setCopiedHex] = useState(null);

  if (!isBrandAssetsOpen) return null;

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    showToast(`Copied ${hex} to clipboard`, 'success');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colors = [
    { name: 'Crystal White', hex: '#F8FBFF', role: 'Primary Glass Surface' },
    { name: 'Ice Blue', hex: '#DDEEFF', role: 'Secondary Ambient Tint' },
    { name: 'Accent Cyan', hex: '#70C8ED', role: 'Active Button & Glow' },
    { name: 'Deep Blue', hex: '#193B5B', role: 'Primary Typography & Foundation' },
    { name: 'Secondary Steel', hex: '#718398', role: 'Muted Typography & Meta' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-azraq-deep/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none">
      <div
        className="relative w-full max-w-4xl glass-panel rounded-3xl shadow-[0_24px_64px_rgba(25,59,91,0.24)] border border-[rgba(130,170,205,0.35)] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header Bar */}
        <div className="p-5 sm:p-6 bg-[rgba(248,251,255,0.92)] backdrop-blur-xl text-azraq-deep flex items-center justify-between border-b border-[rgba(130,170,205,0.22)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-azraq-deep to-azraq-cyan flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-azraq-deep tracking-tight">
                  AZRAQ Brand Identity System & Design Book
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-azraq-ice/80 text-azraq-deep text-[10px] font-bold uppercase tracking-wider border border-[rgba(130,170,205,0.3)]">
                  Official Assets
                </span>
              </div>
              <p className="text-xs text-azraq-secondary">
                Wordmark • Geometric Monogram • Packaging • Mobile Icons • Social Brand Assets
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBrandAssetsOpen(false)}
            className="w-8 h-8 rounded-full glass-card hover:bg-white text-azraq-secondary hover:text-azraq-deep flex items-center justify-center transition-all border border-[rgba(130,170,205,0.3)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 bg-[rgba(248,251,255,0.7)] backdrop-blur-md">

          {/* Brand Manifesto Section */}
          <div className="p-6 rounded-3xl glass-card border border-[rgba(130,170,205,0.3)] shadow-xs space-y-2">
            <span className="text-xs font-mono font-bold text-[#0877C9] uppercase tracking-widest">
              Brand Positioning & Ethos
            </span>
            <h3 className="text-2xl font-black text-azraq-deep tracking-tight">
              AZRAQ — Curated Everyday Goods
            </h3>
            <p className="text-base font-serif italic text-azraq-deep/80">
              "Discover better. Live better."
            </p>
            <p className="text-xs sm:text-sm text-azraq-secondary leading-relaxed pt-1">
              AZRAQ is a contemporary retail brand tailored for Bangladesh, bridging futuristic tech-inspired minimalism with curated everyday luxury goods. All backend supplier logistics (EasyDrop) remain private; AZRAQ is the sole customer-facing standard of trust, design, and doorstep excellence.
            </p>
          </div>

          {/* 1. Logos & Monograms Showcase (Dark & Light Variations) */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-ice text-azraq-deep flex items-center justify-center text-xs">1</span>
              Logo Variations & Monograms
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dark Variant on Light Background */}
              <div className="p-8 rounded-2xl bg-white border border-[rgba(130,170,205,0.25)] shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-secondary">Primary Retail Logo (Light Surface)</span>
                <AzraqLogo variant="dark" size="lg" showDescriptor={true} />
                <span className="text-xs text-azraq-secondary">For headers, invoices, retail tags</span>
              </div>

              {/* Light Variant on Dark Background */}
              <div className="p-8 rounded-2xl bg-[#193B5B] border border-[rgba(112,200,237,0.3)] shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-cyan">Dark Mode & Feature Sections</span>
                <AzraqLogo variant="light" size="lg" showDescriptor={true} />
                <span className="text-xs text-white/50">For feature panels, dark hero modes</span>
              </div>
            </div>

            {/* Brand Symbol & App Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">

              {/* Monogram Isolated */}
              <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[rgba(130,170,205,0.25)] flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-secondary">Official Brand Symbol</span>
                <div className="w-16 h-16 rounded-2xl bg-white border border-[rgba(130,170,205,0.25)] flex items-center justify-center shadow-md p-2">
                  <img src="/branding/azraq-icon.png" alt="AZRAQ Symbol" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] text-azraq-secondary">Curated Everyday Goods Bag</span>
              </div>

              {/* Mobile App Icon */}
              <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[rgba(130,170,205,0.25)] flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-secondary">Apple Touch Icon</span>
                <img src="/branding/apple-touch-icon.png" alt="Apple Touch Icon" className="w-16 h-16 rounded-2xl shadow-lg border border-[rgba(130,170,205,0.25)]" />
                <span className="text-[11px] text-azraq-secondary">192x192 Touch Icon</span>
              </div>

              {/* Favicon */}
              <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[rgba(130,170,205,0.25)] flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-secondary">Browser Favicon</span>
                <div className="w-16 h-16 rounded-xl bg-white border border-[rgba(130,170,205,0.25)] flex items-center justify-center shadow-md p-2">
                  <img src="/favicon-32x32.png" alt="Favicon" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-[11px] text-azraq-secondary">Crisp multi-resolution icon</span>
              </div>

            </div>
          </div>

          {/* 2. Color Palette System */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-ice text-azraq-deep flex items-center justify-center text-xs">2</span>
              Official Brand Color Palette
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {colors.map(c => (
                <div
                  key={c.hex}
                  onClick={() => copyColor(c.hex)}
                  className="p-3 rounded-2xl border border-[rgba(130,170,205,0.3)] bg-white/80 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
                >
                  <div className="w-full h-10 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: c.hex }} />
                  <div className="mt-2">
                    <p className="text-xs font-bold text-azraq-deep truncate">{c.name}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-azraq-secondary mt-0.5">
                      <span>{c.hex}</span>
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Packaging & Physical Touchpoints Mockup */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-ice text-azraq-deep flex items-center justify-center text-xs">3</span>
              Packaging & Customer Unboxing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Luxury Shipper Box */}
              <div className="p-5 rounded-2xl bg-[#193B5B] text-white space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-azraq-cyan">
                  <Package className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-white">Custom Rigid Shipping Box</h5>
                <p className="text-xs text-white/70 leading-relaxed">
                  Deep Navy matte finish with debossed silver AZ monogram and security pull tab tape.
                </p>
                <div className="p-2 rounded-lg bg-black/30 text-[10px] font-mono text-azraq-cyan">
                  SPEC: 350gsm Corrugated • Soy Inks
                </div>
              </div>

              {/* Velvet/Cotton Dust Bag */}
              <div className="p-5 rounded-2xl bg-[#F8FBFF] border border-[rgba(130,170,205,0.3)] space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-azraq-cyan shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-azraq-deep">Satin Protective Dust Bag</h5>
                <p className="text-xs text-azraq-secondary leading-relaxed">
                  Every luxury item includes a custom protective drawstring dust bag with metallic woven label.
                </p>
                <div className="p-2 rounded-lg bg-white text-[10px] font-mono text-azraq-deep border border-[rgba(130,170,205,0.2)]">
                  SPEC: Recycled Organic Cotton
                </div>
              </div>

              {/* Authenticity Certificate & Tag */}
              <div className="p-5 rounded-2xl bg-white border border-[rgba(130,170,205,0.25)] shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-azraq-ice flex items-center justify-center text-azraq-cyan">
                  <Check className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-azraq-deep">QC Holographic Hang Tag</h5>
                <p className="text-xs text-azraq-secondary leading-relaxed">
                  Individually numbered tag with QR code linking directly to AZRAQ doorstep care guide.
                </p>
                <div className="p-2 rounded-lg bg-[#F1F7FC] text-[10px] font-mono text-azraq-deep">
                  TAG: #AZQ-QC-VERIFIED
                </div>
              </div>

            </div>
          </div>

          {/* 4. Social Media Asset Templates */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-deep flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-ice text-azraq-deep flex items-center justify-center text-xs">4</span>
              Social Media & Campaign Templates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Instagram Story / Reel Mockup */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#DDEEFF]/60 to-white border border-[rgba(130,170,205,0.3)] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-deep">
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-azraq-cyan" />
                    Story Template (9:16)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-[rgba(130,170,205,0.2)]">1080x1920</span>
                </div>
                <div className="aspect-[9/12] rounded-xl bg-[#193B5B] p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-center text-[10px] opacity-75">
                    <span>@azraq.shop</span>
                    <span className="text-azraq-cyan">NEW DROP</span>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-xs font-serif italic text-azraq-cyan">Curated Everyday Luxury</span>
                    <h5 className="text-lg font-black tracking-tight leading-tight mt-1">
                      DISCOVER BETTER.<br />LIVE BETTER.
                    </h5>
                  </div>
                  <div className="flex justify-between items-center text-[9px] bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <span>Verified Authentic</span>
                    <span className="font-bold text-azraq-cyan">Shop Now →</span>
                  </div>
                </div>
              </div>

              {/* Feed Post Carousel Mockup */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#DDEEFF]/60 to-white border border-[rgba(130,170,205,0.3)] space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-deep">
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-azraq-cyan" />
                    Feed Carousel (1:1 Square)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-[rgba(130,170,205,0.2)]">1080x1080</span>
                </div>
                <div className="aspect-square rounded-xl bg-gradient-to-br from-[#F8FBFF] to-[#DDEEFF] p-5 flex flex-col justify-between text-azraq-deep border border-[rgba(130,170,205,0.2)] shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold tracking-tight">AZRAQ</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#193B5B] text-white">৳2,450 BDT</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-extrabold text-azraq-deep">Atelier Structured Bag</p>
                    <p className="text-[10px] text-azraq-secondary">Pebbled Vegan Calfskin</p>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-azraq-secondary border-t border-[rgba(130,170,205,0.2)] pt-2">
                    <span>Free BD Courier over ৳3,000</span>
                    <span className="font-bold text-azraq-cyan">Tap to view</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[rgba(248,251,255,0.9)] border-t border-[rgba(130,170,205,0.22)] flex items-center justify-between text-xs text-azraq-secondary">
          <span>AZRAQ Brand Design System • Google DeepMind & Human Co-Created</span>
          <button
            onClick={() => setIsBrandAssetsOpen(false)}
            className="px-5 py-2 rounded-full bg-[#193B5B] text-white font-bold hover:bg-[#062B4F] transition-colors"
          >
            Close Brand Book
          </button>
        </div>

      </div>
    </div>
  );
}

