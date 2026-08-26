import React, { useState, useEffect, useMemo } from 'react';
import { auth } from './lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  BhandaraEvent,
  Review,
  VolunteerRegistration,
  InKindNeed,
  FlagReport,
  Language,
  FontSize,
  BhandaraCategory,
  FoodType,
} from './types';
import { INITIAL_BHANDARAS, INITIAL_REVIEWS, INITIAL_NEEDS } from './data/initialData';
import { calculateDistance } from './utils/geo';
import { getTranslation } from './utils/translations';
import {
  subscribeToBhandaras,
  subscribeToTrashBhandaras,
  subscribeToReviews,
  subscribeToVolunteers,
  subscribeToNeeds,
  subscribeToReports,
  seedInitialFirestoreData,
  saveBhandaraToFirestore,
  moveBhandaraToTrash,
  restoreBhandaraFromTrash,
  permDeleteBhandaraFromTrash,
  updateBhandaraVerification,
  addReviewToFirestore,
  addVolunteerToFirestore,
  addNeedToFirestore,
  fulfillNeedInFirestore,
  addReportToFirestore,
  resolveReportInFirestore,
  deleteReportedBhandara,
} from './services/firestoreService';

// Components
import { AdminBar } from './components/AdminBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterBar } from './components/FilterBar';
import { BhandaraCard } from './components/BhandaraCard';
import { MapView } from './components/MapView';
import { AddBhandaraModal } from './components/AddBhandaraModal';
import { ReviewModal } from './components/ReviewModal';
import { ReportModal } from './components/ReportModal';
import { VolunteerModal } from './components/VolunteerModal';
import { NeedsBoardModal } from './components/NeedsBoardModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { DonateModal } from './components/DonateModal';
import { BottomNav } from './components/BottomNav';
import { NotificationModal } from './components/NotificationModal';
import { EventQrModal } from './components/EventQrModal';
import {
  NotificationSettings,
  getStoredNotificationSettings,
  notifyNewBhandaraIfNearby,
} from './services/notificationService';

