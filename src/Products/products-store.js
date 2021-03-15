import { writable } from 'svelte/store';

export const products = writable([
  {
    id: 'p1',
    title: 'Frog T-shirt',
    price: 25,
    description: 'Available in all sizes',
    srcVar: 'https://cdn.shopify.com/s/files/1/1649/6313/products/PPFGTS-GR-NTmain_530x@2x.jpg?v=1558683409'
  },
  {
    id: 'p2',
    title: 'Frog Mug',
    price: 6,
    description: "Sweeeeeeeeet frog mug. BUY IT",
    srcVar: 'https://img.ltwebstatic.com/images3_pi/2020/12/03/160697495119c005d9d00195e053fdf06c4c7ae50d_thumbnail_900x.webp'
  },
  {
    id: 'p3',
    title: 'Frog tea lights',
    price: 4.5,
    description: "Cosy and fragrant",
    srcVar: 'https://images-na.ssl-images-amazon.com/images/I/71PtYn4E49L._AC_SX342_.jpg'
  },
  {
    id: 'p4',
    title: 'Frog music album',
    price: 8,
    description: "Frog lyrics and slap bass tunes",
    srcVar: 'http://www.progarchives.com/progressive_rock_discography_covers/10980/cover_3211152782019_r.jpg'
  },
  {
    id: 'p5',
    title: 'FrogStation 7',
    price: 248,
    description: "Modern gaming for modern times",
    srcVar: 'https://sgwmscdnimages.azureedge.net/22/9-3-2019/20621831094smll.JPG'
  },

]);
