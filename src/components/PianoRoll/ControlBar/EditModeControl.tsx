import React from 'react';
import { PiCursor, PiSelectionPlusBold, PiPencilSimpleLineBold } from "react-icons/pi";
import { EditMode, useControlBarStore } from '../../../stores/useControlBarStore';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';


const EditModeControl: React.FC = () => {
  const { editMode, setEditMode } = useControlBarStore();
  const { gridTick, setGridTick } = useTimelineGridStore();
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
        onClick={() => setEditMode(EditMode.CURSOR)} 
        className={editMode === EditMode.CURSOR ? 'selected':''}
        >
        <PiCursor />
      </button>
      <button 
        onClick={() => setEditMode(EditMode.SELECT)} 
        className={editMode === EditMode.SELECT ? 'selected':''}
        >
        <PiSelectionPlusBold />
      </button>
      <button 
        onClick={() => setEditMode(EditMode.PENCIL)} 
        className={editMode === EditMode.PENCIL ? 'selected':''}
        >
        <PiPencilSimpleLineBold />
      </button>
    </div>
  );
};

export default EditModeControl;
