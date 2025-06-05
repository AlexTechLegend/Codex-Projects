import React from 'react';

const options = [
  { value: 'genz', label: 'Gen Z' },
  { value: 'millennial', label: 'Millennial' },
  { value: 'boomer', label: 'Boomer' }
];

export default function PersonaSelector({ persona, onChange }) {
  return (
    <div className="mt-4 text-right">
      <select value={persona} onChange={e => onChange(e.target.value)} className="border rounded p-1">
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
