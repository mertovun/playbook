
const horizontalLayoutConfig = {
  whiteNoteWidth: 20,
  blackNoteWidth: 12,
  whiteNoteHeight: 100,
  blackNoteHeight: 60
};

const verticalLayoutConfig = {
  whiteNoteWidth: 10,
  blackNoteWidth: 6,
  whiteNoteHeight: 50,
  blackNoteHeight: 30
};


export const orientation: 'HORIZONTAL' | 'VERTICAL' = 'VERTICALS';

export const layoutConfig = orientation === 'HORIZONTAL' ? horizontalLayoutConfig : verticalLayoutConfig;
