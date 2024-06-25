import { ENote, NoteWithOctave } from "./interface";
import { Octave, OctaveProps } from "./Octave";

type KeyboardRange = [NoteWithOctave,NoteWithOctave]

interface KeyboardProps {
  keyboardRange: KeyboardRange
}

const mapRangeToOctaves = (keyboardRange:KeyboardRange):OctaveProps[] => {
  const [[startNote,startLevel],[endNote,endLevel]] = keyboardRange
  if (startLevel == endLevel) {
    return [{range:[startNote,endNote], level:startLevel}];
  }
  return [{range:[startNote,ENote.B], level:startLevel},...mapRangeToOctaves([[ENote.C,startLevel+1],[endNote,endLevel]])];
}

export const Keyboard = ({keyboardRange}:KeyboardProps) => {
  const octaves = mapRangeToOctaves(keyboardRange).map(octave=>(<Octave key={octave.level} {...octave}/>))
  console.log(keyboardRange);
  return (<>
    {octaves}
  </>)
}