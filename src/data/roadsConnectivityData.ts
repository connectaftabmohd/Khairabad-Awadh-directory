export interface RoadConnectivityItem {
  id: string;
  name: string;
  hindiName?: string;
  category: 'highways' | 'local-roads';
  categoryLabel: string;
  alternateNames: string;
  significance: string;
  keyLandmarks: string[];
  directoryHighlights: string[];
  connectedMohallas: string[];
  chaurahaHubs: string[];
  targetAudience: string;
  routeGoogleMapsUrl: string;
  lengthOrSpan?: string;
  speedLimitOrTraffic?: string;
  badgeColor: string;
  gradient: string;
}

export interface ChaurahaHub {
  id: string;
  name: string;
  hindiName: string;
  road: string;
  mohalla: string;
  description: string;
  landmarks: string[];
  googleMapsUrl: string;
}

export interface TraditionalMohalla {
  id: string;
  name: string;
  hindiName: string;
  primaryRoad: string;
  character: string;
  highlights: string[];
  chaurahaHub: string;
}

export const MAIN_ROADS_CONNECTIVITY: RoadConnectivityItem[] = [
  // Category 1: Highways & Regional Arteries
  {
    id: 'nh-24',
    name: 'National Highway 24 (NH-24)',
    hindiName: 'राष्ट्रीय राजमार्ग 24 (सीतापुर-लखनऊ रोड)',
    category: 'highways',
    categoryLabel: '🛣️ Category 1: Highways & Regional Arteries',
    alternateNames: 'Sitapur Road / Lucknow-Sitapur Road / NH-30 New Designation',
    significance: 'The premier arterial lifeline of Khairabad, handling the highest daily transit volume and inter-district travel.',
    keyLandmarks: [
      'Khairabad Chauraha (Major Crossroad Junction)',
      'Barabhari Toll Plaza (Toll Checkpoint)',
      'Direct Expressway link to Lucknow (~80 km)',
      'Direct Connection to Sitapur City (~8 km)',
      'Highway Dhabas, 24/7 Fuel Outlets & Commercial Transport Yards',
    ],
    directoryHighlights: [
      'Connects Khairabad to Lucknow (~80km) and Sitapur City (~8km).',
      'High-density commercial hub featuring Khairabad Chauraha (Crossroad) and the Barabhari Toll Plaza.',
    ],
    connectedMohallas: ['Sitapur Road Corridor', 'Chungi Naka', 'Barabhari'],
    chaurahaHubs: ['Khairabad Chauraha', 'Barabhari Toll Plaza'],
    targetAudience: 'Travelers, Intercity Commuters & Heavy Freight',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/National+Highway+24+Khairabad+Sitapur+Uttar+Pradesh',
    lengthOrSpan: '80 km corridor to Lucknow / 8 km to Sitapur HQ',
    speedLimitOrTraffic: 'High Speed Multi-Lane Highway',
    badgeColor: 'bg-blue-600 text-white',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'sh-30',
    name: 'State Highway 30 (SH-30)',
    hindiName: 'राज्य राजमार्ग 30 (बिसवां–सीतापुर रोड)',
    category: 'highways',
    categoryLabel: '🛣️ Category 1: Highways & Regional Arteries',
    alternateNames: 'Biswan–Sitapur Road',
    significance: 'Runs along the northern and eastern fringes of town, funneling regional traffic between Biswan, Sitapur, and agricultural mandis.',
    keyLandmarks: [
      'Thana Khairabad (Town Police Station / Kotwali)',
      'Suhaima Market (Bustling Rural Commerce Hub)',
      'Northeastern Bypass Route to Biswan Tehsil',
      'Grain Mandi Linkages & Agricultural Transport Beat',
    ],
    directoryHighlights: [
      'Runs along the northern and eastern fringes.',
      'Connects local traffic moving toward Biswan and includes local landmarks like the Thana Khairabad (Police Station) and Suhaima Market.',
    ],
    connectedMohallas: ['Biswan Road', 'Thana Khairabad Area', 'Suhaima'],
    chaurahaHubs: ['Thana Khairabad Chauraha', 'Suhaima Market Link'],
    targetAudience: 'Regional Travelers, Farmers & Freight Traffic',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/State+Highway+30+Biswan+Sitapur+Road+Khairabad+Uttar+Pradesh',
    lengthOrSpan: 'Key connector to Biswan (~35 km)',
    speedLimitOrTraffic: 'Two-Lane State Highway Corridor',
    badgeColor: 'bg-emerald-600 text-white',
    gradient: 'from-emerald-600 to-teal-700',
  },

  // Category 2: Central Local & Commercial Roads
  {
    id: 'bcm-road',
    name: 'BCM Road',
    hindiName: 'बीसीएम हॉस्पिटल रोड',
    category: 'local-roads',
    categoryLabel: '🏙️ Category 2: Central Local & Commercial Roads',
    alternateNames: 'BCM Hospital Road / Mission Hospital Link / Route Khairabad, UP',
    significance: 'This is arguably the most essential service road inside Khairabad, serving as the town healthcare epicenter.',
    keyLandmarks: [
      'Prominent BCM Hospital Khairabad (Multi-Specialty Healthcare)',
      'Essential Government Health Facilities & Maternal Health Centers',
      'Khairabad Iron Store (Hardware & Construction Depot)',
      'City Optical Market (Optometry, Eye Clinics & Spectacles)',
      '24/7 Pharmacies, Jan Seva Kendras & Blood Testing Labs',
    ],
    directoryHighlights: [
      'Houses the prominent BCM Hospital Khairabad and essential government health facilities.',
      'Anchors key trade points like Khairabad Iron Store and City Optical Market.',
      'Borders traditional mohallas: Mevati Tola and Qasbati Tola.',
    ],
    connectedMohallas: ['Mevati Tola', 'Qasbati Tola'],
    chaurahaHubs: ['BCM Hospital Chauraha', 'Mevati Tola Link'],
    targetAudience: 'Patients, Healthcare Staff, Hardware Buyers & Residents',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/BCM+Hospital+Road+Khairabad+Sitapur+Uttar+Pradesh',
    lengthOrSpan: 'Central Arterial Service Corridor (~2 km)',
    speedLimitOrTraffic: 'Medium Urban Transit (30 km/h)',
    badgeColor: 'bg-rose-600 text-white',
    gradient: 'from-rose-600 to-amber-600',
  },
  {
    id: 'bahraich-sitapur-road',
    name: 'Bahraich–Sitapur Road',
    hindiName: 'बहराइच–सीतापुर रोड',
    category: 'local-roads',
    categoryLabel: '🏙️ Category 2: Central Local & Commercial Roads',
    alternateNames: 'Arjunpur–Sujawalpur Link / Route Uttar Pradesh',
    significance: 'Connects local neighborhoods to critical government infrastructure and prime textile wholesale commerce.',
    keyLandmarks: [
      'RTO Office Sitapur (Regional Transport Office, located in Arjunpur area)',
      'Historical Allama Fazl-e-Haq Khairabadi Smarak Chauraha',
      'Hira Market in Sujawalpur (Major Fashion & Apparel Wholesale Hub)',
      'Vehicle Registration & Driving Test Driving Track',
      'Wholesale Garment Warehouses & Tailoring Units',
    ],
    directoryHighlights: [
      'Connects local neighborhoods to government infrastructure.',
      'Runs near RTO Office Sitapur (located in Arjunpur area of Khairabad).',
      'Features historical Allama Fazl-e-Haq Khairabadi Smarak Chauraha and Hira Market apparel hub.',
    ],
    connectedMohallas: ['Arjunpur', 'Sujawalpur'],
    chaurahaHubs: ['Allama Fazl-e-Haq Khairabadi Smarak Chauraha'],
    targetAudience: 'RTO Visitors, Wholesale Apparel Buyers, Commuters',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/Bahraich+Sitapur+Road+Khairabad+Uttar+Pradesh',
    lengthOrSpan: 'Major Inter-District Link Route',
    speedLimitOrTraffic: 'Urban Commercial & Civic Transit',
    badgeColor: 'bg-violet-600 text-white',
    gradient: 'from-violet-600 to-purple-800',
  },
  {
    id: 'post-office-road',
    name: 'Post Office Road (Purani Bazar Link)',
    hindiName: 'पोस्ट ऑफिस रोड (पुरानी बाज़ार लिंक)',
    category: 'local-roads',
    categoryLabel: '🏙️ Category 2: Central Local & Commercial Roads',
    alternateNames: 'Purani Bazar Link / Dakghar Road',
    significance: 'The historic core of town traffic and Awadhi town commerce with deep cultural heritage.',
    keyLandmarks: [
      'Purani Bazar (Dense 3-way commercial intersection loaded with shops)',
      'Historic Khairabad Sub Post Office (PIN Code: 261131)',
      'Traditional Awadhi Snack & Halwai Points (Mithai, Samosa, Chaat)',
      'Centuries-old Haveli Architecture & Heritage Shivalas',
      'Bespoke Gold & Silver Sarafa Workstations',
    ],
    directoryHighlights: [
      'The historic core of town traffic.',
      'Leads directly into Purani Bazar, a dense three-way commercial intersection loaded with local shops, snack points, and old architecture.',
    ],
    connectedMohallas: ['Purani Bazar', 'Miyan Sarai'],
    chaurahaHubs: ['Purani Bazar Teen-Rasta Chauraha'],
    targetAudience: 'Shoppers, Residents, Heritage Enthusiasts & Postal Visitors',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/Post+Office+Road+Purani+Bazar+Khairabad+Sitapur',
    lengthOrSpan: 'Historic Town Core Corridor (~1.5 km)',
    speedLimitOrTraffic: 'Pedestrian & E-Rickshaw Friendly (Slow)',
    badgeColor: 'bg-amber-600 text-white',
    gradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'nai-bazar-road',
    name: 'Nai Bazar Road',
    hindiName: 'नई बाज़ार रोड',
    category: 'local-roads',
    categoryLabel: '🏙️ Category 2: Central Local & Commercial Roads',
    alternateNames: 'Nai Bazar Market Street / Route Khairabad, Uttar Pradesh',
    significance: 'The primary retail market street of Khairabad, bustling with thousands of daily family shoppers.',
    keyLandmarks: [
      'Joshitola Neighborhood (Heart of Central Residential Town)',
      'Alam Kirana Store (Famous Landmark Provisions & FMCG Store)',
      'Retail Apparel, Sarees, Footwear & Cosmetic Showrooms',
      'Stationery, Bookshops, Mobile Accessories & Electronics',
      'Fresh Vegetable & Fruit Vendor Stretch',
    ],
    directoryHighlights: [
      'The primary retail market street.',
      'Cuts through the Joshitola neighborhood and hosts thousands of daily shoppers looking for groceries (like Alam Kirana Store) and retail apparel.',
    ],
    connectedMohallas: ['Joshitola'],
    chaurahaHubs: ['Nai Bazar Chauraha'],
    targetAudience: 'Daily Household Shoppers, Students, Fashion Retail',
    routeGoogleMapsUrl: 'https://www.google.com/maps/search/Nai+Bazar+Road+Khairabad+Uttar+Pradesh',
    lengthOrSpan: 'Prime Shopping Street (~1.2 km)',
    speedLimitOrTraffic: 'High Footfall Commercial Walkway',
    badgeColor: 'bg-pink-600 text-white',
    gradient: 'from-pink-600 to-rose-700',
  },
];

