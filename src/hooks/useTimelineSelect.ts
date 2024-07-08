import { useState, useCallback } from 'react';
import { useMidiStore } from '../stores/useMidiStore';
import { MidiNote } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { EOrientation, LayoutConfig } from '../components/PianoRoll/interface';
import { midiNumToIsWhiteNote, midiNumToNoteStart } from '../utils/note';
import { EditMode, useControlBarStore } from '../stores/useControlBarStore';

export const useTimelineSelect = () => {
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number, y: number } | null>(null);

  const { editMode } = useControlBarStore();
  const { recordedNotes, selectNote, deselectAll } = useMidiStore();
  const { windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { orientation, timelineHeight, layoutConfig } = usePianoRollLayoutStore();
  


  const handleMouseDown = useCallback((e: any) => {
    if (editMode === EditMode.SELECT) {
      const rect = e.target.getBoundingClientRect();
      setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setSelectionEnd(null);
    }
  }, [editMode]);

  const handleMouseMove = useCallback((e: any) => {
    if (editMode === EditMode.SELECT && selectionStart) {
      const rect = e.target.getBoundingClientRect();
      setSelectionEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [selectionStart, editMode]);

  const handleMouseUp = useCallback((e: any) => {
    if (editMode === EditMode.SELECT) {
      if (!e.ctrlKey) deselectAll();
      if (selectionStart && selectionEnd) {
        handleNoteSelection(selectionStart, selectionEnd, layoutConfig);
      }
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [selectionStart, selectionEnd, editMode, layoutConfig]);

  const handleClickSelect = useCallback((e: any) => {
    if (editMode === EditMode.SELECT && !selectionEnd) {
      const rect = e.target.getBoundingClientRect();
      handleNoteSelection({ x: e.clientX - rect.left, y: e.clientY - rect.top }, { x: e.clientX - rect.left, y: e.clientY - rect.top }, layoutConfig);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  }, [selectionStart, selectionEnd, editMode, layoutConfig]);

  const handleNoteSelection = (start: { x: number, y: number }, end: { x: number, y: number }, layoutConfig: LayoutConfig) => {
    const { whiteNoteWidth, blackNoteWidth } = layoutConfig;
    const selectionRect = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
    
    Object.values(recordedNotes).forEach((notes: { [key: number]: MidiNote }) => {
      Object.values(notes).forEach((note: MidiNote) => {
        const startPx = (note.start - windowStartTime) * pixelsPerSecond;
        const durationPx = (note.end! - note.start) * pixelsPerSecond;
        const startY = midiNumToNoteStart(note.note, whiteNoteWidth, blackNoteWidth);
        const isWhiteNote = midiNumToIsWhiteNote(note.note);
        const noteWidth = isWhiteNote ? whiteNoteWidth:blackNoteWidth;

        const noteRect = orientation === EOrientation.HORIZONTAL
          ? { x: startY, y: timelineHeight - startPx - durationPx, width: noteWidth, height: durationPx } 
          : { x: startPx, y: timelineHeight - startY - noteWidth, width: durationPx, height: noteWidth }; 

        if (rectIntersect(selectionRect, noteRect)) {
          selectNote(note.note, note.start);
        }
      });
    });

  };

  const rectIntersect = (rect1: any, rect2: any) => {
    return !(
      rect1.x > rect2.x + rect2.width ||
      rect1.x + rect1.width < rect2.x ||
      rect1.y > rect2.y + rect2.height ||
      rect1.y + rect1.height < rect2.y
    );
  };

  return {
    selectionStart,
    selectionEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClickSelect,
  };
};
