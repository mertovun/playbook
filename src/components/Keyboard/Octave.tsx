import { noteToString } from '../../utils/note';
import { Note, NoteProps } from './Note';
import { ENote, EOctave } from './interface';
import { layoutConfig, orientation } from './config';

export interface OctaveProps {
  range: [ENote, ENote];
  level: EOctave;
  xOffset: number;
}

const whiteNotes = [ENote.C, ENote.D, ENote.E, ENote.F, ENote.G, ENote.A, ENote.B];
const blackNotes = [ENote.C_SHARP, ENote.D_SHARP, ENote.F_SHARP, ENote.G_SHARP, ENote.A_SHARP];

const mapRangeToNotes = (range: [ENote, ENote], level: EOctave, xOffset: number) => {
  const { whiteNoteWidth, blackNoteWidth, whiteNoteHeight, blackNoteHeight } = layoutConfig;
  const whiteNotesArray: NoteProps[] = [];
  const blackNotesArray: NoteProps[] = [];
  let currentX = xOffset;

  for (let note = range[0]; note <= range[1]; note++) {
    const isWhiteNote = whiteNotes.includes(note);
    const x = orientation === 'HORIZONTAL' ? (isWhiteNote ? currentX : currentX - blackNoteWidth / 2) : 0;
    const y = orientation === 'HORIZONTAL' ? 0 : (isWhiteNote ? currentX : currentX - blackNoteWidth / 2);
    const width = orientation === 'HORIZONTAL' ? (isWhiteNote ? whiteNoteWidth : blackNoteWidth) : (isWhiteNote ? whiteNoteHeight : blackNoteHeight);
    const height = orientation === 'HORIZONTAL' ? (isWhiteNote ? whiteNoteHeight : blackNoteHeight) : (isWhiteNote ? whiteNoteWidth : blackNoteWidth);
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
