import React, { useState } from 'react';
import moment from 'moment-timezone';

const AddTimeZone = ({ onAdd }) => {
  const [selectedZone, setSelectedZone] = useState('UTC');

  const handleAdd = () => {
    onAdd(selectedZone);
  };

  return (
    <div className="add-time-zone">
      <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
        {moment.tz.names().map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
      <button onClick={handleAdd}>Add Time Zone</button>
    </div>
  );
};

export default AddTimeZone;
