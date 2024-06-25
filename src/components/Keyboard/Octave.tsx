import { noteToString } from "../../utils/noteToMidiNum";
import { Note, NoteProps } from "./Note";
import { ENote, EOctave } from "./interface";

export interface OctaveProps {
  range: [ENote,ENote]
  level: EOctave
}

const mapRangeToNotes = (range:[ENote,ENote],level: number):NoteProps[] => {
  const [startNote, endNote] = range
  if (startNote == endNote) {
    return [{note:startNote, children:noteToString([startNote,level],true)}];
  }
  return [{note:startNote, children:noteToString([startNote,level],true)}, ...mapRangeToNotes([startNote+1, endNote], level)];
}

export const Octave = ({range, level}:OctaveProps) => {
  const notes = mapRangeToNotes(range,level).map((note)=> <Note {...note}/>)
  return (<>
    {notes}
  </>)
}