import React from 'react';
import { TbArrowBigRightLines } from "react-icons/tb";
import { useControlBarStore } from '../../../stores/useControlBarStore';
import { formatMeasureBeatTick, timeToMeasureBeatTick } from '../../../utils/time';
import { usePianoRollHandlers } from '../../../hooks/usePianoRollHandlers';
import { useTimelineGridStore } from '../../../stores/useTimelineGridStore';
import { useMidiStore } from '../../../stores/useMidiStore';

const AutoSlideControl: React.FC = () => {
  const { currentTime, gridTick } = useTimelineGridStore();
  const { tempo, timeSignature } = useMidiStore();
  const formattedMeasureBeatTick = formatMeasureBeatTick(...timeToMeasureBeatTick(currentTime, tempo, timeSignature, gridTick));

  const { autoSlide } = useControlBarStore();
  const { toggleAutoSlide } = usePianoRollHandlers();

  return (
    <div className="control-group">
      <button onClick={toggleAutoSlide} className={autoSlide ? 'selected':''}>
        <TbArrowBigRightLines />
      </button>
      {formattedMeasureBeatTick}
    </div>
  );
};

export default AutoSlideControl;
