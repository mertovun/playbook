
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


export let orientation: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL';

export let layoutConfig = orientation === 'HORIZONTAL' ? horizontalLayoutConfig : verticalLayoutConfig;
