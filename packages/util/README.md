# @iota/util.js

The code in the package is mostly utility classes for the rest of the packages to use.

## Install

```shell
npm install @iota/util.js@2.0.0-rc.2
```

## Usage

```js
import { Converter } from "@iota/util.js";

const bytes = Converter.utf8ToBytes("Hello World");

const hex = Converter.bytesToHex(bytes);
```

## API

The class and method documentation can be found in [./docs/api.md](./docs/api.md)
