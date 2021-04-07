# build-size

[![Node Version](https://img.shields.io/node/v/build-size.svg?style=flat-square)](https://www.npmjs.com/package/build-size)
[![Latest Version on NPM](https://img.shields.io/npm/v/build-size.svg?style=flat-square)](https://www.npmjs.com/package/build-size)
[![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)
[![Software License](https://img.shields.io/github/license/swisnl/build-size.svg?style=flat-square)](LICENSE)
[![Run Status](https://img.shields.io/travis/com/swisnl/build-size/master.svg?style=flat-square)](https://travis-ci.com/swisnl/build-size)
[![Made by SWIS](https://img.shields.io/badge/%F0%9F%9A%80-made%20by%20SWIS-%23D9021B.svg?style=flat-square)](https://www.swis.nl)

Parse and compare build size

## Install

Install locally with npm:
```bash
$ npm install --save-dev build-size
```

Install globally with npm:
```bash
$ npm install --global build-size
```

## Basic usage

Locally with npm:
```bash
# Display help
$ npm run build-size -- --help

# Parse
$ npm run build-size -- parse ./previous/**/*.js ./previous/**/*.css > previous.json
$ npm run build-size -- parse ./new/**/*.js ./new/**/*.css > new.json

# Compare
$ npm run build-size -- compare previous.json new.json
```

Globally:
```bash
# Display help
$ build-size --help

# Parse
$ build-size parse ./previous/**/*.js ./previous/**/*.css > previous.json
$ build-size parse ./new/**/*.js ./new/**/*.css > new.json

# Compare
$ build-size compare previous.json new.json
```

## Example output

Parse:
```bash
$ build-size parse js/*.js css/*.css
```

```json
{
  "js/app.js": 133104,
  "js/manifest.js": 1478,
  "js/vendor.js": 466292,
  "css/app.css": 24491
}
```

Compare:
```bash
$ build-size compare previous.json new.json
```

```markdown
This change will increase the build size from 610.71 KB to 616.04 KB, an increase of 5.33 KB \(1%\)

File name | Previous size | New size | Change
--- | --- | --- | ---
js\/app.js | 129.98 KB | 135.32 KB | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 5.33 KB \(4%\)
js\/manifest.js | 1.44 KB | 1.45 KB | ![▲](https://swisnl.github.io/build-size/images/increase.svg "Increase") 2 B \(0%\)
js\/vendor.js | 455.36 KB | 455.36 KB | 0 B \(0%\)
css\/app.css | 23.92 KB | 23.92 KB | 0 B \(0%\)
```


## Testing

``` bash
$ npm test
```


## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) and [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) for details.


## Security

If you discover any security related issues, please email security@swis.nl instead of using the issue tracker.


## Credits

Inspired by [BuildSize](https://github.com/Daniel15/BuildSize) and similar projects, such as [bundlesize](https://github.com/siddharthkp/bundlesize) and [Size Limit](https://github.com/ai/size-limit).


## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.


## SWIS

[SWIS](https://www.swis.nl) is a web agency from Leiden, the Netherlands. We love working with open source software.
