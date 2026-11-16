import timPhoto from '../assets/images/tim-bites-asli.jpeg';
import imgStroberiharga15k from '../assets/images/stroberiharga15k.jpeg';
import imgStroberiharga4k from '../assets/images/stroberiharga4k.jpeg';
import imgjusstroberi from '../assets/images/jusstroberi.jpeg';
import imgStroberiGradeA from '../assets/images/stroberigradea.jpg';
import imgStroberiGradeAB from '../assets/images/stroberigradeab.jpg';
import imgStroberiGradeABC from '../assets/images/stroberigradeabc.jpg';
import imgstroberifrozen from '../assets/images/stroberifrozen.jpeg';
import imgOutletSampingPolresSalatiga from '../assets/images/outletsampingpolressalatiga.jpeg';
import imgOutletSeberangBRINanggulan from '../assets/images/outletseberangbrinanggulan.jpeg';
import imgOutletAmbarawa from '../assets/images/outletambarawa.jpeg';
import imgTestimoni1 from '../assets/images/testimoni1.jpeg';
import imgTestimoni2 from '../assets/images/testimoni2.jpeg';
import imgTestimoni3 from '../assets/images/testimoni3.jpeg';
import imgTestimoni4 from '../assets/images/testimoni4.jpeg';
import imgTestimoni5 from '../assets/images/testimoni5.jpeg';
import imgTestimoni6 from '../assets/images/testimoni6.jpeg';
import imgTestimoni7 from '../assets/images/testimoni7.jpeg';
import imgTestimoni8 from '../assets/images/testimoni8.jpeg';
import imgTestimoni9 from '../assets/images/testimoni9.jpeg';
import imgTestimoni10 from '../assets/images/testimoni10.jpeg';
import imgKemasanStroberi from '../assets/images/kemasanstroberi.jpeg';
export interface Outlet {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  landmark: string;
  mapsUrl: string;
  openingHours: string;
  status: string;
  image: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'all' | 'fresh' | 'package' | 'frozen';
  price: number;
  originalPrice?: number;
  unit: string;
  description: string;
  badges: string[];
  rating: number;
  reviewsCount: number;
  image: string;
  isBestSeller?: boolean;
}

