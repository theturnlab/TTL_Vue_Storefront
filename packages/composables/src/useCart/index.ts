import {
  Context,
  useCartFactory,
  UseCartFactoryParams
} from '@vue-storefront/core';

import { Cart, CartItem, CrProduct, CrAppliedDiscount } from '../../../api-client/src/types/GraphQL';
//

const params: UseCartFactoryParams<Cart, CartItem, CrProduct, CrAppliedDiscount> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  load: async (context: Context, { customQuery }) => {
    return await context.$kibo.api.getCart(null, customQuery).data.getCart;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    await context.$kibo.api.addToCart({ product, quantity }, customQuery);
    return await context.$kibo.api.getCart(null, customQuery).data.getCart;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: async (context: Context, { currentCart, product, customQuery }) => {
    await context.$kibo.api.removeFromCart({ product });
    return await context.$kibo.api.getCart(null, customQuery).data.getCart;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateItemQty: async (context: Context, { currentCart, product, quantity, customQuery }) => {
    await context.$kibo.api.updateItemQty({ product, quantity });
    return await context.$kibo.api.getCart(null, customQuery).data.getCart;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clear: async (context: Context, { currentCart }) => {
    console.log('Mocked: useCart.clear');
    return {};
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.applyCoupon');
    return {
      updatedCart: {},
      updatedCoupon: {}
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeCoupon: async (context: Context, { currentCart, couponCode, customQuery }) => {
    console.log('Mocked: useCart.removeCoupon');
    return {
      updatedCart: {}
    };
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isInCart: (context: Context, { currentCart, product }) => {
    console.log('Mocked: useCart.isInCart');
    return false;
  }
};

export default useCartFactory<Cart, CartItem, CrProduct, CrAppliedDiscount>(params);
