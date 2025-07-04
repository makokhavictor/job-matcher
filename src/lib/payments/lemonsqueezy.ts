// lib/lemonsqueezy.js
import { lemonSqueezySetup, listProducts, listVariants } from '@lemonsqueezy/lemonsqueezy.js';

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  onError: (error) => {
    console.error('Lemon Squeezy Error:', error);
  },
});

export { lemonSqueezySetup, listProducts, listVariants };