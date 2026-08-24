import {
  Destination,
  Hotel,
  Blog,
  TripPlan,
  CommunityPost,
  TravelGroup,
  MongoCollectionDoc,
  RestEndpointDoc,
  UserProfile
} from '../types/travel';

export const INITIAL_USER: UserProfile = {
  id: '',
  name: 'Tanvir Hossain',
  email: 'tanvir@chologhuri.bd',
  phone: '+880 1712-345678',
  dob: '1996-05-14',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'Solo Travelers',
  totalTrips: 6,
  placesVisitedCount: 14,
  totalSpentBDT: 48500,
  currency: 'BDT',
};

export const CHATTOGRAM_DESTINATIONS: Destination[] = [
  {
    id: 'patenga-beach',
    name: 'Patenga Beach',
    division: 'Chattogram Division',
    district: 'Chattogram City',
    category: 'Beach & Coastal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Vibrant coastal beach at the mouth of Karnaphuli River with sunset views and street food delights.',
    fullDesc: 'Patenga Sea Beach is a popular tourist spot located 14 km south from Chattogram city center. Renowned for its sea wall protection, sea breeze, evening street food (Krab, Chana Khatpati), and views of cargo ships navigating into Chattogram Port.',
    attractions: ['Karnaphuli River Estuary', 'Patenga Promenade', 'Naval Academy Viewpoint', 'Local Crab & Seafood Stalls', 'Sunset Sea Wall Walk'],
    travelRoutes: [
      { from: 'Chattogram Agrabad', to: 'Patenga Beach', mode: 'CNG / Local Taxi', costBDT: 350, duration: '40 mins' },
      { from: 'Chattogram Railway Station', to: 'Patenga Beach', mode: 'Bus', costBDT: 40, duration: '60 mins' },
    ],
    estimatedBudgetBDT: { budget: 800, midRange: 2000, luxury: 4500 },
    visitorTips: ['Best visiting hours are between 4:00 PM and 7:00 PM for sunset.', 'Try the famous spicy fried crab and chana float.', 'Beware of heavy tide when sitting near wave breaker rocks.'],
    bestTimeToVisit: 'October to March',
    rating: 4.6,
    reviewsCount: 1240,
    coordinates: { lat: 22.2323, lng: 91.7925 },
    popular: true,
  },
  {
    id: 'sajek-valley',
    name: 'Sajek Valley',
    division: 'Chattogram Division',
    district: 'Rangamati',
    category: 'Hill Tracts & Valleys',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'The Queen of Hills nestled in clouds with wooden cottages, Helipad vistas, and Lush green valleys.',
    fullDesc: 'Sajek Valley is an emerging tourist destination located in Kasalong range of hills among the hill tracts of Rangamati District. Standing 2,000 feet above sea level, it is famous for its sea of clouds (Megh), tribal culture, and serene mountain sunsets.',
    attractions: ['Konglak Para Peak', 'Ruilui Para Village', 'Sajek Helipad 1 & 2', 'Hazachora Waterfall', 'Mizo Ethnic Village Tour'],
    travelRoutes: [
      { from: 'Chattogram City', to: 'Khagrachhari Town', mode: 'Bus', costBDT: 300, duration: '4.5 hrs' },
      { from: 'Khagrachhari Town', to: 'Sajek Valley', mode: 'Chander Gari (Jeep)', costBDT: 4500, duration: '2.5 hrs' },
    ],
    estimatedBudgetBDT: { budget: 3500, midRange: 7500, luxury: 15000 },
    visitorTips: ['Army escort times are 10:00 AM and 3:00 PM from Dighinala.', 'Book resort at Ruilui Para at least 2 weeks in advance.', 'Carry cash as mobile network and ATM facilities are limited.'],
    bestTimeToVisit: 'Monsoon for cloud views (June-Sept), Winter for clear mountain vistas (Nov-Feb)',
    rating: 4.9,
    reviewsCount: 3150,
    coordinates: { lat: 23.3821, lng: 92.2938 },
    popular: true,
  },
  {
    id: 'marine-drive',
    name: 'Marine Drive',
    division: 'Chattogram Division',
    district: 'Cox\'s Bazar',
    category: 'Beach & Coastal',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'The world\'s longest 80 km continuous seaside road connecting Cox\'s Bazar to Teknaf.',
    fullDesc: 'The Cox\'s Bazar–Teknaf Marine Drive is an 80-kilometre-long road from Cox\'s Bazar to Teknaf along the Bay of Bengal. On one side are towering lush green hills, and on the other side is the roaring blue ocean.',
    attractions: ['Inani Coral Beach', 'Himchari National Park & Waterfall', 'Teknaf Eco Resort', 'Darianagar Caves', 'Local Open Eco Auto Drives'],
    travelRoutes: [
      { from: 'Cox\'s Bazar Hotel Zone', to: 'Inani Beach', mode: 'CNG / Local Taxi', costBDT: 800, duration: '45 mins' },
      { from: 'Cox\'s Bazar Hotel Zone', to: 'Teknaf', mode: 'Chander Gari (Jeep)', costBDT: 3000, duration: '2 hrs' },
    ],
    estimatedBudgetBDT: { budget: 2000, midRange: 6000, luxury: 18000 },
    visitorTips: ['Rent an open roof jeep for scenic photography along the sea road.', 'Stop at Himchari view point for a 360-degree hill-sea view.', 'Sunset at Inani beach is tranquil and less crowded.'],
    bestTimeToVisit: 'November to April',
    rating: 4.8,
    reviewsCount: 2890,
    coordinates: { lat: 21.3654, lng: 92.0398 },
    popular: true,
  },
  {
    id: 'nilgiri',
    name: 'Nilgiri Hill Resort',
    division: 'Chattogram Division',
    district: 'Bandarban',
    category: 'Hill Tracts & Valleys',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'High altitude hill station in Bandarban offering breathtaking views of rolling clouds.',
    fullDesc: 'Nilgiri is one of the highest peaks in Bangladesh, located in Thanchi Thana of Bandarban district. Managed by Bangladesh Army, it offers cloud-touching hilltop cottages, panoramic valley vistas, and pristine air.',
    attractions: ['Nilgiri Viewpoint', 'Chimbuk Hill Peak', 'Shoilo Propat Waterfall', 'Bandarban Golden Temple', 'Bawm Tribal Handicrafts'],
    travelRoutes: [
      { from: 'Bandarban Town', to: 'Nilgiri', mode: 'Chander Gari (Jeep)', costBDT: 3500, duration: '2 hrs' },
      { from: 'Chattogram City', to: 'Bandarban Town', mode: 'Bus', costBDT: 220, duration: '3 hrs' },
    ],
    estimatedBudgetBDT: { budget: 2500, midRange: 6500, luxury: 14000 },
    visitorTips: ['Carry NID or passport for security checkposts.', 'Sunrise at Nilgiri displays a dense ocean of white clouds.', 'Pack light warm clothes even in late summer evenings.'],
    bestTimeToVisit: 'September to March',
    rating: 4.9,
    reviewsCount: 1980,
    coordinates: { lat: 21.9167, lng: 92.3333 },
    popular: true,
  },
  {
    id: 'kaptai-lake',
    name: 'Kaptai Lake',
    division: 'Chattogram Division',
    district: 'Rangamati',
    category: 'Lakes & Waterways',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'The largest man-made lake in South Asia surrounded by green hills and floating tribal markets.',
    fullDesc: 'Kaptai Lake in Rangamati is an immense body of water created by Kaptai Dam on Karnaphuli River. Travelers enjoy engine boat rides across crystal green waters, visiting tribal villages, Shuvolong Waterfall, and the Hanging Bridge.',
    attractions: ['Hanging Bridge of Rangamati', 'Shuvolong Waterfall', 'Rajban Vihara Buddhist Temple', 'Peda Ting Ting Island Restaurant', 'Kaptai Kayaking Complex'],
    travelRoutes: [
      { from: 'Chattogram City', to: 'Rangamati Town', mode: 'Bus', costBDT: 180, duration: '2.5 hrs' },
      { from: 'Rangamati Boat Ghat', to: 'Kaptai Lake Tour', mode: 'Boat / Launch', costBDT: 1500, duration: 'Full Day' },
    ],
    estimatedBudgetBDT: { budget: 1500, midRange: 4000, luxury: 9500 },
    visitorTips: ['Try authentic Chakma dishes like Bamboo Chicken at island restaurants.', 'Hire a private wooden motor boat for 4-5 hours to explore distant islands.', 'Kayaking at Kaptai spillway is peaceful.'],
    bestTimeToVisit: 'August to March',
    rating: 4.7,
    reviewsCount: 1840,
    coordinates: { lat: 22.5833, lng: 92.2167 },
    popular: true,
  },
  {
    id: 'chandranath-hill',
    name: 'Chandranath Hill & Temple',
    division: 'Chattogram Division',
    district: 'Sitakunda',
    category: 'Hill Tracts & Valleys',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Revered pilgrimage hill peak offering scenic trekking routes and panoramic sea-mountain views.',
    fullDesc: 'Chandranath Peak in Sitakunda is a famous trekking and religious destination standing 1,020 feet high. Surrounded by deep evergreen forests and ancient steps, it overlooks both the Bay of Bengal coastline and agricultural plains.',
    attractions: ['Chandranath Hindu Pilgrimage Temple', 'Birupakkha Temple', 'Sitakunda Forest Trail', 'Echo Valley Steps', 'Seacoast Panorama Peak'],
    travelRoutes: [
      { from: 'Chattogram Kadamtali', to: 'Sitakunda Gate', mode: 'Bus', costBDT: 60, duration: '1 hr' },
      { from: 'Sitakunda Gate', to: 'Chandranath Base', mode: 'CNG / Local Taxi', costBDT: 100, duration: '15 mins' },
    ],
    estimatedBudgetBDT: { budget: 500, midRange: 1500, luxury: 3500 },
    visitorTips: ['Trek has around 2,000 stairs; wear sturdy sports shoes and carry water.', 'Start trekking early morning around 7:00 AM to avoid noon heat.', 'Take the left staircase while going up for a gentler slope.'],
    bestTimeToVisit: 'October to February',
    rating: 4.7,
    reviewsCount: 1620,
    coordinates: { lat: 22.6189, lng: 91.6811 },
    popular: true,
  },
  {
    id: 'khoiyachora-waterfall',
    name: 'Khoiyachora Waterfall',
    division: 'Chattogram Division',
    district: 'Mirsarai',
    category: 'Waterfalls & Springs',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Multistep cascading waterfall hidden deep inside Mirsarai forest ranges.',
    fullDesc: 'Khoiyachora Waterfall is one of the largest multi-step waterfalls in Bangladesh, featuring 9 distinct cascading steps hidden inside the hills of Mirsarai. It is a top favorite for adventure backpackers and nature lovers.',
    attractions: ['Step 1 Main Basin', 'Step 2 & 3 Cliff Trails', 'Bamboo Forest Trekking', 'Natural Mountain Spring Pool', 'Mirsarai Eco Trail'],
    travelRoutes: [
      { from: 'Chattogram City', to: 'Khoiyachora Bus Stop Mirsarai', mode: 'Bus', costBDT: 80, duration: '1.5 hrs' },
      { from: 'Khoiyachora Gate', to: 'Waterfall Base Trail', mode: 'CNG / Local Taxi', costBDT: 100, duration: '15 mins' },
    ],
    estimatedBudgetBDT: { budget: 600, midRange: 1800, luxury: 3500 },
    visitorTips: ['Trekking requires walking through shallow streams; wear waterproof sandals.', 'Climbing to step 5 and above is slippery during heavy rains; hire a local guide.', 'Avoid leaving plastic trash in the forest area.'],
    bestTimeToVisit: 'June to October (Peak monsoon water flow)',
    rating: 4.8,
    reviewsCount: 1420,
    coordinates: { lat: 22.7667, lng: 91.5667 },
    popular: true,
  },
  {
    id: 'foys-lake',
    name: 'Foy\'s Lake & Concord Park',
    division: 'Chattogram Division',
    district: 'Chattogram City',
    category: 'Heritage & Eco Parks',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Picturesque artificial lake, amusement park, and resort nestled among lush hillocks.',
    fullDesc: 'Foy\'s Lake is a scenic lake created in 1924 by Assam Bengal Railway, located near Pahartoli in Chattogram. Modernized into an eco-resort and amusement park by Concord Group, it features water park slides, lake cruise boats, and peaceful hill bungalows.',
    attractions: ['Foy\'s Lake Boat Cruise', 'Sea World Water Park', 'Concord Amusement Park', 'Pahartoli Heritage Railway Site', 'Foy\'s Lake Resort Bungalows'],
    travelRoutes: [
      { from: 'Chattogram GEC Circle', to: 'Foy\'s Lake Gate', mode: 'CNG / Local Taxi', costBDT: 120, duration: '15 mins' },
    ],
    estimatedBudgetBDT: { budget: 700, midRange: 2500, luxury: 6000 },
    visitorTips: ['Great family destination with amusement rides and clean water slides.', 'Book boat ride to the quiet backside of the lake for sunset scenery.'],
    bestTimeToVisit: 'All year round',
    rating: 4.5,
    reviewsCount: 2100,
    coordinates: { lat: 22.3611, lng: 91.7944 },
    popular: false,
  },
  {
    id: 'boga-lake',
    name: 'Boga Lake',
    division: 'Chattogram Division',
    district: 'Bandarban',
    category: 'Lakes & Waterways',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Mysterious natural volcanic crater lake situated 1,200 ft high in the Ruma hill wilderness.',
    fullDesc: 'Boga Lake (Bogaakhol Lake) is a high-altitude natural lake located in Ruma Upazila of Bandarban. Legend holds that a dragon myth surrounds its formation. It serves as the gateway camp for trekking Keokradong Peak.',
    attractions: ['Volcanic Lake Basin', 'Bawm Tribal Eco Cottages', 'Campfire Hill Views', 'Keokradong Trek Gateway', 'Ruma Jhiri Creek'],
    travelRoutes: [
      { from: 'Bandarban Town', to: 'Ruma Bazar', mode: 'Chander Gari (Jeep)', costBDT: 2500, duration: '2.5 hrs' },
      { from: 'Ruma Bazar', to: 'Boga Lake', mode: 'Chander Gari (Jeep)', costBDT: 2800, duration: '2 hrs' },
    ],
    estimatedBudgetBDT: { budget: 2200, midRange: 5000, luxury: 9000 },
    visitorTips: ['Regulated by Bangladesh Army checkpost; guide is mandatory.', 'Stay at Siam Bawm\'s eco cottage for local hospitality and organic tribal food.', 'No electricity; solar power available for light.'],
    bestTimeToVisit: 'November to March',
    rating: 4.9,
    reviewsCount: 940,
    coordinates: { lat: 21.9861, lng: 92.4708 },
    popular: true,
  },
  {
    id: 'guliakhali-sea-beach',
    name: 'Guliakhali Sea Beach',
    division: 'Chattogram Division',
    district: 'Sitakunda',
    category: 'Beach & Coastal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Unique green carpet grass field meeting mangrove canals and soft sea waves.',
    fullDesc: 'Also known as Muradpur Beach, Guliakhali in Sitakunda presents a rare landscape where green lawn-like grass mounds are carved by small natural tidal canals, bordered by mangrove roots and calm ocean water.',
    attractions: ['Green Grass Mounds Landscape', 'Mangrove Forest Trail', 'Tidal Canal Boat Ride', 'Peaceful Secluded Shoreline'],
    travelRoutes: [
      { from: 'Sitakunda Town', to: 'Guliakhali Beach Ghat', mode: 'CNG / Local Taxi', costBDT: 200, duration: '25 mins' },
    ],
    estimatedBudgetBDT: { budget: 500, midRange: 1600, luxury: 3200 },
    visitorTips: ['Check high tide and low tide schedule before visiting.', 'Carry waterproof boots if walking through mud canals.', 'Uncrowded spot perfect for quiet sunset photography.'],
    bestTimeToVisit: 'July to March',
    rating: 4.6,
    reviewsCount: 1150,
    coordinates: { lat: 22.6105, lng: 91.6031 },
    popular: false,
  },
  {
    id: 'nafakhum-waterfall',
    name: 'Nafakhum Waterfall',
    division: 'Chattogram Division',
    district: 'Bandarban',
    category: 'Waterfalls & Springs',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'The Niagara of Bangladesh — massive rushing waterfall on Sangu River in Remakri.',
    fullDesc: 'Nafakhum is one of the largest wild waterfalls in Bangladesh by volume of water. Located in Remakri, Thanchi of Bandarban district, reaching it involves an epic boat journey down the majestic rock canyons of the Sangu River.',
    attractions: ['Sangu River Canyon Boat Ride', 'Remakri Village', 'Nafakhum Roaring Water Basin', 'Tindu Big Rock Valley', 'Marma Tribal Culture'],
    travelRoutes: [
      { from: 'Bandarban Town', to: 'Thanchi Bazar', mode: 'Chander Gari (Jeep)', costBDT: 300, duration: '3.5 hrs' },
      { from: 'Thanchi Ghat', to: 'Remakri & Nafakhum', mode: 'Boat / Launch', costBDT: 4000, duration: '3 hrs boat + 1.5 hr walk' },
    ],
    estimatedBudgetBDT: { budget: 3500, midRange: 7500, luxury: 12500 },
    visitorTips: ['Must register with Army at Thanchi checkpost.', 'Wear life jackets during Sangu river engine boat ride.', 'Hire registered Marma local tour guide.'],
    bestTimeToVisit: 'September to November (Post monsoon water volume is staggering)',
    rating: 4.9,
    reviewsCount: 880,
    coordinates: { lat: 21.7611, lng: 92.5639 },
    popular: true,
  },
  {
    id: 'batali-hill',
    name: 'Batali Hill',
    division: 'Chattogram Division',
    district: 'Chattogram City',
    category: 'Heritage & Eco Parks',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Highest hill peak inside Chattogram city offering panoramic urban and port harbor views.',
    fullDesc: 'Batali Hill (also known as Jilapi Pahar) is the highest hill in Chattogram City, rising 280 feet. Located near Lalkhan Bazar, it features winding roads, century-old shade trees, and a 360-degree view of the city skyline, Karnaphuli River, and harbor.',
    attractions: ['Shataguru Heritage Banyan Tree', 'City Skyline & Harbor Viewpoint', 'PTP Park Gazebos', 'Evening Sunset Terrace'],
    travelRoutes: [
      { from: 'Lalkhan Bazar Circle', to: 'Batali Hill Summit', mode: 'CNG / Local Taxi', costBDT: 100, duration: '10 mins' },
    ],
    estimatedBudgetBDT: { budget: 200, midRange: 800, luxury: 2000 },
    visitorTips: ['Great short evening hill escape right inside the city.', 'Try local tea stalls at the hill base.'],
    bestTimeToVisit: 'All year round (especially early mornings and late afternoons)',
    rating: 4.4,
    reviewsCount: 780,
    coordinates: { lat: 22.3481, lng: 91.8197 },
    popular: false,
  },
  {
    id: 'nilachal',
    name: 'Nilachal Hill Viewpoint',
    division: 'Chattogram Division',
    district: 'Bandarban',
    category: 'Hill Tracts & Valleys',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Golden sunset paradise peak just 5 km from Bandarban Town with cloud gazebos.',
    fullDesc: 'Nilachal is a famous tourist spot maintained by district administration. Located 2,000 feet high, it provides sweeping views of Bandarban town below, golden hour sunsets, and colorful flower gardens on mountain crests.',
    attractions: ['Nilachal Sunset Point', 'Cloud Cafe & Resort', 'Bandarban Valley Deck', 'Bawm Handicraft Stalls'],
    travelRoutes: [
      { from: 'Bandarban Town Ghat', to: 'Nilachal Summit', mode: 'CNG / Local Taxi', costBDT: 350, duration: '15 mins' },
    ],
    estimatedBudgetBDT: { budget: 800, midRange: 2200, luxury: 5500 },
    visitorTips: ['Very easily accessible from Bandarban city without long jeep trips.', 'Visit between 4:30 PM and 6:30 PM for breathtaking sunset sky colors.'],
    bestTimeToVisit: 'September to March',
    rating: 4.8,
    reviewsCount: 1750,
    coordinates: { lat: 22.1833, lng: 92.2000 },
    popular: true,
  },
  {
    id: 'parki-beach',
    name: 'Parki Beach',
    division: 'Chattogram Division',
    district: 'Anwara',
    category: 'Beach & Coastal',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Secluded golden sandy beach surrounded by Jhau pine forests in Anwara.',
    fullDesc: 'Parki Beach is located in Anwara Upazila, across the Karnaphuli river from Chattogram city. Famous for its thick Jhau (pine tree) groves along the coastline and quiet environment away from urban rush.',
    attractions: ['Jhau Pine Forest Promenade', 'Karnaphuli River Mouth View', 'Seafood Picnic Spot', 'Sunset Beach Walks'],
    travelRoutes: [
      { from: 'Chattogram City (via Karnaphuli Tunnel)', to: 'Parki Beach', mode: 'CNG / Local Taxi', costBDT: 600, duration: '40 mins' },
    ],
    estimatedBudgetBDT: { budget: 600, midRange: 1800, luxury: 4000 },
    visitorTips: ['Now faster to reach via Bangabandhu Sheikh Mujibur Rahman Tunnel.', 'Ideal for family weekend picnics and quiet beach walks.'],
    bestTimeToVisit: 'October to March',
    rating: 4.5,
    reviewsCount: 920,
    coordinates: { lat: 22.1892, lng: 91.8025 },
    popular: false,
  },
  {
    id: 'sitakunda-eco-park',
    name: 'Sitakunda Eco Park & Botanical Garden',
    division: 'Chattogram Division',
    district: 'Sitakunda',
    category: 'Heritage & Eco Parks',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Bangladesh\'s first eco-park featuring botanical orchids, Suptadhara & Sahasradhara waterfalls.',
    fullDesc: 'Established in 2001, Sitakunda Eco Park spans 808 hectares of hilly flora and fauna. It contains rare orchid gardens, natural springs, and two famed mountain waterfalls — Suptadhara and Sahasradhara.',
    attractions: ['Suptadhara Waterfall Trail', 'Sahasradhara Waterfall Basin', 'Botanical Orchid Conservatory', 'Hillside Viewing Tower'],
    travelRoutes: [
      { from: 'Chattogram City', to: 'Sitakunda Eco Park Gate', mode: 'Bus', costBDT: 60, duration: '1 hr' },
    ],
    estimatedBudgetBDT: { budget: 400, midRange: 1200, luxury: 2800 },
    visitorTips: ['Good comfortable walking stairs to the waterfalls.', 'Bring your own snacks and water bottles.'],
    bestTimeToVisit: 'July to January',
    rating: 4.6,
    reviewsCount: 1380,
    coordinates: { lat: 22.6280, lng: 91.6660 },
    popular: false,
  },
  {
    id: 'saint-martins-island',
    name: 'Saint Martin\'s Island',
    division: 'Chattogram Division',
    district: 'Cox\'s Bazar',
    category: 'Beach & Coastal',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    shortDesc: 'Bangladesh\'s only coral island with turquoise ocean waters, coconut groves, and Chera Dwip.',
    fullDesc: 'St. Martin\'s Island is a small coral island in the northeastern part of the Bay of Bengal, about 9 km south of the tip of the Cox\'s Bazar-Teknaf peninsula. Known locally as Narikel Jinjira (Coconut Island), it features crystal water, live corals, fresh lobster, and stargazing.',
    attractions: ['Chera Dwip Coral Reef', 'West Beach Sunset Point', 'Coconut Tree Beaches', 'Fresh Coral Seafood Grills', 'Night Stargazing Deck'],
    travelRoutes: [
      { from: 'Teknaf / Cox\'s Bazar Ghat', to: 'Saint Martin\'s Pier', mode: 'Boat / Launch', costBDT: 1200, duration: '2.5 hrs luxury cruise' },
    ],
    estimatedBudgetBDT: { budget: 4000, midRange: 9000, luxury: 22000 },
    visitorTips: ['Ship services operate strictly between November and March.', 'Rent bicycles to ride around the whole island in 2 hours.', 'Visit Chera Dwip by speed boat during low tide.'],
    bestTimeToVisit: 'November to March',
    rating: 4.9,
    reviewsCount: 4200,
    coordinates: { lat: 20.6273, lng: 92.3225 },
    popular: true,
  }
];

