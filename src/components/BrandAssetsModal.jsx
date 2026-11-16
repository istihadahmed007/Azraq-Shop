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
    { name: 'Midnight Navy', hex: '#101C35', role: 'Main Brand & Foundation' },
    { name: 'Deep Blue', hex: '#183B70', role: 'Secondary Brand Depth' },
    { name: 'Cobalt Blue', hex: '#2563EB', role: 'Primary Action & Accent' },
    { name: 'Pure White', hex: '#FFFFFF', role: 'Card Surfaces & Contrast' },
    { name: 'Soft Gray', hex: '#F5F7FA', role: 'Subtle Backgrounds' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-azraq-navy/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-azraq-purple/30 overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-azraq-navy to-azraq-charcoal text-white flex items-center justify-between border-b border-azraq-purple/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azraq-charcoal border border-azraq-lime/40 flex items-center justify-center text-azraq-lime">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">
                  AZRAQ Brand Identity System & Design Book
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-azraq-lime text-azraq-navy text-[10px] font-black uppercase">
                  Official Assets
                </span>
              </div>
              <p className="text-xs text-white/60">
                Wordmark • Geometric Monogram • Packaging • Mobile Icons • Social Brand Assets
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBrandAssetsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 bg-white">
          
          {/* Brand Manifesto Section */}
          <div className="p-6 rounded-3xl bg-azraq-cloud border border-azraq-purple/20 space-y-2">
            <span className="text-xs font-mono font-bold text-azraq-violet uppercase tracking-widest">
              Brand Positioning & Ethos
            </span>
            <h3 className="text-2xl font-black text-azraq-navy tracking-tight">
              AZRAQ — Curated Everyday Goods
            </h3>
            <p className="text-base font-serif italic text-azraq-navy/80">
              "Discover better. Live better."
            </p>
            <p className="text-xs sm:text-sm text-azraq-navy/70 leading-relaxed pt-1">
              AZRAQ is a contemporary retail brand tailored for Bangladesh, bridging futuristic tech-inspired minimalism with curated everyday luxury goods. All backend supplier logistics (EasyDrop) remain private; AZRAQ is the sole customer-facing standard of trust, design, and doorstep excellence.
            </p>
          </div>

          {/* 1. Logos & Monograms Showcase (Dark & Light Variations) */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-navy flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-xs">1</span>
              Logo Variations & Monograms
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dark Variant on Light Background */}
              <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-400">Primary Retail Logo (Light Surface)</span>
                <AzraqLogo variant="dark" size="lg" showDescriptor={true} />
                <span className="text-xs text-gray-500">For headers, invoices, retail tags</span>
              </div>

              {/* Light Variant on Dark Background */}
              <div className="p-8 rounded-2xl bg-azraq-navy border border-azraq-purple/30 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-[10px] font-mono uppercase text-azraq-purple">Dark Mode & Feature Sections</span>
                <AzraqLogo variant="light" size="lg" showDescriptor={true} />
                <span className="text-xs text-white/50">For feature panels, dark hero modes</span>
              </div>
            </div>

            {/* Brand Symbol & App Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Monogram Isolated */}
              <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-gray-200 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-500">Official Brand Symbol</span>
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-md p-2">
                  <img src="/branding/azraq-icon.png" alt="AZRAQ Symbol" className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] text-gray-500">Curated Everyday Goods Bag</span>
              </div>

              {/* Mobile App Icon */}
              <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-gray-200 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-500">Apple Touch Icon</span>
                <img src="/branding/apple-touch-icon.png" alt="Apple Touch Icon" className="w-16 h-16 rounded-2xl shadow-lg border border-gray-200" />
                <span className="text-[11px] text-gray-500">192x192 Touch Icon</span>
              </div>

              {/* Favicon */}
              <div className="p-5 rounded-2xl bg-[#F5F7FA] border border-gray-200 flex flex-col items-center justify-center gap-3 text-center">
                <span className="text-[10px] font-mono uppercase text-gray-500">Browser Favicon</span>
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-md p-2">
                  <img src="/favicon-32x32.png" alt="Favicon" className="w-8 h-8 object-contain" />
                </div>
                <span className="text-[11px] text-gray-500">Crisp multi-resolution icon</span>
              </div>

            </div>
          </div>

          {/* 2. Color Palette System */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-navy flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-xs">2</span>
              Official Brand Color Palette
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {colors.map(c => (
                <div 
                  key={c.hex}
                  onClick={() => copyColor(c.hex)}
                  className="p-3 rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-28"
                >
                  <div className="w-full h-10 rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: c.hex }} />
                  <div className="mt-2">
                    <p className="text-xs font-bold text-azraq-navy truncate">{c.name}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mt-0.5">
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
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-navy flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-xs">3</span>
              Packaging & Customer Unboxing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Luxury Shipper Box */}
              <div className="p-5 rounded-2xl bg-azraq-navy text-white space-y-3 relative overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-azraq-charcoal flex items-center justify-center text-azraq-lime">
                  <Package className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-white">Custom Rigid Shipping Box</h5>
                <p className="text-xs text-white/70 leading-relaxed">
                  Deep Navy matte finish with debossed silver AZ monogram and neon-lime security pull tab tape.
                </p>
                <div className="p-2 rounded-lg bg-black/30 text-[10px] font-mono text-azraq-lime">
                  SPEC: 350gsm Corrugated • Soy Inks
                </div>
              </div>

              {/* Velvet/Cotton Dust Bag */}
              <div className="p-5 rounded-2xl bg-azraq-cloud border border-azraq-purple/30 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-azraq-violet shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-azraq-navy">Satin Protective Dust Bag</h5>
                <p className="text-xs text-azraq-navy/70 leading-relaxed">
                  Every Category 5 bag includes a custom lavender drawstring dust bag with metallic woven label.
                </p>
                <div className="p-2 rounded-lg bg-white text-[10px] font-mono text-azraq-violet">
                  SPEC: Recycled Organic Cotton
                </div>
              </div>

              {/* Authenticity Certificate & Tag */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                <div className="w-8 h-8 rounded-lg bg-azraq-lavender flex items-center justify-center text-azraq-violet">
                  <Check className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-sm text-azraq-navy">QC Holographic Hang Tag</h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Individually numbered tag with QR code linking directly to AZRAQ doorstep care guide.
                </p>
                <div className="p-2 rounded-lg bg-gray-100 text-[10px] font-mono text-gray-700">
                  TAG: #AZQ-QC-VERIFIED
                </div>
              </div>

            </div>
          </div>

          {/* 4. Social Media Asset Templates */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-azraq-navy flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-azraq-lavender text-azraq-violet flex items-center justify-center text-xs">4</span>
              Social Media & Campaign Templates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Instagram Story / Reel Mockup */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-azraq-lavender to-white border border-azraq-purple/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-navy">
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-azraq-violet" />
                    Story Template (9:16)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full">1080x1920</span>
                </div>
                <div className="aspect-[9/12] rounded-xl bg-azraq-navy p-4 flex flex-col justify-between text-white relative overflow-hidden shadow-inner">
                  <div className="flex justify-between items-center text-[10px] opacity-75">
                    <span>@azraq.shop</span>
                    <span className="text-azraq-lime">NEW DROP</span>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-xs font-serif italic text-azraq-lime">Curated Everyday Luxury</span>
                    <h5 className="text-lg font-black tracking-tight leading-tight mt-1">
                      DISCOVER BETTER.<br />LIVE BETTER.
                    </h5>
                  </div>
                  <div className="flex justify-between items-center text-[9px] bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <span>Category 5 Authorized</span>
                    <span className="font-bold text-azraq-lime">Shop Now →</span>
                  </div>
                </div>
              </div>

              {/* Feed Post Carousel Mockup */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-azraq-lavender to-white border border-azraq-purple/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-azraq-navy">
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-4 h-4 text-azraq-violet" />
                    Feed Carousel (1:1 Square)
                  </span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full">1080x1080</span>
                </div>
                <div className="aspect-square rounded-xl bg-hero-gradient p-5 flex flex-col justify-between text-azraq-navy border border-azraq-purple/20 shadow-inner">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold tracking-tight">AZRAQ</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-azraq-navy text-white">৳2,450 BDT</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-extrabold text-azraq-navy">Atelier Structured Bag</p>
                    <p className="text-[10px] text-azraq-navy/60">Pebbled Vegan Calfskin</p>
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-azraq-navy/70 border-t border-azraq-purple/20 pt-2">
                    <span>Free BD Courier over ৳3,000</span>
                    <span className="font-bold text-azraq-violet">Tap to view</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-azraq-cloud border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>AZRAQ Brand Design System • Google DeepMind & Human Co-Created</span>
          <button
            onClick={() => setIsBrandAssetsOpen(false)}
            className="px-5 py-2 rounded-full bg-azraq-navy text-white font-bold hover:bg-azraq-charcoal transition-colors"
          >
            Close Brand Book
          </button>
        </div>

      </div>
    </div>
  );
}

