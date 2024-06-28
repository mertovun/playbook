import React from 'react';
import { useTimelineStore } from '../store';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
  const { currentTime, tempo, timeSignature } = useTimelineStore();
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;
  const secondsPerQuarter = 60 / tempo / 4;

  const pixelsPerSecond = 100; // todo: grid layout
  const quarterLineColor = "#333333";
  const beatLineColor = "#666666";
  const measureLineColor = "#999999";
  
  const pixelsPerQuarter = secondsPerQuarter * pixelsPerSecond;

  const gridlines = [];
  for (let quarterLineIndex = 0; quarterLineIndex < timelineWidth / pixelsPerQuarter; quarterLineIndex++) {
    const measureLine = quarterLineIndex % (beatsPerMeasure * quarterPerBeat) === 0;
    const measureLineIndex = Math.floor(quarterLineIndex / (beatsPerMeasure * quarterPerBeat) );
    const x = quarterLineIndex * pixelsPerQuarter;
    const quarterLine = quarterLineIndex % quarterPerBeat === 0;
    const color = measureLine ? measureLineColor : (quarterLine ? beatLineColor : quarterLineColor);
    const label = measureLine ? measureLineIndex : '';
    gridlines.push(
      <>
        <line key={quarterLineIndex} x1={x} y1="0" x2={x} y2={timelineHeight} stroke={color} strokeWidth="0.5" />
        {measureLine? <text
                x={x + 6}
                y={6}
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

  return (
    <g>
      {gridlines}
      <line
        x1={currentTime * pixelsPerSecond}
        y1="0"
        x2={currentTime * pixelsPerSecond}
        y2={timelineHeight}
        stroke="red"
        strokeWidth="1"
      />
    </g>
  );
};