export const CHATTOGRAM_HOTELS: Hotel[] = [
  {
    id: 'hotel-radisson-blu-chattogram',
    name: 'Radisson Blu Chattogram Bay View',
    destinationName: 'Chattogram City',
    district: 'Chattogram City',
    rating: 4.8,
    reviewsCount: 850,
    pricePerNightBDT: 14500,
    pricePerNightUSD: 125,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Infinity Pool', 'Free High-Speed Wi-Fi', 'Rooftop Lounge & Bar', 'Spa & Fitness Center', 'Complimentary Breakfast', 'Airport Shuttle'],
    roomTypes: ['Superior King Room', 'Bay View Deluxe Suite', 'Executive Lounge Suite'],
    address: 'SS Khaled Road, Lalkhan Bazar, Chattogram',
    coordinates: { lat: 22.3475, lng: 91.8210 },
    featured: true,
  },
  {
    id: 'resort-sayeman-beach',
    name: 'Sayeman Beach Resort',
    destinationName: 'Marine Drive',
    district: 'Cox\'s Bazar',
    rating: 4.9,
    reviewsCount: 1420,
    pricePerNightBDT: 12000,
    pricePerNightUSD: 105,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Oceanfront Infinity Pool', 'Private Beach Access', 'Seafood Grill BBQ', 'Free Wi-Fi', 'Spa'],
    roomTypes: ['Ocean View Deluxe', 'Super Deluxe Twin', 'Presidential Ocean Suite'],
    address: 'Marine Drive Road, Kolatoli, Cox\'s Bazar',
    coordinates: { lat: 21.4172, lng: 91.9805 },
    featured: true,
  },
  {
    id: 'sajek-cloud-haven-resort',
    name: 'Sajek Cloud Haven Resort',
    destinationName: 'Sajek Valley',
    district: 'Rangamati',
    rating: 4.8,
    reviewsCount: 620,
    pricePerNightBDT: 4500,
    pricePerNightUSD: 40,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Wooden Balcony Cloud View', '24/7 Hot Water', 'Traditional Bamboo BBQ Dinners', 'Free Wi-Fi'],
    roomTypes: ['Cloud View Wooden Cottage', 'Valley Horizon Room', 'Family Duplex Villa'],
    address: 'Ruilui Para, Main Helipad Road, Sajek Valley',
    coordinates: { lat: 23.3825, lng: 92.2940 },
    featured: true,
  },
  {
    id: 'nilgiri-army-resort',
    name: 'Nilgiri Hill Resort',
    destinationName: 'Nilgiri Hill Resort',
    district: 'Bandarban',
    rating: 4.9,
    reviewsCount: 930,
    pricePerNightBDT: 7000,
    pricePerNightUSD: 60,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['360-Degree Mountain Deck', 'Army Security', 'Restaurant', 'Hot Showers', 'Parking'],
    roomTypes: ['Teesta Cottage', 'Meghla Hill Villa', 'Niladri VIP Bungalow'],
    address: 'Thanchi Road, Nilgiri Peak, Bandarban',
    coordinates: { lat: 21.9167, lng: 92.3333 },
    featured: true,
  },
  {
    id: 'kaptai-lake-paradise-resort',
    name: 'Kaptai Lake Paradise Resort',
    destinationName: 'Kaptai Lake',
    district: 'Rangamati',
    rating: 4.7,
    reviewsCount: 410,
    pricePerNightBDT: 3800,
    pricePerNightUSD: 33,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    ],
    amenities: ['Private Boat Dock', 'Lake Kayaks', 'Restaurant with Fish Delicacies', 'Free Breakfast'],
    roomTypes: ['Waterfront Cottage', 'Lakeview Double Room'],
    address: 'New Market Road, Lake Drive, Rangamati',
    coordinates: { lat: 22.5850, lng: 92.2180 },
    featured: false,
  },
  {
    id: 'sitakunda-garden-resort',
    name: 'Sitakunda Green Hill Resort',
    destinationName: 'Chandranath Hill',
    district: 'Sitakunda',
    rating: 4.5,
    reviewsCount: 290,
    pricePerNightBDT: 2800,
    pricePerNightUSD: 24,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Garden Terrace', 'Free Wi-Fi', 'Tour Guide Desk', 'Restaurant'],
    roomTypes: ['Standard AC Double', 'Family Hill Suite'],
    address: 'Dhaka-Chattogram Highway, Sitakunda Gate',
    coordinates: { lat: 22.6190, lng: 91.6820 },
    featured: false,
  }
];

