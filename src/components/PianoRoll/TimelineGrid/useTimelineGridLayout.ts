// src/hooks/useGridlines.ts
import { useTimelineGridStore } from './useTimelineGridStore';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { EOrientation } from '../interface';
import { useMidiStore } from '../useMidiStore';

export const useTimelineGridLayout = (timelineWidth: number, timelineHeight: number) => {
  const { orientation } = usePianoRollLayoutStore();
  const { isRecording, cursorStartTime, currentTime, windowStartTime, pixelsPerSecond } = useTimelineGridStore();
  const { tempo, timeSignature } = useMidiStore();
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;
  const secondsPerQuarter = (60 / tempo) / 4;
  // const quarterPerMeasure = quarterPerBeat * beatsPerMeasure;
  const pixelsPerQuarter = secondsPerQuarter * pixelsPerSecond;
  

  const quarterStartIndex = Math.floor(windowStartTime / secondsPerQuarter);
  const quarterEndIndex = Math.ceil(timelineWidth / pixelsPerQuarter + quarterStartIndex);

  // todo: grid layout
  const labelOffset = 6;
  const quarterLineOpacity = 0.15;
  const beatLineOpacity = 0.3;
  const measureLineOpacity = 0.5;

  // const quarterLineColor = "#555";
  // const beatLineColor = "#aaa";
  // const measureLineColor = "#fff";\
  const gridLineColor = "#fff";

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
    const opacity = measureLine ? measureLineOpacity : (quarterLine ? beatLineOpacity : quarterLineOpacity);
    // const color = measureLine ? measureLineColor : (quarterLine ? beatLineColor : quarterLineColor);
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
