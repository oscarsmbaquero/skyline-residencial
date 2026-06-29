export interface Flat {
  id: string;
  block: string;
  floor: number;
  letter: string;
  floorLabel: string;
  name: string;
  dorms: number;
  baths: number;
  util: number;
  built: number;
  terrace: number;
  parking: string;
  storage: string;
  orientation: string;
  status: number;
  statusLabel: string;
  statusKey: string;
  price: number;
}

export interface Summary {
  total: number;
  avail: number;
  reserv: number;
  sold: number;
}
