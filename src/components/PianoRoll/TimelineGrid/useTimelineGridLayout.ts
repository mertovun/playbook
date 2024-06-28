// src/hooks/useGridlines.ts
import { useTimelineStore } from '../store';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { EOrientation } from '../interface';

export const useTimelineGridLayout = (timelineWidth: number, timelineHeight: number) => {
  const { orientation } = usePianoRollLayoutStore();
  const { currentTime, tempo, timeSignature } = useTimelineStore();
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
    const label: string | number = measureLine ? measureLineIndex : '';
    gridlines.push(
      {
        x1,x2,y1,y2,label,labelX,labelY,color
      }
    ); 
  }

  const x1 = orientation === EOrientation.HORIZONTAL ? 0 : currentTime * pixelsPerSecond;
  const x2 = orientation === EOrientation.HORIZONTAL ? timelineWidth : currentTime * pixelsPerSecond;
  const y1 = orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : 0;
  const y2 = orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : timelineHeight;

  return { gridlines, cursor: { x1, y1, x2, y2 } };
};
