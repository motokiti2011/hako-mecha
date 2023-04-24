export interface slipVehicle {
  // 伝票番号
  slipNo: string;
  // 車両名
  vehicleName: string;
  // 伝票車両分類区分
  slipVehicleClassDiv: string;
  // 車両区分
  vehicleDiv: string;  
  // 車両番号
  vehicleNo: string| null;
  // 車台番号
  chassisNo: string| null;
  // 指定類別
  designatedClassification: string| null;
  // カラー
  coler: string| null;
  // カラーNo.
  colerNo: string| null;
  // 初年度登録日
  firstRegistrationDate: string| null;
  // 車検満了日
  inspectionExpirationDate: string| null;
  // メーカー
  vehicleMaker: string| null;
  // 車両形状
  vehicleForm: string| null;
}



export const initSlipVehicle: slipVehicle = {
    // ユーザーID
    slipNo: '',
    // 車両名
    vehicleName: '',
    // 伝票車両分類区分
    slipVehicleClassDiv: '',
    // 車両区分
    vehicleDiv: '',
    // 車両番号
    vehicleNo: null,
    // 車台番号
    chassisNo: null,
    // 指定類別
    designatedClassification:null,
    // カラー
    coler: null,
    // カラーNo.
    colerNo: null,
    // 初年度登録日
    firstRegistrationDate:null,
    // 車検満了日
    inspectionExpirationDate: null,
    // メーカー
    vehicleMaker: null,
    // 車両形状
    vehicleForm: null
}