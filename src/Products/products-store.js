import { writable } from 'svelte/store';

export const products = writable([
  {
    id: 'p1',
    title: 'Frog T-shirt',
    price: 25,
    description: 'Available in all sizes',
    srcVar: '/images/tshirt.jpeg',
    discount: null,
  },
  {
    id: 'p2',
    title: 'Frog Mug',
    price: 6,
    description: "Sweeeeeeeeet frog mug. BUY IT",
    srcVar: 'images/mugs.webp',
    discount: null,
  },
  {
    id: 'p3',
    title: 'Frog tea lights',
    price: 4.5,
    description: "Cosy and fragrant",
    srcVar: '/images/candle.jpg',
    discount: 'SAVE 20%'
  },
  {
    id: 'p4',
    title: 'Frog music album',
    price: 8,
    description: "Frog lyrics and slap bass tunes",
    srcVar: '/images/album.jpeg',
    discount: null,
  },
  {
    id: 'p5',
    title: 'FrogStation 7',
    price: 248,
    description: "Modern gaming for modern times",
    srcVar: '/images/frogstation.jpg',
    discount: null,
  },

]);
