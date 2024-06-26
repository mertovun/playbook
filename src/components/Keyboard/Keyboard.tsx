import { Octave } from './Octave';
import { EOrientation, NoteWithOctave } from './interface';
import './Keyboard.css';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
  orientation: EOrientation;
  mapRangeToOctaves: any;
  mapRangeToNotes: any;
}

export const Keyboard = ({ keyboardRange, orientation, mapRangeToOctaves, mapRangeToNotes }: KeyboardProps) => {
  const octaves = mapRangeToOctaves(keyboardRange);
  return (
    <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
      {octaves.map((octaveProps:any, i:number) => (
        <Octave key={i} {...octaveProps} orientation={orientation} mapRangeToNotes={mapRangeToNotes} />
      ))}
    </svg>
  );
};
