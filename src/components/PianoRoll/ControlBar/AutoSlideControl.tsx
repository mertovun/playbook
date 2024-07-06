import React from 'react';
import { TbArrowBigRightLines } from "react-icons/tb";

interface AutoSlideControlProps {
  toggleAutoSlide: () => void;
  formattedMeasureBeatQuarter: string;
}

const AutoSlideControl: React.FC<AutoSlideControlProps> = ({
  toggleAutoSlide,
  formattedMeasureBeatQuarter,
}) => {
  return (
    <div className="control-group">
      <button onClick={toggleAutoSlide}>
        <TbArrowBigRightLines />
      </button>
      {formattedMeasureBeatQuarter}
    </div>
  );
};

export default AutoSlideControl;
