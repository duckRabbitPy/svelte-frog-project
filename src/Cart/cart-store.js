import { writable } from 'svelte/store';

//default item in cart
const cart = writable([
  {
    id: 's8',
    title: 'Frog wallpaper download',
    price: 0.00,
  },
]);


const customCart = {
  subscribe: cart.subscribe,
  addItem: item => {
    cart.update(items => {
      if (items.find(i => i.id === item.id)) {
        return [...items];
      }
      return [...items, item];
    });
  },
  removeItem: id => {
    cart.update(items => {
      return items.filter(i => i.id !== id);
    });
  },
};


export const total = writable(0);

export default customCart;