export const CHAURAHA_HUBS: ChaurahaHub[] = [
  {
    id: 'khairabad-chauraha',
    name: 'Khairabad Chauraha (NH-24 Junction)',
    hindiName: 'ख़ैराबाद चौराहा (हाईवे क्रॉसरोड)',
    road: 'National Highway 24 (NH-24)',
    mohalla: 'Sitapur Road Corridor',
    description: 'The bustling highway crossroads welcoming travelers entering from Lucknow or Sitapur. Hub for highway dhabas, e-rickshaws, and auto-stands.',
    landmarks: ['Barabhari Toll Plaza', 'Highway Police Booth', 'Sitapur City Feeder', 'Lucknow Express Bus Stop'],
    googleMapsUrl: 'https://www.google.com/maps/search/Khairabad+Chauraha+NH-24+Sitapur+Road',
  },
  {
    id: 'fazl-e-haq-smarak',
    name: 'Allama Fazl-e-Haq Khairabadi Smarak Chauraha',
    hindiName: 'अल्लामा फ़ज़ल-ए-हक़ ख़ैराबादी स्मारक चौराहा',
    road: 'Bahraich–Sitapur Road',
    mohalla: 'Arjunpur / Sujawalpur',
    description: 'Historical intersection honoring the legendary 1857 freedom fighter, philosopher, and Islamic scholar Allama Fazl-e-Haq Khairabadi.',
    landmarks: ['Fazl-e-Haq Memorial Gate', 'Hira Market Link', 'RTO Office Corridor', 'Sujawalpur Entrance'],
    googleMapsUrl: 'https://www.google.com/maps/search/Allama+Fazl-e-Haq+Khairabadi+Smarak+Chauraha+Sitapur',
  },
  {
    id: 'purani-bazar-teen-rasta',
    name: 'Purani Bazar Teen-Rasta Chauraha',
    hindiName: 'पुरानी बाज़ार तीन-रास्ता चौराहा',
    road: 'Post Office Road',
    mohalla: 'Purani Bazar',
    description: 'Historic dense 3-way commercial junction at the heart of old Khairabad, surrounded by traditional sweet shops, cloth merchants, and havelis.',
    landmarks: ['Khairabad Sub Post Office', 'Miyan Sarai Lane', 'Sarafa Bazaar Junction', 'Halwai Corner'],
    googleMapsUrl: 'https://www.google.com/maps/search/Purani+Bazar+Khairabad+Sitapur',
  },
  {
    id: 'bcm-hospital-chauraha',
    name: 'BCM Hospital Chauraha',
    hindiName: 'बीसीएम हॉस्पिटल चौराहा',
    road: 'BCM Road',
    mohalla: 'Mevati Tola / Qasbati Tola',
    description: 'Vital healthcare junction leading to BCM Hospital, private diagnostic clinics, pharmacies, and Mevati Tola residential corridors.',
    landmarks: ['BCM Hospital Gate', 'Khairabad Iron Store', 'City Optical Market', 'Emergency Ambulance Point'],
    googleMapsUrl: 'https://www.google.com/maps/search/BCM+Hospital+Khairabad+Sitapur',
  },
  {
    id: 'thana-chauraha',
    name: 'Thana Khairabad Chauraha (SH-30)',
    hindiName: 'थाना ख़ैराबाद चौराहा',
    road: 'State Highway 30 (SH-30)',
    mohalla: 'Thana Khairabad Area',
    description: 'Law enforcement and civic crossroads on the Biswan highway, facilitating patrol and public reporting.',
    landmarks: ['Kotwali Thana Khairabad', 'Suhaima Market Link', 'Biswan Bus Shelter', 'Jan Seva Kendra'],
    googleMapsUrl: 'https://www.google.com/maps/search/Thana+Khairabad+Sitapur',
  },
  {
    id: 'nai-bazar-chauraha',
    name: 'Nai Bazar Chauraha',
    hindiName: 'नई बाज़ार चौराहा',
    road: 'Nai Bazar Road',
    mohalla: 'Joshitola',
    description: 'Central shopping intersection cutting through Joshitola; top retail destination for groceries, cosmetics, clothing, and footwear.',
    landmarks: ['Alam Kirana Store', 'Joshitola Galli', 'Apparel & Saree Stores', 'Stationery Hub'],
    googleMapsUrl: 'https://www.google.com/maps/search/Nai+Bazar+Road+Khairabad+Sitapur',
  },
];

