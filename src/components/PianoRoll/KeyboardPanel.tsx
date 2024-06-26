import { ENote, EOctave, EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { useKeyboardPanelLayout } from './useKeyboardPanelLayout';
import './KeyboardPanel.css';
import { Timeline } from './Timeline/Timeline';

export const KeyboardPanel = () => {

  const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];

  const { orientation, setOrientation, mapRangeToKeyboardNotes, mapRangeToKeyboardOctaves } = useKeyboardPanelLayout(keyboardRange);

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
        <Keyboard 
          orientation={orientation} 
          mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves}
          mapRangeToKeyboardNotes={mapRangeToKeyboardNotes}
        />
        {/* <Timeline  
          orientation={orientation} 
          mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves}
          mapRangeToTimelineNotes={mapRangeToKeyboardNotes}
        /> */}
      </svg>
      
    </>
  );
};

export default KeyboardPanel;
