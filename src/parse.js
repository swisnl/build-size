'use strict';
const fs = require('fs');
const glob = require('glob');
const globToRegExp = require('glob-to-regexp');

function getFileSizeInBytes(filePatterns) {
    let result = {};

    filePatterns.forEach(function (filePattern) {
        let resultOriginalFileNames = {};
        getFilesMatchingPattern(filePattern).forEach(function (fileName) {
            let stats = fs.statSync(fileName);

            resultOriginalFileNames[fileName] = stats['size'];
        });

        if (filePattern.indexOf('[hash]') !== -1) {
            let regExp = convertGlobToRegex(filePattern);
            Object.keys(resultOriginalFileNames).forEach(function (fileName) {
                let regExpResult = regExp.exec(fileName);

                if (regExpResult) {
                    result[fileName.replace(regExpResult[1], '[hash]')] = resultOriginalFileNames[fileName];
                } else {
                    result[fileName] = resultOriginalFileNames[fileName];
                }
            });
        } else {
            Object.assign(result, resultOriginalFileNames);
        }
    });

    return result;
}

function getFilesMatchingPattern(filePattern) {
    return glob.sync(filePattern.replace('[hash]', '*'), {nonull: false, nodir: true});
}

function convertGlobToRegex(pattern) {
    let regexString = globToRegExp(pattern).toString();
    // Trim start and end slash
    regexString = regexString.substr(1, regexString.length - 2);
    // Replace [hash]
    regexString = regexString.replace('\\[hash\\]', '([a-z0-9]+)');

    return new RegExp(regexString);
}

module.exports = getFileSizeInBytes;
