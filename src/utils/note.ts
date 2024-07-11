import { NoteWithOctave } from "../components/PianoRoll/interface";

export function noteToMidiNum(note:NoteWithOctave){
  return 12 + 12 * note[1] + note[0];
}

export function noteToString(note:NoteWithOctave, withOctave:boolean){
  const map = {
    0:'c',
    1:'c#',
    2:'d',
    3:'d#',
    4:'e',
    5:'f',
    6:'f#',
    7:'g',
    8:'g#',
    9:'a',
    10:'a#',
    11:'b',
  };
  let str = map[note[0]]
  if (withOctave) str += note[1];
  return str;
}

export function noteStartToMidiNum(noteStart: number, whiteNoteWidth: number, blackNoteWidth: number) {
  const notesPerOctave = 12;
  const whiteNotesPerOctave = 7;

  const octaveWidth = whiteNoteWidth * whiteNotesPerOctave;

  noteStart += 5 * whiteNoteWidth
  const octave = Math.floor(noteStart / (octaveWidth));
  const positionInOctave = noteStart % (octaveWidth);
  // const note = Math.floor(12 * positionInOctave/octaveWidth);
  let note;
  if (positionInOctave> octaveWidth-whiteNoteWidth + blackNoteWidth/2) note = 11;
  else if (positionInOctave> octaveWidth-whiteNoteWidth - blackNoteWidth/2) note = 10;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 2 + blackNoteWidth/2) note = 9;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 2 - blackNoteWidth/2) note = 8;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 3 + blackNoteWidth/2) note = 7;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 3 - blackNoteWidth/2) note = 6;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 4 ) note = 5;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 5 + blackNoteWidth/2) note = 4;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 5 - blackNoteWidth/2) note = 3;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 6 + blackNoteWidth/2) note = 2;
  else if (positionInOctave> octaveWidth-whiteNoteWidth * 6 - blackNoteWidth/2) note = 1;
  else note = 0;

  let midiNum = (octave+1) * notesPerOctave + note;

  return midiNum;
}


export function midiNumToNoteStart(midiNum: number, whiteNoteWidth: number, blackNoteWidth: number) {
  const octave = Math.floor((midiNum-12)/12);
  const note = midiNum % 12;
  const base = (octave * 7 - 5)* whiteNoteWidth;
  if (note == 0) return base;                                             // C
  if (note == 1) return base + whiteNoteWidth - blackNoteWidth /2;        // C#
  if (note == 2) return base + whiteNoteWidth;                            // D
  if (note == 3) return base + whiteNoteWidth * 2 - blackNoteWidth /2;    // D#
  if (note == 4) return base + whiteNoteWidth * 2;                        // E
  if (note == 5) return base + whiteNoteWidth * 3;                        // F
  if (note == 6) return base + whiteNoteWidth * 4 - blackNoteWidth /2;    // F#
  if (note == 7) return base + whiteNoteWidth * 4;                        // G
  if (note == 8) return base + whiteNoteWidth * 5 - blackNoteWidth /2;    // G#
  if (note == 9) return base + whiteNoteWidth * 5;                        // A
  if (note == 10) return base + whiteNoteWidth * 6 - blackNoteWidth /2;   // A#
  return base + whiteNoteWidth * 6;                                       // B
}

export function midiNumToIsWhiteNote(midiNum: number) {
  const note = midiNum % 12;
  if (note == 0) return true;         // C
  if (note == 1) return false;        // C#
  if (note == 2) return true;         // D
  if (note == 3) return false;        // D#
  if (note == 4) return true;         // E
  if (note == 5) return true;         // F
  if (note == 6) return false;        // F#
  if (note == 7) return true;         // G
  if (note == 8) return false;        // G#
  if (note == 9) return true;         // A
  if (note == 10) return false;       // A#
  return true;                        // B
}