export interface TestimonialScreenshot {
  id: string;
  imageUrl: string;
  alt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  imageUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const BRAND_CONFIG = {
  name: "BITE'S",
  altName: "BiteBites",
  tagline: "Fresh Strawberry, Happy Every Day!",
  subheadline: "Nikmati kesegaran strawberry pilihan dengan kualitas terbaik dari kebun lokal untuk menemani hari-harimu.",
  whatsappNumber: "081818193311",
  whatsappUrl: "https://wa.me/6281818193311",
  instagramHandle: "@bites_strawberrysalatiga",
  instagramUrl: "https://www.instagram.com/bites_strawberrysalatiga?utm_source=ig_web_button_share_sheet&dlrf=ZDNlZDc0MzIxNw==",
  tiktokHandle: "@bites.fruit",
  tiktokUrl: "https://www.tiktok.com/@bites.fruit?is_from_webapp=1&sender_device=pc",
  operatingHours: "06.00 – 17.00 WIB (Buka Setiap Hari)",
  city: "Salatiga, Jawa Tengah",
};

export const OUTLETS: Outlet[] = [
  {
    id: "outlet-1",
    name: "Outlet 1 — Samping Polres Salatiga",
    shortName: "Outlet Polres Salatiga",
    tagline: "Outlet Utama & Stand Fresh",
    address: "Jl. Sukowati (Tepat di samping Polres Salatiga), Kalicacing, Kec. Sidorejo, Kota Salatiga, Jawa Tengah",
    landmark: "Samping Polres Salatiga",
    mapsUrl: "https://maps.app.goo.gl/73vit83r3MYn9Jha8",
    openingHours: "06.00 – 17.00 WIB",
    status: "Buka Setiap Hari",
    image: imgOutletSampingPolresSalatiga,
    phone: "081818193311",
  },
  {
    id: "outlet-2",
    name: "Outlet 2 — Seberang BRI Nanggulan Salatiga",
    shortName: "Outlet BRI Nanggulan",
    tagline: "Stand Fresh Harian",
    address: "Area BRI Unit Nanggulan, Jl. Raya Tingkir - Suruh, Nanggulan, Kota Salatiga, Jawa Tengah",
    landmark: "BRI Unit Nanggulan Salatiga",
    mapsUrl: "https://maps.app.goo.gl/T1UZW6tY3XUHHHSs5",
    openingHours: "06.00 – 17.00 WIB",
    status: "Buka Setiap Hari",
    image: imgOutletSeberangBRINanggulan,
    phone: "081818193311",
  },
  {
    id: "outlet-3",
    name: "Outlet 3 — Pangsar Ambarawa SDN Panjang 03",
    shortName: "Outlet Ambarawa",
    tagline: "Stand Fresh Harian",
    address: "Pangsar Ambarawa, SDN Panjang 03, Ambarawa, Kab. Semarang, Jawa Tengah",
    landmark: "Pangsar Ambarawa SDN Panjang 03",
    mapsUrl: "https://maps.app.goo.gl/qGBFgi2st61bVaAd6",
    openingHours: "07.00 – 17.00 WIB",
    status: "Buka Setiap Hari",
    image: imgOutletAmbarawa,
    phone: "081818193311",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Strawberry Pack Besar",
    category: "fresh",
    price: 16000,
    unit: "250gr",
    description: "Buah pilihan berukuran jumbo, manis segar, merah merona, dan dipetik langsung setiap pagi dari kebun lokal pilihan.",
    badges: ["FRESH", "BEST SELLER"],
    rating: 4.9,
    reviewsCount: 250,
    image: imgStroberiharga15k,
    isBestSeller: true,
  },
  {
    id: "prod-2",
    name: "Strawberry Pack Kecil",
    category: "fresh",
    price: 4000,
    unit: "66,67gr",
    description: "Pengalaman seru stroberi organik segar kualitas prima dengan tangkai utuh, manis asam seimbang dan wangi alami.",
    badges: ["FRESH", "ORGANIK"],
    rating: 4.9,
    reviewsCount: 142,
    image: imgStroberiharga4k,
    isBestSeller: false,
  },
  {
    id: "prod-3",
    name: "Jus Strawberry",
    category: "package",
    price: 12000,
    originalPrice: 12000,
    unit: "250 ml",
    description: "Paket segar favorit keluarga, porsi pas dan ramah di kantong, sangat cocok untuk camilan harian dan sajian meja makan.",
    badges: ["FRESH", "HEMAT"],
    rating: 4.9,
    reviewsCount: 210,
    image: imgjusstroberi,
    isBestSeller: true,
  },
  {
    id: "prod-4",
    name: "Stroberi Manis Grade A",
    category: "fresh",
    price: 80000,
    unit: "/kg",
    description: "Ukuran besar, bentuk sempurna, warna merah merata, kualitas terbaik.",
    badges: ["FRESH", "FAVORIT"],
    rating: 4.8,
    reviewsCount: 96,
    image: imgStroberiGradeA,
    isBestSeller: false,
  },
  {
    id: "prod-7",
    name: "Stroberi Manis Grade AB",
    category: "fresh",
    price: 70000,
    unit: "/kg",
    description: "Ukuran sedang-bentuk sempurna, warna merah merata, kualitas terbaik",
    badges: ["FRESH", "PREMIUM"],
    rating: 4.7,
    reviewsCount: 90,
    image: imgStroberiGradeAB,
    isBestSeller: false,
  },
  {
    id: "prod-5",
    name: "Stroberi Manis Grade ABC",
    category: "package",
    price: 60000,
    unit: "/kg",
    description: "Ukuran bervariasi, bentuk sempurna, warna merah menarik, kualitas terbaik.",
    badges: ["HEMAT", "BEST DEAL"],
    rating: 4.9,
    reviewsCount: 115,
    image: imgStroberiGradeABC,
    isBestSeller: true,
  },
  {
    id: "prod-6",
    name: "Strawberry Frozen",
    category: "frozen",
    price: 40000,
    unit: "/kg",
    description: "Stroberi utuh beku higienis tanpa tangkai, siap blender untuk jus segar, smoothie bowl, selai homemade, atau topping dessert.",
    badges: ["PRAKTIS", "BEKU SEGAR"],
    rating: 4.8,
    reviewsCount: 68,
    image: imgstroberifrozen,
    isBestSeller: false,
  },
];

export const ADVANTAGES = [
  {
    id: "adv-1",
    title: "Strawberry Fresh",
    subtitle: "Dipetik Langsung",
    description: "Dari kebun lokal pilihan, buah dipetik pagi hari sehingga tiba di outlet dalam kondisi segar bugar dan wangi khas stroberi.",
    icon: "Sprout",
  },
  {
    id: "adv-2",
    title: "Dipilih & Disortir",
    subtitle: "Sortir Manual Ketat",
    description: "Setiap butir stroberi melalui proses seleksi manual teliti untuk memisahkan buah cacat dan memastikan hanya buah prima yang kamu bawa pulang.",
    icon: "CheckCheck",
  },
  {
    id: "adv-3",
    title: "Harga Terjangkau",
    subtitle: "Langsung dari Sumber",
    description: "Kami memotong rantai distribusi panjang sehingga pelanggan Salatiga bisa menikmati buah stroberi berkualitas premium dengan harga bersahabat.",
    icon: "Coins",
  },
  {
    id: "adv-4",
    title: "Stok Harian Selalu Baru",
    subtitle: "Tanpa Pengawet",
    description: "Pasokan baru setiap hari tanpa sistem simpan berhari-hari. Kesegaran alami murni tanpa lilin atau bahan pengawet apa pun.",
    icon: "Clock",
  },
];

export const PROMOS = [
  {
    id: "promo-2",
    tag: "SPECIAL DEALS",
    title: "Gratis Pengantaran Area Salatiga Kota",
    desc: "Pesan minimal 3 box stroberi varian apa saja, tim BITE'S siap antar langsung ke depan rumah kamu tanpa ongkir tambahan.",
    validUntil: "Area Salatiga Kota & Sekitarnya",
    accentColor: "#F28C18",
    productPreset: "Paket Hemat Keluarga",
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-0",
    title: "Tim & Kru BITE'S Salatiga",
    caption: "Senyum hangat kru dan keluarga besar BITE'S Healthy Food siap menyambutmu di outlet.",
    category: "Tim & Outlet",
    imageUrl: timPhoto,
  },
  {
    id: "gal-1",
    title: "Stroberi Segar Berkilau",
    caption: "Warna merah cerah merona hasil panen pagi hari dengan tekstur juicy dan manis.",
    category: "Buah Segar",
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "gal-3",
    title: "Kemasan Rapi & Higienis",
    caption: "Kemas mika transparan menjaga buah tetap bernapas dan tidak mudah memar.",
    category: "Kemasan",
    imageUrl: imgKemasanStroberi,
  },
];

// Testimoni = screenshot chat asli dari pelanggan.
// Cara menambah: taruh file di src/assets/images, import di atas, lalu tambahkan satu baris di sini.
export const TESTIMONIAL_SCREENSHOTS: TestimonialScreenshot[] = [
  { id: "testi-1", imageUrl: imgTestimoni1, alt: "Screenshot testimoni pelanggan BITE'S 1" },
  { id: "testi-2", imageUrl: imgTestimoni2, alt: "Screenshot testimoni pelanggan BITE'S 2" },
  { id: "testi-3", imageUrl: imgTestimoni3, alt: "Screenshot testimoni pelanggan BITE'S 3" },
  { id: "testi-4", imageUrl: imgTestimoni4, alt: "Screenshot testimoni pelanggan BITE'S 4" },
  { id: "testi-5", imageUrl: imgTestimoni5, alt: "Screenshot testimoni pelanggan BITE'S 5" },
  { id: "testi-6", imageUrl: imgTestimoni6, alt: "Screenshot testimoni pelanggan BITE'S 6" },
  { id: "testi-7", imageUrl: imgTestimoni7, alt: "Screenshot testimoni pelanggan BITE'S 7" },
  { id: "testi-8", imageUrl: imgTestimoni8, alt: "Screenshot testimoni pelanggan BITE'S 8" },
  { id: "testi-9", imageUrl: imgTestimoni9, alt: "Screenshot testimoni pelanggan BITE'S 9" },
  { id: "testi-10", imageUrl: imgTestimoni10, alt: "Screenshot testimoni pelanggan BITE'S 10" },
];
export const FAQS: FAQItem[] = [
  {
    question: "Bagaimana cara memesan strawberry di BITE'S?",
    answer: "Sangat mudah! Kamu cukup klik tombol 'Pesan via WhatsApp' di website ini atau pilih produk dari katalog. Form pesanan akan menyusun format pesan otomatis yang langsung terhubung ke admin WhatsApp kami di 081818193311.",
    category: "Pemesanan",
  },
  {
    question: "Di mana saja lokasi outlet resmi BITE'S di Salatiga?",
    answer: "Saat ini BITE'S memiliki 3 titik outlet di Salatiga: (1) Samping Polres Salatiga, (2) Depan BRI Unit Nanggulan Salatiga, dan (3) Pangsar Ambarawa SDN Panjang 03. Semua lokasi dapat kamu buka langsung dengan Google Maps melalui menu Lokasi di website ini.",
    category: "Lokasi",
  },
  {
    question: "Jam berapa outlet BITE'S buka setiap hari?",
    answer: "Outlet kami buka setiap hari mulai pukul 06.00 hingga 17.00 WIB (selama persediaan buah hari itu masih ada). Karena stroberi dipasok segar setiap pagi, kami sarankan memesan lebih awal untuk mendapatkan varian favorit.",
    category: "Operasional",
  },
  {
    question: "Apakah bisa melakukan pengambilan sendiri (Pickup) di outlet?",
    answer: "Bisa banget! Kamu bisa pesan terlebih dahulu via WhatsApp untuk hold stok dan menentukan jam pickup di outlet pilihanmu (Polres, Nanggulan, atau Ambarawa) agar tidak kehabisan saat datang.",
    category: "Pemesanan",
  },
  {
    question: "Apakah melayani pesan antar (Delivery) ke rumah?",
    answer: "Ya, kami melayani pengiriman area Kota Salatiga dan sekitarnya melalui kurir lokal atau pengantaran khusus. Tersedia promo bebas ongkir untuk minimal pemesanan 3 box!",
    category: "Pengiriman",
  },
  {
    question: "Bagaimana cara menyimpan stroberi agar tetap segar lebih lama?",
    answer: "Simpan stroberi dalam lemari es (chiller) dalam wadah berventilasi atau wadah tertutup yang dialasi tisu kering. Cuci stroberi hanya sesaat sebelum hendak dimakan agar buah tidak cepat lembek.",
    category: "Tips Buah",
  },
];
