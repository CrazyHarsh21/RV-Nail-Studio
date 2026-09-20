import { NailDesign, ServiceItem } from '../types';

export const BRAND_PHONE = '6397449307';
export const BRAND_PHONE_INTL = '916397449307';
export const BRAND_INSTAGRAM = 'rv.nails_art_by_rohit';
export const BRAND_INSTAGRAM_URL = 'https://www.instagram.com/rv.nails_art_by_rohit';

export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = 'Hi RV Nails Art by Rohit, I would like to book a nail appointment.';
  const message = customMessage || defaultMsg;
  return `https://wa.me/${BRAND_PHONE_INTL}?text=${encodeURIComponent(message)}`;
}

export const HERO_IMAGE = '/images/aesthetic_hero_nails_1789826243580.jpg';
export const ARTIST_IMAGE = '/images/rohit_artist_portrait_1789826210402.jpg';
export const ARTIST_CRAFTING_IMAGE = '/images/rohit_crafting_action_1789826228998.jpg';

export const NAIL_DESIGNS: NailDesign[] = [
  {
    id: 'prism-multiverse',
    name: 'Prism Multiverse',
    slug: 'prism-multiverse',
    subtitle: 'Vibrant Multi-Tone Cobalt, Ruby & Pastel Lilac Chroma',
    description: 'A show-stopping multi-chromatic palette combining royal cobalt blue, radiant magenta ruby, soft lavender marble, and sunset coral glaze with 24k gold leaf flakes.',
    palette: ['#1E40AF', '#BE185D', '#8B5CF6', '#10B981', '#F59E0B'],
    shape: 'Almond Sculpted',
    finish: 'Mirror Glaze Multi-Chroma',
    wearDuration: '4 Weeks',
    image: '/images/multicolor_nail_set_1789822976547.jpg',
    tags: ['Multi-Color', 'Trending Art', 'Chroma Shift'],
    popular: true,
  },
  {
    id: 'rainbow-chrome',
    name: 'Rainbow Chrome Glaze',
    slug: 'rainbow-chrome',
    subtitle: 'Iridescent Holographic Pastel Rainbow Spectrum',
    description: 'Each sculpted fingertip features an individual pearlescent pastel rainbow tone—lilac iris, sky blue, pistachio mint, peach shimmer, and blossom pink with 3D liquid droplets.',
    palette: ['#C084FC', '#60A5FA', '#34D399', '#F472B6', '#FBBF24'],
    shape: 'Coffin Stiletto',
    finish: 'Prismatic Mirror Glaze',
    wearDuration: '3 to 4 Weeks',
    image: '/images/rainbow_chrome_nails_1789822991773.jpg',
    tags: ['Pastel Rainbow', 'Chrome Powder', '3D Water Drop'],
    popular: true,
  },
  {
    id: 'vivid-gemstones',
    name: 'Vivid Gemstones',
    slug: 'vivid-gemstones',
    subtitle: 'Royal Sapphire, Emerald Jade & Amethyst Swirl',
    description: 'Deep royal sapphire blue paired with swirling emerald green jade, vibrant violet aura, and hand-gilded 24k gold veins creating an opulent multi-jewel statement.',
    palette: ['#1D4ED8', '#047857', '#7C3AED', '#B91C1C', '#E5C478'],
    shape: 'Stiletto Luxury',
    finish: 'High-Gloss Liquid Quartz',
    wearDuration: '4 Weeks',
    image: '/images/vibrant_gem_nails_1789823007715.jpg',
    tags: ['Jeweled', 'Multi-Gem', 'Hand-Painted'],
    popular: true,
  },
  {
    id: 'nature-touch',
    name: 'Emerald & Gold Botanica',
    slug: 'nature-touch',
    subtitle: 'Vivid Forest Jade with Real 24K Leaf Inlays',
    description: 'Lush vivid emerald green and soft mint tones interwoven with pure 24K gold foil and organic floral vines over a milky translucent glass foundation.',
    palette: ['#047857', '#10B981', '#D4AF37', '#FAF7F2'],
    shape: 'Oval Natural',
    finish: 'Milky Glass Gel Lacquer',
    wearDuration: '3 to 4 Weeks',
    image: '/images/nail_nature_touch_1789820655987.jpg',
    tags: ['Emerald Green', 'Gold Foil', 'Botanical Art'],
  },
  {
    id: 'heart-vibe',
    name: 'Noir & Rose Hearts',
    slug: 'heart-vibe',
    subtitle: 'Dramatic Noir with Romantic Micro Detailing',
    description: 'Bold midnight noir base with delicate rose pink and cream heart detailing, sealed under scratch-proof glass-sheen gel lacquer.',
    palette: ['#0B0B0D', '#F4BAC0', '#FAF7F2', '#E5C478'],
    shape: 'Almond Sculpted',
    finish: 'Ultra-Gloss Gel & Soft Velvet',
    wearDuration: '3 to 4 Weeks',
    image: '/images/nail_heart_vibe_1789820617422.jpg',
    tags: ['Romantic Noir', 'Fine Line', 'Hand-Painted'],
  },
  {
    id: 'glitter-elegance',
    name: 'Champagne Shimmer Cascades',
    slug: 'glitter-elegance',
    subtitle: 'Champagne Shimmer & Translucent Porcelain',
    description: 'Cascading champagne gold and rose-gold micro-glitter ombré over a sheer porcelain base, catching radiant light with every gesture.',
    palette: ['#E5C478', '#D8C7B8', '#FAF7F2', '#A88438'],
    shape: 'Coffin Stiletto',
    finish: 'Crystalline Shimmer Topcoat',
    wearDuration: '4 Weeks',
    image: '/images/nail_glitter_elegance_1789820636074.jpg',
    tags: ['Luxury Sparkle', 'Cocktail Glam', 'Ombré'],
  },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'manicure-pedicure',
    title: 'MANICURE & PEDICURE',
    subtitle: 'Deluxe cuticle therapy, Russian dry technique, scrub & massage',
    duration: '60 - 75 mins',
    priceStart: '₹799',
    description: 'A comprehensive medical-grade cuticle cleaning, nail bed nourishment, organic exfoliator, warm towel therapy, and flawless lacquer finish.',
    features: ['Russian Cuticle Care', 'Deep Hydration Mask', 'Organic Sugar Scrub', 'High-Gloss Top Coat'],
    icon: 'Sparkles',
    recommendedFor: 'Routine self-care and immaculate hand presentation.',
  },
  {
    id: 'nail-art-design',
    title: 'NAIL ART & DESIGN',
    subtitle: 'Bespoke hand-painted freehand art, foils, 3D gems & chrome',
    duration: '75 - 100 mins',
    priceStart: '₹1,199',
    description: 'Custom artistic styling tailored to your outfit or mood. Rohit crafts intricate miniature designs, metallic chromes, floral motifs, and geometric lines.',
    features: ['Freehand Detailing', 'Liquid Chrome & Mirror Glaze', '3D Charm Application', 'Encapsulated Dried Flora'],
    icon: 'Palette',
    recommendedFor: 'Parties, birthdays, photoshoots, and art lovers.',
  },
  {
    id: 'nail-extensions',
    title: 'NAIL EXTENSIONS (GEL / ACRYLIC)',
    subtitle: 'Custom sculpted tips, builder gel overlays & seamless infills',
    duration: '90 - 120 mins',
    priceStart: '₹1,599',
    description: 'Sculpted length with zero damage to the natural nail. Choose between lightweight soft gel extensions or resilient acrylic foundations shaped to perfection.',
    features: ['Custom Tip Shaping (Almond, Coffin, Stiletto)', 'Odorless Hypoallergenic Gel', 'No-Lifting Edge Seal', 'Long-Lasting 4+ Weeks'],
    icon: 'Scissors',
    recommendedFor: 'Short or brittle nails needing dramatic length and strength.',
  },
  {
    id: 'bridal-nails',
    title: 'BRIDAL NAILS & SPECIAL OCCASIONS',
    subtitle: 'Couture wedding nails matched to bridal lehengas & gowns',
    duration: '120 mins',
    priceStart: '₹2,499',
    description: 'The ultimate royal manicure for your biggest day. Includes pre-wedding swatch consultation, Swarovski crystal placement, and matching wedding jewelry tones.',
    features: ['Swarovski Crystal Inlays', 'Lehenga Color Match', '24K Gold Dust Accents', 'Complimentary Ring Finger Detailing'],
    icon: 'Crown',
    recommendedFor: 'Brides, bridesmaids, sangeet, and gala galas.',
  },
  {
    id: 'nail-care-treatments',
    title: 'NAIL CARE & TREATMENTS',
    subtitle: 'Keratin restoration, IBX repair & gentle soak-off removal',
    duration: '45 - 60 mins',
    priceStart: '₹699',
    description: 'Restore thin, peeling, or damaged nails with intense peptide and keratin treatments that rebuild natural nail protein bonds.',
    features: ['IBX Protein Rebuilding', 'Non-Damaging Gentle Soak Off', 'Keratin Infused Oils', 'Calcium Strengthening Seal'],
    icon: 'HeartHandshake',
    recommendedFor: 'Nail recovery after prolonged extensions or brittle nails.',
  },
];

