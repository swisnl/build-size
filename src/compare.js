const filesize = require('filesize');
const markdownEscape = require('markdown-escape');

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
        }
    });
}

function compareTotalFileSizes(previousSizes, newSizes) {
    let previousSize = Object.values(previousSizes).reduce((a, b) => a + b, 0);
    let newSize = Object.values(newSizes).reduce((a, b) => a + b, 0);

    return {
        previousSize,
        newSize,
        difference: {
            bytes: getDifferenceInBytes(previousSize, newSize),
            percentage: getDifferenceInPercentage(previousSize, newSize)
        }
    }
}

function getDifferenceInBytes(previousSize, newSize) {
    if (previousSize && newSize) {
        return newSize - previousSize;
    } else if (previousSize) {
        return previousSize * -1;
    } else if (newSize) {
        return newSize;
    }

    return 0;
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

    return 0;
}

function getMarkdownForDifferences(totalDifference, difference) {
    let rows = [
        '',
        'File name | Previous size | New size | Change',
        '--- | --- | --- | ---'
    ];

    rows.unshift(
        markdownEscape(
            `This change will ${totalDifference.difference.bytes >= 0 ? 'increase' : 'decrease'} the build size from ${filesize(totalDifference.previousSize)} to ${filesize(totalDifference.newSize)}, ${totalDifference.difference.bytes >= 0 ? 'an increase' : 'a decrease'} of ${filesize(totalDifference.difference.bytes)} (${totalDifference.difference.percentage}%)`
        )
    );

    rows = rows.concat(difference.map(function (file) {
        let row = [];

        row.push(markdownEscape(file.fileName));
        row.push(file.previousSize ? filesize(file.previousSize) : 'x');
        row.push(file.newSize ? filesize(file.newSize) : 'x');
        row.push(markdownEscape(`${file.difference.bytes >= 0 ? '+' : ''}${filesize(file.difference.bytes)} (${file.difference.percentage}%)`));

        return row.join(' | ');
    }));

    return rows.join('\n');
}

module.exports = function compare(sizesOld, sizesNew, markdown = true) {
    let difference = compareFileSizes(sizesOld, sizesNew);

    if (!markdown) {
        return difference;
    }

    let totalDifference = compareTotalFileSizes(sizesOld, sizesNew);

    return getMarkdownForDifferences(totalDifference, difference);
};
