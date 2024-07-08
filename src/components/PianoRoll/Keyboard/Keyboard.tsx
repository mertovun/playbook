import { usePianoRollLayoutStore } from '../../../stores/usePianoRollLayoutStore';
import { KeyboardOctave } from './KeyboardOctave';

export const Keyboard = () => {
  const { mapRangeToOctaves, mapRangeToKeyboardNotes } = usePianoRollLayoutStore();
  const octaves = mapRangeToOctaves();
  return (
    <>
      {octaves.map((octaveProps:any, i:number) => (
        <KeyboardOctave key={i} {...octaveProps} mapRangeToKeyboardNotes={mapRangeToKeyboardNotes} />
      ))}
    </>
  );
};
