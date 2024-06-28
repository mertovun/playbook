
export function currentMeasureBeatQuarter(currentTimeInSeconds:number, tempo:number, timeSignature:[number, number]): [number, number, number]{
  const [beatsPerMeasure, beatUnit] = timeSignature;
  const quarterPerBeat = 16 / beatUnit;

  const secondsPerQuarter = 60 / tempo / 4;
  let currentQuarter = currentTimeInSeconds /  secondsPerQuarter;
  let currentBeat = Math.floor(currentQuarter / quarterPerBeat);
  currentQuarter -= currentBeat * quarterPerBeat;
  let currentMeasure = Math.floor(currentBeat/ beatsPerMeasure);
  currentBeat -= currentMeasure * beatsPerMeasure;
  return [currentMeasure, currentBeat, currentQuarter]
}

export function formatMeasureBeatQuarter(currentMeasure:number, currentBeat:number, currentQuarter:number) {
  const formattedMeasure = currentMeasure.toString().padStart(2, '0');
  const formattedBeat = currentBeat.toString().padStart(2, '0');
  const formattedQuarter = currentQuarter.toFixed(3).padStart(5, '0');
  return `${formattedMeasure}:${formattedBeat}:${formattedQuarter}`;
}