export const CHATTOGRAM_BLOGS: Blog[] = [
  {
    id: 'blog-sajek-cloud-guide',
    title: 'Chasing Clouds in Sajek Valley: The Complete 3-Day Backpacker Itinerary',
    subtitle: 'From Khagrachhari jeep escort to Konglak peak sunrise — everything you need to know for a dream mountain trip.',
    author: {
      name: 'Nusrat Jahan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Female Traveler & Blogger',
    },
    publishDate: 'July 28, 2026',
    category: 'Guides & Itineraries',
    destinationName: 'Sajek Valley',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    content: `Sajek Valley is often referred to as the "Roof of Chattogram Division". Standing on the balcony of a wooden cottage at Ruilui Para at 6:00 AM while white cotton clouds float right beneath your feet is a transcendent experience.

### Getting There:
1. Take an overnight AC bus from Chattogram or Dhaka to Khagrachhari.
2. At Khagrachhari Shapla Chattar, hire a registered Chander Gari (Jeep).
3. Reach Dighinala Army Camp before the 10:00 AM or 3:00 PM security convoy times.

### Top Experiences:
- **Konglak Para:** The highest point of Sajek. The 20-minute uphill trek rewards you with a 360-degree panorama of Bangladesh-India border mountain ranges.
- **Helipad Sunset:** Watch the sun set behind layers of dark blue mountain ridges while drinking fresh hilly papaya juice.
- **Bamboo Chicken:** Savor local Marma style chicken cooked inside seasoned green bamboo shafts over open embers.`,
    readTime: '6 min read',
    likes: 342,
    commentsCount: 28,
    comments: [
      { id: 'c1', userName: 'Rafiqul Islam', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', text: 'Great detailed guide! What is the average cost for hiring a full jeep?', date: '2 days ago' },
      { id: 'c2', userName: 'Nusrat Jahan', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', text: 'Hi Rafiq, a full jeep costs around ৳9,000 for 2 nights 3 days including fuel!', date: '1 day ago' },
    ],
    featured: true,
  },
  {
    id: 'blog-khoiyachora-trekking',
    title: 'Conquering the 9 Steps of Khoiyachora Waterfall in Mirsarai',
    subtitle: 'An exhilarating monsoon trekking experience through hidden stream trails and steep rock walls.',
    author: {
      name: 'Sharif Ahmed',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      role: 'Adventure Backpacker',
    },
    publishDate: 'July 15, 2026',
    category: 'Trekking & Adventure',
    destinationName: 'Khoiyachora Waterfall',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=900&q=80',
    content: `For waterfall lovers in Bangladesh, Mirsarai in Chattogram is a paradise. Khoiyachora stands out because of its incredible cascading levels.

### The Trek:
Starting from the highway near Khoiyachora high school, you walk about 30 minutes along a village dirt road before entering the dense forest stream. Walking barefoot or with anti-slip rubber shoes is essential as you wade through mountain water.

### Reaching Step 5 & 7:
While Step 1 has a deep swimming pool, the real beauty begins when you climb the natural mud and vine stairs on the left cliff face up to Step 3 and Step 5. The roaring sound of falling spring water creates a natural cooling mister across the canyon.`,
    readTime: '4 min read',
    likes: 215,
    commentsCount: 14,
    comments: [
      { id: 'c3', userName: 'Sabrina Roy', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', text: 'Is it safe for solo female trekkers?', date: '5 days ago' },
    ],
    featured: false,
  },
  {
    id: 'blog-patenga-food-sunset',
    title: 'Sunset & Seafood: A Local\'s Evening Guide to Patenga Beach',
    subtitle: 'How to spend a perfect evening at Chattogram\'s iconic sea promenade.',
    author: {
      name: 'Mahmudul Hasan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'Chattogram Local Guide',
    },
    publishDate: 'June 30, 2026',
    category: 'Food & Cultural Stories',
    destinationName: 'Patenga Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    content: `Patenga sea beach holds a special place in every Chattogram resident\'s heart. With the inauguration of the new sea wall promenade and Karnaphuli Tunnel, Patenga is cleaner and more scenic than ever.

Don\'t miss the hot spicy fried crab (Kakra Bhaji) served with sliced cucumber and mustard oil, followed by hot tea while watching massive international container ships enter the harbor entrance under sunset skies.`,
    readTime: '3 min read',
    likes: 188,
    commentsCount: 9,
    comments: [],
    featured: false,
  }
];

export const INITIAL_TRIPS: TripPlan[] = [
  {
    id: 'trip-sajek-2026',
    title: 'Monsoon Sajek & Kaptai Escape',
    destination: 'Sajek Valley',
    district: 'Rangamati',
    days: 3,
    budgetBDT: 12500,
    budgetUSD: 105,
    persona: 'Solo Travelers',
    status: 'Upcoming',
    startDate: '2026-08-15',
    endDate: '2026-08-18',
    itinerary: [
      { day: 1, title: 'Arrival at Khagrachhari & Scenic Convoy to Sajek', morning: 'Board early morning jeep from Khagrachhari to Dighinala Army Camp.', afternoon: 'Join Army escort at 10:00 AM. Arrive at Ruilui Para, Sajek Valley. Check in cloud cottage.', evening: 'Sunset at Sajek Helipad 1. Dinner with Bamboo Roasted Chicken.', estExpenseBDT: 4500 },
      { day: 2, title: 'Konglak Peak Trek & Hazachora Waterfalls', morning: 'Sunrise cloud viewing from cottage balcony. Early trek to Konglak Para summit (highest Sajek peak).', afternoon: 'Visit Hazachora Waterfall near Dighinala road for a refreshing spring dip.', evening: 'Stargazing at Helipad 2 with local hot ginger tea.', estExpenseBDT: 2500 },
      { day: 3, title: 'Rangamati Boat Cruise on Kaptai Lake', morning: 'Descend hill drive to Rangamati Town.', afternoon: 'Hire motorboat at Kaptai Lake to visit Hanging Bridge and Shuvolong Waterfall.', evening: 'Return journey to Chattogram city.', estExpenseBDT: 5500 },
    ],
    placesVisited: ['Sajek Valley', 'Konglak Para', 'Kaptai Lake', 'Shuvolong Waterfall'],
    travelersCount: 1,
    notes: 'Carry power bank and NID photocopies for military security checkpoints.',
    createdDate: '2026-08-01',
  },
  {
    id: 'trip-cox-marine-drive',
    title: 'Weekend Marine Drive & Coral Island',
    destination: 'Marine Drive',
    district: 'Cox\'s Bazar',
    days: 4,
    budgetBDT: 22000,
    budgetUSD: 190,
    persona: 'Couples',
    status: 'Completed',
    startDate: '2026-03-10',
    endDate: '2026-03-14',
    itinerary: [
      { day: 1, title: 'Arrival & Beach Walk', morning: 'Arrive at Cox\'s Bazar Airport. Check in beach resort.', afternoon: 'Lunch at Jhaubon Restaurant.', evening: 'Sunset at Sugandha Beach.', estExpenseBDT: 6000 },
      { day: 2, title: '80km Marine Drive Open Jeep Drive', morning: 'Drive past Himchari waterfalls along ocean road.', afternoon: 'Seafood lunch at Inani Coral Beach.', evening: 'Teknaf eco park viewpoint.', estExpenseBDT: 7500 },
      { day: 3, title: 'Saint Martin\'s Island Cruise', morning: 'Board luxury ship Bay One to St. Martin\'s Island.', afternoon: 'Bicycle ride around coconut groves.', evening: 'Fresh grilled lobster dinner on West Beach.', estExpenseBDT: 8500 },
    ],
    placesVisited: ['Marine Drive', 'Inani Beach', 'Himchari', 'Saint Martin\'s Island'],
    travelersCount: 2,
    notes: 'Pre-booked cruise ship ticket 1 week early.',
    createdDate: '2026-03-01',
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Farhana Akter',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      badge: 'Verified Female Traveler',
      persona: 'Female Travelers',
    },
    title: 'Looking for female co-travelers for 3-day Bandarban Trek (Nilgiri & Boga Lake) in Sept!',
    content: 'Hello everyone! I am planning a 3-day trip to Bandarban covering Nilgiri, Chimbuk, and Boga Lake starting Sept 12. We are currently 2 female solo travelers and looking for 2 more sisters to share jeep and cottage costs safely. DM or comment if interested!',
    destinationName: 'Bandarban',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=80',
    tags: ['FemaleTravelers', 'BandarbanTrek', 'GroupFormation', 'SoloTraveler'],
    likes: 48,
    commentsCount: 16,
    date: '3 hours ago',
    type: 'CompanionSeeker',
  },
  {
    id: 'post-2',
    author: {
      name: 'Jasim Uddin Guide',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      badge: 'Certified Tour Guide',
      persona: 'Tour Guides',
    },
    title: 'Current Trail Update: Chandranath Hill & Khoiyachora Waterfall Rain Alert',
    content: 'Greeting travelers! Due to recent monsoon showers in Sitakunda & Mirsarai, the trail up to Chandranath peak has minor slippery algae steps. Please use anti-slip shoes and carry trekking poles. Water volume at Khoiyachora is magnificent right now!',
    destinationName: 'Sitakunda',
    tags: ['TrailUpdate', 'SafetyAlert', 'Sitakunda', 'Khoiyachora'],
    likes: 92,
    commentsCount: 24,
    date: 'Yesterday',
    type: 'Discussion',
  }
];

export const TRAVEL_GROUPS: TravelGroup[] = [
  {
    id: 'group-1',
    name: 'Chattogram Waterfall Trekkers',
    destination: 'Mirsarai & Sitakunda',
    district: 'Mirsarai',
    memberCount: 142,
    maxMembers: 200,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80',
    tags: ['Waterfalls', 'WeekendTreks', 'Backpackers'],
    organizer: 'Sharif Ahmed',
    dateRange: 'Every Weekend',
  },
  {
    id: 'group-2',
    name: 'Sajek Sunrise & Stargazing Club',
    destination: 'Sajek Valley',
    district: 'Rangamati',
    memberCount: 88,
    maxMembers: 120,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    tags: ['Clouds', 'Photography', 'ResortStay'],
    organizer: 'Nusrat Jahan',
    dateRange: 'Sept 15-18, 2026',
  },
  {
    id: 'group-3',
    name: 'Cox\'s Bazar Marine Drive Riders',
    destination: 'Marine Drive',
    district: 'Cox\'s Bazar',
    memberCount: 210,
    maxMembers: 300,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    tags: ['CoastalDrive', 'Couples', 'BeachVibes'],
    organizer: 'Tanvir Hossain',
    dateRange: 'Monthly Meets',
  }
];

export const DATABASE_COLLECTIONS_SCHEMA: MongoCollectionDoc[] = [
  {
    name: 'Users',
    description: 'Travelers, Tour Guides, Hotel Owners, and Admins user profile accounts.',
    count: 1420,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Unique user identification' },
      { field: 'name', type: 'String', required: true, description: 'Full user name' },
      { field: 'email', type: 'String', required: true, description: 'User primary email' },
      { field: 'phone', type: 'String', required: false, description: 'Contact phone number' },
      { field: 'role', type: 'String', required: true, description: 'User role e.g. Solo Traveler, Tour Guide, Admin' },
      { field: 'avatarUrl', type: 'String', required: false, description: 'Profile picture CDN URL' },
      { field: 'createdAt', type: 'Date', required: true, description: 'Registration timestamp' },
    ]
  },
  {
    name: 'Roles',
    description: 'System authorization roles (Foreign Tourist, Solo, Couple, Family, Guide, Hotel, Admin).',
    count: 11,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Role ID' },
      { field: 'roleName', type: 'String', required: true, description: 'Name of persona role' },
      { field: 'permissions', type: 'Array<String>', required: true, description: 'Access level permissions' },
    ]
  },
  {
    name: 'Destinations',
    description: 'Chattogram Division tourist spots, attractions, routes, and budget estimates.',
    count: 17,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Destination ID' },
      { field: 'name', type: 'String', required: true, description: 'Spot name e.g. Sajek Valley' },
      { field: 'district', type: 'String', required: true, description: 'District inside Chattogram Division' },
      { field: 'category', type: 'String', required: true, description: 'Beach, Hill Tracts, Waterfalls, Lakes' },
      { field: 'travelRoutes', type: 'Array<Object>', required: true, description: 'Detailed transport modes and costs' },
      { field: 'estimatedBudgetBDT', type: 'Object', required: true, description: 'Budget, mid-range, luxury estimates' },
    ]
  },
  {
    name: 'Hotels',
    description: 'Hotels, resorts, and wooden hill cottages across Chattogram Division.',
    count: 85,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Hotel record ID' },
      { field: 'name', type: 'String', required: true, description: 'Property title' },
      { field: 'destinationId', type: 'ObjectId', required: true, description: 'Associated destination reference' },
      { field: 'pricePerNightBDT', type: 'Number', required: true, description: 'Nightly room rate in BDT' },
      { field: 'amenities', type: 'Array<String>', required: true, description: 'Pool, Wifi, Breakfast, Ocean view' },
    ]
  },
  {
    name: 'Restaurants',
    description: 'Local food joints, seafood grills, and traditional tribal dining places.',
    count: 64,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Restaurant ID' },
      { field: 'name', type: 'String', required: true, description: 'Eatery title' },
      { field: 'specialty', type: 'String', required: true, description: 'Chittagong Mezbani Beef, Bamboo Chicken, Crab Grill' },
      { field: 'avgPriceBDT', type: 'Number', required: true, description: 'Average cost per meal' },
    ]
  },
  {
    name: 'Guides',
    description: 'Local certified hill guides, language translators, and emergency escorts.',
    count: 42,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Guide ID' },
      { field: 'name', type: 'String', required: true, description: 'Guide full name' },
      { field: 'languages', type: 'Array<String>', required: true, description: 'Bangla, English, Marma, Chakma' },
      { field: 'dailyFeeBDT', type: 'Number', required: true, description: 'Guide daily hire rate' },
    ]
  },
  {
    name: 'Trips',
    description: 'User saved and upcoming trip itineraries generated manually or via AI Planner.',
    count: 512,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Trip plan ID' },
      { field: 'userId', type: 'ObjectId', required: true, description: 'Owner traveler ID' },
      { field: 'destination', type: 'String', required: true, description: 'Target destination' },
      { field: 'days', type: 'Number', required: true, description: 'Duration in days' },
      { field: 'itinerary', type: 'Array<Object>', required: true, description: 'Day-by-day morning/noon/evening plan' },
    ]
  },
  {
    name: 'Bookings',
    description: 'Hotel room reservations and guide booking records.',
    count: 890,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Booking ID' },
      { field: 'hotelId', type: 'ObjectId', required: true, description: 'Hotel ID' },
      { field: 'status', type: 'String', required: true, description: 'Confirmed, Pending, Cancelled' },
      { field: 'totalAmountBDT', type: 'Number', required: true, description: 'Total charge in BDT' },
    ]
  },
  {
    name: 'Transportation',
    description: 'Chander Gari jeeps, CNG taxis, launch boats, and bus schedule records.',
    count: 120,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Transport route ID' },
      { field: 'mode', type: 'String', required: true, description: 'Chander Gari, CNG, Launch, Bus' },
      { field: 'fareBDT', type: 'Number', required: true, description: 'Standard fare' },
    ]
  },
  {
    name: 'Expenses',
    description: 'Detailed user expense logs tracking travel budget vs actual spent.',
    count: 2300,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Expense record ID' },
      { field: 'category', type: 'String', required: true, description: 'Transport, Stay, Food, Activity' },
      { field: 'amountBDT', type: 'Number', required: true, description: 'Cost logged' },
    ]
  },
  {
    name: 'Reviews',
    description: 'Ratings and feedback on destinations, hotels, and tour guides.',
    count: 3410,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Review ID' },
      { field: 'rating', type: 'Number', required: true, description: '1 to 5 stars' },
      { field: 'comment', type: 'String', required: true, description: 'Review body text' },
    ]
  },
  {
    name: 'Blogs',
    description: 'Travel stories, guides, and practical insights published by community.',
    count: 210,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Blog post ID' },
      { field: 'title', type: 'String', required: true, description: 'Article title' },
      { field: 'content', type: 'String', required: true, description: 'Markdown / HTML content' },
    ]
  },
  {
    name: 'Communities',
    description: 'Travel groups, regional clubs, and discussion forums.',
    count: 35,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Group ID' },
      { field: 'name', type: 'String', required: true, description: 'Community group title' },
    ]
  },
  {
    name: 'Messages',
    description: 'Direct traveler-to-traveler and traveler-to-guide chat messages.',
    count: 4890,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Message ID' },
      { field: 'senderId', type: 'ObjectId', required: true, description: 'Sender user ID' },
      { field: 'text', type: 'String', required: true, description: 'Message text' },
    ]
  },
  {
    name: 'Notifications',
    description: 'Alerts for upcoming trip departures, security weather warnings, and booking confirmations.',
    count: 1200,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Notification ID' },
      { field: 'title', type: 'String', required: true, description: 'Notification headline' },
      { field: 'read', type: 'Boolean', required: true, description: 'Read status' },
    ]
  },
  {
    name: 'Payments',
    description: 'bKash, Nagad, Visa, and Mastercard transaction logs.',
    count: 940,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Payment transaction ID' },
      { field: 'gateway', type: 'String', required: true, description: 'bKash, Nagad, Credit Card' },
      { field: 'status', type: 'String', required: true, description: 'Completed, Failed' },
    ]
  },
  {
    name: 'EmergencyReports',
    description: 'SOS alerts and Tourist Police Chattogram division emergency logs.',
    count: 12,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Report ID' },
      { field: 'location', type: 'String', required: true, description: 'GPS coordinates or spot name' },
      { field: 'status', type: 'String', required: true, description: 'Dispatched, Resolved' },
    ]
  },
  {
    name: 'Achievements',
    description: 'Badges unlocked by travelers e.g. "Cloud Explorer", "Waterfall Climber", "Coastal Cruiser".',
    count: 88,
    fields: [
      { field: '_id', type: 'ObjectId', required: true, description: 'Achievement ID' },
      { field: 'title', type: 'String', required: true, description: 'Badge title' },
    ]
  }
];

