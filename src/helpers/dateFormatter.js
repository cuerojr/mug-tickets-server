const dateFormatter = (rawData) => {
    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
        timeZone: 'America/Buenos_Aires'
    }).format(new Date(rawData));
}

const formatTime = (rawTime = '') => {
    const time = new Date(rawTime).toISOString().split('T')[1];
    return `${time.split(':')[0]}:${time.split(':')[1]}hs`;
}

export {
    dateFormatter,
    formatTime
}