import React from 'react';
import { Octave, OctaveProps } from './Octave';
import { ENote, NoteWithOctave } from './interface';
import { layoutConfig, orientation } from './config';
import './Keyboard.css';

type KeyboardRange = [NoteWithOctave, NoteWithOctave];

interface KeyboardProps {
  keyboardRange: KeyboardRange;
}

const mapRangeToOctaves = (keyboardRange: KeyboardRange): OctaveProps[] => {
  const [[startNote, startLevel], [endNote, endLevel]] = keyboardRange;
  const octaves = [];
  let currentXOffset = 0;

  for (let level = startLevel; level <= endLevel; level++) {
    let octaveRange: [ENote, ENote];
    if (level === startLevel) {
      octaveRange = [startNote, ENote.B];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += (ENote.B - startNote) * layoutConfig.whiteNoteWidth;
    } else if (level === endLevel) {
      octaveRange = [ENote.C, endNote];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += (endNote - ENote.C) * layoutConfig.whiteNoteWidth;
    } else {
      octaveRange = [ENote.C, ENote.B];
      octaves.push({ range: octaveRange, level, xOffset: currentXOffset });
      currentXOffset += 7 * layoutConfig.whiteNoteWidth;
    }
  }

  return octaves;
};

export const Keyboard = ({ keyboardRange }: KeyboardProps) => {
  const octaves = mapRangeToOctaves(keyboardRange);
  return (
    <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
      {octaves.map((octaveProps, index) => (
        <Octave key={index} {...octaveProps} />
      ))}
    </svg>
  );
};
