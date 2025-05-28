const calculateEndDate = (startDate, durationString) => {
    const date = new Date(startDate);
    const parts = durationString.toLowerCase().split(' ');
    const value = parseInt(parts[0], 10);
    const unit = parts[1];

    if (isNaN(value)) {
        throw new Error('Invalid duration value provided');
    }

    switch (unit) {
        case 'day':
        case 'days':
            date.setDate(date.getDate() + value);
            break;
        case 'week':
        case 'weeks':
            date.setDate(date.getDate() + (value * 7)); 
            break;
        case 'month':
        case 'months':
            date.setMonth(date.getMonth() + value);
            break;
        case 'year':
        case 'years':
            date.setFullYear(date.getFullYear() + value);
            break;
        default:
            throw new Error(`Unsupported duration unit: ${unit}`);
    }

    return date;
};

module.exports = { calculateEndDate };