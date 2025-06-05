import React, { useEffect, useRef } from 'react';

export default function EchoPlayer({ clip, persona }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [clip]);

  return (
    <div className="mb-4 text-center">
      <audio ref={audioRef} src={clip.audioUrl} />
      <p className="mt-2">Someone said…</p>
    </div>
  );
}