export const REST_API_ENDPOINTS: RestEndpointDoc[] = [
  {
    method: 'GET',
    endpoint: '/api/destinations',
    description: 'Retrieve all Chattogram Division destinations with filters by district or category.',
    sampleParams: '?district=Rangamati&category=Hill Tracts & Valleys',
  },
  {
    method: 'GET',
    endpoint: '/api/hotels',
    description: 'Search and filter hotels by destination, price range, ratings, and amenities.',
    sampleParams: '?destination=Sajek Valley&maxPrice=5000',
  },
  {
    method: 'POST',
    endpoint: '/api/plan-trip',
    description: 'Generate AI personalized itinerary using Gemini API based on budget, days, and persona.',
    sampleBody: JSON.stringify({ destination: 'Bandarban', days: 3, budgetBDT: 8000, persona: 'Solo Travelers' }, null, 2),
  },
  {
    method: 'GET',
    endpoint: '/api/blogs',
    description: 'Get featured travel blogs, community guides, and stories.',
  },
  {
    method: 'POST',
    endpoint: '/api/trips',
    description: 'Save new custom trip itinerary to user dashboard.',
  },
  {
    method: 'POST',
    endpoint: '/api/chat',
    description: 'Server-side Gemini AI chatbot assistant for real-time Chattogram travel inquiries.',
  }
];

