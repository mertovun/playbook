import { Octave, OctaveProps } from './Octave';
import { ENote, NoteWithOctave } from './interface';
import './Keyboard.css';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
}

const whiteNoteWidth = 20;

const mapRangeToOctaves = (keyboardRange: KeyboardRange): OctaveProps[] => {
  const [[startNote, startLevel], [endNote, endLevel]] = keyboardRange;
  const octaves = [];
  let currentXOffset = 0;

  for (let level = startLevel; level <= endLevel; level++) {
    let octaveRange: [ENote, ENote];
    if (level === startLevel) {
      octaveRange = [startNote, ENote.B];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += (ENote.B - startNote) * whiteNoteWidth;
    } else if (level === endLevel) {
      octaveRange = [ENote.C, endNote];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += (endNote - ENote.C) * whiteNoteWidth;
    } else {
      octaveRange = [ENote.C, ENote.B];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += 7 * whiteNoteWidth;
    }
  }

  return octaves;
};

export const Keyboard = ({ keyboardRange }: KeyboardProps) => {
  const octaves = mapRangeToOctaves(keyboardRange);
  return (
    <svg className="keyboard-svg" width="100%" height="400">
      {octaves.map((octaveProps, index) => (
        <Octave key={index} {...octaveProps} />
      ))}
    </svg>
  );
};