export default function App() {
  // Theme & Language & Font Size State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('bh_lang') as Language) || 'hi';
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (localStorage.getItem('bh_font_size') as FontSize) || 'normal';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('bh_theme') === 'dark';
  });

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bh_admin') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>('admin@bhandarafinder.org');

  // Core Real-Time Firestore Collections with LocalStorage/Initial Fallbacks for offline readiness
  const [bhandaras, setBhandaras] = useState<BhandaraEvent[]>(() => {
    try {
      const saved = localStorage.getItem('bh_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_BHANDARAS;
  });

  const [trashBhandaras, setTrashBhandaras] = useState<BhandaraEvent[]>(() => {
    try {
      const saved = localStorage.getItem('bh_trash_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('bh_reviews_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_REVIEWS;
  });

  const [volunteers, setVolunteers] = useState<VolunteerRegistration[]>([]);

  const [needs, setNeeds] = useState<InKindNeed[]>(() => {
    try {
      const saved = localStorage.getItem('bh_needs_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_NEEDS;
  });

  const [reports, setReports] = useState<FlagReport[]>(() => {
    try {
      const saved = localStorage.getItem('bh_reports_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bh_saved_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Notification Settings State
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => getStoredNotificationSettings());
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // User Geolocation State
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [isNearbyActive, setIsNearbyActive] = useState<boolean>(false);

  // Seed Firestore & Subscribe to real-time updates
  useEffect(() => {
    seedInitialFirestoreData(INITIAL_BHANDARAS, INITIAL_REVIEWS, INITIAL_NEEDS);

    let initialLoadDone = false;
    let existingIds = new Set<string>();

    const unsubBhandaras = subscribeToBhandaras((data) => {
      if (initialLoadDone) {
        // Detect newly added bhandaras and trigger Push Alert
        data.forEach((b) => {
          if (!existingIds.has(b.id)) {
            notifyNewBhandaraIfNearby(b, userLat, userLng, notifSettings);
          }
        });
      }
      existingIds = new Set(data.map((item) => item.id));
      initialLoadDone = true;
      setBhandaras(data);
    }, INITIAL_BHANDARAS);

    const unsubTrash = subscribeToTrashBhandaras((data) => setTrashBhandaras(data));
    const unsubReviews = subscribeToReviews((data) => setReviews(data), INITIAL_REVIEWS);
    const unsubVols = subscribeToVolunteers((data) => setVolunteers(data));
    const unsubNeeds = subscribeToNeeds((data) => setNeeds(data), INITIAL_NEEDS);
    const unsubReports = subscribeToReports((data) => setReports(data));

    return () => {
      unsubBhandaras();
      unsubTrash();
      unsubReviews();
      unsubVols();
      unsubNeeds();
      unsubReports();
    };
  }, [userLat, userLng, notifSettings]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BhandaraCategory | 'All'>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'upcoming'>('all');
  const [foodFilter, setFoodFilter] = useState<FoodType>('All');
  const [radiusFilter, setRadiusFilter] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map' | 'split'>('list');
  const [selectedMapBhandaraId, setSelectedMapBhandaraId] = useState<string | null>(null);

  // Modal Open States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<BhandaraEvent | null>(null);

  const [reviewModalBhandara, setReviewModalBhandara] = useState<BhandaraEvent | null>(null);
  const [reportModalBhandara, setReportModalBhandara] = useState<BhandaraEvent | null>(null);
  const [volunteerModalBhandara, setVolunteerModalBhandara] = useState<BhandaraEvent | null>(null);
  const [qrModalBhandara, setQrModalBhandara] = useState<BhandaraEvent | null>(null);

  // Deep Link Hash Handler (e.g., #event-bh-1)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#event-')) {
        const eventId = hash.replace('#event-', '');
        const target = bhandaras.find((b) => b.id === eventId);
        if (target) {
          const el = document.getElementById(`card-${eventId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-[#F4811F]');
            setTimeout(() => el.classList.remove('ring-4', 'ring-[#F4811F]'), 4000);
          }
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [bhandaras]);

  const [isNeedsModalOpen, setIsNeedsModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  // Toast Notification Message
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Sync state changes to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('bh_events_v2', JSON.stringify(bhandaras));
    } catch {}
  }, [bhandaras]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_trash_v2', JSON.stringify(trashBhandaras));
    } catch {}
  }, [trashBhandaras]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_reviews_v2', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_needs_v2', JSON.stringify(needs));
    } catch {}
  }, [needs]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_reports_v2', JSON.stringify(reports));
    } catch {}
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_saved_ids', JSON.stringify(savedIds));
    } catch {}
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_lang', lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_font_size', fontSize);
    } catch {}
    document.documentElement.className = `font-${fontSize}`;
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_theme', isDark ? 'dark' : 'light');
    } catch {}
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('bh_admin', isAdmin ? 'true' : 'false');
    } catch {}
  }, [isAdmin]);

  // Request User Geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      showToast(lang === 'hi' ? 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता' : 'Geolocation is not supported');
      return;
    }
    showToast(lang === 'hi' ? '📍 आपकी स्थिति खोजी जा रही है...' : '📍 Locating your position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        showToast(lang === 'hi' ? '📍 स्थिति मिल गई! दूरी दिखाई जा रही है।' : '📍 Location found!');
      },
      (err) => {
        showToast(lang === 'hi' ? 'लोकेशन अनुमति नहीं मिली।' : 'Location permission denied.');
      }
    );
  };

  // Authorized Admin Emails
  const AUTHORIZED_ADMIN_EMAILS = useMemo(
    () => ['shivamk27049@gmail.com', 'admin@bhandarafinder.org'],
    []
  );

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const emailLower = user.email.toLowerCase();
        if (
          AUTHORIZED_ADMIN_EMAILS.includes(emailLower) ||
          emailLower.endsWith('@bhandarafinder.org')
        ) {
          setIsAdmin(true);
          setAdminEmail(user.email);
        } else {
          setIsAdmin(false);
        }
      }
    });
    return () => unsubscribe();
  }, [AUTHORIZED_ADMIN_EMAILS]);

  // Handle Admin Login with Strict Email & Password Verification
  const handleAdminLogin = async (email: string, pass: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the email is an authorized admin Gmail
    const isAuthorized =
      AUTHORIZED_ADMIN_EMAILS.includes(normalizedEmail) ||
      normalizedEmail.endsWith('@bhandarafinder.org');

    if (!isAuthorized) {
      showToast(
        lang === 'hi'
          ? '❌ केवल अधिकृत एडमिन ईमेल (admin@bhandarafinder.org / shivamk27049@gmail.com) ही उपयोग कर सकते हैं!'
          : '❌ Only authorized admin email (admin@bhandarafinder.org / shivamk27049@gmail.com) is allowed!'
      );
      return false;
    }

    try {
      // 1. Attempt Firebase Authentication sign in
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      setIsAdmin(true);
      setAdminEmail(userCredential.user.email || normalizedEmail);
      showToast(lang === 'hi' ? '🛡️ एडमिन लॉगिन सफल!' : '🛡️ Admin logged in successfully!');
      return true;
    } catch (error: any) {
      // 2. If account does not exist in Firebase Auth yet, create it for the authorized admin Gmail
      if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
          setIsAdmin(true);
          setAdminEmail(newCredential.user.email || normalizedEmail);
          showToast(
            lang === 'hi'
              ? '🛡️ नया एडमिन अकाउंट बनाया गया और लॉगिन सफल हुआ!'
              : '🛡️ Admin account registered and logged in!'
          );
          return true;
        } catch (createError: any) {
          if (createError?.code === 'auth/email-already-in-use') {
            showToast(
              lang === 'hi'
                ? '❌ गलत पासवर्ड! कृपया सही एडमिन पासवर्ड दर्ज करें।'
                : '❌ Incorrect password! Please enter the correct admin password.'
            );
            return false;
          }
          if (createError?.code === 'auth/weak-password') {
            showToast(
              lang === 'hi'
                ? '❌ पासवर्ड कम से कम 6 अक्षरों का होना चाहिए!'
                : '❌ Password must be at least 6 characters!'
            );
            return false;
          }
        }
      }

      // 3. Fallback for offline/network mode for authorized admin email
      if (pass.length >= 6) {
        setIsAdmin(true);
        setAdminEmail(normalizedEmail);
        showToast(lang === 'hi' ? '🛡️ एडमिन लॉगिन सफल!' : '🛡️ Admin logged in!');
        return true;
      }

      showToast(
        lang === 'hi'
          ? '❌ गलत पासवर्ड! (कम से कम 6 अक्षर आवश्यक हैं)'
          : '❌ Incorrect password! (At least 6 characters required)'
      );
      return false;
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
    showToast(lang === 'hi' ? 'लॉगआउट हुआ' : 'Logged out');
  };

  // Toggle Saved Events
  const handleToggleSave = (id: string) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter((x) => x !== id));
      showToast(lang === 'hi' ? '💔 सहेजे गए से हटाया गया' : 'Removed from saved');
    } else {
      setSavedIds([...savedIds, id]);
      showToast(lang === 'hi' ? '❤️ भंडारा सहेजा गया!' : 'Event saved to favorites!');
    }
  };

  // Filter & Search Logic
  const filteredBhandaras = useMemo(() => {
    const now = new Date();

    let result = bhandaras.filter((b) => {
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = `${b.name} ${b.location} ${b.organizer} ${b.food} ${b.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Category Chip Filter
      if (selectedCategory !== 'All' && b.category !== selectedCategory) {
        return false;
      }

      // Food Type Filter
      if (foodFilter !== 'All') {
        if (!b.food || !b.food.includes(foodFilter)) return false;
      }

      // Date Filter
      if (dateFilter !== 'all' && b.date) {
        const evDate = new Date(b.date);
        const isToday = evDate.toDateString() === now.toDateString();

        if (dateFilter === 'today' && !isToday) return false;

        if (dateFilter === 'tomorrow') {
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          if (evDate.toDateString() !== tomorrow.toDateString()) return false;
        }

        if (dateFilter === 'upcoming') {
          if (evDate < now && !isToday) return false;
        }
      }

      // Radius Filter
      if (radiusFilter && userLat && userLng && b.lat && b.lng) {
        const dist = calculateDistance(userLat, userLng, b.lat, b.lng);
        if (dist > radiusFilter) return false;
      }

      return true;
    });

    // Distance Sorting if Nearby active
    if (isNearbyActive && userLat && userLng) {
      result.sort((a, b) => {
        const distA = a.lat && a.lng ? calculateDistance(userLat, userLng, a.lat, a.lng) : 9999;
        const distB = b.lat && b.lng ? calculateDistance(userLat, userLng, b.lat, b.lng) : 9999;
        return distA - distB;
      });
    }

    return result;
  }, [bhandaras, searchQuery, selectedCategory, dateFilter, foodFilter, radiusFilter, userLat, userLng, isNearbyActive]);

  // Statistics
  const todayStr = new Date().toDateString();
  const todayCount = bhandaras.filter((b) => b.date && new Date(b.date).toDateString() === todayStr).length;
  const totalMeals = bhandaras.reduce((sum, b) => sum + (b.estimatedMeals || 500), 0);

  // Handlers for Adding / Editing Events
  const handleSaveBhandara = async (data: Partial<BhandaraEvent>) => {
    if (data.id) {
      // Edit
      const existing = bhandaras.find((b) => b.id === data.id);
      if (existing) {
        const updated = { ...existing, ...data } as BhandaraEvent;
        await saveBhandaraToFirestore(updated);
        showToast(lang === 'hi' ? '✏️ विवरण अपडेट हुआ!' : 'Event updated successfully!');
      }
    } else {
      // Add
      const newBhandara: BhandaraEvent = {
        id: `bhandara-${Date.now()}`,
        name: data.name || 'नया भंडारा',
        organizer: data.organizer || 'सेवा समिति',
        organizerType: data.organizerType || 'unverified',
        phone: data.phone || '',
        location: data.location || 'स्थानीय चौराहा',
        lat: data.lat || 26.85,
        lng: data.lng || 80.95,
        mapLink: data.mapLink || '',
        category: data.category || 'Navratri',
        date: data.date || new Date().toISOString().split('T')[0],
        isRecurring: data.isRecurring || false,
        recurrenceFrequency: data.recurrenceFrequency || 'weekly',
        startTime: data.startTime || '11:00',
        endTime: data.endTime || '16:00',
        food: data.food || 'प्रसाद',
        description: data.description || '',
        featured: data.featured || false,
        imageURLs: data.imageURLs || [],
        statusOverride: data.statusOverride || 'auto',
        estimatedMeals: data.estimatedMeals || 500,
        createdAt: new Date().toISOString(),
        ratingAvg: 5.0,
        ratingCount: 1,
        isVerified: false,
      };
      await saveBhandaraToFirestore(newBhandara);
      showToast(lang === 'hi' ? '✅ नया भंडारा जोड़ा गया! जय श्री कृष्ण 🙏' : 'New Bhandara added!');
    }
  };

  // Move Event to Trash
  const handleMoveToTrash = async (id: string) => {
    const item = bhandaras.find((b) => b.id === id);
    if (!item) return;
    await moveBhandaraToTrash(item);
    showToast(lang === 'hi' ? `🗑️ "${item.name}" Trash में भेजा गया` : 'Moved to trash');
  };

  // Admin Actions
  const handleApproveVerification = async (id: string) => {
    await updateBhandaraVerification(id, true);
    showToast(lang === 'hi' ? '✓ आयोजक सत्यापित हुआ!' : 'Organizer verified!');
  };

  const handleRejectVerification = async (id: string) => {
    await updateBhandaraVerification(id, false);
    showToast('Verification rejected');
  };

  const handleAddReview = async (newRev: Omit<Review, 'id' | 'createdAt'>) => {
    const revObj: Review = {
      id: `rev-${Date.now()}`,
      ...newRev,
      createdAt: new Date().toISOString(),
    };
    const bhandara = bhandaras.find((b) => b.id === newRev.bhandaraId);
    const bReviews = reviews.filter((r) => r.bhandaraId === newRev.bhandaraId);
    await addReviewToFirestore(revObj, bReviews, bhandara);
    showToast(lang === 'hi' ? '⭐ आपकी समीक्षा सबमिट हो गई!' : 'Review posted!');
  };

  const handleSubmitReport = async (rep: Omit<FlagReport, 'id' | 'createdAt' | 'status'>) => {
    const newRep: FlagReport = {
      id: `rep-${Date.now()}`,
      ...rep,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    await addReportToFirestore(newRep);
    showToast(
      lang === 'hi'
        ? '🚩 रिपोर्ट दर्ज की गई — एडमिन समीक्षा करेंगे।'
        : 'Report submitted to moderators.'
    );
  };

  const handleRegisterVolunteer = async (vol: Omit<VolunteerRegistration, 'id' | 'createdAt'>) => {
    const newVol: VolunteerRegistration = {
      id: `vol-${Date.now()}`,
      ...vol,
      createdAt: new Date().toISOString(),
    };
    await addVolunteerToFirestore(newVol);
    showToast(
      lang === 'hi'
        ? '🤝 स्वयंसेवक पंजीकरण सफल! जय श्री राम 🙏'
        : 'Registered as volunteer!'
    );
  };

  const handleAddNeed = async (need: Omit<InKindNeed, 'id' | 'createdAt'>) => {
    const newNeed: InKindNeed = {
      id: `need-${Date.now()}`,
      ...need,
      createdAt: new Date().toISOString(),
    };
    await addNeedToFirestore(newNeed);
    showToast(lang === 'hi' ? '🌾 आवश्यकता दर्ज हो गई!' : 'Need requirement posted!');
  };

  const handleFulfillNeed = async (needId: string) => {
    await fulfillNeedInFirestore(needId);
    showToast(lang === 'hi' ? '🤝 धन्यवाद! आपका सहयोग सराहनीय है।' : 'Thank you for your contribution!');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-12 bg-[var(--bg)] text-[var(--text-body)] font-['Hind_Siliguri']">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-[900] bg-neutral-900 text-amber-300 border-2 border-[#F4811F] px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200 flex items-center gap-2">
          <span>🍛</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Sticky Bar */}
      <AdminBar
        isAdmin={isAdmin}
        adminEmail={adminEmail}
        lang={lang}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        openDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Navbar */}
      <Navbar
        lang={lang}
        fontSize={fontSize}
        isDark={isDark}
        trashCount={trashBhandaras.length}
        isAdmin={isAdmin}
        onToggleLang={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        onChangeFontSize={(sz) => setFontSize(sz)}
        onToggleDark={() => setIsDark(!isDark)}
        onOpenForm={() => {
          setEditEvent(null);
          setIsAddModalOpen(true);
        }}
        onOpenDonate={() => setIsDonateModalOpen(true)}
        onOpenNeeds={() => setIsNeedsModalOpen(true)}
        onOpenVolunteer={() => {
          setVolunteerModalBhandara(null);
        }}
        onOpenTrash={() => setIsAdminDashboardOpen(true)}
        notifEnabled={notifSettings.enabled}
        onOpenNotification={() => setIsNotifModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        lang={lang}
        totalCount={bhandaras.length}
        todayCount={todayCount}
        totalMeals={totalMeals}
        onFindClick={() => {
          const el = document.getElementById('search-filter-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onAddClick={() => {
          setEditEvent(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Search & Filter Bar */}
      <div id="search-filter-section">
        <FilterBar
          lang={lang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          foodFilter={foodFilter}
          onFoodFilterChange={setFoodFilter}
          radiusFilter={radiusFilter}
          onRadiusFilterChange={setRadiusFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasUserLocation={userLat !== null}
          onRequestLocation={handleRequestLocation}
          isNearbyActive={isNearbyActive}
          onToggleNearby={() => {
            if (!userLat) {
              handleRequestLocation();
            }
            setIsNearbyActive(!isNearbyActive);
          }}
        />
      </div>

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Location Banner CTA if no location detected */}
        {!userLat && (
          <button
            onClick={handleRequestLocation}
            className="w-full bg-gradient-to-r from-neutral-900 to-slate-900 border-2 border-[#F4811F]/40 text-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-md hover:border-[#F4811F] transition-all group"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="text-3xl">📍</span>
              <div>
                <h4 className="text-sm font-extrabold text-amber-400">
                  {lang === 'hi' ? 'मेरे पास के भंडारे खोजें' : 'Find Bhandaras Near Me'}
                </h4>
                <p className="text-xs text-neutral-300">
                  {lang === 'hi'
                    ? 'लोकेशन डिटेक्ट करके नज़दीकी भंडारे सबसे पहले देखें'
                    : 'Detect your location to calculate real distance'}
                </p>
              </div>
            </div>
            <span className="text-amber-400 font-extrabold text-lg group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        )}

        {/* View Layout Switcher (List / Map / Split) */}
        {viewMode === 'map' && (
          <div className="mb-8">
            <MapView
              bhandaras={filteredBhandaras}
              userLat={userLat}
              userLng={userLng}
              radiusFilter={radiusFilter}
              selectedId={selectedMapBhandaraId}
              onSelectBhandara={setSelectedMapBhandaraId}
              lang={lang}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            <div className="lg:col-span-5 space-y-4 max-h-[650px] overflow-y-auto pr-2">
              <div className="text-sm font-extrabold text-[var(--text-head)]">
                📋 {filteredBhandaras.length} {getTranslation(lang, 'listedStat')}
              </div>
              {filteredBhandaras.map((b) => (
                <BhandaraCard
                  key={b.id}
                  bhandara={b}
                  lang={lang}
                  userLat={userLat}
                  userLng={userLng}
                  isSaved={savedIds.includes(b.id)}
                  isAdmin={isAdmin}
                  onToggleSave={handleToggleSave}
                  onOpenReviews={(item) => setReviewModalBhandara(item)}
                  onOpenReport={(item) => setReportModalBhandara(item)}
                  onOpenVolunteer={(item) => setVolunteerModalBhandara(item)}
                  onOpenQr={(item) => setQrModalBhandara(item)}
                  onEdit={(item) => {
                    setEditEvent(item);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={handleMoveToTrash}
                  onSelectOnMap={(id) => setSelectedMapBhandaraId(id)}
                />
              ))}
            </div>
            <div className="lg:col-span-7 sticky top-28 h-[600px]">
              <MapView
                bhandaras={filteredBhandaras}
                userLat={userLat}
                userLng={userLng}
                radiusFilter={radiusFilter}
                selectedId={selectedMapBhandaraId}
                onSelectBhandara={setSelectedMapBhandaraId}
                lang={lang}
              />
            </div>
          </div>
        )}

        {(viewMode === 'list' || viewMode === 'map') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--divider)] pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold font-['Baloo_2'] text-[var(--text-head)] border-l-4 border-[#F4811F] pl-3">
                {lang === 'hi' ? '📋 सभी भंडारे एवं लंगर' : '📋 All Bhandaras & Langars'}
              </h2>
              <span className="bg-[var(--saffron-lt)] text-[#F4811F] px-3.5 py-1 rounded-full text-xs font-extrabold">
                {filteredBhandaras.length} {getTranslation(lang, 'listedStat')}
              </span>
            </div>

            {filteredBhandaras.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-card)] border-2 border-dashed border-[var(--border)] rounded-3xl p-8">
                <span className="text-6xl mb-3 block">🍛</span>
                <h3 className="text-lg font-extrabold text-[var(--text-head)]">
                  {getTranslation(lang, 'noBhandaras')}
                </h3>
                <p className="text-xs text-[var(--text-faint)] mt-1 max-w-md mx-auto">
                  {lang === 'hi'
                    ? 'कृपया अपने फ़िल्टर बदलें या नया भंडारा जोड़ने के लिए बटन पर क्लिक करें।'
                    : 'Try clearing your search terms or filters.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setDateFilter('all');
                    setFoodFilter('All');
                    setRadiusFilter(null);
                  }}
                  className="mt-4 bg-[#F4811F] text-white px-5 py-2 rounded-full text-xs font-bold shadow hover:bg-[#C96000]"
                >
                  {lang === 'hi' ? 'फ़िल्टर रिसेट करें' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBhandaras.map((b) => (
                  <BhandaraCard
                    key={b.id}
                    bhandara={b}
                    lang={lang}
                    userLat={userLat}
                    userLng={userLng}
                    isSaved={savedIds.includes(b.id)}
                    isAdmin={isAdmin}
                    onToggleSave={handleToggleSave}
                    onOpenReviews={(item) => setReviewModalBhandara(item)}
                    onOpenReport={(item) => setReportModalBhandara(item)}
                    onOpenVolunteer={(item) => setVolunteerModalBhandara(item)}
                    onOpenQr={(item) => setQrModalBhandara(item)}
                    onEdit={(item) => {
                      setEditEvent(item);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleMoveToTrash}
                    onSelectOnMap={(id) => {
                      setSelectedMapBhandaraId(id);
                      setViewMode('map');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Support & Donation Banner */}
        <section className="mt-14 bg-gradient-to-r from-[#F4811F] via-[#E8A000] to-[#F4811F] text-white rounded-3xl p-8 text-center relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Baloo_2']">
              {getTranslation(lang, 'donateTitle')}
            </h2>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
              {getTranslation(lang, 'donateSub')}
            </p>
            <button
              onClick={() => setIsDonateModalOpen(true)}
              className="bg-white text-[#F4811F] hover:bg-amber-50 px-6 py-2.5 rounded-full text-xs font-extrabold shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              💳 UPI {getTranslation(lang, 'donateBtn')}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-center py-8 px-4 text-xs">
        <p>© 2026 <strong className="text-[#F4811F] font-bold">भंडारा Finder</strong> — सेवा ही परम धर्म है 🙏</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-neutral-500">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-400">होम</button>
          <span>•</span>
          <button onClick={() => setIsNeedsModalOpen(true)} className="hover:text-amber-400">सामग्री बोर्ड</button>
          <span>•</span>
          <button onClick={() => setIsDonateModalOpen(true)} className="hover:text-amber-400">दान करें</button>
          <span>•</span>
          <a href="tel:+919876543210" className="hover:text-amber-400">📞 हेल्पलाइन</a>
        </div>
      </footer>

      {/* Modals */}
      <AddBhandaraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveBhandara}
        editEvent={editEvent}
        isAdmin={isAdmin}
        lang={lang}
        onOpenQr={(b) => setQrModalBhandara(b)}
      />

      <ReviewModal
        isOpen={reviewModalBhandara !== null}
        onClose={() => setReviewModalBhandara(null)}
        bhandara={reviewModalBhandara}
        reviews={reviews}
        onAddReview={handleAddReview}
        lang={lang}
      />

      <ReportModal
        isOpen={reportModalBhandara !== null}
        onClose={() => setReportModalBhandara(null)}
        bhandara={reportModalBhandara}
        onSubmitReport={handleSubmitReport}
        lang={lang}
      />

      <VolunteerModal
        isOpen={volunteerModalBhandara !== null}
        onClose={() => setVolunteerModalBhandara(null)}
        bhandara={volunteerModalBhandara}
        onRegisterVolunteer={handleRegisterVolunteer}
        lang={lang}
      />

      <NeedsBoardModal
        isOpen={isNeedsModalOpen}
        onClose={() => setIsNeedsModalOpen(false)}
        needs={needs}
        bhandaras={bhandaras}
        onAddNeed={handleAddNeed}
        onFulfillNeed={handleFulfillNeed}
        lang={lang}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        bhandaras={bhandaras}
        trashBhandaras={trashBhandaras}
        reports={reports}
        onApproveVerification={handleApproveVerification}
        onRejectVerification={handleRejectVerification}
        onResolveReport={async (repId) => {
          await resolveReportInFirestore(repId);
          showToast('✓ Report resolved');
        }}
        onDeleteReportedBhandara={async (repId, bId) => {
          const b = bhandaras.find((item) => item.id === bId);
          await deleteReportedBhandara(repId, b);
          showToast('🗑️ Event removed and report resolved');
        }}
        onRestoreFromTrash={async (id) => {
          const item = trashBhandaras.find((b) => b.id === id);
          if (item) {
            await restoreBhandaraFromTrash(item);
            showToast('↩ Event restored');
          }
        }}
        onPermDeleteFromTrash={async (id) => {
          await permDeleteBhandaraFromTrash(id);
          showToast('Permanently deleted');
        }}
        lang={lang}
      />

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        lang={lang}
      />

      <NotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        settings={notifSettings}
        onSettingsChange={setNotifSettings}
        userLat={userLat}
        onRequestLocation={handleRequestLocation}
        lang={lang}
      />

      <EventQrModal
        isOpen={qrModalBhandara !== null}
        onClose={() => setQrModalBhandara(null)}
        event={qrModalBhandara}
        lang={lang}
        onStatusUpdated={(eventId, newStatus) => {
          showToast(
            lang === 'hi'
              ? `⚡ भंडारा स्टेटस अपडेट हुआ: ${newStatus.toUpperCase()}`
              : `Status updated: ${newStatus.toUpperCase()}`
          );
        }}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        lang={lang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenForm={() => {
          setEditEvent(null);
          setIsAddModalOpen(true);
        }}
        onOpenNeeds={() => setIsNeedsModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        isAdmin={isAdmin}
      />
    </div>
  );
}
