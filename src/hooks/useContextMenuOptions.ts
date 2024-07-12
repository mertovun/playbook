import { useEffect } from "react";
import { useSelection } from "./useSelection";
import { useMidiStore } from "../stores/useMidiStore";

export enum ContextMenuOptions {
  CUT = 'Cut',
  COPY = 'Copy',
  PASTE = 'Paste',
  DELETE = 'Delete',
  UNDO = 'Undo',
  REDO = 'Redo',
}

export const useContextMenuOptions = () => {
  const options = [
    ContextMenuOptions.CUT,
    ContextMenuOptions.COPY,
    ContextMenuOptions.PASTE,
    ContextMenuOptions.DELETE,
    ContextMenuOptions.UNDO,
    ContextMenuOptions.REDO,
  ];

  const {
    handleCut,
    handleCopy,
    handlePaste,
    handleDelete
  } = useSelection();

  const { undo, redo } = useMidiStore();
  
    // undo/redo ctrl+z ctrl+y
    useEffect(() => {
      const handleKeyDown = (e: any) => {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        }
        if (e.ctrlKey && e.key === 'y') {
          e.preventDefault();
          redo();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [undo, redo]);


  const handleOptionClick = (option: ContextMenuOptions) => {
    switch (option) {
      case ContextMenuOptions.CUT:
        handleCut();
        break;
      case ContextMenuOptions.COPY:
        handleCopy();
        break;
      case ContextMenuOptions.PASTE:
        handlePaste();
        break;
      case ContextMenuOptions.DELETE:
        handleDelete();
        break;
      case ContextMenuOptions.UNDO:
        undo();
        break;
      case ContextMenuOptions.REDO:
        redo();
        break;
      default:
        break;
    }
  };

  return { options, handleOptionClick };
};
