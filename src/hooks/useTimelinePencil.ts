import { useCallback } from 'react';
import { useMidiStore } from '../stores/useMidiStore';
import { MidiNote } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { EOrientation, LayoutConfig } from '../components/PianoRoll/interface';
import { midiNumToIsWhiteNote, midiNumToNoteStart, noteStartToMidiNum } from '../utils/note';
import { EditMode, useControlBarStore } from '../stores/useControlBarStore';
import { measureBeatTickToTime, tickDuration, timeToMeasureBeatTick } from '../utils/time';

export const useTimelinePencil = () => {

  const { editMode, gridSnap } = useControlBarStore();
  const { recordedNotes, tempo, timeSignature, addToRecordedNotes, deleteFromRecordedNotes } = useMidiStore();
  const { 
    windowStartTime, 
    pixelsPerSecond,
    gridTick
  } = useTimelineGridStore();
  const { orientation, timelineHeight, layoutConfig } = usePianoRollLayoutStore();

  const handleClickPencil = useCallback((e: any) => {
    if (e.button !== 0) return;
    let intersected: boolean = false;
    if (editMode === EditMode.PENCIL) {
      const rect = e.target.getBoundingClientRect();
      intersected = noteIntersect(e.clientX - rect.left, e.clientY - rect.top, layoutConfig);
      console.log(intersected)
      if (!intersected) {
        const rect = e.target.getBoundingClientRect();
        const timePx = orientation === EOrientation.HORIZONTAL ? rect.bottom - e.clientY : e.clientX - rect.left;
        let clickTime = timePx / pixelsPerSecond + windowStartTime;
        if (gridSnap) {
          let [measure, beat, tick] = timeToMeasureBeatTick(clickTime, tempo, timeSignature, gridTick);
          tick = Math.floor(tick);
          clickTime = measureBeatTickToTime(measure, beat, tick, tempo, timeSignature, gridTick);
        }
        const noteDuration = tickDuration(gridTick, tempo)

        const notePx = orientation === EOrientation.HORIZONTAL ? e.clientX - rect.left : rect.bottom - e.clientY;
        const { whiteNoteWidth, blackNoteWidth } = layoutConfig;
        const midiNum = noteStartToMidiNum(notePx, whiteNoteWidth, blackNoteWidth);
        // console.log(midiNum);
        const note: MidiNote = {
          note: midiNum,
          start: clickTime,
          velocity: 127,
          end: clickTime + noteDuration,
          selected: false
        }
        addToRecordedNotes(note);
      }
    }
  }, [editMode, layoutConfig, recordedNotes, windowStartTime, pixelsPerSecond, orientation, tempo, timeSignature, gridTick]);

  const noteIntersect = (
    x: number,
    y: number, 
    layoutConfig: LayoutConfig
  ) => {
    const { whiteNoteWidth, blackNoteWidth } = layoutConfig;
    
    for (const notes of Object.values(recordedNotes)) {
      for (const note of Object.values(notes)) {
        const startPx = (note.start - windowStartTime) * pixelsPerSecond;
        const durationPx = (note.end! - note.start) * pixelsPerSecond;
        const startY = midiNumToNoteStart(note.note, whiteNoteWidth, blackNoteWidth);
        const isWhiteNote = midiNumToIsWhiteNote(note.note);
        const noteWidth = isWhiteNote ? whiteNoteWidth:blackNoteWidth;

        const noteRect = orientation === EOrientation.HORIZONTAL
          ? { x: startY, y: timelineHeight - startPx - durationPx, width: noteWidth, height: durationPx } 
          : { x: startPx, y: timelineHeight - startY - noteWidth, width: durationPx, height: noteWidth }; 

        if (pointIntersect(x, y, noteRect)) {
          deleteFromRecordedNotes(note.note, note.start)
          return true;
        }
      }
    }
    return false;
  };

  const pointIntersect = (x:number, y:number, rect: any) => {
    return (
      x < rect.x + rect.width &&
      x > rect.x &&
      y < rect.y + rect.height &&
      y > rect.y
    );
  };

  return {
    handleClickPencil,
  };
};
