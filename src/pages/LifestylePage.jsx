import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Utensils,
  Plane,
  ShoppingBag,
  Film,
  Tag,
  Copy,
  Check,
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
} from 'lucide-react';
import Header from '../components/dashboard/Header';
import PinVerificationModal from '../components/common/PinVerificationModal';
import BrandLogo from '../components/lifestyle/BrandLogos';
import { useBanking } from '../context/BankingContext';

const offersData = [
  {
    id: 'off-1',
    category: 'dining',
    brand: 'Starbucks',
    title: 'Flat 20% Off on Beverage Combos',
    description: 'Enjoy handcrafted beverages with 20% instant discount when paying with UNIQUE Bank Debit Card or UPI.',
    code: 'UNIQUEBREW20',
    expiry: 'Valid till Nov 30, 2026',
    discount: '20% OFF',
    terms: 'Valid on orders above ₹400 across all Starbucks outlets in India.',
    termsDetails: {
      validity: 'Valid till Nov 30, 2026',
      minSpend: '₹ 400.00',
      maxDiscount: 'Flat 20% (up to ₹ 120 per transaction)',
      eligibility: 'All UNIQUE Bank Debit Card & UPI users',
      paymentMethods: 'UNIQUE Bank Debit Card, UPI Auto-Debit',
      redemptionLimit: 'Max 2 redemptions per account per calendar month',
      applicableOn: 'Handcrafted hot & cold beverage combos and select bakery items',
      combinable: 'Cannot be combined with Starbucks Rewards stars or other third-party promotions',
      cancellation: 'Voucher is non-exchangeable for cash once generated and redeemed at outlet counter',
      voucherFee: 0,
      rules: [
        'Present the generated promo code at Starbucks POS before bill generation.',
        'Offer is valid across all participating Starbucks retail outlets in India.',
        'Not applicable on bottled beverages, merchandise, or packaged whole-bean coffee.',
        'In the event of bill cancellation, the promotional discount cannot be re-credited.',
        'This is a demonstration offer for testing banking privileges.',
      ],
    },
  },
  {
    id: 'off-2',
    category: 'travel',
    brand: 'MakeMyTrip',
    title: 'Up to ₹2,500 Off on Domestic Flights',
    description: 'Book domestic flights across India and save up to ₹2,500 using promo code at checkout.',
    code: 'UNIQUETRAVEL',
    expiry: 'Valid till Dec 31, 2026',
    discount: '₹2,500 OFF',
    terms: 'Applicable once per user on domestic flight bookings above ₹6,000.',
    termsDetails: {
      validity: 'Valid till Dec 31, 2026',
      minSpend: '₹ 6,000.00',
      maxDiscount: 'Up to ₹ 2,500.00 instant discount',
      eligibility: 'Verified UNIQUE Bank primary account holders',
      paymentMethods: 'UNIQUE Net Banking, Debit Card, or UPI',
      redemptionLimit: 'Once per user during the promotional window',
      applicableOn: 'Domestic one-way and round-trip flight bookings within India',
      combinable: 'Not applicable on multi-city itineraries, armed forces, or student fares',
      cancellation: 'Standard airline cancellation fees apply; discount component is non-refundable',
      voucherFee: 0,
      rules: [
        'Enter promo code UNIQUETRAVEL on the MakeMyTrip checkout page before final payment.',
        'Convenience fees and ancillary add-ons (meals, seat selection) are excluded from the discount.',
        'Valid on Indigo, Air India, SpiceJet, and Akasa Air domestic sectors.',
        'Offer cannot be transferred or exchanged for cash or airline credit vouchers.',
      ],
    },
  },
  {
    id: 'off-3',
    category: 'entertainment',
    brand: 'BookMyShow',
    title: 'Buy 1 Get 1 Movie Ticket Free',
    description: 'Get a complimentary movie ticket on Weekend Cinema bookings with UNIQUE Platinum Card.',
    code: 'BMSUNIQUEBOGO',
    expiry: 'Valid every Sat & Sun',
    discount: 'BOGO FREE',
    terms: 'Available for first 5,000 ticket bookings every weekend.',
    termsDetails: {
      validity: 'Valid every Saturday & Sunday through 2026',
      minSpend: 'Minimum purchase of 2 movie tickets',
      maxDiscount: 'Free second ticket value up to ₹ 250.00',
      eligibility: 'UNIQUE Platinum Debit Card & Smart Savings account holders',
      paymentMethods: 'UNIQUE Bank Platinum Debit Card',
      redemptionLimit: '1 free ticket per card per weekend (quota of 5,000 tickets weekly)',
      applicableOn: '2D, 3D, and IMAX regular cinema screenings across India',
      combinable: 'Cannot be combined with cinema theater passes or BMS Filmy Pass',
      cancellation: 'Booked tickets are non-refundable and subject to cinema operator terms',
      voucherFee: 0,
      rules: [
        'Select UNIQUE Bank Debit Card Offer under Payment Offers on BookMyShow.',
        'Quota refreshes every Saturday at 12:00 AM IST on a first-come, first-served basis.',
        'Internet handling fees and government taxes are applicable on both tickets.',
        'Sample demonstration terms for simulated voucher evaluation.',
      ],
    },
  },
  {
    id: 'off-4',
    category: 'shopping',
    brand: 'Amazon.in',
    title: '10% Instant Cashback on Tech Gadgets',
    description: 'Get 10% instant cashback up to ₹1,500 on smartphones, laptops, and smart wearables.',
    code: 'AMZUNIQUE10',
    expiry: 'Valid till Nov 15, 2026',
    discount: '10% CASHBACK',
    terms: 'Applicable on Electronics category for orders above ₹7,500.',
    termsDetails: {
      validity: 'Valid till Nov 15, 2026',
      minSpend: '₹ 7,500.00',
      maxDiscount: 'Flat 10% cashback up to ₹ 1,500.00',
      eligibility: 'All primary UNIQUE Bank savings account customers',
      paymentMethods: 'UNIQUE Bank Debit Card or Net Banking',
      redemptionLimit: 'One redemption per registered Amazon customer account',
      applicableOn: 'Smartphones, laptops, tablets, smart wearables, and PC accessories',
      combinable: 'Valid alongside Amazon Prime free delivery benefits',
      cancellation: 'Cashback will be forfeited and deducted if order is returned or cancelled',
      voucherFee: 0,
      rules: [
        'Cashback is credited to your UNIQUE Bank account statement within 72 hours of shipment.',
        'Offer is not valid on Amazon Pay gift card purchases or digital software downloads.',
        'Card transactions via third-party wallets are not eligible for cashback.',
      ],
    },
  },
  {
    id: 'off-5',
    category: 'dining',
    brand: 'Zomato Gold',
    title: 'Flat ₹150 Off on Gourmet Dining & Delivery',
    description: 'Indulge in delicious cuisines from top-rated restaurants with flat ₹150 off.',
    code: 'ZOMATOUNIQUE',
    expiry: 'Valid till Dec 15, 2026',
    discount: '₹150 OFF',
    terms: 'Minimum order value ₹499. Valid twice per month per user.',
    termsDetails: {
      validity: 'Valid till Dec 15, 2026',
      minSpend: '₹ 499.00',
      maxDiscount: 'Flat ₹ 150.00 instant discount',
      eligibility: 'All active UNIQUE Bank account holders',
      paymentMethods: 'UPI via UNIQUE Bank or Linked Debit Card',
      redemptionLimit: '2 orders per month per customer account',
      applicableOn: 'Participating gourmet dining, cafes, and online home delivery restaurants',
      combinable: 'Can be used alongside Zomato Gold free delivery benefits',
      cancellation: 'Discount coupon cannot be reinstated if the restaurant cancels the order',
      voucherFee: 0,
      rules: [
        'Apply promo code ZOMATOUNIQUE at the checkout cart before choosing payment.',
        'Valid on delivery orders placed in metropolitan and tier-1 Indian cities.',
        'Not applicable on alcoholic beverages or direct tip to delivery partners.',
      ],
    },
  },
  {
    id: 'off-6',
    category: 'travel',
    brand: 'Priority Pass Airport Lounges',
    title: 'Complimentary Access to 1,300+ Lounges',
    description: 'Enjoy free gourmet refreshments, high-speed Wi-Fi, and relax before your flights worldwide.',
    code: 'LOUNGEPASS26',
    expiry: 'All Year Privilege',
    discount: 'FREE ACCESS',
    terms: 'Complimentary for Premium and Smart Savings plan cardholders.',
    termsDetails: {
      validity: 'Continuous membership privilege throughout 2026',
      minSpend: '₹ 0.00 (Zero minimum spend)',
      maxDiscount: '100% complimentary lounge entry (₹ 2,400 value per visit)',
      eligibility: 'Exclusive to Premium Banking & Platinum Card cardholders',
      paymentMethods: 'Mandatory verification card authorization hold of ₹ 2.00 (auto-reversed)',
      redemptionLimit: '4 complimentary lounge visits per calendar quarter',
      applicableOn: '1,300+ participating international and domestic airport lounges worldwide',
      combinable: 'Guest access permitted at standard lounge fee per additional visitor',
      cancellation: 'Unused quarterly visits lapse and do not roll over to subsequent quarters',
      voucherFee: 2,
      rules: [
        'Present your UNIQUE Platinum Card and boarding pass at lounge reception.',
        'A temporary ₹2 verification charge is placed on the card to confirm active status.',
        'Lounge access includes standard food buffet, high-speed Wi-Fi, and shower facilities.',
        'Stay is limited to a maximum of 3 hours per visit prior to flight departure.',
      ],
    },
  },
  {
    id: 'off-7',
    category: 'shopping',
    brand: 'Croma Electronics',
    title: '₹2,000 Voucher on Home Appliances',
    description: 'Upgrade your living space with flat ₹2,000 instant discount on refrigerators, TVs, and washing machines.',
    code: 'CROMAUNIQUE',
    expiry: 'Valid till Nov 20, 2026',
    discount: '₹2,000 OFF',
    terms: 'Valid at Croma retail stores and online on cart value above ₹20,000.',
    termsDetails: {
      validity: 'Valid till Nov 20, 2026',
      minSpend: '₹ 20,000.00',
      maxDiscount: 'Flat ₹ 2,000.00 instant voucher discount',
      eligibility: 'UNIQUE Bank Debit Card and Net Banking customers',
      paymentMethods: 'UNIQUE Bank Cards, Net Banking, or No-Cost EMI',
      redemptionLimit: 'Single use per invoice across retail stores and croma.com',
      applicableOn: 'Large appliances including refrigerators, smart TVs, and washing machines',
      combinable: 'Cannot be merged with corporate employee or institutional discount programs',
      cancellation: 'In case of product return, voucher value will be deducted from refund',
      voucherFee: 0,
      rules: [
        'Present the voucher QR or 10-digit code at the billing counter or checkout on croma.com.',
        'Eligible on all leading appliance brands including LG, Samsung, Sony, and Whirlpool.',
        'Not valid on mobile phones, gift cards, or extended warranty purchases.',
      ],
    },
  },
  {
    id: 'off-8',
    category: 'entertainment',
    brand: 'Spotify Premium',
    title: '3 Months Free Spotify Individual',
    description: 'Stream millions of songs and podcasts ad-free with offline playback on any device.',
    code: 'SPOTIFYUNIQUE',
    expiry: 'Valid till Dec 31, 2026',
    discount: '3 MONTHS FREE',
    terms: 'Available for members who have not previously tried Spotify Premium.',
    termsDetails: {
      validity: 'Valid till Dec 31, 2026',
      minSpend: '₹ 0.00 for initial 3 months trial',
      maxDiscount: '3 Months free Spotify Individual subscription (₹ 357 value)',
      eligibility: 'New Spotify subscribers using UNIQUE Bank Card for mandate setup',
      paymentMethods: 'UNIQUE Bank Virtual or Physical Debit Card',
      redemptionLimit: 'One promotional trial per Spotify account and UNIQUE card',
      applicableOn: 'Spotify Individual Premium (Ad-free audio, high bit-rate, offline downloads)',
      combinable: 'Not valid for Spotify Family, Duo, or Student subscription tiers',
      cancellation: 'Cancel anytime during the 3-month trial to avoid subsequent auto-renewal billing',
      voucherFee: 0,
      rules: [
        'Redeemable exclusively via spotify.com/in-en/claim using unique promo code.',
        'Requires setting up a recurring e-mandate on your UNIQUE Debit Card.',
        'Standard billing of ₹119/month resumes after 3 months unless cancelled.',
      ],
    },
  },
];

