import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  X,
  Sparkles,
  Search,
  RotateCcw,
  Crop,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Heart,
  Eye,
  ShoppingBag,
  ArrowRight,
  ArrowUpDown,
  Filter,
  Image as ImageIcon,
  ScanLine
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { performVisualSearch } from '../services/visualSearchService';
import ProductCard from './common/ProductCard';

export default function VisualSearchModal() {
  const {
    isVisualSearchOpen,
    setIsVisualSearchOpen,
    products,
    setSelectedProduct,
    addToCart,
    favorites,
    toggleFavorite,
    showToast,
    t
  } = useShop();

  // State
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Data URL
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Filters & Sorting in results view
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under-1500', '1500-3000', 'above-3000'
  const [sortBy, setSortBy] = useState('best-match'); // 'best-match', 'price-low', 'price-high', 'rating'
  const [cropAspectRatio, setCropAspectRatio] = useState('square'); // 'natural' | 'square'

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Close & reset
  const handleClose = () => {
    stopCameraStream();
    setIsVisualSearchOpen(false);
    setSelectedImage(null);
    setSearchResults(null);
    setIsScanning(false);
    setSearchError(null);
  };

  // Stop camera stream safely
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // File validator (Max 10MB, JPG, PNG, WEBP)
  const validateAndProcessFile = (file) => {
    setSearchError(null);
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setSearchError(t(
        "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.",
        "অসমর্থিত ফরম্যাট। অনুগ্রহ করে JPG, PNG বা WEBP ছবি নির্বাচন করুন।"
      ));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSearchError(t(
        "Image file size exceeds the 10 MB limit. Please select a smaller photo.",
        "ছবির সাইজ ১০ মেগাবাইটের বেশি। অনুগ্রহ করে ছোট ছবি নির্বাচন করুন।"
      ));
      return;
    }

    setImageMime(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target.result);
      setSearchResults(null);
    };
    reader.onerror = () => {
      setSearchError(t("Failed to read image file.", "ছবিটি লোড করতে সমস্যা হয়েছে।"));
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Live Camera Launch
  const startLiveCamera = async () => {
    setSearchError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setIsCameraActive(false);
      // Fallback to native input capture
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      } else {
        setSearchError(t("Camera access was blocked or not supported on this device.", "ক্যামেরা এক্সেস সম্ভব হয়নি। ফাইল আপলোড অপশনটি ব্যবহার করুন।"));
      }
    }
  };

  // Snap photo from live camera feed
  const capturePhotoFromLiveStream = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setSelectedImage(dataUrl);
    setImageMime('image/jpeg');
    stopCameraStream();
    setSearchResults(null);
  };

  // Run AI Visual Search
  const executeVisualSearch = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setSearchError(null);

    // Real scanning phase feedback
    const scanSteps = [
      t("Analyzing image dimensions and object contours...", "ছবির সাইজ ও অবজেক্টের কনট্যুর বিশ্লেষণ করা হচ্ছে..."),
      t("Extracting spatial geometry and structural features...", "গঠন ও প্যাটার্ন বিশ্লেষণ করা হচ্ছে..."),
      t("Predicting product category and matching catalog...", "পণ্য ক্যাটাগরি এবং ক্যাটালগের সাথে মেলানো হচ্ছে...")
    ];

    let stepIndex = 0;
    setScanStatusMessage(scanSteps[0]);
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < scanSteps.length) {
        setScanStatusMessage(scanSteps[stepIndex]);
      }
    }, 450);

    try {
      const results = await performVisualSearch({
        imageBase64: selectedImage,
        mimeType: imageMime,
        filters: {}
      });

      clearInterval(stepInterval);
      setSearchResults(results);
    } catch (err) {
      clearInterval(stepInterval);
      console.error('Visual search failure:', err);
      setSearchError(err.message || t("Visual search encountered an error. Please try another photo.", "ভিজ্যুয়াল সার্চে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"));
    } finally {
      setIsScanning(false);
    }
  };

  // Compute filtered & sorted results for display
  const processedResults = React.useMemo(() => {
    if (!searchResults || !searchResults.sections) return { bestMatches: [], similarProducts: [] };

    let best = [...(searchResults.sections.best_matches || [])];
    let similar = [...(searchResults.sections.similar_products || [])];

    // Combine for global category / price filtering
    const filterList = (items) => {
      let filtered = [...items];
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      if (priceFilter === 'under-1500') {
        filtered = filtered.filter(p => p.price < 1500);
      } else if (priceFilter === '1500-3000') {
        filtered = filtered.filter(p => p.price >= 1500 && p.price <= 3000);
      } else if (priceFilter === 'above-3000') {
        filtered = filtered.filter(p => p.price > 3000);
      }

      // Sort
      if (sortBy === 'price-low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
      } else {
        // Best match
        filtered.sort((a, b) => b.similarity - a.similarity);
      }

      return filtered;
    };

    return {
      bestMatches: filterList(best),
      similarProducts: filterList(similar)
    };
  }, [searchResults, selectedCategory, priceFilter, sortBy]);

  // Extract unique categories from search result items
  const availableCategories = React.useMemo(() => {
    if (!searchResults?.sections) return ['All'];
    const allItems = [
      ...(searchResults.sections.best_matches || []),
      ...(searchResults.sections.similar_products || [])
    ];
    const set = new Set(allItems.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [searchResults]);

  if (!isVisualSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-azraq-deep/40 backdrop-blur-md animate-in fade-in duration-200 select-none">

      {/* Modal Dialog Window */}
      <div
        className="relative w-full max-w-5xl lg:max-w-6xl glass-panel rounded-3xl shadow-[0_24px_64px_rgba(25,59,91,0.24)] border border-[rgba(130,170,205,0.35)] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[rgba(130,170,205,0.22)] bg-[rgba(248,251,255,0.92)] backdrop-blur-xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-azraq-deep to-azraq-cyan text-white flex items-center justify-center shadow-xs">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-azraq-deep tracking-tight">
                  {t("AI Visual Product Search", "এআই ভিজ্যুয়াল প্রোডাক্ট সার্চ")}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-azraq-ice/80 text-azraq-deep text-[10px] font-bold uppercase tracking-wider border border-[rgba(130,170,205,0.3)]">
                  Visual Search
                </span>
              </div>
              <p className="text-xs text-azraq-secondary">
                {t("Search by Image — Discover identical and visually matching products across our catalogue.", "ছবি দিয়ে সরাসরি পণ্য খুঁজুন।")}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full glass-card hover:bg-white text-azraq-secondary hover:text-azraq-deep flex items-center justify-center transition-all border border-[rgba(130,170,205,0.3)]"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* Error Banner */}
          {searchError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{searchError}</span>
            </div>
          )}

          {/* STEP 1: Upload & Capture Mode (When no image is chosen yet) */}
          {!selectedImage && !isCameraActive && (
            <div className="space-y-6">

              {/* Drag & Drop Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${dragActive
                  ? 'border-azraq-cyan bg-[#DDEEFF]/40 scale-[1.01] shadow-[0_0_30px_rgba(112,200,237,0.35)]'
                  : 'border-[rgba(130,170,205,0.4)] hover:border-azraq-cyan bg-gradient-to-b from-white/80 to-[rgba(221,238,255,0.2)] hover:bg-white/90'
                  }`}
              >
                {/* Floating ambient glow */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-azraq-ice/50 text-azraq-deep flex items-center justify-center mx-auto mb-4 border border-[rgba(130,170,205,0.3)] shadow-inner group-hover:scale-105 transition-transform">
                  <Upload className="w-8 h-8 sm:w-9 sm:h-9 text-azraq-cyan" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-azraq-deep mb-1">
                  {t("Drag and drop your image here, or browse files", "এখানে ছবি ড্র্যাগ করুন অথবা ক্লিক করে নির্বাচন করুন")}
                </h3>
                <p className="text-xs text-azraq-secondary max-w-md mx-auto mb-5">
                  {t("Supports JPG, JPEG, PNG, WEBP files up to 10 MB.", "সমর্থিত ফরম্যাট: JPG, JPEG, PNG, WEBP (সর্বোচ্চ ১০ এমবি)")}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-primary-icy text-azraq-deep text-xs font-bold shadow-[0_8px_24px_rgba(112,200,237,0.3)] transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t("Upload an Image", "ডিভাইস থেকে আপলোড")}</span>
                </div>
              </div>

              {/* Alternative Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Option 2: Live Camera Capture */}
                <button
                  onClick={startLiveCamera}
                  className="p-4 rounded-xl bg-white border border-[#D9F0FF] hover:border-[#69C5F5] hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0877C9]/10 text-[#0877C9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0877C9] group-hover:text-white transition-all">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#062B4F] group-hover:text-[#0877C9] transition-colors">
                      {t("Take a Photo", "ক্যামেরা দিয়ে ছবি তুলুন")}
                    </h4>
                    <p className="text-[11px] text-[#062B4F]/60 mt-0.5">
                      {t("Use your mobile or laptop camera", "মোবাইল বা ওয়েবক্যাম দিয়ে স্ন্যাপ করুন")}
                    </p>
                  </div>
                </button>

                {/* Option 3: Sample Product Search (Quick Try) */}
                <button
                  onClick={() => {
                    // Try with authentic watch / speaker / bag
                    const sampleUrl = products[0]?.main_image || 'https://easydrop.asia/products/image-1794224164356-135288231.jpeg';
                    setSelectedImage(sampleUrl);
                    setSearchResults(null);
                  }}
                  className="p-4 rounded-xl bg-white border border-[#D9F0FF] hover:border-[#69C5F5] hover:shadow-md transition-all flex items-center gap-3.5 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#50DDF0]/15 text-[#0877C9] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0877C9] group-hover:text-white transition-all">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#062B4F] group-hover:text-[#0877C9] transition-colors">
                      {t("Try a Sample Product", "স্যাম্পল পণ্য দিয়ে পরীক্ষা করুন")}
                    </h4>
                    <p className="text-[11px] text-[#062B4F]/60 mt-0.5">
                      {t("Instant demo with flagship gadget set", "আমাদের ফ্ল্যাগশিপ পণ্য দিয়ে পরখ করুন")}
                    </p>
                  </div>
                </button>

              </div>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndProcessFile(e.target.files[0]);
                  }
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndProcessFile(e.target.files[0]);
                  }
                }}
              />

            </div>
          )}

          {/* STEP 1.B: Live Camera Stream View */}
          {isCameraActive && (
            <div className="space-y-4 text-center">
              <div className="relative aspect-video max-w-lg mx-auto rounded-2xl bg-black overflow-hidden border-2 border-[#0877C9] shadow-2xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Visual Viewfinder Reticle */}
                <div className="absolute inset-8 border border-white/40 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-[#50DDF0]" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-[#50DDF0]" />
                  </div>
                  <div className="text-[10px] text-white/70 font-mono tracking-widest uppercase">
                    Align Product in Frame
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-[#50DDF0]" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-[#50DDF0]" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={stopCameraStream}
                  className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#062B4F] text-xs font-bold transition-all"
                >
                  {t("Cancel", "বাতিল")}
                </button>
                <button
                  onClick={capturePhotoFromLiveStream}
                  className="px-6 py-2.5 rounded-full bg-[#0877C9] hover:bg-[#062B4F] text-white text-xs font-black shadow-lg transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t("Capture & Search", "ছবি তুলুন")}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Selected Image Preview & Scan Trigger (Before Results) */}
          {selectedImage && !searchResults && (
            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-[#D9F0FF]">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-[#062B4F]">
                    {t("Selected Photo Preview", "নির্বাচিত ছবির প্রিভিউ")}
                  </h3>
                  <p className="text-xs text-[#062B4F]/60">
                    {t("Adjust framing or click Find Similar Products to begin visual recognition.", "নিশ্চিত করে সার্চ শুরু করুন।")}
                  </p>
                </div>

                {/* Aspect ratio / Crop toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCropAspectRatio(cropAspectRatio === 'square' ? 'natural' : 'square')}
                    className="px-3 py-1.5 rounded-full bg-[#F0F7FF] hover:bg-[#D9F0FF] text-xs font-semibold text-[#062B4F] border border-[#D9F0FF] flex items-center gap-1.5 transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5 text-[#0877C9]" />
                    <span>{cropAspectRatio === 'square' ? '1:1 Square' : 'Natural'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setSearchResults(null);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    {t("Replace", "পরিবর্তন")}
                  </button>
                </div>
              </div>

              {/* Main Image Preview with Interactive Laser Scanning Animation */}
              <div className="relative max-w-sm mx-auto rounded-2xl bg-gradient-to-b from-[#F8FCFF] to-white border border-[#69C5F5]/40 shadow-xl overflow-hidden p-3 flex items-center justify-center">

                <div className={`w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center relative ${cropAspectRatio === 'square' ? 'aspect-square' : 'max-h-80'
                  }`}>
                  <img
                    src={selectedImage}
                    alt="Query Product"
                    className="w-full h-full object-contain"
                  />

                  {/* Visual Scanning Indicator (Active when searching) */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-[#0877C9]/10 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0877C9] to-transparent animate-visual-scan pointer-events-none" />
                    </div>
                  )}
                </div>

              </div>

              {/* Scanning status message */}
              {isScanning ? (
                <div className="text-center space-y-2 py-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0877C9]">
                    <Sparkles className="w-4 h-4 animate-spin text-[#50DDF0]" />
                    <span>{scanStatusMessage}</span>
                  </div>
                  <div className="w-48 h-1.5 bg-[#D9F0FF] rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0877C9] to-[#50DDF0] animate-pulse w-3/4 rounded-full" />
                  </div>
                </div>
              ) : (
                /* Primary CTA Button: Find Similar Products */
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={executeVisualSearch}
                    disabled={isScanning}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-primary-icy text-azraq-deep font-bold text-sm shadow-[0_8px_24px_rgba(112,200,237,0.35)] hover:shadow-[0_12px_32px_rgba(112,200,237,0.5)] transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Sparkles className="w-4 h-4 text-azraq-deep" />
                    <span>{t("Find Similar Products", "সাদৃশ্যপূর্ণ পণ্য খুঁজুন")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* STEP 3: Results Display View */}
          {searchResults && (
            <div className="space-y-6">

              {/* Results Top Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#F0F7FF] via-white to-[#F0F7FF] border border-[#D9F0FF]">

                {/* Query Thumbnail Pill */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white border border-[#D9F0FF] p-1 flex-shrink-0 shadow-sm overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Queried item"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-[#062B4F] tracking-tight">
                        {t("Visual Search Results", "ভিজ্যুয়াল সার্চ ফলাফল")}
                      </h3>
                      {searchResults?.predicted_category && searchResults.predicted_category !== 'All' && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#EBF6FF] text-[#0877C9] border border-[#BCE1FE] text-[11px] font-bold">
                          {searchResults.predicted_category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#062B4F]/60">
                      {t("We found products that match the visual structure and category of your photo.", "আপনার ছবির সাথে সাদৃশ্যপূর্ণ ক্যাটালগ পণ্যসমূহ।")}
                    </p>
                  </div>
                </div>

                {/* Search Another Image Action */}
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSearchResults(null);
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-[#0877C9] text-[#0877C9] hover:bg-[#0877C9] hover:text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start md:self-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t("Search Another Image", "নতুন ছবি দিয়ে খুঁজুন")}</span>
                </button>
              </div>

              {/* Filter and Sorting Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                  {availableCategories.slice(0, 6).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                        ? 'bg-[#062B4F] text-white shadow-sm'
                        : 'bg-[#F8FCFF] text-[#062B4F]/70 hover:bg-[#D9F0FF]/50 border border-[#D9F0FF]'
                        }`}
                    >
                      {cat === 'All' ? t('All Categories', 'সব ক্যাটাগরি') : cat}
                    </button>
                  ))}
                </div>

                {/* Price & Sort Dropdowns */}
                <div className="flex items-center gap-2">
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] focus:outline-none"
                  >
                    <option value="all">{t("All Prices", "সব মূল্য")}</option>
                    <option value="under-1500">&lt; ৳1,500</option>
                    <option value="1500-3000">৳1,500 - ৳3,000</option>
                    <option value="above-3000">&gt; ৳3,000</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#D9F0FF] text-xs font-bold text-[#062B4F] focus:outline-none"
                  >
                    <option value="best-match">{t("Sort: Best Match", "সাজান: সেরা মিল")}</option>
                    <option value="price-low">{t("Price: Low to High", "দাম: কম")}</option>
                    <option value="price-high">{t("Price: High to Low", "দাম: বেশি")}</option>
                    <option value="rating">{t("Top Rated", "সর্বোচ্চ রেটিং")}</option>
                  </select>
                </div>

              </div>

              {/* No items matched message */}
              {processedResults.bestMatches.length === 0 && processedResults.similarProducts.length === 0 && (
                <div className="py-12 text-center rounded-2xl bg-[#F8FCFF] border border-[#D9F0FF] p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EBF6FF] text-[#0877C9] flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#062B4F]">
                    {t("No Close Matches Found", "কাছাকাছি কোনো পণ্য পাওয়া যায়নি")}
                  </h4>
                  <p className="text-xs text-[#062B4F]/60 max-w-md mx-auto">
                    {t(
                      "We could not find products in our catalogue matching this photo with high visual similarity. Try uploading a clearer photo with good lighting or browse by category.",
                      "আপনার ছবির সাথে যথেষ্ট সাদৃশ্যপূর্ণ কোনো পণ্য ক্যাটালগে পাওয়া যায়নি। স্পষ্ট ছবি আপলোড করুন অথবা ক্যাটাগরি ব্রাউজ করুন।"
                    )}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setSearchResults(null);
                      }}
                      className="px-5 py-2 rounded-full bg-[#0877C9] text-white text-xs font-bold hover:bg-[#062B4F] transition-colors"
                    >
                      {t("Try Another Image", "অন্য ছবি দিয়ে খুঁজুন")}
                    </button>
                    {(selectedCategory !== 'All' || priceFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSelectedCategory('All');
                          setPriceFilter('all');
                        }}
                        className="px-5 py-2 rounded-full bg-white border border-[#D9F0FF] text-[#062B4F] text-xs font-bold hover:bg-[#F0F7FF] transition-colors"
                      >
                        {t("Reset Filters", "ফিল্টার রিসেট করুন")}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION A — BEST MATCHES */}
              {processedResults.bestMatches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0877C9] shadow-[0_0_8px_#0877C9]" />
                    <h4 className="text-sm sm:text-base font-black text-[#062B4F] tracking-tight">
                      {t("Section A — Exact & Best Matches", "সেকশন এ — হুবহু ও সেরা সাদৃশ্যপূর্ণ পণ্যসমূহ")}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#0877C9] bg-[#D9F0FF] px-2 py-0.5 rounded-full">
                      {processedResults.bestMatches.length} {t("Matches", "টি মিল")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {processedResults.bestMatches.map(product => {
                      const fullProduct = products.find(p => p.id === product.id) || product;
                      return (
                        <ProductCard
                          key={product.id}
                          product={fullProduct}
                          isFav={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                          onSelectProduct={(p) => {
                            setSelectedProduct(p);
                            setIsVisualSearchOpen(false);
                          }}
                          onAddToCart={(p, v, q) => {
                            addToCart(p, v, q);
                            showToast(t("Added to your shopping bag!", "ব্যাগে যোগ করা হয়েছে!"), 'success');
                          }}
                          similarityBadge={product.similarity}
                          showSku={false}
                          showCategory={true}
                          compact={true}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION B — SIMILAR PRODUCTS */}
              {processedResults.similarProducts.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#69C5F5]" />
                    <h4 className="text-sm sm:text-base font-black text-[#062B4F] tracking-tight">
                      {t("Section B — Visually Similar Products", "সেকশন বি — কাছাকাছি ঘরানার পণ্যসমূহ")}
                    </h4>
                    <span className="text-[11px] font-semibold text-[#062B4F]/60">
                      {t("Related recommendations within matching category", "একই ক্যাটাগরির প্রাসঙ্গিক বিকল্প পণ্য")}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {processedResults.similarProducts.map(product => {
                      const fullProduct = products.find(p => p.id === product.id) || product;
                      return (
                        <ProductCard
                          key={product.id}
                          product={fullProduct}
                          isFav={favorites.includes(product.id)}
                          onToggleFavorite={toggleFavorite}
                          onSelectProduct={(p) => {
                            setSelectedProduct(p);
                            setIsVisualSearchOpen(false);
                          }}
                          onAddToCart={(p, v, q) => {
                            addToCart(p, v, q);
                            showToast(t("Added to your shopping bag!", "ব্যাগে যোগ করা হয়েছে!"), 'success');
                          }}
                          similarityBadge={product.similarity}
                          showSku={false}
                          showCategory={true}
                          compact={true}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

