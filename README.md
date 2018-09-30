# differencify-jest-reporter
A Jest reporter for [Differencify](https://github.com/NimaSoroush/differencify)

## Installation

Using npm:

```bash
$ npm i -D differencify-jest-reporter
```

## Usage

Jest CLI:

```bash
jest --reporters differencify-jest-reporter
```

Jest Config:

```json
{
  "reporters": ["differencify-jest-reporter"]
}
```

## Options

### debug: boolean

Logs the output to consol

### reportPath: string

Report directory relative to root of project

### reportTypes: object

File name for generating a html report and json


```json
  reporters: [
    'default', // keep the default reporter
    [
      'differencify-jest-reporter',
      {
        debug: true,
        reportPath: 'differencify_reports',
        reportTypes: {
          html: 'index.html',
          json: 'index.json',
        },
      },
    ],
  ],
```

Note: Options are available only via jest.config file

## Licence

MIT
