import React, { useCallback } from 'react';
import { PiSelectionPlusBold, PiPencilSimpleLineBold } from "react-icons/pi";
import { EditMode, useControlBarStore } from '../../../stores/useControlBarStore';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { useMidiStore } from '../../../stores/useMidiStore';


const EditModeControl: React.FC = () => {
  const { deselectAll } = useMidiStore();
  const { editMode, setEditMode } = useControlBarStore();
  const { gridTick, setGridTick } = useTimelineGridStore();
  
  const handleSelect = useCallback(() => {
    deselectAll();
    setEditMode(EditMode.SELECT)
  }, [deselectAll, setEditMode]);
  
  const handlePencil = useCallback(() => {
    deselectAll();
    setEditMode(EditMode.PENCIL)
  }, [deselectAll, setEditMode]);
  
  return (
    <div className="control-group">
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
        <PiSelectionPlusBold />
      </button>
      <button 
        onClick={handlePencil} 
        className={editMode === EditMode.PENCIL ? 'selected':''}
        >
        <PiPencilSimpleLineBold />
      </button>
    </div>
  );
};

export default EditModeControl;
