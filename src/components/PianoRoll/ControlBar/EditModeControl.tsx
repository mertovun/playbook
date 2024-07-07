import React from 'react';
import { PiCursor, PiSelectionPlusBold, PiPencilSimpleLineBold } from "react-icons/pi";
import { EditMode, useControlBarStore } from '../../../stores/useControlBarStore';


const EditModeControl: React.FC = () => {
  const { editMode, setEditMode } = useControlBarStore();
  return (
    <div className="control-group">
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
