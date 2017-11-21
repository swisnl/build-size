'use strict';
const filesize = require('filesize');
const markdownEscape = require('markdown-escape');

function getMarkdownForDifferences(difference, includeTotal = true) {
    let rows = [
        'File name | Previous size | New size | Change',
        '--- | --- | --- | ---'
    ];

    if (includeTotal) {
        let totalDifference = difference.pop();
        rows.unshift('');
        rows.unshift(
            markdownEscape(
                `This change will ${totalDifference.difference.bytes >= 0 ? 'increase' : 'decrease'} the build size from ${filesize(totalDifference.previousSize)} to ${filesize(totalDifference.newSize)}, ${totalDifference.difference.bytes >= 0 ? 'an increase' : 'a decrease'} of ${filesize(Math.abs(totalDifference.difference.bytes))} (${totalDifference.difference.percentage}%)`
            )
        );
    }

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

module.exports = getMarkdownForDifferences;
