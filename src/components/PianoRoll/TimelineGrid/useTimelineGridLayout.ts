// src/hooks/useGridlines.ts
import { useTimelineStore } from '../useTimelineStore';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { EOrientation } from '../interface';

export const useTimelineGridLayout = (timelineWidth: number, timelineHeight: number) => {
  const { orientation } = usePianoRollLayoutStore();
  const { startTime, currentTime, tempo, timeSignature } = useTimelineStore();
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;
  const secondsPerQuarter = 60 / tempo / 4;

  const pixelsPerSecond = 100; // todo: grid layout
  const labelOffset = 6;
  const quarterLineColor = "#333333";
  const beatLineColor = "#666666";
  const measureLineColor = "#999999";

  const pixelsPerQuarter = secondsPerQuarter * pixelsPerSecond;

  const gridlines = [];
  for (let quarterLineIndex = 0; quarterLineIndex < timelineWidth / pixelsPerQuarter; quarterLineIndex++) {
    const measureLine = quarterLineIndex % (beatsPerMeasure * quarterPerBeat) === 0;
    const measureLineIndex = Math.floor(quarterLineIndex / (beatsPerMeasure * quarterPerBeat) );
    const x = quarterLineIndex * pixelsPerQuarter;
    
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
    x1: orientation === EOrientation.HORIZONTAL ? 0 : currentTime * pixelsPerSecond,
    x2: orientation === EOrientation.HORIZONTAL ? timelineWidth : currentTime * pixelsPerSecond,
    y1: orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : 0,
    y2: orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : timelineHeight,
    color: 'red'
  }

  const startCursor = {
    x1: orientation === EOrientation.HORIZONTAL ? 0 : startTime * pixelsPerSecond,
    x2: orientation === EOrientation.HORIZONTAL ? timelineWidth : startTime * pixelsPerSecond,
    y1: orientation === EOrientation.HORIZONTAL ? timelineHeight - startTime * pixelsPerSecond : 0,
    y2: orientation === EOrientation.HORIZONTAL ? timelineHeight - startTime * pixelsPerSecond : timelineHeight,
    color: 'orange'
  }

  return { gridlines, playCursor, startCursor };
};
