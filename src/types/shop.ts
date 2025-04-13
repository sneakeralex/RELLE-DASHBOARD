// Shop type definition based on relle_shop table
export interface Shop {
  id: number;
  name: string;
  address: string;
  coverImg: string;
  longitude: number;
  latitude: number;
  openDate: string;
  introduce: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

// Shop status enum
export enum ShopStatus {
  Inactive = 0,
  Active = 1,
  Maintenance = 2,
  Closed = 3
}
