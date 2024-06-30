// src/hooks/useGridlines.ts
import { useTimelineGridStore } from './useTimelineGridStore';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { EOrientation } from '../interface';
import { useMidiStore } from '../useMidi';

export const useTimelineGridLayout = (timelineWidth: number, timelineHeight: number) => {
  const { orientation } = usePianoRollLayoutStore();
  const { isRecording, cursorStartTime, currentTime, timeSignature, windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { tempo } = useMidiStore();
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;
  const secondsPerQuarter = (60 / tempo) / 4;
  // const quarterPerMeasure = quarterPerBeat * beatsPerMeasure;
  const pixelsPerQuarter = secondsPerQuarter * pixelsPerSecond;
  

  const quarterStartIndex = Math.floor(windowStartTime / secondsPerQuarter);
  const quarterEndIndex = Math.ceil(timelineWidth / pixelsPerQuarter + quarterStartIndex);

  // todo: grid layout
  const labelOffset = 6;
  const quarterLineColor = "#333333";
  const beatLineColor = "#666666";
  const measureLineColor = "#999999";

  const gridlines = [];
  for (let quarterLineIndex = quarterStartIndex; quarterLineIndex < quarterEndIndex; quarterLineIndex++) {
    const measureLine = quarterLineIndex % (beatsPerMeasure * quarterPerBeat) === 0;
    const measureLineIndex = Math.floor(quarterLineIndex / (beatsPerMeasure * quarterPerBeat) );
    const x = quarterLineIndex * pixelsPerQuarter - windowStartTime * pixelsPerSecond;
    
    const x1 = orientation === EOrientation.HORIZONTAL ? 0 : x;
    const x2 = orientation === EOrientation.HORIZONTAL ? timelineWidth : x;
    const y1 = orientation === EOrientation.HORIZONTAL ? timelineHeight - x : 0;
    const y2 = orientation === EOrientation.HORIZONTAL ? timelineHeight - x : timelineHeight;

    const labelX = orientation === EOrientation.HORIZONTAL ? labelOffset : x + labelOffset ;
    const labelY = orientation === EOrientation.HORIZONTAL ? timelineHeight - x - labelOffset : labelOffset;

    const quarterLine = quarterLineIndex % quarterPerBeat === 0;
    const color = measureLine ? measureLineColor : (quarterLine ? beatLineColor : quarterLineColor);
    const label: string  = measureLine ? measureLineIndex.toString() : '';
    gridlines.push(
      {
        x1,x2,y1,y2,label,labelX,labelY,color
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
