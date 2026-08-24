import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* -------------------------------------------------------------
 * CholoGhuri i18n — English ↔ বাংলা
 * Usage:  const { t, lang, toggleLang } = useI18n();  t('nav.home')
 * ----------------------------------------------------------- */

export type Lang = 'en' | 'bn';

const dictionary = {
  // Navigation
  'nav.home': ['Home', 'হোম'],
  'nav.explore': ['Explore', 'ঘুরে দেখুন'],
  'nav.blogs': ['Blog', 'ব্লগ'],
  'nav.hotels': ['Hotels', 'হোটেল'],
  'nav.planner': ['AI Planner', 'এআই প্ল্যানার'],
  'nav.myTrips': ['My Trips', 'আমার ভ্রমণ'],
  'nav.community': ['Community', 'কমিউনিটি'],
  'nav.dashboard': ['Dashboard', 'ড্যাশবোর্ড'],
  'nav.search': ['Search Chattogram...', 'চট্টগ্রাম খুঁজুন...'],
  'nav.searchLong': ['Search Chattogram destinations...', 'চট্টগ্রামের গন্তব্য খুঁজুন...'],
  'nav.tagline': ['From Dreams to Destinations.', 'স্বপ্ন থেকে গন্তব্যে।'],
  'nav.banner': ['Exclusive Focus on', 'বিশেষ ফোকাস'],
  'nav.bannerDivision': ['Chattogram Division', 'চট্টগ্রাম বিভাগ'],
  'nav.currency': ['Toggle BDT / USD currency', 'মুদ্রা পরিবর্তন করুন'],
  'nav.theme.dark': ['Switch to dark mode', 'ডার্ক মোড চালু করুন'],
  'nav.theme.light': ['Switch to light mode', 'লাইট মোড চালু করুন'],
  'nav.language': ['Switch language', 'ভাষা পরিবর্তন'],
  'nav.menu': ['Menu', 'মেনু'],

  // Auth
  'auth.login': ['Login / Sign Up', 'লগইন / সাইন আপ'],
  'auth.signIn': ['Sign In', 'সাইন ইন'],
  'auth.createAccount': ['Create Account', 'অ্যাকাউন্ট তৈরি করুন'],
  'auth.signOut': ['Sign Out', 'সাইন আউট'],
  'auth.welcomeBack': ['Welcome Back to CholoGhuri', 'চলোঘুরিতে স্বাগতম'],
  'auth.createTitle': ['Create CholoGhuri Account', 'চলোঘুরি অ্যাকাউন্ট তৈরি করুন'],
  'auth.subtitle': ['Chattogram Division Travel Ecosystem & Community', 'চট্টগ্রাম বিভাগের ভ্রমণ ইকোসিস্টেম ও কমিউনিটি'],
  'auth.fullName': ['Full Name', 'পুরো নাম'],
  'auth.email': ['Email Address', 'ইমেইল ঠিকানা'],
  'auth.password': ['Password', 'পাসওয়ার্ড'],
  'auth.passwordPlaceholder': ['Enter your password', 'আপনার পাসওয়ার্ড দিন'],
  'auth.persona': ['Select Traveler Persona / Role', 'ভ্রমণকারীর ধরন নির্বাচন করুন'],
  'auth.personaHint': ['Selecting your persona tailors recommendations across Chattogram Division.', 'আপনার ধরন অনুযায়ী চট্টগ্রাম বিভাগের সুপারিশ সাজানো হবে।'],
  'auth.pleaseWait': ['Please wait...', 'অনুগ্রহ করে অপেক্ষা করুন...'],
  'auth.signInBtn': ['Sign In to Account', 'অ্যাকাউন্টে সাইন ইন করুন'],
  'auth.registerBtn': ['Register & Join Ecosystem', 'নিবন্ধন করুন ও যুক্ত হোন'],
  'auth.secured': ['Secured with bcrypt password hashing & SSL encryption', 'bcrypt হ্যাশিং ও SSL এনক্রিপশনে সুরক্ষিত'],
  'auth.networkError': ['Unable to connect to the server. Please try again.', 'সার্ভারে সংযোগ করা যাচ্ছে না। আবার চেষ্টা করুন।'],
  'auth.requiredTitle': ['Login Required', 'লগইন প্রয়োজন'],
  'auth.requiredDesc': ['Please sign in or create a free account to access this page and manage your trips.', 'এই পেজটি দেখতে এবং আপনার ভ্রমণ পরিচালনা করতে সাইন ইন করুন বা বিনামূল্যে অ্যাকাউন্ট খুলুন।'],
  'auth.memberSince': ['Member', 'সদস্য'],
  'auth.viewProfile': ['View Dashboard', 'ড্যাশবোর্ড দেখুন'],

  // My Trips
  'trips.title': ['MY PLAN & PAST TOURS', 'আমার পরিকল্পনা ও পূর্বের ভ্রমণ'],
  'trips.subtitle': ['Manage your upcoming journeys, saved itineraries, and travel history', 'আপনার আসন্ন যাত্রা, সংরক্ষিত পরিকল্পনা ও ভ্রমণ ইতিহাস পরিচালনা করুন'],
  'trips.create': ['CREATE PLAN', 'পরিকল্পনা তৈরি'],
  'trips.summary': ['TOTAL SUMMARY', 'মোট সারসংক্ষেপ'],
  'trips.stats': ['Personal Travel Statistics', 'ব্যক্তিগত ভ্রমণ পরিসংখ্যান'],
  'trips.total': ['Total Trips Scheduled', 'মোট নির্ধারিত ভ্রমণ'],
  'trips.places': ['Places Visited inside Chattogram', 'চট্টগ্রামে ভ্রমণকৃত স্থান'],
  'trips.spent': ['Total Spent Budget', 'মোট ব্যয়'],
  'trips.tracker': ['TOTAL SPENT TRACKER', 'মোট ব্যয় ট্র্যাকার'],
  'trips.all': ['All', 'সব'],
  'trips.upcoming': ['Upcoming', 'আসন্ন'],
  'trips.completed': ['Completed', 'সম্পন্ন'],
  'trips.tours': ['Tours', 'ভ্রমণ'],
  'trips.dates': ['Travel Dates', 'ভ্রমণের তারিখ'],
  'trips.travelers': ['Travelers', 'ভ্রমণকারী'],
  'trips.persons': ['Persons', 'জন'],
  'trips.spots': ['Spots Covered:', 'স্থানসমূহ:'],
  'trips.budget': ['Total Budget', 'মোট বাজেট'],
  'trips.edit': ['Edit / Generate AI', 'সম্পাদনা / এআই'],
  'trips.none': ['No scheduled trips found', 'কোনো নির্ধারিত ভ্রমণ নেই'],
  'trips.noneHint': ['Click "CREATE PLAN" or use AI Trip Planner to build an itinerary.', '"পরিকল্পনা তৈরি" ক্লিক করুন বা এআই ট্রিপ প্ল্যানার ব্যবহার করুন।'],
  'trips.loading': ['Loading your trips...', 'আপনার ভ্রমণ লোড হচ্ছে...'],
  'trips.newPlan': ['Create New Travel Plan', 'নতুন ভ্রমণ পরিকল্পনা'],
  'trips.tripTitle': ['Trip Title', 'ভ্রমণের শিরোনাম'],
  'trips.destination': ['Destination', 'গন্তব্য'],
  'trips.days': ['Days', 'দিন'],
  'trips.budgetBdt': ['Budget (BDT)', 'বাজেট (টাকা)'],
  'trips.startDate': ['Start Date', 'শুরুর তারিখ'],
  'trips.save': ['Save New Plan', 'পরিকল্পনা সংরক্ষণ'],
  'trips.delete': ['Delete Trip', 'ভ্রমণ মুছুন'],
  'trips.viewMap': ['View Map', 'মানচিত্র'],
  'trips.loginPrompt': ['Sign in to view and manage your trips', 'আপনার ভ্রমণ দেখতে ও পরিচালনা করতে সাইন ইন করুন'],
  'trips.loginPromptDesc': ['Your trips are private and linked to your account. Log in to see your saved itineraries or create a new plan.', 'আপনার ভ্রমণ ব্যক্তিগত এবং আপনার অ্যাকাউন্টের সাথে যুক্ত। সংরক্ষিত পরিকল্পনা দেখতে লগইন করুন।'],

  // Dashboard
  'dash.title': ['TRIP MANAGEMENT & PROFILE DASHBOARD', 'ভ্রমণ ব্যবস্থাপনা ও প্রোফাইল ড্যাশবোর্ড'],
  'dash.subtitle': ['Manage personal details, tour calendar, photo gallery & system architecture', 'ব্যক্তিগত তথ্য, ভ্রমণ ক্যালেন্ডার, গ্যালারি ও সিস্টেম আর্কিটেকচার'],
  'dash.profileTab': ['PERSONAL DETAILS & TOUR CALENDAR', 'ব্যক্তিগত তথ্য ও ভ্রমণ ক্যালেন্ডার'],
  'dash.galleryTab': ['TOUR GALLERY & PICTURES VISITED', 'ভ্রমণ গ্যালারি ও ছবি'],
  'dash.archTab': ['ADMIN ARCHITECTURE HUB & API TESTER', 'আর্কিটেকচার হাব ও API টেস্টার'],
  'dash.personal': ['Personal Details', 'ব্যক্তিগত তথ্য'],
  'dash.edit': ['Edit', 'সম্পাদনা'],
  'dash.cancel': ['Cancel', 'বাতিল'],
  'dash.phone': ['Phone Number', 'ফোন নম্বর'],
  'dash.email': ['Email Address', 'ইমেইল ঠিকানা'],
  'dash.dob': ['Date of Birth', 'জন্ম তারিখ'],
  'dash.saveChanges': ['Save Changes', 'সংরক্ষণ করুন'],
  'dash.calendar': ['TOUR CALENDAR & UPCOMING SCHEDULES', 'ভ্রমণ ক্যালেন্ডার ও আসন্ন সূচি'],
  'dash.noTrips': ['No trips yet. Create one from My Trips or the AI Planner.', 'এখনো কোনো ভ্রমণ নেই। আমার ভ্রমণ বা এআই প্ল্যানার থেকে তৈরি করুন।'],
  'dash.notifications': ['Ecosystem Notifications', 'বিজ্ঞপ্তি'],
  'dash.signOut': ['Sign Out', 'সাইন আউট'],
  'dash.role': ['Role', 'ভূমিকা'],

  // Home
  'home.badge': ['AI-Powered Travel Ecosystem • Chattogram Division MVP', 'এআই-চালিত ভ্রমণ ইকোসিস্টেম • চট্টগ্রাম বিভাগ'],
  'home.heroTitle': ['From Dreams to', 'স্বপ্ন থেকে'],
  'home.heroAccent': ['Destinations.', 'গন্তব্যে।'],
  'home.heroDesc': ['Explore breathtaking hill ranges of Sajek & Bandarban, endless ocean waves along Marine Drive, pristine waterfalls of Mirsarai, and quiet lakes of Rangamati with intelligent AI planning.', 'সাজেক ও বান্দরবানের পাহাড়, মেরিন ড্রাইভের অবিরাম সমুদ্র, মিরসরাইয়ের ঝর্ণা এবং রাঙামাটির শান্ত হ্রদ — এআই পরিকল্পনার সাথে আবিষ্কার করুন।'],
  'home.searchPlaceholder': ['Where in Chattogram? (e.g. Sajek, Bandarban)', 'চট্টগ্রামে কোথায়? (যেমন সাজেক, বান্দরবান)'],
  'home.explore': ["Let's Explore", 'চলো ঘুরি'],
  'home.tailored': ['Tailored for:', 'আপনার জন্য:'],
  'home.popular': ['Popular Chattogram Destinations', 'চট্টগ্রামের জনপ্রিয় গন্তব্য'],
  'home.popularDesc': ['Must-visit hill tracts, beaches, and waterfalls', 'অবশ্য দর্শনীয় পাহাড়, সৈকত ও ঝর্ণা'],
  'home.viewAll': ['View All Destinations', 'সব গন্তব্য দেখুন'],
  'home.estBudget': ['Est. Budget:', 'আনুমানিক বাজেট:'],
  'home.showcase': ['Chattogram in 3D', 'ত্রিমাত্রিক চট্টগ্রাম'],
  'home.showcaseDesc': ['Drag, hover or swipe to orbit the most iconic attractions of Chattogram Division', 'চট্টগ্রাম বিভাগের আইকনিক আকর্ষণগুলো ঘুরিয়ে দেখতে টেনে বা হোভার করুন'],
  'home.showcaseHint': ['Drag to rotate • Click a card to explore', 'ঘোরাতে টানুন • বিস্তারিত দেখতে কার্ডে ক্লিক করুন'],
  'home.aiBadge': ['Smart Gemini 3.6 Itinerary Engine', 'স্মার্ট জেমিনি ৩.৬ ইটিনারারি ইঞ্জিন'],
  'home.aiTitle': ['Generate Custom Travel Plans in Seconds', 'সেকেন্ডেই কাস্টম ভ্রমণ পরিকল্পনা তৈরি করুন'],
  'home.aiDesc': ['Specify your days, budget, and travel persona (Solo, Couple, Family, Backpacker). Our AI instantly creates day-by-day morning/noon/evening schedules, transport routes, and expense estimates.', 'দিন, বাজেট ও ভ্রমণের ধরন দিন। আমাদের এআই সাথে সাথে দিনভিত্তিক সকাল/দুপুর/সন্ধ্যার সূচি, যাতায়াত ও খরচের হিসাব তৈরি করে।'],
  'home.launchAi': ['Launch AI Trip Planner', 'এআই ট্রিপ প্ল্যানার চালু করুন'],
  'home.estimator': ['Chattogram Division Trip Budget Estimator', 'চট্টগ্রাম ভ্রমণ বাজেট ক্যালকুলেটর'],
  'home.estimatorDesc': ['Interactive quick estimator for travel expenses', 'ভ্রমণ খরচের দ্রুত হিসাব'],
  'home.duration': ['Trip Duration:', 'ভ্রমণের সময়কাল:'],
  'home.daysLabel': ['Days', 'দিন'],
  'home.style': ['Travel Style:', 'ভ্রমণের ধরন:'],
  'home.backpacker': ['Backpacker', 'ব্যাকপ্যাকার'],
  'home.standard': ['Standard', 'স্ট্যান্ডার্ড'],
  'home.resort': ['Resort', 'রিসোর্ট'],
  'home.estTotal': ['Estimated Total Cost', 'আনুমানিক মোট খরচ'],
  'home.planDetails': ['Plan Details', 'বিস্তারিত পরিকল্পনা'],
  'home.hotels': ['Recommended Accommodations', 'প্রস্তাবিত আবাসন'],
  'home.hotelsDesc': ['Top rated resorts and wooden hill cottages', 'সেরা রিসোর্ট ও পাহাড়ি কাঠের কটেজ'],
  'home.browseHotels': ['Browse All Hotels', 'সব হোটেল দেখুন'],
  'home.night': ['/ night', '/ রাত'],
  'home.blogs': ['Community Travel Blogs & Stories', 'কমিউনিটি ভ্রমণ ব্লগ ও গল্প'],
  'home.blogsDesc': ['Real experiences shared by travelers', 'ভ্রমণকারীদের বাস্তব অভিজ্ঞতা'],
  'home.viewBlogs': ['View All Blogs', 'সব ব্লগ দেখুন'],

  // Planner
  'planner.save': ['Save to My Trips', 'আমার ভ্রমণে সংরক্ষণ'],
  'planner.saved': ['Saved to My Trips!', 'সংরক্ষিত হয়েছে!'],
  'planner.saving': ['Saving...', 'সংরক্ষণ হচ্ছে...'],
  'planner.loginToSave': ['Sign in to save this plan', 'সংরক্ষণ করতে সাইন ইন করুন'],

  // Footer
  'footer.about': ['CholoGhuri is an AI-powered travel assistant and ecosystem designed to become Bangladesh\'s largest travel platform.', 'চলোঘুরি একটি এআই-চালিত ভ্রমণ সহকারী ও ইকোসিস্টেম, যা বাংলাদেশের বৃহত্তম ভ্রমণ প্ল্যাটফর্ম হওয়ার লক্ষ্যে তৈরি।'],
  'footer.division': ['Chattogram Division', 'চট্টগ্রাম বিভাগ'],
  'footer.features': ['Platform Features', 'প্ল্যাটফর্ম ফিচার'],
  'footer.developer': ['Developer Architecture', 'ডেভেলপার আর্কিটেকচার'],
  'footer.hotline': ['Bangladesh Tourist Police Emergency Hotline', 'বাংলাদেশ ট্যুরিস্ট পুলিশ জরুরি হটলাইন'],
  'footer.call': ['Call Emergency 999', 'জরুরি কল ৯৯৯'],
  'footer.rights': ['© 2026 CholoGhuri Travel Ecosystem. All rights reserved.', '© ২০২৬ চলোঘুরি ভ্রমণ ইকোসিস্টেম। সর্বস্বত্ব সংরক্ষিত।'],
  'footer.builtFor': ['Built for', 'তৈরি'],
  'footer.with': ['with', 'সাথে'],
  'footer.in': ['in Bangladesh', 'বাংলাদেশে'],

  // Common
  'common.close': ['Close', 'বন্ধ'],
  'common.loading': ['Loading...', 'লোড হচ্ছে...'],
} as const;

export type TranslationKey = keyof typeof dictionary;

export const translate = (key: TranslationKey, lang: Lang): string => {
  const entry = dictionary[key];
  if (!entry) return key;
  return lang === 'bn' ? entry[1] : entry[0];
};

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
  t: (k) => translate(k, 'en'),
});

const STORAGE_KEY = 'chologhuri-lang';

const readStoredLang = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'bn' ? 'bn' : 'en';
  } catch {
    return 'en';
  }
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const toggleLang = useCallback(() => setLang(lang === 'en' ? 'bn' : 'en'), [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, toggleLang, t: (key) => translate(key, lang) }),
    [lang, setLang, toggleLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
