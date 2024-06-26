import { KeyboardOctave } from './KeyboardOctave';
import { EOrientation } from '../interface';

interface KeyboardProps {
  orientation: EOrientation;
  mapRangeToKeyboardOctaves: any;
  mapRangeToKeyboardNotes: any;
}

export const Keyboard = ({ orientation, mapRangeToKeyboardOctaves, mapRangeToKeyboardNotes }: KeyboardProps) => {
  const octaves = mapRangeToKeyboardOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <KeyboardOctave key={i} {...octaveProps} orientation={orientation} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
      ))}
    </>
  );
};
