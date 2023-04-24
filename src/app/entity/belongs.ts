export interface belongs {
  // 所属区分
  belongsDiv: string;
  // 所属名
  belongs: string;
}

/** 所属データ */
export const belongsData :belongs[] = [
  {belongsDiv: '1', belongs: '自工場'},
  {belongsDiv: '2', belongs: '関連工場'},
  {belongsDiv: '3', belongs: '外注工場'},
  {belongsDiv: '4', belongs: '外注メカニック'}
]