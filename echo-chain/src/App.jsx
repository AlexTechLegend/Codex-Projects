import React, { useEffect, useState } from 'react';
import EchoPlayer from './components/EchoPlayer';
import DepthSelector from './components/DepthSelector';
import RecordButton from './components/RecordButton';
import PersonaSelector from './components/PersonaSelector';

export default function App() {
  const [clip, setClip] = useState(null);
  const [persona, setPersona] = useState('genz');

  useEffect(() => {
    fetch('/api/clip/next')
      .then(res => res.json())
      .then(setClip)
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-sm w-full">
      {clip && <EchoPlayer clip={clip} persona={persona} />}
      <DepthSelector />
      <RecordButton />
      <PersonaSelector persona={persona} onChange={setPersona} />
    </div>
  );
}
