export type Candle = {
  id: string;
  title: string;
  scent: string;
  notes: string;
  burnHours: number;
  weight: string;
  description: string;
  price: number;
  discountPercent?: number;
  stock: number;
  rating: number;
  image: string;
};

export const candles: Candle[] = [
  {
    id: "p1",
    title: "اسطوخودوس شب",
    scent: "اسطوخودوس",
    notes: "اسطوخودوس، چوب سدر، کهربا",
    burnHours: 42,
    weight: "220 گرم",
    description: "شمع آرام شب. موم طبیعی، شعله کوتاه و یکدست.",
    price: 329000,
    discountPercent: 12,
    stock: 18,
    rating: 5,
    image: "/heritage/stage-scent.jpg",
  },
  {
    id: "p2",
    title: "جشن طلایی",
    scent: "پرتقال تلخ",
    notes: "پرتقال تلخ، دارچین، وانیل",
    burnHours: 38,
    weight: "260 گرم",
    description: "برای میز تولد و شب مهمانی. شعله بلندتر، رایحه گرم.",
    price: 599000,
    stock: 4,
    rating: 4,
    image: "/heritage/stage-finish.jpg",
  },
  {
    id: "p3",
    title: "سفره برنز",
    scent: "عود و رز",
    notes: "رز، عود، مشک",
    burnHours: 50,
    weight: "310 گرم",
    description: "شمع ستونی برای سفره عقد و یلدا.",
    price: 749000,
    discountPercent: 8,
    stock: 6,
    rating: 4,
    image: "/heritage/atelier-candle.jpg",
  },
  {
    id: "p4",
    title: "موم خام کارگاه",
    scent: "عسل و موم",
    notes: "عسل، موم زنبور، وانیل آرام",
    burnHours: 36,
    weight: "200 گرم",
    description: "نزدیک‌ترین رایحه به خود کارگاه. ساده و گرم.",
    price: 279000,
    stock: 22,
    rating: 5,
    image: "/heritage/stage-melt.jpg",
  },
];

export function getCandle(id: string) {
  return candles.find((item) => item.id === id) ?? candles[0];
}
