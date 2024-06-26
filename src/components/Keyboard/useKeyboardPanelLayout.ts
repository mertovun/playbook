import { useState, useEffect, useCallback } from 'react';
import { ENote, EOctave, EOrientation, NoteWithOctave } from './interface';
import { noteToString } from '../../utils/note';
import { NoteProps } from './Note';

export type LayoutConfig = {
  whiteNoteWidth: number;
  blackNoteWidth: number;
  whiteNoteHeight: number;
  blackNoteHeight: number;
}

const horizontalLayout: LayoutConfig = {
  whiteNoteWidth: 20,
  blackNoteWidth: 12,
  whiteNoteHeight: 100,
  blackNoteHeight: 60
};

const verticalLayout: LayoutConfig = {
  whiteNoteWidth: 15,
  blackNoteWidth: 9,
  whiteNoteHeight: 75,
  blackNoteHeight: 45
};

const whiteNotes = [ENote.C, ENote.D, ENote.E, ENote.F, ENote.G, ENote.A, ENote.B];
const blackNotes = [ENote.C_SHARP, ENote.D_SHARP, ENote.F_SHARP, ENote.G_SHARP, ENote.A_SHARP];

interface KeyboardPanelLayoutState {
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
}

export const useKeyboardPanelLayout = (keyboardRange: [NoteWithOctave, NoteWithOctave]) => {
  const [state, setState] = useState<KeyboardPanelLayoutState>({
    orientation: EOrientation.HORIZONTAL,
    layoutConfig: horizontalLayout
  });

  const setOrientation = (orientation: EOrientation) => {
    setState({
      orientation,
      layoutConfig: orientation === EOrientation.HORIZONTAL ? horizontalLayout : verticalLayout
    });
  };

  const mapRangeToNotes = useCallback((range: [ENote, ENote], level: EOctave, xOffset: number) => {
    const { orientation, layoutConfig } = state;
    const { whiteNoteWidth, blackNoteWidth, whiteNoteHeight, blackNoteHeight } = layoutConfig;
    const whiteNotesArray: NoteProps[] = [];
    const blackNotesArray: NoteProps[] = [];
    let currentX = xOffset;

    for (let note = range[0]; note <= range[1]; note++) {
      const isWhiteNote = whiteNotes.includes(note);
      const x = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : 0;
      const y = orientation === EOrientation.HORIZONTAL ? 0 : 51 * whiteNoteWidth - (isWhiteNote ? currentX : currentX - (whiteNoteWidth - blackNoteWidth / 2));
      const width = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : (isWhiteNote ? whiteNoteHeight : blackNoteHeight);
      const height = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteHeight : blackNoteHeight) : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
      const label = note === ENote.C ? noteToString([note, level], true).toUpperCase() : '';
      const color = isWhiteNote ? 'white' : 'black';

      const noteProps = {
        note: note,
        x,
        y,
        width,
        height,
        label,
        color: color,
      };

      if (isWhiteNote) {
        whiteNotesArray.push(noteProps);
        currentX += whiteNoteWidth;
      } else {
        blackNotesArray.push(noteProps);
      }
    }

    return { whiteNotesArray, blackNotesArray };
  }, [state]);

  const mapRangeToOctaves = useCallback((keyboardRange: [NoteWithOctave, NoteWithOctave]) => {
    const { layoutConfig } = state;
    const { whiteNoteWidth } = layoutConfig;
    const [[startNote, startLevel], [endNote, endLevel]] = keyboardRange;
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
  }, [state]);

  return {
    ...state,
    keyboardRange,
    setOrientation,
    mapRangeToNotes,
    mapRangeToOctaves,
  };
};
