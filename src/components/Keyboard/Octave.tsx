import React from 'react';
import { noteToString } from '../../utils/note';
import { Note, NoteProps } from './Note';
import { ENote, EOctave } from './interface';

export interface OctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
}

const whiteNoteWidth = 20;
const blackNoteWidth = 14;
const whiteNoteHeight = 100;
const blackNoteHeight = 60;

const whiteNotes = [ENote.C, ENote.D, ENote.E, ENote.F, ENote.G, ENote.A, ENote.B];
const blackNotes = [ENote.C_SHARP, ENote.D_SHARP, ENote.F_SHARP, ENote.G_SHARP, ENote.A_SHARP];

const mapRangeToNotes = (range: [ENote, ENote], level: EOctave, xOffset: number) => {
  const [startNote, endNote] = range;
  const whiteNotesArray: NoteProps[] = [];
  const blackNotesArray: NoteProps[] = [];
  let currentX = xOffset;

  for (let note = startNote; note <= endNote; note++) {
    const isWhiteNote = whiteNotes.includes(note);

    const x = isWhiteNote ? currentX : currentX - blackNoteWidth /2;
    const yOffset = 0;

    const width = isWhiteNote ? whiteNoteWidth : blackNoteWidth;
    const noteHeight = isWhiteNote ? whiteNoteHeight : blackNoteHeight;

    const label = note === ENote.C ? noteToString([note, level], true).toUpperCase() : '';
    const color = isWhiteNote ? 'white' : 'black';

    const noteProps = {
      note: note,
      x,
      y: yOffset,
      width: width,
      height: noteHeight,
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
};

export const Octave = ({ range, level, xOffset }: OctaveProps) => {
  const { whiteNotesArray, blackNotesArray } = mapRangeToNotes(range, level, xOffset);
  return (
    <g>
      {whiteNotesArray.map((noteProps, i) => (
        <Note key={i} {...noteProps} />
      ))}
      {blackNotesArray.map((noteProps, i) => (
        <Note key={i + whiteNotesArray.length} {...noteProps} />
      ))}
    </g>
  );
};
