const ticketNumber = (ticketNumber = '') => {
    return (ticketNumber).toLocaleString('en-US', {
        minimumIntegerDigits: 7, 
        useGrouping:false
      });
};

const ticketNumbers = (ticketNumber = '') => {
    return (ticketNumber).toLocaleString('en-US', {
        minimumIntegerDigits: 7, 
        useGrouping:false
      });
};

const flattenArray = (array = []) => {
    let len = array.length;
    let result = [];
    for (let i = 0; i < len; i++) {
        let currentElement = array[i];
        if(Array.isArray(currentElement)) {
            let flattedArray = flattenArray(currentElement);
            result.push(...flattedArray);
        } else {
            result.push(currentElement);
        }
    }
    return result;
}

export {
    ticketNumber,
    ticketNumbers,
    flattenArray
}