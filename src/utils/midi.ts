
export const dispatchNoteOnMessage = (midiNum: number, velocity: number) =>{
  const noteOnMessage = [0x90, midiNum, velocity]; // 0x90 is the Note On message
  window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOnMessage } }));
}

export const dispatchNoteOffMessage = (midiNum: number, velocity: number) =>{
  const noteOffMessage = [0x80, midiNum, velocity]; // 0x80 is the Note Off message
  window.dispatchEvent(new CustomEvent('midi', { detail: { data: noteOffMessage } }));
}
