import React, { Component } from 'react';
import moment from 'moment-timezone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TimeZoneDisplay from './TimeZoneDisplay';
import AddTimeZone from './AddTimeZone';

class TimeZoneConverter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeZones: ['UTC', 'Asia/Kolkata'], // Default time zones
      currentTime: moment(),
      darkMode: false,
      shareableLink: '',
    };
  }

  handleTimeZoneAddition = (timeZone) => {
    this.setState((prevState) => ({
      timeZones: [...prevState.timeZones, timeZone],
    }), this.updateShareableLink);
  };

  handleTimeZoneDeletion = (index) => {
    this.setState((prevState) => ({
      timeZones: prevState.timeZones.filter((_, i) => i !== index),
    }), this.updateShareableLink);
  };

  handleTimeChange = (newTime) => {
    this.setState({ currentTime: newTime }, this.updateShareableLink);
  };

  changeTiemeZone = (e, index) => {
    const { value } = e.target;
    const { timeZones } = this.state;
    timeZones[index] = value;
    this.setState({ timeZones }, this.updateShareableLink);
  };

  onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(this.state.timeZones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ timeZones: items }, this.updateShareableLink);
  };

  toggleDarkMode = () => {
    this.setState((prevState) => ({ darkMode: !prevState.darkMode }));
  };

  updateShareableLink = () => {
    const { timeZones, currentTime } = this.state;
    const params = new URLSearchParams();
    params.append('time', currentTime.toISOString());
    params.append('zones', timeZones.join(','));
    this.setState({ shareableLink: `${window.location.origin}?${params.toString()}` });
  };

  handleGoogleCalendar = () => {
    const { currentTime } = this.state;
    const event = {
      action: 'TEMPLATE',
      text: 'Meeting',
      dates: `${currentTime.format('YYYYMMDDTHHmmss')}Z/${currentTime.add(1, 'hours').format('YYYYMMDDTHHmmss')}Z`,
    };
    const query = new URLSearchParams(event).toString();
    window.open(`https://www.google.com/calendar/render?${query}`, '_blank');
  };

  render() {
    const { timeZones, currentTime, darkMode, shareableLink } = this.state;
    return (
      <div className={`time-zone-converter ${darkMode ? 'dark-mode' : ''}`}>
        <h1>Time Zone Converter</h1>
        <div className="controls">
          <AddTimeZone onAdd={this.handleTimeZoneAddition} />
          <div>
            <button onClick={this.toggleDarkMode}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button onClick={this.handleGoogleCalendar}>Add to Google Calendar</button>
            <button onClick={() => {
              alert('Shareable link copied to clipboard');
              navigator.clipboard.writeText(shareableLink)
            }}>
              Copy Shareable Link
            </button>
          </div>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {timeZones.map((zone, index) => (
                  <Draggable key={zone} draggableId={zone} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TimeZoneDisplay
                          dark={darkMode}
                          timeZone={zone}
                          currentTime={currentTime}
                          onTimeChange={this.handleTimeChange}
                          changeTiemeZone={(e) => this.changeTiemeZone(e, index)}
                          onDelete={() => this.handleTimeZoneDeletion(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {shareableLink && (
          <div className="shareable-link">
            <a href={shareableLink} target="_blank" rel="noopener noreferrer">
              Open Shareable Link
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default TimeZoneConverter;
