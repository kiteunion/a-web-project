export interface FeeResultInterface {
  data:    FeesDataInterface;
  code:    number;
  message: string;
  error:   null;
}

export interface FeesDataInterface {
  baseFee:  number; // 0 - unused
  classFee: number; // 795
  classGovFee: number; // 250
  expenditureFee: number; // 475
  expenditureGovFee: number; // 230
  postalFee: number; // 95
}
