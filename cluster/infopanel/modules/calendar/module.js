class CalendarModule {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.events = [];
    this.init();
  }

  async init() {
    const response = await fetch('/modules/calendar/module.html');
    const html = await response.text();
    this.container.innerHTML = html;

    this.eventsContainer = this.container.querySelector('.calendar-events');

    if (this.config.icalUrl) {
      await this.loadICalEvents();
    } else if (this.config.icalPath) {
      await this.loadICalFromPath();
    }

    this.render();
  }

  async loadICalFromPath() {
    try {
      const response = await fetch(this.config.icalPath);
      const icalData = await response.text();
      this.parseICal(icalData);
    } catch (error) {
      console.error('Failed to load iCal from path:', error);
    }
  }

  async loadICalEvents() {
    try {
      const response = await fetch(this.config.icalUrl);
      const icalData = await response.text();
      this.parseICal(icalData);
    } catch (error) {
      console.error('Failed to load iCal:', error);
    }
  }

  parseICal(icalData) {
    this.events = [];
    const lines = icalData.split(/\r?\n/);
    let currentEvent = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === 'BEGIN:VEVENT') {
        currentEvent = {};
      } else if (line === 'END:VEVENT' && currentEvent) {
        if (currentEvent.start) {
          this.events.push(currentEvent);
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('DTSTART')) {
          const dateMatch = line.match(/:(.*?)$/);
          if (dateMatch) {
            currentEvent.start = this.parseICalDate(dateMatch[1]);
          }
        } else if (line.startsWith('DTEND')) {
          const dateMatch = line.match(/:(.*?)$/);
          if (dateMatch) {
            currentEvent.end = this.parseICalDate(dateMatch[1]);
          }
        } else if (line.startsWith('SUMMARY:')) {
          currentEvent.summary = line.substring(8);
        } else if (line.startsWith('DESCRIPTION:')) {
          currentEvent.description = line.substring(12);
        }
      }
    }

    // Sort events by start date
    this.events.sort((a, b) => a.start - b.start);
  }

  parseICalDate(dateStr) {
    // Handle both formats: YYYYMMDD and YYYYMMDDTHHMMSS
    if (dateStr.includes('T')) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(9, 11);
      const minute = dateStr.substring(11, 13);
      const second = dateStr.substring(13, 15);
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    } else {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
  }

  getUpcomingEvents() {
    const now = new Date();
    const upcoming = this.events.filter(event => event.start >= now);

    const displayMode = this.config.displayMode || 'count';
    
    if (displayMode === 'count') {
      const count = this.config.eventCount || 5;
      return upcoming.slice(0, count);
    } else if (displayMode === 'timeRange') {
      const days = this.config.days || 7;
      const weeks = this.config.weeks || 0;
      const months = this.config.months || 0;
      
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + days);
      endDate.setDate(endDate.getDate() + (weeks * 7));
      endDate.setMonth(endDate.getMonth() + months);
      
      return upcoming.filter(event => event.start <= endDate);
    }

    return upcoming.slice(0, 5);
  }

  formatDate(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  formatTime(date) {
    const options = { hour: 'numeric', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  }

  render() {
    const upcomingEvents = this.getUpcomingEvents();

    if (upcomingEvents.length === 0) {
      this.eventsContainer.innerHTML = '<div class="no-events">No upcoming events</div>';
      return;
    }

    this.eventsContainer.innerHTML = upcomingEvents.map(event => `
      <div class="calendar-event">
        <div class="event-date">${this.formatDate(event.start)}</div>
        ${event.start.getHours() !== 0 || event.start.getMinutes() !== 0 ? 
          `<div class="event-time">${this.formatTime(event.start)}</div>` : ''}
        <div class="event-title">${this.escapeHtml(event.summary || 'Untitled Event')}</div>
        ${event.description ? 
          `<div class="event-description">${this.escapeHtml(event.description)}</div>` : ''}
      </div>
    `).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    // Cleanup if needed
  }
}

window.CalendarModule = CalendarModule;
