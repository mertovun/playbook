import React from 'react';
import { useTimelineGridLayout } from './useTimelineGridLayout';
import {GridLine} from './GridLine';
import {CursorLine} from './CursorLine';
import { useTimelineStore } from '../useTimelineStore';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
  const { startTime, currentTime, setStartTime } = useTimelineStore();
  const { gridlines, startCursor, playCursor } = useTimelineGridLayout(timelineWidth, timelineHeight);

  return (
    <g transform="translate(0,0) scale(1,1)">
      {gridlines.map((lineProps, index) => (
        <GridLine key={index} {...lineProps} />
      ))}
      <CursorLine {...startCursor} />
      {startTime !== currentTime ? <CursorLine {...playCursor} /> : ''}
    </g>
  );
};

export default TimelineGrid;
