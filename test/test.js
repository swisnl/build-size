'use strict';
/* global describe */
/* global it */
const assert = require('assert');
const buildSize = require('../index');

describe('build-size', function () {
    describe('parse', function () {
        it('should parse file sizes', function () {
            assert.deepEqual(
                buildSize.parse(['test/_files/*']),
                {
                    'test/_files/app.be5151c2f90464f5e9d98573fdadf3a9.js': 47516,
                    'test/_files/app.css': 12345,
                    'test/_files/app.ecf49a73567467e5325153fd251bd25a.js': 85654,
                    'test/_files/app.js': 28800,
                    'test/_files/app.no-hash.js': 35486
                }
            );
        });

        it('should parse file sizes of hashed files', function () {
            assert.deepEqual(
                buildSize.parse(['test/_files/*.[hash].js']),
                {
                    'test/_files/app.[hash].js': 85654
                }
            );
        });

        it('should combine multiple glob patterns', function () {
            assert.deepEqual(
                buildSize.parse(['test/_files/*.css', 'test/_files/*.[hash].js']),
                {
                    'test/_files/app.css': 12345,
                    'test/_files/app.[hash].js': 85654
                }
            );
        });
    });

    describe('compare', function () {
        it('should compare two files', function () {
            assert.deepEqual(
                buildSize.compare({'app.js': 200}, {'app.js': 250}).shift(),
                {
                    fileName: 'app.js',
                    previousSize: 200,
                    newSize: 250,
                    difference: {
                        bytes: 50,
                        percentage: 25
                    }
                }
            );
        });

        it('should handle missing previous file', function () {
            assert.deepEqual(
                buildSize.compare({}, {'app.js': 250}).shift(),
                {
                    fileName: 'app.js',
                    previousSize: null,
                    newSize: 250,
                    difference: {
                        bytes: 250,
                        percentage: 100
                    }
                }
            );
        });

        it('should handle missing new file', function () {
            assert.deepEqual(
                buildSize.compare({'app.js': 250}, {}).shift(),
                {
                    fileName: 'app.js',
                    previousSize: 250,
                    newSize: null,
                    difference: {
                        bytes: -250,
                        percentage: 100
                    }
                }
            );
        });

        it('should handle files with equal size', function () {
            assert.deepEqual(
                buildSize.compare({'app.js': 250}, {'app.js': 250}).shift(),
                {
                    fileName: 'app.js',
                    previousSize: 250,
                    newSize: 250,
                    difference: {
                        bytes: 0,
                        percentage: 0
                    }
                }
            );
        });

        it('should add a total comparison', function () {
            assert.deepEqual(
                buildSize.compare({'app.js': 200, 'app.css': 400}, {'app.js': 250, 'app.css': 500}).pop(),
                {
                    fileName: 'total',
                    previousSize: 600,
                    newSize: 750,
                    difference: {
                        bytes: 150,
                        percentage: 25
                    }
                }
            );
        });
    });

    describe('format', function () {
        it('should format results with total increase', function () {
            assert.equal(
                buildSize.format(
                    [
                        {
                            fileName: 'app.js',
                            previousSize: 200,
                            newSize: 250,
                            difference: {
                                bytes: 50,
                                percentage: 25
                            }
                        },
                        {
                            fileName: 'app.css',
                            previousSize: 400,
                            newSize: 500,
                            difference: {
                                bytes: 100,
                                percentage: 25
                            }
                        },
                        {
                            fileName: 'total',
                            previousSize: 600,
                            newSize: 750,
                            difference: {
                                bytes: 150,
                                percentage: 25
                            }
                        }
                    ]
                ),
                'This change will increase the build size from 600 B to 750 B, an increase of 150 B \\(25%\\)\n' +
                '\n' +
                'File name | Previous size | New size | Change\n' +
                '--- | --- | --- | ---\n' +
                'app.js | 200 B | 250 B | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 50 B \\(25%\\)\n' +
                'app.css | 400 B | 500 B | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 100 B \\(25%\\)'
            );
        });

        it('should format results with total decrease', function () {
            assert.equal(
                buildSize.format(
                    [
                        {
                            fileName: 'app.js',
                            previousSize: 250,
                            newSize: 200,
                            difference: {
                                bytes: -50,
                                percentage: 20
                            }
                        },
                        {
                            fileName: 'app.css',
                            previousSize: 500,
                            newSize: 400,
                            difference: {
                                bytes: -100,
                                percentage: 20
                            }
                        },
                        {
                            fileName: 'total',
                            previousSize: 750,
                            newSize: 600,
                            difference: {
                                bytes: -150,
                                percentage: 25
                            }
                        }
                    ]
                ),
                'This change will decrease the build size from 750 B to 600 B, a decrease of 150 B \\(25%\\)\n' +
                '\n' +
                'File name | Previous size | New size | Change\n' +
                '--- | --- | --- | ---\n' +
                'app.js | 250 B | 200 B | ![▼](https://swisnl.github.io/build-size/images/decrease.svg "Decrease") 50 B \\(20%\\)\n' +
                'app.css | 500 B | 400 B | ![▼](https://swisnl.github.io/build-size/images/decrease.svg "Decrease") 100 B \\(20%\\)'
            );
        });

        it('should format results without total', function () {
            assert.equal(
                buildSize.format(
                    [
                        {
                            fileName: 'app.js',
                            previousSize: 200,
                            newSize: 250,
                            difference: {
                                bytes: 50,
                                percentage: 25
                            }
                        },
                        {
                            fileName: 'app.css',
                            previousSize: 400,
                            newSize: 500,
                            difference: {
                                bytes: 100,
                                percentage: 25
                            }
                        }
                    ],
                    false
                ),
                'File name | Previous size | New size | Change\n' +
                '--- | --- | --- | ---\n' +
                'app.js | 200 B | 250 B | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 50 B \\(25%\\)\n' +
                'app.css | 400 B | 500 B | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 100 B \\(25%\\)'
            );
        });

        it('should format results with added file', function () {
            assert.equal(
                buildSize.format(
                    [
                        {
                            fileName: 'app.js',
                            previousSize: null,
                            newSize: 250,
                            difference: {
                                bytes: 250,
                                percentage: 100
                            }
                        }
                    ],
                    false
                ),
                'File name | Previous size | New size | Change\n' +
                '--- | --- | --- | ---\n' +
                'app.js | x | 250 B | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 250 B \\(100%\\)'
            );
        });

        it('should format results with removed file', function () {
            assert.equal(
                buildSize.format(
                    [
                        {
                            fileName: 'app.js',
                            previousSize: 250,
                            newSize: null,
                            difference: {
                                bytes: -250,
                                percentage: 100
                            }
                        }
                    ],
                    false
                ),
                'File name | Previous size | New size | Change\n' +
                '--- | --- | --- | ---\n' +
                'app.js | 250 B | x | ![▼](https://swisnl.github.io/build-size/images/decrease.svg "Decrease") 250 B \\(100%\\)'
            );
        });
    });
});
