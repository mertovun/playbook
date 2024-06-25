import { NoteWithOctave } from "../components/Keyboard/interface";

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