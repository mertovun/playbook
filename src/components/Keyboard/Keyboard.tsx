import { Octave } from './Octave';
import { EOrientation, NoteWithOctave } from './interface';
import './Keyboard.css';
import { LayoutConfig } from './useKeyboardPanelLayout';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
  mapRangeToOctaves: any;
  mapRangeToNotes: any;
}

export const Keyboard = ({ keyboardRange, orientation, layoutConfig, mapRangeToOctaves, mapRangeToNotes }: KeyboardProps) => {
  const octaves = mapRangeToOctaves(keyboardRange);
  return (
    <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
      {octaves.map((octaveProps, i) => (
        <Octave key={i} {...octaveProps} orientation={orientation} layoutConfig={layoutConfig} mapRangeToNotes={mapRangeToNotes} />
      ))}
    </svg>
  );
};
