export interface prefectures {
  // 都道府県名
  prefectures: string;
  // ID
  id: number;
  // X左
  xleft: number;
  // X右
  xright: number;
  // Y上
  ytop:number;
  // Y下
  ybottom: number;
  // data
  data: number;
  // 都道府県コードコード
  code: string;
}

/**
 * 都道府県データ
 */
export const prefecturesCoordinateData: prefectures[] = [
  {prefectures: '北海道', id: 1, xleft: 510, xright: 695, ytop:5, ybottom: 124, data:1, code: '01' },
  {prefectures: '北海道', id: 1, xleft: 510, xright: 560, ytop:123, ybottom: 140, data:2, code: '01' },
  {prefectures: '青森県', id: 2, xleft: 510, xright: 645, ytop:158, ybottom: 198, data:1, code: '02' },
  {prefectures: '岩手県', id: 3, xleft: 578, xright: 645, ytop:201, ybottom: 250, data:1, code: '03' },
  {prefectures: '宮城県', id: 4, xleft: 578, xright: 645, ytop:253, ybottom: 301, data:1, code: '04'},
  {prefectures: '秋田県', id: 5, xleft: 510, xright: 576, ytop:202, ybottom: 250, data:1, code: '05'},
  {prefectures: '山形県', id: 6, xleft: 510, xright: 576, ytop:254, ybottom: 285, data:1, code: '06'},
  {prefectures: '山形県', id: 6, xleft: 535, xright: 576, ytop:284, ybottom: 302, data:2, code: '06'},
  {prefectures: '福島県', id: 7, xleft: 535, xright: 645, ytop:305, ybottom: 352, data:1, code: '07'},
  {prefectures: '茨木県', id: 8, xleft: 613, xright: 645, ytop:357, ybottom: 422, data:1, code: '08'},
  {prefectures: '栃木県', id: 9, xleft: 562, xright: 610, ytop:357, ybottom: 581, data:1, code: '09'},
  {prefectures: '群馬県', id: 10, xleft: 510, xright: 559, ytop:357, ybottom: 581, data:1, code: '10'},
  {prefectures: '埼玉県', id: 11, xleft: 510, xright: 610, ytop:407, ybottom: 447, data:1, code: '11'},
  {prefectures: '千葉県', id: 12, xleft: 613, xright: 645, ytop:425, ybottom: 542, data:1, code: '12'},
  {prefectures: '東京都', id: 13, xleft: 535, xright: 610, ytop:450, ybottom: 473, data:1, code: '13'},
  {prefectures: '東京都', id: 13, xleft: 535, xright: 610, ytop:474, ybottom: 490, data:2, code: '13'},
  {prefectures: '神奈川県', id: 14, xleft: 535, xright: 610, ytop:493, ybottom: 541, data:1, code: '14'},
  {prefectures: '神奈川県', id: 14, xleft: 510, xright: 534, ytop:493, ybottom: 541, data:2, code: '14'},
  {prefectures: '新潟県', id: 15, xleft: 467, xright: 534, ytop:305, ybottom: 353, data:1, code: '15'},
  {prefectures: '新潟県', id: 15, xleft: 510, xright: 534, ytop:288, ybottom: 304, data:2, code: '15'},
  {prefectures: '富山県', id: 16, xleft: 416, xright: 465, ytop:305, ybottom: 353, data:1, code: '16'},
  {prefectures: '石川県', id: 17, xleft: 382, xright: 413, ytop:305, ybottom: 353, data:1, code: '17'},
  {prefectures: '福井県', id: 18, xleft: 347, xright: 413, ytop:374, ybottom: 405, data:1, code: '18'},
  {prefectures: '福井県', id: 18, xleft: 382, xright: 413, ytop:357, ybottom: 346, data:2, code: '18'},
  {prefectures: '山梨県', id: 19, xleft: 484, xright: 533, ytop:459, ybottom: 491, data:1, code: '19'},
  {prefectures: '長野県', id: 20, xleft: 450, xright: 508, ytop:356, ybottom: 491, data:1, code: '20'},
  {prefectures: '長野県', id: 20, xleft: 450, xright: 482, ytop:357, ybottom: 473, data:2, code: '20'},
  {prefectures: '岐阜県', id: 21, xleft: 416, xright: 448, ytop:356, ybottom: 491, data:1, code: '21'},
  {prefectures: '静岡県', id: 22, xleft: 467, xright: 508, ytop:494, ybottom: 542, data:1, code: '22'},
  {prefectures: '静岡県', id: 22, xleft: 509, xright: 534, ytop:519, ybottom: 542, data:2, code: '22'},
  {prefectures: '愛知県', id: 23, xleft: 416, xright: 466, ytop:458, ybottom: 576, data:1, code: '23'},
  {prefectures: '三重県', id: 24, xleft: 318, xright: 413, ytop:458, ybottom: 576, data:1, code: '24'},
  {prefectures: '滋賀県', id: 25, xleft: 318, xright: 414, ytop:408, ybottom: 455, data:1, code: '25'},
  {prefectures: '京都府', id: 26, xleft: 313, xright: 345, ytop:372, ybottom: 457, data:1, code: '26'},
  {prefectures: '京都府', id: 26, xleft: 346, xright: 380, ytop:408, ybottom: 457, data:2, code: '26'},
  {prefectures: '大阪府', id: 27, xleft: 313, xright: 345, ytop:459, ybottom: 517, data:1, code: '27'},
  {prefectures: '兵庫県', id: 28, xleft: 278, xright: 311, ytop:373, ybottom: 473, data:1, code: '28'},
  {prefectures: '奈良県', id: 29, xleft: 347, xright: 380, ytop:459, ybottom:542, data:1, code: '29'},
  {prefectures: '和歌山県', id: 30, xleft: 314, xright: 345, ytop:520, ybottom:576, data:1, code: '30'},
  {prefectures: '和歌山県', id: 30, xleft: 346, xright: 380, ytop:544, ybottom:576, data:2, code: '30'},
  {prefectures: '鳥取県', id: 31, xleft: 210, xright: 277, ytop:373, ybottom:422, data:1, code: '31'},
  {prefectures: '島根県', id: 32, xleft: 210, xright: 243, ytop:373, ybottom:422, data:1, code: '32'},
  {prefectures: '岡山県', id: 33, xleft: 245, xright: 277, ytop:426, ybottom:473, data:1, code: '33'},
  {prefectures: '広島県', id: 34, xleft: 210, xright: 243, ytop:426, ybottom:473, data:1, code: '34'},
  {prefectures: '山口県', id: 35, xleft: 175, xright: 208, ytop:426, ybottom:473, data:1, code: '35'},
  {prefectures: '徳島県', id: 36, xleft: 236, xright: 293, ytop:536, ybottom:576, data:1, code: '36'},
  {prefectures: '香川県', id: 37, xleft: 236, xright: 293, ytop:493, ybottom:534, data:1, code: '37'},
  {prefectures: '愛媛県', id: 38, xleft: 175, xright: 234, ytop:493, ybottom:534, data:1, code: '38'},
  {prefectures: '高知県', id: 39, xleft: 175, xright: 234, ytop:536, ybottom:576, data:1, code: '39'},
  {prefectures: '福岡県', id: 40, xleft: 73, xright: 123, ytop:373, ybottom:447, data:1, code: '40'},
  {prefectures: '福岡県', id: 40, xleft: 124, xright: 157, ytop:373, ybottom:404, data:2, code: '40'},
  {prefectures: '佐賀県', id: 41, xleft: 39, xright: 72, ytop:373, ybottom:447, data:1, code: '41'},
  {prefectures: '長崎県', id: 42, xleft: 5, xright: 37, ytop:373, ybottom:447, data:1, code: '42'},
  {prefectures: '熊本県', id: 43, xleft: 73, xright: 123, ytop:451, ybottom:525, data:1, code: '43'},
  {prefectures: '大分県', id: 44, xleft: 125, xright: 157, ytop:408, ybottom:465, data:1, code: '44'},
  {prefectures: '宮崎県', id: 45, xleft: 125, xright: 157, ytop:468, ybottom:525, data:1, code: '45'},
  {prefectures: '鹿児島県', id: 46, xleft: 73, xright: 157, ytop:528, ybottom:576, data:1, code: '46'},
  {prefectures: '沖縄県', id: 47, xleft: 73, xright: 106, ytop:595, ybottom:645, data:1, code: '47'},
];


export interface cityDate {
  // ID
  id: string;
  // 都道府県コードコード
  name: string;
}

export interface cityApiDate {
  // ID
  status: string;
  // 都道府県コードコード
  data: cityDate[];
}
