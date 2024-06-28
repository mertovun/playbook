import React from 'react';
import { useTimelineStore } from '../store';
import usePianoRollLayoutStore from '../usePianoRollLayoutStore';
import { EOrientation } from '../interface';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
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
    const label = measureLine ? measureLineIndex : '';
    gridlines.push(
      <>
        <line key={quarterLineIndex} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.5" />
        {measureLine? <text
                x={labelX}
                y={labelY}
                alignmentBaseline="middle"
                textAnchor="middle"
                fontSize="10"
                fill={measureLineColor}
        >{label}
        </text> : ""
        
        }
      </>
    ); 
  }

  const x1 = orientation === EOrientation.HORIZONTAL ? 0 : currentTime * pixelsPerSecond;
  const x2 = orientation === EOrientation.HORIZONTAL ? timelineWidth : currentTime * pixelsPerSecond;
  const y1 = orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : 0;
  const y2 = orientation === EOrientation.HORIZONTAL ? timelineHeight - currentTime * pixelsPerSecond : timelineHeight;

  return (
    <g transform="translate(0,0), scale(1, 1)">
      {gridlines}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="red"
        strokeWidth="1"
      />
    </g>
  );
};