export const TRADITIONAL_MOHALLAS: TraditionalMohalla[] = [
  {
    id: 'joshitola',
    name: 'Joshitola',
    hindiName: 'जोशी टोला',
    primaryRoad: 'Nai Bazar Road',
    character: 'High-density historical residential mohalla and prime retail hub with bustling daily shopping street.',
    highlights: ['Alam Kirana Store', 'Retail Apparel', 'Saree & Cloth Stores', 'Daily Groceries & Essentials'],
    chaurahaHub: 'Nai Bazar Chauraha',
  },
  {
    id: 'sujawalpur',
    name: 'Sujawalpur',
    hindiName: 'सुजावलपुर',
    primaryRoad: 'Bahraich–Sitapur Road',
    character: 'Famed commercial fashion and wholesale apparel district, hosting buyers from across Sitapur district.',
    highlights: ['Hira Market Wholesale Cloth', 'Garment Showrooms', 'Embroidery & Zari Units', 'Festive Fashion Hub'],
    chaurahaHub: 'Allama Fazl-e-Haq Khairabadi Smarak Chauraha',
  },
  {
    id: 'arjunpur',
    name: 'Arjunpur',
    hindiName: 'अर्जुनपुर',
    primaryRoad: 'Bahraich–Sitapur Road',
    character: 'Government administration and civic services sector, serving the entire Sitapur district transport operations.',
    highlights: ['RTO Office Sitapur', 'Driving Test Track', 'Vehicle Documentation Centers', 'Transport Agencies'],
    chaurahaHub: 'Allama Fazl-e-Haq Khairabadi Smarak Chauraha',
  },
  {
    id: 'mevati-tola',
    name: 'Mevati Tola',
    hindiName: 'मेवाती टोला',
    primaryRoad: 'BCM Road',
    character: 'Historic residential tola bordering BCM Road, known for community warmth, local crafts, and hardware commerce.',
    highlights: ['Khairabad Iron Store', 'BCM Hospital Proximity', 'Medical Stores', 'Community Masjids'],
    chaurahaHub: 'BCM Hospital Chauraha',
  },
  {
    id: 'qasbati-tola',
    name: 'Qasbati Tola',
    hindiName: 'कस्बाती टोला',
    primaryRoad: 'BCM Road',
    character: 'Traditional inner quarter with quiet residential lanes, artisan workshops, and healthcare workers.',
    highlights: ['City Optical Market', 'Healthcare Workers Quarters', 'Local Dhabas', 'BCM Service Lane'],
    chaurahaHub: 'BCM Hospital Chauraha',
  },
  {
    id: 'miyan-sarai',
    name: 'Miyan Sarai',
    hindiName: 'मियां सराय',
    primaryRoad: 'Post Office Road',
    character: 'Awadh-era historic settlement with heritage courtyard houses, traditional trades, and deep cultural roots.',
    highlights: ['Purani Bazar Link', 'Heritage Dargahs', 'Traditional Bakery & Snacks', 'Craftsmen Workshops'],
    chaurahaHub: 'Purani Bazar Teen-Rasta Chauraha',
  },
  {
    id: 'purani-bazar',
    name: 'Purani Bazar',
    hindiName: 'पुरानी बाज़ार',
    primaryRoad: 'Post Office Road',
    character: 'The historic town commercial epicenter with 3-way crossing, gold/silver jewellers, and vintage spice shops.',
    highlights: ['Khairabad Sub Post Office (261131)', 'Three-Way Teen Rasta', 'Sarafa Jewellery', 'Traditional Mithai'],
    chaurahaHub: 'Purani Bazar Teen-Rasta Chauraha',
  },
  {
    id: 'sitapur-road-corridor',
    name: 'Sitapur Road Corridor',
    hindiName: 'सीतापुर रोड कॉरिडोर',
    primaryRoad: 'National Highway 24 (NH-24)',
    character: 'Modern transit and industrial highway corridor with fuel stations, hotels, and intercity bus stops.',
    highlights: ['Khairabad Chauraha', 'Barabhari Toll Plaza', '24/7 Dhabas', 'Automotive Garages & Petrol Pumps'],
    chaurahaHub: 'Khairabad Chauraha (NH-24 Junction)',
  },
  {
    id: 'suhaima-area',
    name: 'Suhaima / Thana Area',
    hindiName: 'सुहैमा / थाना क्षेत्र',
    primaryRoad: 'State Highway 30 (SH-30)',
    character: 'Northern-eastern regional market edge hosting rural agricultural trade and police headquarters.',
    highlights: ['Thana Khairabad Kotwali', 'Suhaima Market', 'Biswan Corridor', 'Grain & Fertilizer Depots'],
    chaurahaHub: 'Thana Khairabad Chauraha (SH-30)',
  },
];
