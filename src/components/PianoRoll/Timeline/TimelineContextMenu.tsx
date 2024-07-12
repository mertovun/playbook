import React, { useCallback } from 'react';
import './TimelineContextMenu.scss';
import { ContextMenuOptions } from '../hooks/useContextMenuOptions';
import { useMidiStore } from '../stores/useMidiStore';

interface ContextMenuProps {
  x: number;
  y: number;
  options: ContextMenuOptions[];
  onOptionClick: (option: ContextMenuOptions) => void;
}

export const TimelineContextMenu: React.FC<ContextMenuProps> = ({ x, y, options, onOptionClick }) => {
  const { countSelected, countClipboard, pastRecordedNotes, futureRecordedNotes } = useMidiStore();

  const shortcuts = {
    [ContextMenuOptions.CUT]: 'Ctrl+X',
    [ContextMenuOptions.COPY]: 'Ctrl+C',
    [ContextMenuOptions.PASTE]: 'Ctrl+V',
    [ContextMenuOptions.DELETE]: 'Del',
    [ContextMenuOptions.UNDO]: 'Ctrl+Z',
    [ContextMenuOptions.REDO]: 'Ctrl+Y',
  };

  const canUndo = useCallback(()=>{
    return pastRecordedNotes.length>0
  },[pastRecordedNotes]);
  const canRedo = useCallback(()=>{
    return futureRecordedNotes.length>0
  },[futureRecordedNotes]);
  
  const disabled = {
    [ContextMenuOptions.CUT]: countSelected() === 0,
    [ContextMenuOptions.COPY]: countSelected() === 0,
    [ContextMenuOptions.PASTE]: countClipboard() === 0,
    [ContextMenuOptions.DELETE]: countSelected() === 0,
    [ContextMenuOptions.UNDO]: !canUndo(),
    [ContextMenuOptions.REDO]: !canRedo(),
  };

  return (
    <div 
      className="context-menu" 
      style={{ top: y, left: x, position: 'absolute' }}
    >
      {options.map((option, index) => (
        <>
        <button 
          key={index} 
          onClick={() => onOptionClick(option)} 
          className="context-menu-option"
          disabled={disabled[option]}
          >
          <span className="option-text">{option}</span>
          <span className="shortcut-text">{shortcuts[option]}</span>
        </button>
        {option === ContextMenuOptions.DELETE && <div className="context-menu-divider"></div>}
        </>
      ))}
    </div>
  );
};
