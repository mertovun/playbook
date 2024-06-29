import React from 'react';
import { useTimelineGridLayout } from './useTimelineGridLayout';
import {GridLine} from './GridLine';
import {CursorLine} from './CursorLine';
import { useTimelineGridStore } from './useTimelineGridStore';

interface TimelineGridProps {
  timelineWidth: number;
  timelineHeight: number;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ timelineWidth, timelineHeight }) => {
  const { cursorStartTime, currentTime } = useTimelineGridStore();
  const { gridlines, startCursor, playCursor } = useTimelineGridLayout(timelineWidth, timelineHeight);

  return (
    <g transform="translate(0,0) scale(1,1)">
      {gridlines.map((lineProps, index) => (
        <GridLine key={index} {...lineProps} />
      ))}
      <CursorLine {...startCursor} />
      {cursorStartTime !== currentTime ? <CursorLine {...playCursor} /> : ''}
    </g>
  );
};

export default TimelineGrid;
