import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { ENote, EOctave } from './components/Keyboard/interface'
import { Keyboard } from './components/Keyboard/Keyboard'

function App() {

  return (
    <>
      <Keyboard keyboardRange={[[ENote.A,EOctave._0],[ENote.C,EOctave._8]]}/>
    </>
  )
}

export default App
