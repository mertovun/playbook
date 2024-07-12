import { create } from 'zustand';
import { ENote, EOctave, EOrientation, KeyboardRange, LayoutConfig } from '../interface';
import { noteToString } from '../utils/note';

const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];

const colorScheme = {
  keyboardWhiteNote: '#e9e9e9',
  keyboardBlackNote: '#020202',
  timelineWhiteNote: '#272727',
  timelineBlackNote: '#222222',
}

const ASPECT_RATIO = 1.6;

const horizontalLayout: LayoutConfig = {
  whiteNoteWidth: 15 * ASPECT_RATIO,
  blackNoteWidth: 9 * ASPECT_RATIO,
  whiteNoteHeight: 75 * ASPECT_RATIO,
  blackNoteHeight: 45 * ASPECT_RATIO,
  timelineOffset: 10
};

const verticalLayout: LayoutConfig = {
  whiteNoteWidth: 15,
  blackNoteWidth: 9,
  whiteNoteHeight: 75,
  blackNoteHeight: 45,
  timelineOffset: 10
};

const whiteNotes = [ENote.C, ENote.D, ENote.E, ENote.F, ENote.G, ENote.A, ENote.B];

interface PianoRollLayoutState {
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
  pianoRollWidth: number;
  pianoRollLength: number;
  timelineX: number;
  timelineY: number;
  timelineHeight: number;
  timelineWidth: number;
  setOrientation: (orientation: EOrientation) => void;
  mapRangeToKeyboardNotes: (range: [ENote, ENote], level: EOctave, xOffset: number) => { whiteNotesArray: any[], blackNotesArray: any[] };
  mapRangeToTimelineNotes: (range: [ENote, ENote], xOffset: number) => { whiteNotesArray: any[], blackNotesArray: any[] };
  mapRangeToOctaves: () => { range: [ENote, ENote], level: EOctave, xOffset: number }[];
}

export const usePianoRollLayoutStore = create<PianoRollLayoutState>((set, get) => ({
  orientation: EOrientation.HORIZONTAL,
  layoutConfig: horizontalLayout,
  pianoRollWidth: 52 * horizontalLayout.whiteNoteWidth,
  pianoRollLength: 52 * horizontalLayout.whiteNoteWidth / ASPECT_RATIO,
  timelineX: 0,
  timelineY: 0,
  timelineHeight: 52 * horizontalLayout.whiteNoteWidth / ASPECT_RATIO - horizontalLayout.timelineOffset - horizontalLayout.whiteNoteHeight,
  timelineWidth: 52 * horizontalLayout.whiteNoteWidth,
  setOrientation: (orientation: EOrientation) => {
    const layoutConfig = orientation === EOrientation.HORIZONTAL ? horizontalLayout : verticalLayout;
    
    const pianoRollWidth = 52 * layoutConfig.whiteNoteWidth;
    const pianoRollLength = orientation === EOrientation.HORIZONTAL ? pianoRollWidth / ASPECT_RATIO : pianoRollWidth * ASPECT_RATIO;

    const timelineLength = pianoRollLength - layoutConfig.timelineOffset - layoutConfig.whiteNoteHeight;

    const timelineX = orientation === EOrientation.HORIZONTAL ? 0 : layoutConfig.whiteNoteHeight + layoutConfig.timelineOffset;
    const timelineY = orientation === EOrientation.HORIZONTAL ? 0 : 0;
    const timelineHeight = orientation === EOrientation.HORIZONTAL ? timelineLength : pianoRollWidth;
    const timelineWidth = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : timelineLength;
    
    set({
      orientation,
      layoutConfig,
      pianoRollWidth,
      pianoRollLength,
      timelineX,
      timelineY,
      timelineHeight,
      timelineWidth,
    });
  },
  mapRangeToKeyboardNotes: (range: [ENote, ENote], level: EOctave, xOffset: number) => {
    const { orientation, layoutConfig, pianoRollWidth, pianoRollLength } = get();
    const { whiteNoteWidth, blackNoteWidth, whiteNoteHeight, blackNoteHeight } = layoutConfig;
    
    const whiteNotesArray: any[] = [];
    const blackNotesArray: any[] = [];
    let currentX = xOffset;

    for (let note = range[0]; note <= range[1]; note++) {
      const isWhiteNote = whiteNotes.includes(note);
      const x = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : 0;
      const y = orientation === EOrientation.HORIZONTAL ? pianoRollLength - whiteNoteHeight : pianoRollWidth - whiteNoteWidth - (isWhiteNote ? currentX : currentX - (whiteNoteWidth - blackNoteWidth / 2));
      const width = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : (isWhiteNote ? whiteNoteHeight : blackNoteHeight);
      const height = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteHeight : blackNoteHeight) : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
      const label = note === ENote.C ? noteToString([note, level], true).toUpperCase() : '';
      const color = isWhiteNote ? colorScheme.keyboardWhiteNote : colorScheme.keyboardBlackNote;

      const noteProps = {
        note,
        level,
        x,
        y,
        width,
        height,
        label,
        color,
      };

      if (isWhiteNote) {
        whiteNotesArray.push(noteProps);
        currentX += whiteNoteWidth;
      } else {
        blackNotesArray.push(noteProps);
      }
    }

    return { whiteNotesArray, blackNotesArray };
  },
  mapRangeToTimelineNotes: (range: [ENote, ENote], xOffset: number) => {
    const { orientation, layoutConfig, pianoRollWidth, pianoRollLength, timelineHeight } = get();
    const { whiteNoteWidth, blackNoteWidth } = layoutConfig;
    
    const whiteNotesArray: any[] = [];
    const blackNotesArray: any[] = [];
    let currentX = xOffset;

    for (let note = range[0]; note <= range[1]; note++) {
      const isWhiteNote = whiteNotes.includes(note);
      const x = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : 0;
      const y = orientation === EOrientation.HORIZONTAL ? 0 : pianoRollWidth - whiteNoteWidth - (isWhiteNote ? currentX : currentX - (whiteNoteWidth - blackNoteWidth / 2));
      const width = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : pianoRollLength;
      const height = orientation === EOrientation.HORIZONTAL ? timelineHeight  : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
      const color = isWhiteNote ? colorScheme.timelineWhiteNote : colorScheme.timelineBlackNote;

      const noteProps = {
        note,
        x,
        y,
        width,
        height,
        color,
      };

      if (isWhiteNote) {
        whiteNotesArray.push(noteProps);
        currentX += whiteNoteWidth;
      } else {
        blackNotesArray.push(noteProps);
      }
    }

    return { whiteNotesArray, blackNotesArray };
  },
  mapRangeToOctaves: () => {
    const [[startNote, startLevel], [endNote, endLevel]] = keyboardRange;
    const { whiteNoteWidth } = get().layoutConfig;
    const octaves = [];
    let currentXOffset = 0;

    for (let level = startLevel; level <= endLevel; level++) {
      let octaveRange: [ENote, ENote];
      if (level === startLevel) {
        octaveRange = [startNote, ENote.B];
        octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
        currentXOffset += (ENote.B - startNote) * whiteNoteWidth;
      } else if (level === endLevel) {
        octaveRange = [ENote.C, endNote];
        octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
        currentXOffset += (endNote - ENote.C) * whiteNoteWidth;
      } else {
        octaveRange = [ENote.C, ENote.B];
        octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
        currentXOffset += 7 * whiteNoteWidth;
      }
    }

    return octaves;
  }
}));
