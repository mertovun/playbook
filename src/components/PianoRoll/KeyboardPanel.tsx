import { ENote, EOctave, EOrientation, KeyboardRange } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import { useKeyboardPanelLayout } from './useKeyboardPanelLayout';
import './KeyboardPanel.css';
import { Timeline } from './Timeline/Timeline';

export const KeyboardPanel = () => {

  const { orientation, setOrientation, mapRangeToKeyboardNotes, mapRangeToKeyboardOctaves } = useKeyboardPanelLayout();

  const toggleOrientation = () => {
    setOrientation(orientation === EOrientation.HORIZONTAL ? EOrientation.VERTICAL : EOrientation.HORIZONTAL);
  };

  const keyboardRange: KeyboardRange = [[ENote.A, EOctave._0], [ENote.C, EOctave._8]];

  return (
    <>
      <button onClick={toggleOrientation}>
        Toggle Orientation
      </button>
      <svg className={`keyboard-svg ${orientation}`} width="100%" height="800">
        <Keyboard 
          keyboardRange={keyboardRange} 
          orientation={orientation} 
          mapRangeToKeyboardOctaves={mapRangeToKeyboardOctaves}
          mapRangeToKeyboardNotes={mapRangeToKeyboardNotes}
        />
        {/* <Timeline 
          keyboardRange={keyboardRange} 
          orientation={orientation} 
          mapRangeToTimelineOctaves={mapRangeToKeyboardOctaves}
          mapRangeToTimelineNotes={mapRangeToKeyboardNotes}
        /> */}
      </svg>
      
    </>
  );
};

export default KeyboardPanel;
