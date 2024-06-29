import { MIDIProvider } from '@react-midi/hooks';
import './App.css';
import { PianoRoll } from './components/PianoRoll/PianoRoll';

function App() {
  return (
    <>
      <MIDIProvider>
        <PianoRoll/>
      </MIDIProvider>

    </>
  );
}

export default App;
