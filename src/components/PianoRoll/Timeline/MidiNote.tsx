import React from 'react';
import './TimelineNote.css';
import { ENote, EOrientation } from '../interface';
import { noteToMidiNum } from '../../../utils/note';
import usePianoRollLayoutStore from '../../../stores/usePianoRollLayoutStore';
import { useMidiNotePlayback } from '../../../hooks/useMidiNotePlayback';
import { useMidiNote } from '../../../hooks/useMidiNote';

export interface MidiNoteProps {
  note: ENote;
  level: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MidiNote: React.FC<MidiNoteProps> = React.memo(({ note, level, x, y, width, height }) => {
  const midiNum = noteToMidiNum([note, level]);

  const { orientation, timelineHeight } = usePianoRollLayoutStore();

  const noteDefaultColor = '#eb9';
  const noteDefaultStrokeColor = '#643';

  useMidiNotePlayback(midiNum);
  const notes = useMidiNote(midiNum);

  return (
    <svg x={x} y={y}>
      {notes().map(({ startPx, durationPx, key }) => {
      const noteX = orientation === EOrientation.HORIZONTAL ? 0 : startPx;
      const noteY = orientation === EOrientation.HORIZONTAL ? timelineHeight - startPx - durationPx : 0;
      const noteWidth = orientation === EOrientation.HORIZONTAL ? width : durationPx;
      const noteHeight = orientation === EOrientation.HORIZONTAL ? durationPx : height;
      return (
        <rect
          key={key}
          x={noteX}
          y={noteY}
          width={noteWidth}
          height={noteHeight}
          fill={noteDefaultColor}
          stroke={noteDefaultStrokeColor}
          strokeWidth={1.2}
          rx={5}
          ry={5}
          style={{ pointerEvents: 'none' }}
        />
      );
    })}
    </svg>
  );
});
