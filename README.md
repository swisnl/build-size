# @swis/build-size

[![Node Version](https://img.shields.io/node/v/@swis/build-size.svg)](https://www.npmjs.com/package/@swis/build-size)
[![Latest Version on NPM](https://img.shields.io/npm/v/@swis/build-size.svg)](https://www.npmjs.com/package/@swis/build-size)
[![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) 
[![Software License](https://img.shields.io/github/license/swisnl/build-size.svg)](LICENSE)

Parse and compare build size

## Install

Install locally with npm:
```bash
$ npm install --save-dev @swis/build-size
```

Install globally with npm:
```bash
$ npm install --global @swis/build-size
```

## Basic usage

Locally with npm:
```bash
# Display help
$ npm run build-size --help

# Parse
$ npm run build-size parse ./previous/**/*.js ./previous/**/*.css > previous.json
$ npm run build-size parse ./new/**/*.js ./new/**/*.css > new.json

# Compare
$ npm run build-size compare previous.json new.json
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
js\/app.js | 129.98 KB | 135.32 KB | +5.33 KB \(4%\)
js\/manifest.js | 1.44 KB | 1.45 KB | +2 B \(0%\)
js\/vendor.js | 455.36 KB | 455.36 KB | +0 B \(0%\)
css\/app.css | 23.92 KB | 23.92 KB | +0 B \(0%\)
```

## License

`@swis/build-size` is licensed under the MIT License - see the [LICENSE file](LICENSE) for details

## Credits

Inspired by [BuildSize](https://github.com/Daniel15/BuildSize) and similar projects, such as [bundlesize](https://github.com/siddharthkp/bundlesize) and [Size Limit](https://github.com/ai/size-limit).