const categories = [
  { id: 'all', label: 'All Offers', icon: Sparkles },
  { id: 'dining', label: 'Dining', icon: Utensils },
  { id: 'travel', label: 'Travel & Lounges', icon: Plane },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'entertainment', label: 'Entertainment', icon: Film },
];

export default function LifestylePage() {
  const { showToast, addTransaction } = useBanking();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Flows
  const [selectedOffer, setSelectedOffer] = useState(null); // Claim modal
  const [termsModalOffer, setTermsModalOffer] = useState(null); // Terms & Conditions modal
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [claimError, setClaimError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [claimedOffers, setClaimedOffers] = useState({}); // { [id]: { refId, date, time } }

  const filteredOffers = useMemo(() => {
    return offersData.filter((offer) => {
      const matchCat = activeCategory === 'all' || offer.category === activeCategory;
      const matchSearch =
        offer.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenClaim = (offer) => {
    setSelectedOffer(offer);
    setTermsAccepted(false);
    setClaimError('');
    setCopiedCode(false);
  };

  const handleCloseClaim = () => {
    setSelectedOffer(null);
    setTermsAccepted(false);
    setClaimError('');
    setCopiedCode(false);
  };

  const handleInitiateRedeem = () => {
    if (!termsAccepted) {
      setClaimError('Please accept the Offer Terms & Conditions to proceed.');
      return;
    }
    setClaimError('');
    // Open demo PIN verification modal
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);

    if (!selectedOffer) return;

    const refId = `VCH-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = selectedOffer.termsDetails.voucherFee || 0;

    if (fee > 0) {
      addTransaction({
        description: `Lounge Token Verification Hold — ${selectedOffer.brand}`,
        amount: fee,
        type: 'debit',
        category: 'travel',
        paymentMethod: 'Debit Card Authorization',
        recipient: selectedOffer.brand,
      });
    }

    setClaimedOffers((prev) => ({
      ...prev,
      [selectedOffer.id]: {
        refId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    showToast(`Voucher for ${selectedOffer.brand} activated! Code revealed.`, 'success');
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast(`Promo code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-alt">
      <Header />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Dashboard
          </Link>
          <span className="text-text-muted">/</span>
          <span className="font-medium text-text-secondary">Lifestyle & Privileges</span>
        </div>

        {/* Hero Section */}
        <div className="mb-8 rounded-2xl border border-white/60 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 p-6 sm:p-8 text-white shadow-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white mb-3">
            <Sparkles size={14} />
            Exclusive Member Rewards
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curated Lifestyle Privileges & Partner Deals
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
            Unlock handpicked offers on dining, flight bookings, lounge experiences, and top shopping
            brands simply by using your UNIQUE Bank accounts and cards.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-text-secondary hover:text-text-primary border border-border/70'
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search offers or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-text-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* Offers Grid */}
        {filteredOffers.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-base font-semibold text-text-primary">No offers found</p>
            <p className="text-xs text-text-muted mt-1">
              Try adjusting your search query or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 rounded-xl bg-brand-50 px-4 py-2 text-xs font-bold text-brand-600 hover:bg-brand-100 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredOffers.map((offer) => {
              const isClaimed = Boolean(claimedOffers[offer.id]);

              return (
                <div
                  key={offer.id}
                  className="card flex flex-col justify-between overflow-hidden p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/80"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <BrandLogo brandId={offer.id} size={44} />
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/50">
                        {offer.discount}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                      {offer.brand}
                    </p>
                    <h3 className="mt-1 font-bold text-sm text-text-primary leading-snug">
                      {offer.title}
                    </h3>
                    <p className="mt-2 text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {offer.description}
                    </p>

                    <div className="mt-2.5 rounded-lg bg-surface-alt px-2.5 py-1 text-[11px] text-text-muted">
                      Min spend: <strong className="text-text-secondary">{offer.termsDetails.minSpend}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTermsModalOffer(offer)}
                      className="text-[11px] font-semibold text-text-muted hover:text-brand-600 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      Terms & Conditions
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenClaim(offer)}
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100 transition-colors cursor-pointer"
                    >
                      <Tag size={13} />
                      <span>{isClaimed ? 'View Voucher' : 'Claim Offer'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ────────────────── 1. DEDICATED TERMS & CONDITIONS MODAL ────────────────── */}
      <AnimatePresence>
        {termsModalOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setTermsModalOffer(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <BrandLogo brandId={termsModalOffer.id} size={42} />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">
                      Terms & Conditions
                    </h3>
                    <p className="text-xs text-text-muted font-medium">
                      {termsModalOffer.brand} · {termsModalOffer.discount}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTermsModalOffer(null)}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer"
                  aria-label="Close terms modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="mt-4 overflow-y-auto pr-1 space-y-4 text-xs text-text-secondary leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-text-primary">{termsModalOffer.title}</h4>
                  <p className="mt-1 text-xs text-text-muted">{termsModalOffer.description}</p>
                </div>

                {/* Sample Demonstration Notice */}
                <div className="rounded-xl bg-amber-50/80 border border-amber-200/70 p-3 text-amber-800 flex items-start gap-2 text-[11px]">
                  <FileText size={16} className="shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">Sample Demonstration Terms</p>
                    <p className="text-amber-700 mt-0.5">
                      These conditions are demonstration rules provided for testing and evaluation. No real merchant contract or financial liability is created.
                    </p>
                  </div>
                </div>

                {/* Structured Terms Grid */}
                <div className="rounded-xl bg-surface-alt p-3.5 border border-border/70 space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Offer Validity
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.validity}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Minimum Spend
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.minSpend}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Maximum Benefit
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.maxDiscount}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Eligible Members
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.eligibility}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Payment Methods
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.paymentMethods}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                        Redemption Limit
                      </span>
                      <span className="font-semibold text-text-primary">
                        {termsModalOffer.termsDetails.redemptionLimit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Applicable Products & Services
                    </span>
                    <span className="text-text-primary">
                      {termsModalOffer.termsDetails.applicableOn}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Combinability
                    </span>
                    <span className="text-text-primary">
                      {termsModalOffer.termsDetails.combinable}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                      Cancellation & Refund Policy
                    </span>
                    <span className="text-text-primary">
                      {termsModalOffer.termsDetails.cancellation}
                    </span>
                  </div>
                </div>

                {/* Detailed Conditions List */}
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">
                    Detailed Conditions & Eligibility
                  </h5>
                  <ul className="space-y-1.5 list-disc list-inside text-text-secondary pl-1">
                    {termsModalOffer.termsDetails.rules.map((rule, idx) => (
                      <li key={idx} className="text-xs leading-relaxed">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={() => setTermsModalOffer(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const targetOffer = termsModalOffer;
                    setTermsModalOffer(null);
                    handleOpenClaim(targetOffer);
                  }}
                  className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm cursor-pointer"
                >
                  Proceed to Claim Offer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────── 2. CLAIM & REDEEM VOUCHER MODAL ────────────────── */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={handleCloseClaim}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <BrandLogo brandId={selectedOffer.id} size={48} />
                  <div>
                    <h3 className="font-bold text-base text-text-primary">
                      {selectedOffer.brand}
                    </h3>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {selectedOffer.discount}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseClaim}
                  className="rounded-lg p-1.5 text-text-muted hover:bg-gray-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              {claimedOffers[selectedOffer.id] ? (
                /* ── Successfully Claimed / Activated View ── */
                <div className="py-4 space-y-4">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2">
                      <CheckCircle2 size={28} />
                    </div>
                    <h4 className="font-bold text-base text-text-primary">Offer Activated & Unlocked!</h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Your exclusive voucher code is verified and ready to use.
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/50">
                      Simulated Privilege Claim
                    </span>
                  </div>

                  {/* Voucher code box */}
                  <div className="rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-4 text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                      Exclusive Voucher Code
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="font-mono text-xl font-extrabold text-brand-900 tracking-wider">
                        {selectedOffer.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(selectedOffer.code)}
                        className="rounded-lg p-1.5 text-brand-700 hover:bg-white hover:text-brand-900 transition-colors shadow-2xs cursor-pointer"
                        title="Copy Code"
                      >
                        {copiedCode ? (
                          <Check size={18} className="text-emerald-600" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-text-muted mt-1.5">{selectedOffer.expiry}</p>
                  </div>

                  {/* Reference & Usage summary */}
                  <div className="rounded-xl bg-surface-alt p-3 text-xs space-y-1.5 border border-border/70">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Ref ID</span>
                      <span className="font-mono font-bold text-text-primary">
                        {claimedOffers[selectedOffer.id].refId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Claimed On</span>
                      <span className="text-text-primary">
                        {claimedOffers[selectedOffer.id].date} · {claimedOffers[selectedOffer.id].time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Min. Spend</span>
                      <span className="font-semibold text-text-primary">
                        {selectedOffer.termsDetails.minSpend}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(selectedOffer.code)}
                      className="rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm cursor-pointer"
                    >
                      {copiedCode ? 'Copied to Clipboard!' : 'Copy Code & Finish'}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Pre-claim Review & Terms Agreement View ── */
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">{selectedOffer.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      {selectedOffer.description}
                    </p>
                  </div>

                  {/* Key Conditions Quick Card */}
                  <div className="rounded-xl bg-surface-alt p-3.5 border border-border/70 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Minimum Spend:</span>
                      <span className="font-semibold text-text-primary">
                        {selectedOffer.termsDetails.minSpend}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Eligibility:</span>
                      <span className="font-semibold text-text-primary">
                        {selectedOffer.termsDetails.eligibility}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Validity:</span>
                      <span className="text-text-primary">{selectedOffer.expiry}</span>
                    </div>

                    <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                      <span className="text-[11px] text-text-muted">Need to check full conditions?</span>
                      <button
                        type="button"
                        onClick={() => {
                          const target = selectedOffer;
                          setSelectedOffer(null);
                          setTermsModalOffer(target);
                        }}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 underline cursor-pointer"
                      >
                        Read Terms & Conditions
                      </button>
                    </div>
                  </div>

                  {/* Terms acceptance checkbox */}
                  <div className="rounded-xl border border-brand-200/60 bg-brand-50/40 p-3">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-text-secondary select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (e.target.checked) setClaimError('');
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500 cursor-pointer"
                      />
                      <span className="leading-snug">
                        I have read and agree to the <strong>Offer Terms & Conditions</strong>, minimum spend criteria, and redemption limits.
                      </span>
                    </label>
                  </div>

                  {claimError && (
                    <div className="rounded-xl bg-red-50 p-2.5 text-xs text-red-600 font-semibold border border-red-200 flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{claimError}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={handleCloseClaim}
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleInitiateRedeem}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-all shadow-sm cursor-pointer"
                    >
                      <Lock size={14} />
                      <span>Authorize & Claim</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ────────────────── 3. PIN VERIFICATION MODAL ────────────────── */}
      <PinVerificationModal
        isOpen={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        amount={selectedOffer?.termsDetails?.voucherFee > 0 ? selectedOffer.termsDetails.voucherFee : undefined}
        recipient={`${selectedOffer?.brand || 'Partner'} Exclusive Privilege`}
        title="Authorize Offer Claim"
      />

      <footer className="mt-12 border-t border-white/60 bg-white/70 backdrop-blur-md px-4 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} UNIQUE Bank · Demo Frontend — Not a real banking service.
      </footer>
    </div>
  );
}
