import React, { useCallback, useState } from 'react';
import './KeyboardNote.css';
import { ENote } from '../interface';
import { noteToMidiNum } from '../utils/note';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useMidiStore } from '../stores/useMidiStore';
import { dispatchNoteOffMessage, dispatchNoteOnMessage } from '../utils/midi';

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

  const handleMouseDown = useCallback((e:any) => {
    if (!isPlaying || isRecording) dispatchNoteOnMessage(midiNumber, velocity);
  }, [midiNumber]);

  const handleMouseUp = useCallback((e:any) => {
    if (!isPlaying || isRecording) dispatchNoteOffMessage(midiNumber, velocity);
  }, [midiNumber]);

  const handleMouseEnter = useCallback((e:any) => {
    if (e.buttons) {
      if (!isPlaying || isRecording) dispatchNoteOnMessage(midiNumber, velocity);
    }
  }, [midiNumber]);

  const handleMouseLeave = useCallback((e:any) => {
    if (e.buttons) {
      if (!isPlaying || isRecording) dispatchNoteOffMessage(midiNumber, velocity);
    }
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
      onMouseDown={handleMouseDown}
      onMouseUp= {handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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

