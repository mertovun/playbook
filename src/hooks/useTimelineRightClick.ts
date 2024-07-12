import { useState, useCallback, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import { ContextMenuOptions, useContextMenuOptions } from './useContextMenuOptions';

// Define the Jotai atom for managing the showContextMenu state
export const showContextMenuAtom = atom<boolean>(false);

interface UseTimelineRightClickReturnType {
  contextMenuPosition: { x: number; y: number } | null;
  showContextMenu: boolean;
  handleRightClick: (e: React.MouseEvent) => void;
  handleOptionClick: (option: ContextMenuOptions) => void;
  closeContextMenu: () => void;
  options: ContextMenuOptions[];
}

export const useTimelineRightClick = (): UseTimelineRightClickReturnType => {
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showContextMenu, setShowContextMenu] = useAtom(showContextMenuAtom);

  const { options, handleOptionClick } = useContextMenuOptions();

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, [setContextMenuPosition, setShowContextMenu]);

  const closeContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, [setShowContextMenu]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showContextMenu) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContextMenu, closeContextMenu]);

  return {
    contextMenuPosition,
    showContextMenu,
    handleRightClick,
    handleOptionClick,
    closeContextMenu,
    options,
  };
};
