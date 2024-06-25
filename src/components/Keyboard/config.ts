
const horizontalLayoutConfig = {
  whiteNoteWidth: 20,
  blackNoteWidth: 12,
  whiteNoteHeight: 100,
  blackNoteHeight: 60
};

const verticalLayoutConfig = {
  whiteNoteWidth: 15,
  blackNoteWidth: 9,
  whiteNoteHeight: 75,
  blackNoteHeight: 45
};


export const orientation: 'HORIZONTAL' | 'VERTICAL' = 'VERTICALS';

export const layoutConfig = orientation === 'HORIZONTAL' ? horizontalLayoutConfig : verticalLayoutConfig;
