import { useEffect, useCallback } from 'react';
import { useMidiStore } from '../stores/useMidiStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';

export const useSelection = () => {
  const {
    deleteSelected,
    copySelectedToClipboard,
    pasteClipboardToRecordedNotes,
    clipboardNotes,
  } = useMidiStore();

  const { cursorStartTime } = useTimelineGridStore();

  const handleCut = useCallback(() => {
    copySelectedToClipboard();
    deleteSelected();
  }, [copySelectedToClipboard, deleteSelected]);

  const handleCopy = useCallback(() => {
    copySelectedToClipboard();
  }, [copySelectedToClipboard]);

  const handlePaste = useCallback(() => {
    if (clipboardNotes.length > 0) {
      const startTime = cursorStartTime;
      if (startTime !== null) {
        pasteClipboardToRecordedNotes(Number(startTime));
      }
    }
  }, [clipboardNotes, pasteClipboardToRecordedNotes, cursorStartTime]);

  const handleDelete = useCallback(() => {
    deleteSelected();
  }, [deleteSelected]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        handleCut();
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCut, handleCopy, handlePaste, handleDelete]);

  return {
    handleCut,
    handleCopy,
    handlePaste,
    handleDelete
  };
};
