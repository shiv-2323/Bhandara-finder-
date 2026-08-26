import { BhandaraEvent, InKindNeed, Review } from '../types';

const getFutureDate = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BHANDARAS: BhandaraEvent[] = [
  {
    id: 'bhandara-1',
    name: 'श्री राम मंदिर विशाल भंडारा एवं प्रसाद वितरण',
    organizer: 'श्री राम सेवा समिति (पंजीकृत)',
    organizerType: 'temple',
    phone: '+91 9876543210',
    location: 'राम पथ मार्ग, हनुमान गढ़ी के पास, अयोध्या (उ.प्र.)',
    lat: 26.7922,
    lng: 82.1998,
    mapLink: 'https://www.google.com/maps?q=26.7922,82.1998',
    category: 'Navratri',
    date: new Date().toISOString().split('T')[0], // Today
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '11:30',
    endTime: '16:00',
    food: 'पूड़ी-सब्जी, हलवा, कढ़ी-चावल, बूंदी प्रसाद',
    description: 'प्रतिदिन विशाल भंडारा — सभी श्रद्धालुओं हेतु निःशुल्क भोजन व्यवस्था।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80'
    ],
    statusOverride: 'open',
    estimatedMeals: 3500,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.9,
    ratingCount: 38,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-2',
    name: 'गुरुद्वारा बंगला साहिब लंगर सेवा',
    organizer: 'दिल्ली सिख गुरुद्वारा प्रबंधक कमेटी',
    organizerType: 'verified_ngo',
    phone: '+91 9811223344',
    location: 'अशोक रोड, हनुमान रोड के पास, कनोट प्लेस, नई दिल्ली',
    lat: 28.6264,
    lng: 77.2091,
    mapLink: 'https://www.google.com/maps?q=28.6264,77.2091',
    category: 'Langar',
    date: new Date().toISOString().split('T')[0], // Today
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '06:00',
    endTime: '23:00',
    food: 'दाल प्रसादा, राजमा-चावल, खीर, गुरु का लंगर',
    description: '24x7 गुरु का अटूट लंगर। जाति-धर्म का कोई भेद नहीं, सबका स्वागत है।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80'
    ],
    statusOverride: 'open',
    estimatedMeals: 12000,
    createdAt: new Date().toISOString(),
    ratingAvg: 5.0,
    ratingCount: 82,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-3',
    name: 'श्री बांके बिहारी मंदिर महाप्रसाद',
    organizer: 'वृंदावन भक्त मंडल',
    organizerType: 'temple',
    phone: '+91 9412345678',
    location: 'बिहारीपुरा, श्री बांके बिहारी मंदिर के निकट, वृंदावन (मथुरा)',
    lat: 27.5815,
    lng: 77.7006,
    mapLink: 'https://www.google.com/maps?q=27.5815,77.7006',
    category: 'Prasad',
    date: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    startTime: '12:00',
    endTime: '15:30',
    food: 'मक्खन-मिश्री, कचौड़ी-सब्जी, मालपुआ, रबड़ी',
    description: 'ठाकुर जी का भोग प्रसाद वितरण। सभी वैष्णव जनों हेतु।',
    featured: false,
    imageURLs: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'
    ],
    statusOverride: 'auto',
    estimatedMeals: 2000,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.8,
    ratingCount: 29,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-4',
    name: 'काशी विश्वनाथ अन्नक्षेत्र एवं अन्नदान',
    organizer: 'श्री काशी विश्वनाथ मंदिर न्यास',
    organizerType: 'temple',
    phone: '+91 9554433221',
    location: 'चौक, गोदौलिया मार्ग, वाराणसी (उ.प्र.)',
    lat: 25.3109,
    lng: 83.0107,
    mapLink: 'https://www.google.com/maps?q=25.3109,83.0107',
    category: 'Shivratri',
    date: new Date().toISOString().split('T')[0],
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '11:00',
    endTime: '17:00',
    food: 'सात्विक थाली, खीर, सब्जी-पूड़ी, मट्ठा',
    description: 'बाबा विश्वनाथ के पावन परिसर में निःशुल्क सात्विक भोजन क्षेत्र।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80'
    ],
    statusOverride: 'open',
    estimatedMeals: 5000,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.9,
    ratingCount: 45,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-5',
    name: 'हनुमान जयंती महाभंडारा एवं सुंदरकांड',
    organizer: 'संकट मोचन युवा संघ',
    organizerType: 'verified_ind',
    phone: '+91 9711009988',
    location: 'सिविल लाइन्स, हनुमान मंदिर परिसर, कानपुर (उ.प्र.)',
    lat: 26.4499,
    lng: 80.3319,
    mapLink: 'https://www.google.com/maps?q=26.4499,80.3319',
    category: 'Hanuman Jayanti',
    date: getFutureDate(1), // Tomorrow
    isRecurring: false,
    startTime: '13:00',
    endTime: '18:00',
    food: 'बूंदी-मोतीचूर लड्डू, छोले-भटूरे, सूजी का हलवा',
    description: 'सुंदरकांड पाठ उपरांत विशाल प्रसादम वितरण।',
    featured: false,
    imageURLs: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 1800,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.7,
    ratingCount: 12,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-6',
    name: 'श्री महाकाल बड़ा मंगल विशाल महाभंडारा',
    organizer: 'महाकाल भक्त मंडल ट्रस्ट',
    organizerType: 'temple',
    phone: '+91 9839012345',
    location: 'हजरतगंज चौराहा, हनुमान मंदिर के पास, लखनऊ (उ.प्र.)',
    lat: 26.8467,
    lng: 80.9462,
    mapLink: 'https://www.google.com/maps?q=26.8467,80.9462',
    category: 'Hanuman Jayanti',
    date: getFutureDate(1), // Tomorrow
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '10:00',
    endTime: '18:00',
    food: 'पूड़ी-सब्जी, बूंदी रायता, हलवा, ठंडी शिकंजी/शरबत',
    description: 'ज्येष्ठ बड़ा मंगल के शुभ अवसर पर विशाल महाभंडारा एवं शीतल पेयजल वितरण सेवा।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 6000,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.9,
    ratingCount: 54,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-7',
    name: 'सावन सोमवारी महाकाल शिव प्रसादम भंडारा',
    organizer: 'श्री महाकालेश्वर सेवा समिति',
    organizerType: 'temple',
    phone: '+91 9826098765',
    location: 'महाकाल मंदिर मार्ग, रुद्र सागर के समीप, उज्जैन (म.प्र.)',
    lat: 23.1827,
    lng: 75.7682,
    mapLink: 'https://www.google.com/maps?q=23.1827,75.7682',
    category: 'Shivratri',
    date: getFutureDate(2), // In 2 days
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '11:00',
    endTime: '17:00',
    food: 'फलाहारी खिचड़ी, साबूदाना वड़ा, ठंडाई, मावे की खीर',
    description: 'पावन सावन सोमवारी के उपलक्ष्य में भगवान शिव के सभी भक्तों हेतु विशेष फलाहारी प्रसादम।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 8000,
    createdAt: new Date().toISOString(),
    ratingAvg: 5.0,
    ratingCount: 67,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-8',
    name: 'अक्षरधाम सेवा संघ अन्नक्षेत्र एवं भोजन प्रसादम',
    organizer: 'अक्षरधाम जन कल्याण सेवा ट्रस्ट',
    organizerType: 'verified_ngo',
    phone: '+91 9810011223',
    location: 'अक्षरधाम मंदिर गोल चक्कर, मयूर विहार, नई दिल्ली',
    lat: 28.6127,
    lng: 77.2773,
    mapLink: 'https://www.google.com/maps?q=28.6127,77.2773',
    category: 'Prasad',
    date: getFutureDate(3), // In 3 days
    isRecurring: false,
    startTime: '12:00',
    endTime: '16:30',
    food: 'छोले-चावल, कढ़ी-चावल, सूजी का हलवा, मीठी बूंदी',
    description: 'साप्ताहिक विशेष अन्नदान सेवा कार्यक्रम। सभी का सहर्ष स्वागत है।',
    featured: false,
    imageURLs: [
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 2500,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.8,
    ratingCount: 31,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-9',
    name: 'श्री खाटू श्याम जी एकादशी महाभंडारा',
    organizer: 'खाटू श्याम भक्त मंडल ट्रस्ट',
    organizerType: 'temple',
    phone: '+91 9414055667',
    location: 'खाटू धाम मुख्य मंदिर मार्ग, सीकर (राजस्थान)',
    lat: 27.3600,
    lng: 75.3900,
    mapLink: 'https://www.google.com/maps?q=27.3600,75.3900',
    category: 'Prasad',
    date: getFutureDate(4), // In 4 days
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    startTime: '11:00',
    endTime: '19:00',
    food: 'चूरमा, पूड़ी-आलू सब्जी, कढ़ी-कचौड़ी, गरम केसर दूध',
    description: 'बाबा श्याम के एकादशी महाप्रसाद वितरण एवं पदयात्रियों हेतु विश्राम व भोजन व्यवस्था।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 10000,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.9,
    ratingCount: 88,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-10',
    name: 'गांधी मैदान रविवार जन-अन्नदान भंडारा',
    organizer: 'मानव सेवा जनहित समिति',
    organizerType: 'verified_ngo',
    phone: '+91 9935044332',
    location: 'गांधी मैदान गेट नं. 5 के पास, फ्रेजर रोड, पटना (बिहार)',
    lat: 25.6110,
    lng: 85.1376,
    mapLink: 'https://www.google.com/maps?q=25.6110,85.1376',
    category: 'Langar',
    date: getFutureDate(5), // In 5 days
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    startTime: '11:30',
    endTime: '15:30',
    food: 'दाल-भात, आलू-बैंगन चोखा, खीर, पापड़, सलाद',
    description: 'प्रत्येक रविवार गरीब व जरूरतमंदों के लिए सम्मानजनक निःशुल्क भोजन सेवा।',
    featured: false,
    imageURLs: [
      'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 3000,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.7,
    ratingCount: 22,
    isVerified: true,
    verifiedByAdmin: true
  },
  {
    id: 'bhandara-11',
    name: 'हर की पौड़ी पावन गंगा आरती अन्नक्षेत्र',
    organizer: 'गंगा सभा एवं समाज सेवा समिति',
    organizerType: 'temple',
    phone: '+91 9758011223',
    location: 'हर की पौड़ी घाट, मालवीय द्वीप के निकट, हरिद्वार (उत्तराखंड)',
    lat: 29.9560,
    lng: 78.1709,
    mapLink: 'https://www.google.com/maps?q=29.9560,78.1709',
    category: 'Guru Purnima',
    date: getFutureDate(6), // In 6 days
    isRecurring: false,
    startTime: '12:00',
    endTime: '17:00',
    food: 'पूड़ी-सब्जी, चना-हलवा, आम का पना, शीतल प्रसादम',
    description: 'हरिद्वार आने वाले सभी तीर्थयात्रियों एवं साधु-संतों हेतु पावन प्रसादम।',
    featured: true,
    imageURLs: [
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80'
    ],
    statusOverride: 'soon',
    estimatedMeals: 7500,
    createdAt: new Date().toISOString(),
    ratingAvg: 4.9,
    ratingCount: 41,
    isVerified: true,
    verifiedByAdmin: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    bhandaraId: 'bhandara-1',
    userName: 'अनिल शर्मा',
    rating: 5,
    comment: 'बहुत ही उत्तम और सात्विक भोजन व्यवस्था थी। सफाई का विशेष ध्यान रखा गया था।',
    crowdLevel: 'Medium',
    foodQuality: 'Excellent',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-2',
    bhandaraId: 'bhandara-2',
    userName: 'Gurpreet Singh',
    rating: 5,
    comment: 'Waheguru ji! Amazing discipline and warm service by volunteers. Food was delicious.',
    crowdLevel: 'High',
    foodQuality: 'Excellent',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_NEEDS: InKindNeed[] = [
  {
    id: 'need-1',
    bhandaraId: 'bhandara-1',
    bhandaraName: 'श्री राम मंदिर विशाल भंडारा',
    item: 'गेहूं का आटा',
    quantityNeeded: '50 किग्रा',
    quantityFulfilled: '20 किग्रा',
    status: 'Partially Fulfilled',
    contactPhone: '+91 9876543210',
    createdAt: new Date().toISOString()
  },
  {
    id: 'need-2',
    bhandaraId: 'bhandara-3',
    bhandaraName: 'श्री बांके बिहारी मंदिर महाप्रसाद',
    item: 'शुद्ध देसी घी & चीनी',
    quantityNeeded: '15 लीटर घी, 30 किग्रा चीनी',
    quantityFulfilled: '0',
    status: 'Open',
    contactPhone: '+91 9412345678',
    createdAt: new Date().toISOString()
  }
];
