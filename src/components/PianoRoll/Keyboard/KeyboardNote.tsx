import React, { useCallback } from 'react';
import './KeyboardNote.css';
import { ENote } from '../interface';
import { noteToMidiNum } from '../../../utils/note';
import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';
import { useMidiStore } from '../useMidi';

export interface NoteProps {
  note: ENote;
  level:number;
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  color: string;
}

export const KeyboardNote: React.FC<NoteProps> = ({ note, level, x, y, width, height, label, color }) => {
  const { isPlaying, isRecording } = useTimelineGridStore();

  const { activeNotes } = useMidiStore();

  const midiNumber = noteToMidiNum([note,level]);
  const midiNote = activeNotes[midiNumber];

  const velocity = 127; // Maximum velocity
  const handleKeyboardNoteMouseDown = useCallback(() =>{
    const noteOnMessage = [0x90, midiNumber, velocity]; // 0x90 is the Note On message
    if (!isPlaying || isRecording) window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOnMessage } }));
  }, [midiNumber]);

  const handleKeyboardNoteMouseUp = useCallback(() =>{
    const noteOffMessage = [0x80, midiNumber, velocity]; // 0x80 is the Note Off message
    if (!isPlaying || isRecording) window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOffMessage } }));
  }, [midiNumber]);

  const keyPressed = midiNote !== undefined && midiNote.velocity > 0;

  return (
  <g>
    <rect 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      fill={keyPressed ? 'orange' : color} 
      stroke="black" 
      onMouseDown={handleKeyboardNoteMouseDown}
      onMouseUp= {handleKeyboardNoteMouseUp}
    />
    {label && (
      <text
        x={x + width / 2}
        y={y + height / 1.25}
        alignmentBaseline="middle"
        textAnchor="middle"
        fontSize="9"
        className="note-label"
      >
        {label}
      </text>
    )}
  </g>
)};

