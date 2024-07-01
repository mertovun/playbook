
export function measureBeatQuarter(timeInSeconds:number, tempo:number, timeSignature:[number, number]): [number, number, number]{
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;

  const secondsPerQuarter = 60 / tempo / 4;
  let quarter = timeInSeconds /  secondsPerQuarter;
  let beat = Math.floor(quarter / quarterPerBeat);
  quarter -= beat * quarterPerBeat;
  const measure = Math.floor(beat/ beatsPerMeasure);
  beat -= measure * beatsPerMeasure;
  return [measure, beat, quarter]
}

export function formatMeasureBeatQuarter(measure:number, beat:number, quarter:number) {
  const formattedMeasure = measure.toString().padStart(1, '0');
  const formattedBeat = beat.toString().padStart(1, '0');
  const formattedQuarter = quarter.toFixed(3).padStart(5, '0');
  return ` ${formattedMeasure} : ${formattedBeat} : ${formattedQuarter}`;
}