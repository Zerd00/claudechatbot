export const Floors = [
    'BASEMENT',
    'SEMI_BASEMENT',
    'GROUND_FLOOR',
    'MEZZANINE',
    '_1', '_2', '_3', '_4', '_5',
    '_6', '_7', '_8', '_9', '_10',
    '_11', '_12', '_13', '_14', '_15',
    '_16', '_17', '_18', '_19', '_20',
    '_21', '_22', '_23', '_24', '_25',
    '_26', '_27', '_28', '_29', '_30',
    '_31', '_32', '_33', '_34', '_35',
    '_36', '_37', '_38', '_39', '_40',
    '_41', '_42', '_43', '_44', '_45',
    '_46', '_47', '_48', '_49', '_50'
  ] as const;
  
  export type Floor = typeof Floors[number];
  