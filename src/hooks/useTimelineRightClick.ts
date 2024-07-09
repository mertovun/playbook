// useTimelineRightClick.ts
import { useState, useCallback, useEffect } from 'react';
import { ContextMenuOptions, useContextMenuOptions } from './useContextMenuOptions';

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
  const [showContextMenu, setShowContextMenu] = useState(false);

  const { options, handleOptionClick } = useContextMenuOptions();

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  }, []);

  const closeContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, []);

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
