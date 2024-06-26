import { Octave } from './Octave';
import { EOrientation, NoteWithOctave } from './interface';
import './Keyboard.css';
import { LayoutConfig, useKeyboardPanelLayout } from './useKeyboardPanelLayout';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
  orientation: EOrientation;
  layoutConfig: LayoutConfig;
}

export const Keyboard = ({ keyboardRange, orientation, layoutConfig }: KeyboardProps) => {
  const { mapRangeToOctaves } = useKeyboardPanelLayout(keyboardRange);
  const octaves = mapRangeToOctaves(keyboardRange, layoutConfig);
  return (
    <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
      {octaves.map((octaveProps, index) => (
        <Octave key={index} {...octaveProps} orientation={orientation} layoutConfig={layoutConfig} />
      ))}
    </svg>
  );
};
