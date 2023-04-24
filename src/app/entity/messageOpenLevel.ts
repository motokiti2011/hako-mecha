export interface messageOpenLevel {
  // id
  openLevel: string;
  // VALUE
  openLevelValue: string;
}

export const openLevel: messageOpenLevel[] = [
  {openLevel: '1', openLevelValue: 'OPEN'},
  {openLevel: '2', openLevelValue: 'PARTIALLYOPEN'},
  {openLevel: '3', openLevelValue: 'PRIVATE'}
]
