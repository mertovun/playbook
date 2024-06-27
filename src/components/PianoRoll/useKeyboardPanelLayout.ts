import { useState, useCallback } from 'react';
import { ENote, EOctave, EOrientation, LayoutConfig, NoteWithOctave } from './interface';
import { noteToString } from '../../utils/note';

const colorScheme = {
  keyboardWhiteNote: '#e9e9e9',
  keyboardBlackNote: '#020202',
  timelineWhiteNote: '#272727',
  timelineBlackNote: '#222222',
}

const ASPECT_RATIO = 1.4;

const horizontalLayout: LayoutConfig = {
  whiteNoteWidth: 15*ASPECT_RATIO,
  blackNoteWidth: 9*ASPECT_RATIO,
  whiteNoteHeight: 75*ASPECT_RATIO,
  blackNoteHeight: 45*ASPECT_RATIO,
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
// const blackNotes = [ENote.C_SHARP, ENote.D_SHARP, ENote.F_SHARP, ENote.G_SHARP, ENote.A_SHARP];

interface KeyboardPanelLayoutState {
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
  keyboardWidth: number;
  timelineLength: number;
}

export const useKeyboardPanelLayout = (keyboardRange: [NoteWithOctave, NoteWithOctave]) => {
  const [state, setState] = useState<KeyboardPanelLayoutState>({
    orientation: EOrientation.HORIZONTAL,
    layoutConfig: horizontalLayout,
    keyboardWidth: 52 * horizontalLayout.whiteNoteWidth,
    timelineLength: 52 * horizontalLayout.whiteNoteWidth /ASPECT_RATIO
  });

  const setOrientation = (orientation: EOrientation) => {
    const layoutConfig = orientation === EOrientation.HORIZONTAL ? horizontalLayout : verticalLayout;
    const keyboardWidth = 52 * layoutConfig.whiteNoteWidth;
    const timelineLength = orientation === EOrientation.HORIZONTAL ? keyboardWidth/ASPECT_RATIO : keyboardWidth*ASPECT_RATIO;

    setState({
      orientation,
      layoutConfig,
      keyboardWidth,
      timelineLength,
    });
  };

  const { orientation, layoutConfig, keyboardWidth, timelineLength } = state;
  const { whiteNoteWidth, blackNoteWidth, whiteNoteHeight, blackNoteHeight, timelineOffset } = layoutConfig;

  const mapRangeToKeyboardNotes = useCallback((range: [ENote, ENote], level: EOctave, xOffset: number) => {
    const whiteNotesArray: any[] = [];
    const blackNotesArray: any[] = [];
    let currentX = xOffset;

    for (let note = range[0]; note <= range[1]; note++) {
      const isWhiteNote = whiteNotes.includes(note);
      const x = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : 0;
      const y = orientation === EOrientation.HORIZONTAL ? timelineLength - whiteNoteHeight : keyboardWidth - whiteNoteWidth - (isWhiteNote ? currentX : currentX - (whiteNoteWidth - blackNoteWidth / 2));
      const width = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : (isWhiteNote ? whiteNoteHeight : blackNoteHeight);
      const height = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteHeight : blackNoteHeight) : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
      const label = note === ENote.C ? noteToString([note, level], true).toUpperCase() : '';
      const color = isWhiteNote ? colorScheme.keyboardWhiteNote : colorScheme.keyboardBlackNote;

      const noteProps = {
        note,
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
  }, [state]);

  const mapRangeToTimelineNotes = useCallback((range: [ENote, ENote], xOffset: number) => {
    const whiteNotesArray: any[] = [];
    const blackNotesArray: any[] = [];
    let currentX = xOffset;

    for (let note = range[0]; note <= range[1]; note++) {
      const isWhiteNote = whiteNotes.includes(note);
      const x = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : whiteNoteHeight + timelineOffset;
      const y = orientation === EOrientation.HORIZONTAL ? 0 : keyboardWidth - whiteNoteWidth - (isWhiteNote ? currentX : currentX - (whiteNoteWidth - blackNoteWidth / 2));
      const width = orientation === EOrientation.HORIZONTAL ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : timelineLength;
      const height = orientation === EOrientation.HORIZONTAL ? timelineLength - timelineOffset - whiteNoteHeight  : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
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
  }, [state]);

  const mapRangeToKeyboardOctaves = useCallback(() => {
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
    setOrientation,
    mapRangeToKeyboardNotes,
    mapRangeToTimelineNotes,
    mapRangeToKeyboardOctaves,
  };
};
