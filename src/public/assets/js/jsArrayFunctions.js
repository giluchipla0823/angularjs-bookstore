export const extractColumn = (arr, column) => {
    function reduction(previousValue, currentValue) {
        previousValue.push(currentValue[column]);
        return previousValue;
    }

    return arr.reduce(reduction, []);
};

export default {
    extractColumn
};