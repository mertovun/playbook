import React, { useCallback, useEffect } from 'react';
import { PiSelectionPlusBold, PiPencilSimpleLineBold } from "react-icons/pi";
import { EditMode, useControlBarStore } from '../stores/useControlBarStore';
import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { useMidiStore } from '../stores/useMidiStore';
import { VscMagnet } from 'react-icons/vsc';


const EditModeControl: React.FC = () => {
  const { deselectAll } = useMidiStore();
  const { editMode, setEditMode, gridSnap, setGridSnap } = useControlBarStore();
  const { gridTick, setGridTick } = useTimelineGridStore();

  const handleSnap = useCallback(() => {
    setGridSnap(!gridSnap);
  }, [setGridSnap, gridSnap]);
  
  const handleSelect = useCallback(() => {
    deselectAll();
    setEditMode(EditMode.SELECT)
  }, [deselectAll, setEditMode]);
  
  const handlePencil = useCallback(() => {
    deselectAll();
    setEditMode(EditMode.PENCIL)
  }, [deselectAll, setEditMode]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' || event.key === 'S') {
        event.preventDefault(); // Prevent any default behavior associated with the 'S' key
        handleSelect();
      }
      if (event.key === 'b' || event.key === 'B') {
        event.preventDefault(); // Prevent any default behavior associated with the 'B' key
        handlePencil();
      }
      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault(); // Prevent any default behavior associated with the 'B' key
        handleSnap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSelect, handlePencil, handleSnap]);
  
  return (
    <div className="control-group">
      <button 
        onClick={handleSnap} 
        className={gridSnap ? 'selected':''}
        >
        <VscMagnet title='Snap to Grid [G]' />
      </button>
      <label>
        Grid: 1 /
        <select
          value={gridTick}
          onChange={(e) => {
            setGridTick(Number(e.target.value));
          }}
        >
          {[1, 2, 3, 4, 6, 8].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <button 
        onClick={handleSelect} 
        className={editMode === EditMode.SELECT ? 'selected':''}
        >
        <PiSelectionPlusBold title='Select Mode [S]' />
      </button>
      <button 
        onClick={handlePencil} 
        className={editMode === EditMode.PENCIL ? 'selected':''}
        >
        <PiPencilSimpleLineBold title='Pencil Mode [B]' />
      </button>
    </div>
  );
};

export default EditModeControl;
