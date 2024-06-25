import { noteToString } from "../../utils/note";
import { Note, NoteProps } from "./Note";
import { ENote, EOctave } from "./interface";

export interface OctaveProps {
  range: [ENote,ENote];
  level: EOctave;
  xOffset: number;
}

const whiteNoteWidth = 20;
const whiteNoteHeight = 100;
const blackNoteHeight = 60;

const whiteNotes = [ENote.C, ENote.D, ENote.E, ENote.F, ENote.G, ENote.A, ENote.B];
// const blackNotes = [ENote.C_SHARP, ENote.D_SHARP, ENote.F_SHARP, ENote.G_SHARP, ENote.A_SHARP];

const mapRangeToNotes = (range:[ENote,ENote],level: EOctave, xOffset: number):NoteProps[] => {
  const [startNote, endNote] = range
  const notes = [];
  let currentX = xOffset;

  for (let note = startNote; note <= endNote; note++) {
    const isWhiteNote = whiteNotes.includes(note);
    const noteHeight = isWhiteNote ? whiteNoteHeight : blackNoteHeight;
    // const yOffset = isWhiteNote ? level * whiteNoteHeight : level * whiteNoteHeight - (whiteNoteHeight - blackNoteHeight) / 2; // ???
    const color = isWhiteNote ? 'white' : 'black';

    notes.push({
      note: note,
      x: currentX,
      y: 0,
      width: whiteNoteWidth,
      height: noteHeight,
      label: noteToString([note, level], true),
      color: color,
    });

    if (isWhiteNote) {
      currentX += whiteNoteWidth;
    }
  }

  return notes;
}

export const Octave = ({range, level, xOffset }:OctaveProps) => {
  const notes = mapRangeToNotes(range, level, xOffset).map((noteProps, i)=> <Note key={i} {...noteProps}/>)
  return (<>
    {notes}
  </>)
}
