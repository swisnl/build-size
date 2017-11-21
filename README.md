# @swis/build-size

[![Latest Version on NPM](https://img.shields.io/npm/v/@swis/build-size.svg)](https://www.npmjs.com/package/@swisnl/build-size)
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

## License

`@swis/build-size` is licensed under the MIT License - see the [LICENSE file](LICENSE) for details

## Credits

Inspired by [BuildSize](https://github.com/Daniel15/BuildSize) and similar projects, such as [bundlesize](https://github.com/siddharthkp/bundlesize) and [Size Limit](https://github.com/ai/size-limit).
