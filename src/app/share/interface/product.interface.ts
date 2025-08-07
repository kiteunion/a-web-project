export interface ProductResultInterface {
  data:      DataInterface;
  code:      number;
  message:   string;
  errorInfo: ErrorInfoInterface;
}

export interface DataInterface {
  classes: ClassInterface[];
}

export interface ClassInterface {
  index?: number;
  price?: number;
  prefix?: string;
  name:       string;
  categories: CategoryInterface[];
}

export interface CategoryInterface {
  name: string;
}

export interface ErrorInfoInterface {
  details: string;
}
