class ClockModule {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.updateInterval = null;
        this.init();
    }

    async init() {
        const response = await fetch('/modules/clock/module.html');
        const html = await response.text();
        this.container.innerHTML = html;

        this.labelElement = this.container.querySelector('.clock-label');
        this.timeElement = this.container.querySelector('.clock-time');
        this.dateElement = this.container.querySelector('.clock-date');

        // Set label
        this.labelElement.textContent = this.config.label || 'Clock';

        // Initial update
        this.updateTime();

        // Update every second
        this.updateInterval = setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        const timezone = this.config.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
        const use24Hour = this.config.use24Hour !== false; // Default to 24-hour format
        const showSeconds = this.config.showSeconds !== false; // Default to showing seconds
        const showDate = this.config.showDate !== false; // Default to showing date

        try {
            const now = new Date();

            // Format time
            let timeString;
            if (this.config.timeFormat) {
                // Custom format string
                timeString = this.formatTime(now, timezone, this.config.timeFormat);
            } else {
                // Default format using Intl
                const timeOptions = {
                    timeZone: timezone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: !use24Hour
                };

                if (showSeconds) {
                    timeOptions.second = '2-digit';
                }

                timeString = now.toLocaleTimeString('en-US', timeOptions);
            }

            this.timeElement.textContent = timeString;

            // Format date
            if (showDate) {
                let dateString;
                if (this.config.dateFormat) {
                    // Custom format string
                    dateString = this.formatDate(now, timezone, this.config.dateFormat);
                } else {
                    // Default format using Intl
                    const dateOptions = {
                        timeZone: timezone,
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    };

                    dateString = now.toLocaleDateString('en-US', dateOptions);
                }

                this.dateElement.textContent = dateString;
                this.dateElement.style.display = 'block';
            } else {
                this.dateElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error updating clock:', error);
            this.timeElement.textContent = 'Invalid timezone';
            this.dateElement.textContent = '';
        }
    }

    formatTime(date, timezone, format) {
        // Get date parts in the specified timezone
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        }).formatToParts(date);

        const values = {};
        parts.forEach(({ type, value }) => {
            values[type] = value;
        });

        // Also get 12-hour format parts
        const parts12 = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).formatToParts(date);

        let hour12 = '';
        let period = '';
        parts12.forEach(({ type, value }) => {
            if (type === 'hour') hour12 = value;
            if (type === 'dayPeriod') period = value;
        });

        // Format replacements
        let result = format;
        result = result.replace('HH', values.hour.padStart(2, '0')); // 24-hour, 2-digit
        result = result.replace('H', parseInt(values.hour)); // 24-hour, no padding
        result = result.replace('hh', hour12.padStart(2, '0')); // 12-hour, 2-digit
        result = result.replace('h', hour12); // 12-hour, no padding
        result = result.replace('mm', values.minute.padStart(2, '0')); // Minutes, 2-digit
        result = result.replace('m', parseInt(values.minute)); // Minutes, no padding
        result = result.replace('ss', values.second.padStart(2, '0')); // Seconds, 2-digit
        result = result.replace('s', parseInt(values.second)); // Seconds, no padding
        result = result.replace('A', period.toUpperCase()); // AM/PM uppercase
        result = result.replace('a', period.toLowerCase()); // am/pm lowercase

        return result;
    }

    formatDate(date, timezone, format) {
        // Get date parts in the specified timezone
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            weekday: 'long'
        }).formatToParts(date);

        const values = {};
        parts.forEach(({ type, value }) => {
            values[type] = value;
        });

        // Get month/weekday names
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekdayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const monthNum = parseInt(values.month);
        const dayNum = parseInt(values.day);

        // Get the actual weekday for this date in the timezone
        const weekdayNum = new Date(date.toLocaleString('en-US', { timeZone: timezone })).getDay();

        // Format replacements
        let result = format;
        result = result.replace('YYYY', values.year); // 4-digit year
        result = result.replace('YY', values.year.slice(-2)); // 2-digit year
        result = result.replace('MMMM', monthNames[monthNum - 1]); // Full month name
        result = result.replace('MMM', monthShort[monthNum - 1]); // Short month name
        result = result.replace('MM', values.month.padStart(2, '0')); // 2-digit month
        result = result.replace('M', monthNum); // Month number, no padding
        result = result.replace('DD', values.day.padStart(2, '0')); // 2-digit day
        result = result.replace('D', dayNum); // Day number, no padding
        result = result.replace('dddd', weekdayNames[weekdayNum]); // Full weekday name
        result = result.replace('ddd', weekdayShort[weekdayNum]); // Short weekday name

        return result;
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

window.ClockModule = ClockModule;