/* -------------------------------------------------------------
 * Generated avatar (SVG data URI) for users without a profile image.
 * Deterministic gradient picked from the user's name.
 * ----------------------------------------------------------- */
const AVATAR_GRADIENTS: [string, string][] = [
  ['#10b981', '#0ea5e9'],
  ['#8b5cf6', '#ec4899'],
  ['#f59e0b', '#ef4444'],
  ['#14b8a6', '#6366f1'],
  ['#06b6d4', '#22c55e'],
  ['#f43f5e', '#a855f7'],
];

export const avatarFor = (name: string): string => {
  const clean = (name || 'Traveler').trim();
  const parts = clean.split(/\s+/);
  const initials = (parts[0]?.[0] || 'T') + (parts.length > 1 ? parts[parts.length - 1][0] : '');
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  const [c1, c2] = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="128" height="128" rx="64" fill="url(#g)"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="52" font-weight="700" fill="#fff">${initials.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/* -------------------------------------------------------------
 * 3D Showcase — famous attractions of Chattogram Division
 * ----------------------------------------------------------- */
export interface ShowcaseSpot {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  tagline: string;
  image: string;
  accent: string;
  destinationId?: string;
}

export const SHOWCASE_SPOTS: ShowcaseSpot[] = [
  {
    id: 'sajek',
    name: 'Sajek Valley',
    nameBn: 'সাজেক ভ্যালি',
    district: 'Rangamati',
    tagline: 'Kingdom of clouds above the hills',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    accent: '#10b981',
    destinationId: 'sajek-valley',
  },
  {
    id: 'coxs-bazar',
    name: "Cox's Bazar",
    nameBn: 'কক্সবাজার',
    district: "Cox's Bazar",
    tagline: "World's longest natural sea beach",
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    accent: '#0ea5e9',
    destinationId: 'marine-drive',
  },
  {
    id: 'patenga',
    name: 'Patenga Sea Beach',
    nameBn: 'পতেঙ্গা সমুদ্র সৈকত',
    district: 'Chattogram City',
    tagline: 'Sunsets at the Karnaphuli estuary',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=900&q=80',
    accent: '#f59e0b',
    destinationId: 'patenga-beach',
  },
  {
    id: 'saint-martin',
    name: "Saint Martin's Island",
    nameBn: 'সেন্ট মার্টিন দ্বীপ',
    district: "Cox's Bazar",
    tagline: 'The only coral island of Bangladesh',
    image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=900&q=80',
    accent: '#06b6d4',
    destinationId: 'saint-martins-island',
  },
  {
    id: 'foys-lake',
    name: "Foy's Lake",
    nameBn: 'ফয়’স লেক',
    district: 'Chattogram City',
    tagline: 'Lakeside amusement amid green hills',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80',
    accent: '#8b5cf6',
    destinationId: 'foys-lake',
  },
  {
    id: 'bandarban',
    name: 'Bandarban Hills',
    nameBn: 'বান্দরবান পাহাড়',
    district: 'Bandarban',
    tagline: 'Nilgiri, Nilachal & misty peaks',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
    accent: '#ec4899',
    destinationId: 'nilgiri',
  },
];
