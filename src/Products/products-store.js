import { writable } from 'svelte/store';

export const products = writable([
  {
    id: 'p1',
    title: 'Frog T-shirt',
    price: 25,
    description: 'Available in all sizes',
    srcVar: 'https://www.thebearhug.com/images/the-bearhug-co-ltd-laser-frog-t-shirt-p958-8377_medium.jpg',
    discount: null,
  },
  {
    id: 'p2',
    title: 'Frog Mug',
    price: 6,
    description: "Sweeeeeeeeet frog mug. BUY IT",
    srcVar: 'https://img.ltwebstatic.com/images3_pi/2020/12/03/160697495119c005d9d00195e053fdf06c4c7ae50d_thumbnail_900x.webp',
    discount: null,
  },
  {
    id: 'p3',
    title: 'Frog tea lights',
    price: 4.5,
    description: "Cosy and fragrant",
    srcVar: 'https://i.etsystatic.com/12941269/r/il/a9c128/998648306/il_1588xN.998648306_13wj.jpg',
    discount: 'SAVE 20%'
  },
  {
    id: 'p4',
    title: 'Frog music album',
    price: 8,
    description: "Frog lyrics and slap bass tunes",
    srcVar: 'http://www.progarchives.com/progressive_rock_discography_covers/10980/cover_3211152782019_r.jpg',
    discount: null,
  },
  {
    id: 'p5',
    title: 'FrogStation 7',
    price: 248,
    description: "Modern gaming for modern times",
    srcVar: 'https://www.decalgirl.com/assets/items/xboc/800/xboc-frog.5.jpg',
    discount: null,
  },

]);
