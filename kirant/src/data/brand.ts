/** Site brand — unique identity (not tied to the reference hotel). */
export const brand = {
  name: "Ashvara",
  nameUpper: "ASHVARA",
  tagline: "Where the peaks teach you to linger",
  location: "Nagarkot, Nepal",
  region: "Nagarkot",
  country: "Nepal",
  email: "hello@ashvara.hotel",
  phone: "+977 9801234567",
  phoneHref: "tel:+9779801234567",
  supportPhone: "+977 9801234567",
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",
  copyrightYear: 2026,
} as const;

export type Brand = typeof brand;
