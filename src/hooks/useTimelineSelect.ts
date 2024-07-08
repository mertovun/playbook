// src/hooks/useTimelineSelect.ts
import { useState, useCallback } from 'react';
import { useMidiStore } from '../stores/useMidiStore';
import { MidiNote } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { EOrientation } from '../components/PianoRoll/interface';

export const useTimelineSelect = () => {
  const [selectionStart, setSelectionStart] = useState<{ x: number, y: number } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{ x: number, y: number } | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());

  const { recordedNotes } = useMidiStore();
  const { windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { orientation, timelineHeight } = usePianoRollLayoutStore();

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setSelectionStart({ x: e.clientX, y: e.clientY });
    setSelectionEnd(null);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectionStart) {
      setSelectionEnd({ x: e.clientX, y: e.clientY });
    }
  }, [selectionStart]);

  const handleMouseUp = useCallback(() => {
    if (selectionStart && selectionEnd) {
      handleNoteSelection(selectionStart, selectionEnd);
    }
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [selectionStart, selectionEnd]);

  const handleNoteSelection = (start: { x: number, y: number }, end: { x: number, y: number }) => {
    const selectionRect = {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };

    const newSelectedNotes = new Set<number>();
    
    // Check if a note falls within the selection rectangle
    Object.values(recordedNotes).forEach((notes: { [key: number]: MidiNote }) => {
      Object.values(notes).forEach((note: MidiNote) => {
        const startPx = (note.start - windowStartTime) * pixelsPerSecond;
        const durationPx = (note.end! - note.start) * pixelsPerSecond;
        const endPx = startPx + durationPx;

        const noteRect = orientation === EOrientation.HORIZONTAL
          ? { x: startPx, y: timelineHeight - note.note * 10, width: durationPx, height: 10 } // Adjust based on your note height logic
          : { x: note.note * 10, y: startPx, width: 10, height: durationPx }; // Adjust based on your note width logic

        if (rectIntersect(selectionRect, noteRect)) {
          newSelectedNotes.add(note.note);
        }
      });
    });

    setSelectedNotes(newSelectedNotes);
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
    selectedNotes,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
