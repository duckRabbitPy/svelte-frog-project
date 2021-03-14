import { writable } from 'svelte/store';

export const products = writable([
  {
    id: 'p1',
    title: 'Frog T-shirt',
    price: '£25.00',
    description: 'Available in all sizes'
  },
  {
    id: 'p2',
    title: 'Frog Mug',
    price: '£6.00',
    description: "Sweeeeeeeeet frog mug. BUY IT."
  },
  {
    id: 'p3',
    title: 'Frog tea lights',
    price: '£4.50',
    description: "Cosy and fragrant."
  },
  {
    id: 'p4',
    title: 'Frog music album',
    price: '£8.00',
    description: "Frog lyrics and folk tunes"
  },
  {
    id: 'p5',
    title: 'FrogStation 7',
    price: '£284.00',
    description: "Modern gaming for modern times"
  },

]);
