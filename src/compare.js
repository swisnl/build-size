'use strict';

function compareFileSizes(previousSizes, newSizes) {
    return Object.keys(Object.assign({}, previousSizes, newSizes)).map(function (fileName) {
        let previousSize = previousSizes[fileName] || null;
        let newSize = newSizes[fileName] || null;

        return {
            fileName,
            previousSize,
            newSize,
            difference: {
                bytes: getDifferenceInBytes(previousSize, newSize),
                percentage: getDifferenceInPercentage(previousSize, newSize)
            }
        };
    });
}

function compareTotalFileSizes(previousSizes, newSizes) {
    let previousSize = Object.values(previousSizes).reduce((a, b) => a + b, 0);
    let newSize = Object.values(newSizes).reduce((a, b) => a + b, 0);

    return {
        fileName: 'total',
        previousSize,
        newSize,
        difference: {
            bytes: getDifferenceInBytes(previousSize, newSize),
            percentage: getDifferenceInPercentage(previousSize, newSize)
        }
    };
}

function getDifferenceInBytes(previousSize, newSize) {
    if (previousSize && newSize) {
        return newSize - previousSize;
    } else if (previousSize) {
        return previousSize * -1;
    } else if (newSize) {
        return newSize;
    }
}

function getDifferenceInPercentage(previousSize, newSize) {
    if (previousSize && newSize) {
        let difference = Math.abs(getDifferenceInBytes(previousSize, newSize));

        return Math.round(difference / previousSize * 100);
    } else if (previousSize) {
        return 100;
    } else if (newSize) {
        return 100;
    }
}

module.exports = function compare(previousSizes, newSizes, excludeUnchanged) {
    let files = compareFileSizes(previousSizes, newSizes);

    if (excludeUnchanged) {
        files = files.filter(file => file.difference.bytes !== 0);
    }

    return files.concat([compareTotalFileSizes(previousSizes, newSizes)]);
};
