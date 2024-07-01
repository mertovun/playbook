import { useTimelineGridStore } from '../TimelineGrid/useTimelineGridStore';
import { usePianoRollHandlers } from '../usePianoRollHandlers';
import { measureBeatQuarter, formatMeasureBeatQuarter } from '../../../utils/time';
import { useMidiStore } from '../useMidi';

export const ControlBar = () => {
  const { isPlaying, stop, record, cursorStartTime, currentTime } = useTimelineGridStore();
  const { toggleOrientation, togglePlayPause } = usePianoRollHandlers();
  const { tempo, timeSignature } = useMidiStore();

  const formattedMeasureBeatQuarter = formatMeasureBeatQuarter(...measureBeatQuarter(currentTime, tempo, timeSignature));

  return (
    <div className="control-bar">
      <button onClick={toggleOrientation}>Toggle Orientation</button>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button disabled={cursorStartTime === currentTime} onClick={stop}>
        {'Stop'}
      </button>
      <button disabled={isPlaying} onClick={record}>
        {'Record'}
      </button>
      {formattedMeasureBeatQuarter}
    </div>
  );
};
