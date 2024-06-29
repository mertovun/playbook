import React, { useCallback } from 'react';
import './KeyboardNote.css';
import { ENote } from '../interface';
import { noteToMidiNum } from '../../../utils/note';
import { useMIDINote, useMIDIOutput } from '@react-midi/hooks';
import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';

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

  const midiNumber = noteToMidiNum([note,level]);
  const midiNote = useMIDINote({note: midiNumber, channel:1})

  const { noteOn, noteOff } = useMIDIOutput()

  const handleKeyboardNoteMouseDown = useCallback(() =>{
    if (!isPlaying || isRecording) noteOn(midiNumber, {velocity:127, channel:1});
  }, [noteOn, midiNumber]);

  const handleKeyboardNoteMouseUp = useCallback(() =>{
    if (!isPlaying || isRecording) noteOff(midiNumber, {channel:1})
  }, [noteOff, midiNumber]);

  const keyPressed = midiNote && midiNote.on;

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

