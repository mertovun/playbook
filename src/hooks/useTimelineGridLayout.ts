import { useTimelineGridStore } from '../stores/useTimelineGridStore';
import { usePianoRollLayoutStore } from '../stores/usePianoRollLayoutStore';
import { useMidiStore } from '../stores/useMidiStore';
import { EOrientation } from '../components/PianoRoll/interface';

export const useTimelineGridLayout = (timelineWidth: number, timelineHeight: number) => {
  const { orientation } = usePianoRollLayoutStore();
  const { isRecording, cursorStartTime, currentTime, windowStartTime, pixelsPerSecond, gridTick } = useTimelineGridStore();
  const { tempo, timeSignature } = useMidiStore();
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const tickPerBeat = 4 * gridTick / beatUnit;
  const secondsPerTick = (60 / tempo) / gridTick;

  const pixelsPerTick = secondsPerTick * pixelsPerSecond;

  const tickStartIndex = Math.floor(windowStartTime / secondsPerTick);
  const tickEndIndex = Math.ceil(timelineWidth / pixelsPerTick + tickStartIndex);

  // todo: grid layout
  const labelOffset = 6;
  const tickLineOpacity = 0.15;
  const beatLineOpacity = 0.3;
  const measureLineOpacity = 0.5;


  const gridLineColor = "#fff";

  const gridlines = [];
  for (let tickLineIndex = tickStartIndex; tickLineIndex < tickEndIndex; tickLineIndex++) {
    const measureLine = tickLineIndex % (beatsPerMeasure * tickPerBeat) === 0;
    const measureLineIndex = Math.floor(tickLineIndex / (beatsPerMeasure * tickPerBeat) );
    const x = tickLineIndex * pixelsPerTick - windowStartTime * pixelsPerSecond;
    
    const x1 = orientation === EOrientation.HORIZONTAL ? 0 : x;
    const x2 = orientation === EOrientation.HORIZONTAL ? timelineWidth : x;
    const y1 = orientation === EOrientation.HORIZONTAL ? timelineHeight - x : 0;
    const y2 = orientation === EOrientation.HORIZONTAL ? timelineHeight - x : timelineHeight;

    const labelX = orientation === EOrientation.HORIZONTAL ? labelOffset : x + labelOffset ;
    const labelY = orientation === EOrientation.HORIZONTAL ? timelineHeight - x - labelOffset : labelOffset;

    const tickLine = tickLineIndex % tickPerBeat === 0;
    const opacity = measureLine ? measureLineOpacity : (tickLine ? beatLineOpacity : tickLineOpacity);

    const color = gridLineColor;
    const label: string  = measureLine ? measureLineIndex.toString() : '';
    gridlines.push(
      {
        x1,x2,y1,y2,label,labelX,labelY,color,opacity
      }
    ); 
  }

  const playCursor = {
    x1: orientation === EOrientation.HORIZONTAL ? 0 : (currentTime - windowStartTime) * pixelsPerSecond,
    x2: orientation === EOrientation.HORIZONTAL ? timelineWidth : (currentTime - windowStartTime) * pixelsPerSecond,
    y1: orientation === EOrientation.HORIZONTAL ? timelineHeight - (currentTime - windowStartTime) * pixelsPerSecond : 0,
    y2: orientation === EOrientation.HORIZONTAL ? timelineHeight - (currentTime - windowStartTime) * pixelsPerSecond : timelineHeight,
    color: isRecording ? 'red' : 'green'
  }

  const startCursor = {
    x1: orientation === EOrientation.HORIZONTAL ? 0 : (cursorStartTime - windowStartTime) * pixelsPerSecond,
    x2: orientation === EOrientation.HORIZONTAL ? timelineWidth : (cursorStartTime - windowStartTime) * pixelsPerSecond,
    y1: orientation === EOrientation.HORIZONTAL ? timelineHeight - (cursorStartTime - windowStartTime) * pixelsPerSecond : 0,
    y2: orientation === EOrientation.HORIZONTAL ? timelineHeight - (cursorStartTime - windowStartTime) * pixelsPerSecond : timelineHeight,
    color: 'orange'
  }

  return { gridlines, playCursor, startCursor };
};
