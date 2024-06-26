import { KeyboardOctave } from './KeyboardOctave';
import { EOrientation, NoteWithOctave } from '../interface';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
  orientation: EOrientation;
  mapRangeToKeyboardOctaves: any;
  mapRangeToKeyboardNotes: any;
}

export const Keyboard = ({ keyboardRange, orientation, mapRangeToKeyboardOctaves, mapRangeToKeyboardNotes }: KeyboardProps) => {
  const octaves = mapRangeToKeyboardOctaves(keyboardRange);
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <KeyboardOctave key={i} {...octaveProps} orientation={orientation} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
      ))}
    </>
  );
};
