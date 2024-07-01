import React, { useCallback, useEffect, useRef } from 'react';
import './TimelineNote.css';
import { ENote, EOrientation } from '../interface';
import { noteToMidiNum } from '../../../utils/note';
import { useMidiStore } from '../useMidi';
import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { dispatchNoteOffMessage, dispatchNoteOnMessage } from '../../../utils/midi';

export interface TimelineMidiNoteProps {
  note: ENote;
  level:number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const TimelineMidiNote: React.FC<TimelineMidiNoteProps> = ({ note, level, x, y, width, height }) => {
  const midiNum = noteToMidiNum([note, level]);

  const { recordedNotes , activeNotes } = useMidiStore();
  const { currentTime, isPlaying, isRecording, windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { orientation, timelineHeight } = usePianoRollLayoutStore();

  const noteDefaultColor = '#eb9';
  const noteDefaultStrokeColor = '#643';

  const currentTimeRef = useRef(currentTime);

  useEffect(() => {
    if (isPlaying) {
      for (let note of Object.values(recordedNotes[midiNum])) {
        if (currentTimeRef.current < note.start && currentTime >= note.start) {
          dispatchNoteOnMessage(midiNum, note.velocity);
        }
        if (currentTimeRef.current < note.end! && currentTime >= note.end!) {
          dispatchNoteOffMessage(midiNum, note.velocity);
        }
      }
    }
    currentTimeRef.current = currentTime;
  }, [currentTime, midiNum, recordedNotes, activeNotes, dispatchNoteOnMessage, dispatchNoteOffMessage, isRecording]);



  const renderNotes = useCallback(() =>{
    const notes = [];
    for (let note of Object.values(recordedNotes[midiNum])) {
      const startPx = (note.start - windowStartTime)*pixelsPerSecond;
      const durationPx = (note.end! - note.start)*pixelsPerSecond;
      notes.push([startPx, durationPx, note.start]);
    }
    if (isRecording) {
      const activeNote = activeNotes[midiNum];
      if (activeNote) {
        const startPx = (activeNote.start - windowStartTime)*pixelsPerSecond;
        const durationPx = (currentTime - activeNote.start)*pixelsPerSecond;
        notes.push([startPx, durationPx, activeNote.start]);
      }
    }
    // if (notes.length) console.log(notes);
    return notes.map(([startPx, durationPx, key])=>{
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
          strokeWidth={1.6}
          rx={5}
          ry={5}
          style={{ pointerEvents: 'none' }}
        />
      )
    })
  }, [midiNum, recordedNotes, activeNotes, currentTime, windowStartTime, isRecording, orientation])

  return (
    <svg x={x} y={y}>
      {renderNotes()}
    </svg>
  )
};

