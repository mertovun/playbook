import { KeyboardOctave } from './KeyboardOctave';

interface KeyboardProps {
  mapRangeToKeyboardOctaves: any;
  mapRangeToKeyboardNotes: any;
}

export const Keyboard = ({ mapRangeToKeyboardOctaves, mapRangeToKeyboardNotes }: KeyboardProps) => {
  const octaves = mapRangeToKeyboardOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <KeyboardOctave key={i} {...octaveProps} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
      ))}
    </>
  );
};