export const TIME_SLOTS = [
  '11:00 AM – 12:00 PM',
  '1:00 PM – 2:00 PM',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM',
  '5:00 PM – 6:00 PM',
  '6:00 PM – 7:00 PM',
  '7:00 PM – 8:00 PM',
  '8:00 PM – 9:00 PM',
];

export const WHY_CHOOSE_US = [
  {
    id: 'hygiene',
    title: 'CLEAN & HYGIENIC',
    subtitle: 'Hospital-Grade Sterilization',
    description: 'Your health is non-negotiable. Every metal tool undergoes rigorous multi-stage autoclave sterilization, and buffers and files are strictly single-use.',
    icon: 'ShieldCheck',
  },
  {
    id: 'products',
    title: 'PREMIUM PRODUCTS',
    subtitle: 'Cruelty-Free & HEMA-Free',
    description: 'We exclusively apply premium European, Japanese, and Korean imported gel systems, ensuring high pigment density, radiant shine, and zero natural plate thinning.',
    icon: 'Gem',
  },
  {
    id: 'friendly',
    title: 'FRIENDLY SERVICE',
    subtitle: 'One-on-One Personalized Care',
    description: 'Every session begins with a collaborative consultation with Rohit. Relax in an unhurried, comfortable luxury environment tailored to your comfort.',
    icon: 'Smile',
  },
  {
    id: 'satisfaction',
    title: 'YOUR SATISFACTION OUR PRIORITY',
    subtitle: 'Durability & Touch-Up Promise',
    description: 'We stand firmly behind the quality and artistry of every set. Enjoy our 7-day complimentary touch-up guarantee for effortless peace of mind.',
    icon: 'HeartHandshake',
  },
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: '/images/nail_heart_vibe_1789820617422.jpg',
    caption: 'Noir & blush micro-hearts for our weekend muse ✨ @rv.nails_art_by_rohit',
    likes: '842',
    comments: '46',
  },
  {
    id: 'ig-2',
    image: '/images/nail_glitter_elegance_1789820636074.jpg',
    caption: 'Champagne gold ombré cascade. Pure luxury at your fingertips 🥂',
    likes: '1,290',
    comments: '88',
  },
  {
    id: 'ig-3',
    image: '/images/nail_nature_touch_1789820655987.jpg',
    caption: 'Emerald botanicals + 24k foil leaf accents for summer freshness 🌿',
    likes: '974',
    comments: '62',
  },
  {
    id: 'ig-4',
    image: '/images/nail_minimal_love_1789820673994.jpg',
    caption: 'Clean girl Korean jelly aesthetic with delicate heart accents 🤍',
    likes: '1,450',
    comments: '94',
  },
  {
    id: 'ig-5',
    image: '/images/nail_classic_charm_1789820690399.jpg',
    caption: 'Royal plum velvet + caviar micro-pearls for an evening affair 👑',
    likes: '1,120',
    comments: '73',
  },
  {
    id: 'ig-6',
    image: '/images/hero_nail_art_1789820586242.jpg',
    caption: 'Artistry in motion. Every nail is a canvas crafted with love by Rohit 💅',
    likes: '2,310',
    comments: '135',
  },
];
