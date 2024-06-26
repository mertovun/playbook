export enum EOrientation {
  HORIZONTAL,
  VERTICAL
}

export type LayoutConfig = {
  whiteNoteWidth: number;
  blackNoteWidth: number;
  whiteNoteHeight: number;
  blackNoteHeight: number;
  timelineOffset: number;
  timelineLength: number;
}

export type KeyboardRange = [NoteWithOctave, NoteWithOctave];

export enum ENote {
  C,
  C_SHARP,
  D,
  D_SHARP,
  E,
  F,
  F_SHARP,
  G,
  G_SHARP,
  A,
  A_SHARP,
  B,
}

export enum EOctave {
  _0,
  _1,
  _2,
  _3,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
}

export type NoteWithOctave = [ENote,EOctave]
