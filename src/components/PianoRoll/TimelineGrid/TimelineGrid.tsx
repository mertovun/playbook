// src/components/GridLines/TimelineGrid.tsx
import React from 'react';
import { useTimelineGridLayout } from './useTimelineGridLayout';
import {GridLine} from './GridLine';
import {CursorLine} from './CursorLine';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
  const { gridlines, cursor } = useTimelineGridLayout(timelineWidth, timelineHeight);

  return (
    <g transform="translate(0,0) scale(1,1)">
      {gridlines.map((lineProps, index) => (
        <GridLine key={index} {...lineProps} />
      ))}
      <CursorLine {...cursor} />
    </g>
  );
};

export default TimelineGrid;
