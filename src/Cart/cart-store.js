import { writable } from 'svelte/store';

const cart = writable([
  {
    id: 's8',
    title: 'Frog wallpaper download',
    price: 'FREE'
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
  }
};

export default customCart;
