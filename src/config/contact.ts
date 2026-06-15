/**
 * KapdaSPA — Contact & site details
 * Edit this file to update phone, email, cities, and social links across the website.
 */

export const contactConfig = {
  /** Tagline shown at the top of the homepage */
  tagline: 'Book a premium spa day for your clothes',

  /** Display email shown on site */
  email: 'kapdaspa@gmail.com',

  /** Phone number as shown to users */
  phone: '+91 9839346866',

  /** Use in tel: links (include country code, no spaces) */
  phoneTel: '+919839346866',

  /** Business address (optional) */
  address: 'KapdaSPA HQ, Lucknow, India',

  /** Cities where service is currently live */
  servingCities: ['Delhi', 'Noida', 'Gurgaon', 'Lucknow', 'Raipur'],

  /** Flat delivery charge added to every order (INR) */
  deliveryCharge: 49,

  /** Social media — set href to your profile URL or leave as # */
  social: {
    instagram: '#',
    twitter: '#',
    linkedin: '#',
    facebook: '#',
  },

  /** App store links — use # until live, then paste store URLs */
  appStores: {
    googlePlay: '#',
    appStore: '#',
  },
} as const
