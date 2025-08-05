export interface FeeResultInterface {
  data:    FeesDataInterface;
  code:    number;
  message: string;
  error:   null;
}

export interface FeesDataInterface {
  baseFee:  number;
  classFee: number;
}
