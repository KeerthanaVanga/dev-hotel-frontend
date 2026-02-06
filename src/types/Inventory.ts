export interface HotelInventory {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  type: string;
  amenities: string[];
  sleeps: number;
  bedrooms: number;
  bathrooms: number;
  propertyToken: string;
}
