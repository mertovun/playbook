import { EOrientation } from './interface';
import { Keyboard } from './Keyboard/Keyboard';
import './PianoRoll.scss';
import { TimelineGrid } from './TimelineGrid/TimelineGrid';
import { TimelineBackground } from './Timeline/TimelineBackground';
import { usePianoRollLayoutStore } from '../../stores/usePianoRollLayoutStore';
import { usePianoRollHandlers } from '../../hooks/usePianoRollHandlers';
import { usePianoRollUpdate } from '../../hooks/usePianoRollUpdate';
import { useMidi } from '../../hooks/useMidi';
import { ControlBar } from './ControlBar/ControlBar';
import { useMetronome } from '../../hooks/useMetronome';
import { useTimelineSelect } from '../../hooks/useTimelineSelect';
import { SelectionRectangle } from './Timeline/SelectionRectangle';

export const PianoRoll = () => {
  const { 
    orientation, 
    pianoRollWidth, 
    pianoRollLength, 
    timelineX, 
    timelineY,
    timelineHeight,
    timelineWidth
  } = usePianoRollLayoutStore();

  const { 
    timelineSvgRef, 
    handleDrop,
    handleDragOver
  } = usePianoRollHandlers();
  const { selectionStart, selectionEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleClickSelect } = useTimelineSelect();
  usePianoRollUpdate();
  useMetronome();
  useMidi();

  const height = orientation === EOrientation.HORIZONTAL ? pianoRollLength : pianoRollWidth;
  const width = orientation === EOrientation.HORIZONTAL ? pianoRollWidth : pianoRollLength;

  return (
    <div className='pianoroll'>
      <div>
        <ControlBar />
        <div>
          <svg className={`pianoroll-svg ${orientation}`} width={width} height={height}>
            <Keyboard />
            <svg
              x={timelineX}
              y={timelineY}
              width={timelineWidth}
              height={timelineHeight}
              onClick={handleClickSelect}
              ref={timelineSvgRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <TimelineBackground width={timelineWidth} height={timelineHeight} />
              <TimelineGrid timelineWidth={timelineWidth} timelineHeight={timelineHeight} />
              <SelectionRectangle selectionStart={selectionStart} selectionEnd={selectionEnd} />
            </svg>
          </svg>
        </div>
      </div>
    </div>
  );
};
