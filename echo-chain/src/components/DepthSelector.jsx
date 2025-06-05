import React from 'react';

export default function DepthSelector() {
  return (
    <div className="flex justify-between my-4" role="radiogroup" aria-label="Depth selector">
      {[1, 2, 3, 4, 5].map(n => (
        <label key={n} className="flex flex-col items-center">
          <input type="radio" name="depth" value={n} />
          <span>{n}</span>
        </label>
      ))}
    </div>
  );
}
