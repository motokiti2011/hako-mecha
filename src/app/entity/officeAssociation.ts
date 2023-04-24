// 事業所関連性情報
export interface officeAssociation {
    // 事業所関係性区分
    officeAssociationDiv: string;
    // 事業所関係性
    officeAssociation: string;
}


export const officeAssociationData: officeAssociation[] = [
  {officeAssociationDiv: '0', officeAssociation: '本社' },
  {officeAssociationDiv: '1', officeAssociation: '拠点' },
  {officeAssociationDiv: '2', officeAssociation: '外注工場' },
  {officeAssociationDiv: '3', officeAssociation: 'パートナー工場' },
  {officeAssociationDiv: '4', officeAssociation: '部品商' },
  {officeAssociationDiv: '99', officeAssociation: 'その他' },
]