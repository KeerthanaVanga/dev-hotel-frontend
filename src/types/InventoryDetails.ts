export type InventoryDetails = {
  propertyToken: string;
  name: string;
  type: string;
  description: string;
  link: string;
  address: string;
  phone: string;
  checkInTime: string;
  checkOutTime: string;
  ratePerNight: number | null;
  images: { thumbnail: string; original: string }[];
  featuredPrices: {
    source: string;
    link: string;
    logo: string;
    remarks: string[];
    ratePerNight: number | null;
    rooms: {
      name: string;
      link: string;
      images: string[];
      ratePerNight: number | null;
    }[];
  }[];
};
