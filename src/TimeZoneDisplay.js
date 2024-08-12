import React from 'react';
import moment from 'moment-timezone';

const TimeZoneDisplay = ({ timeZone, changeTiemeZone, currentTime, onTimeChange, onDelete, dark }) => {
  const localTime = currentTime.tz(timeZone);

  const handleSliderChange = (event) => {
    const hours = parseInt(event.target.value, 10);
    const newTime = moment(currentTime).hours(hours);
    onTimeChange(newTime);
  };

  return (
    <div className={`time-zone-display ${dark ? 'dark-mode' : ''}`}>
      <div className="time-zone-header">
        <select value={timeZone} onChange={(e) => {
          changeTiemeZone(e);
        }}>
          {moment.tz.names().map((zone) => (
            <option style={{
              color: zone === timeZone ? 'black' : 'gray',
            }} key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        <button onClick={onDelete}>Remove</button>
      </div>
      <div className="time-slider">
        <input
          type="range"
          min="0"
          max="23"
          value={localTime.hours()}
          onChange={handleSliderChange}
        />
        <span>{localTime.format('HH:mm')}</span>
      </div>
    </div>
  );
};

export default TimeZoneDisplay;
