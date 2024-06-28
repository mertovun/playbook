import React from 'react';
import { useTimelineStore } from '../store';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
  const { currentTime, tempo, timeSignature } = useTimelineStore();
  const [beatsPerBar, beatUnit] = timeSignature;
  const secondsPerBeat = 60 / tempo;
  const pixelsPerSecond = 100; // todo: grid layout

  const gridlines = [];
  for (let i = 0; i < timelineWidth / (secondsPerBeat * pixelsPerSecond); i++) {
    const x = i * secondsPerBeat * pixelsPerSecond;
    const color = i % beatsPerBar === 0 ? 'lightgrey' : 'gray';
    gridlines.push(<line key={i} x1={x} y1="0" x2={x} y2={timelineHeight} stroke={color} />);
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