export interface CountriesResultInterface {
  data:    CountriesInterface;
  code:    number;
  message: string;
  error:   null;
}

export interface CountriesInterface {
  items:         CountriesItem[];
  allItemsCount: number;
}

export interface CountriesItem {
  Code:         string;
  Code2:        string;
  Name:         string;
  SearchRegion: SearchRegion;
  id:           number;
}

export enum SearchRegion {
  Au = "au",
}
