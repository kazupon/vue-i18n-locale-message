# :globe_with_meridians: vue-i18n-locale-message

[![npm](https://img.shields.io/npm/v/vue-i18n-locale-message.svg)](https://www.npmjs.com/package/vue-i18n-locale-message)
[![CircleCI](https://circleci.com/gh/kazupon/vue-i18n-locale-message.svg?style=svg)](https://circleci.com/gh/kazupon/vue-i18n-locale-message)
[![codecov](https://codecov.io/gh/kazupon/vue-i18n-locale-message/branch/master/graph/badge.svg)](https://codecov.io/gh/kazupon/vue-i18n-locale-message)

i18n locale messages management tool / library for vue-i18n

<a href="https://www.patreon.com/kazupon" target="_blank">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patreon">
</a>

## :raising_hand: Motivations

The big motivation is as follows.

- :tired_face: Hard to integrate locale messages for localization services
- :tired_face: Hard to maintain consistency of locale message keys (`eslint-plugin-vue-i18n` need it!)
- :pray: Requested by 3rd vendor tools (`i18n-ally` and etc ...)

## :cd: Installation

### npm

```sh
npm install --save-dev vue-i18n-locale-message
```

If you can globally use CLI only, you need `-g` option the below command.

```sh
npm install -g vue-i18n-locale-message
```

### yarn

```sh
yarn add -D vue-i18n-locale-message
```

If you can globally use CLI, you need `global` option the below command.

```sh
yarn global vue-i18n-locale-message
```

## :star: Features

- API
  - squeeze the meta of locale messages from `i18n` custom block
  - infuse the meta of locale messages to `i18n` custom block
- CLI
  - squeeze the locale messages from `i18n` custom block
  - infuse the locale messages to `i18n` custom block
  - push the locale messages to localization service
  - pull the locale mesagees from localization service

## :rocket: Usages

### API

```js
const fs = require('fs')
const { squeeze, infuse } = require('vue-i18n-locale-message')

// read single-file component contents
// NOTE: about scheme of target contents, see the `SFCInfo` type at `types/index.d.ts
const files = [
  {
    path: '/path/to/src/components/Modal.vue',
    content: `<template>
    ...
    <i18n>
    {
      ...
    }
    <i18n>`
  },
  // ...
]

// squeeze meta locale message from single-file components
// NOTE: about scheme of meta locale message, see the `MetaLocaleMessage` type at `types/index.d.ts`
const meta = squeeze('/path/to/src', files)

// write squeezed meta locale messages
fs.writeFileSync('/path/to/src/meta.json', JSON.stringify(meta))

// after update meta locale message with 3rd vendor tools or your code, it read meta locale messsage
const updatedMeta = require('/path/to/src/updated-meta.json')

// infuse meta locale message to single-file components
const updatedFiles = infuse('/path/to/src', files, updatedMeta)

// write updated single-file component
updateFiles.forEach(file => {
  fs.writeFileSync(file.path, file.content)
})
```

### CLI
#### Squeeze

```sh
vue-i18n-locale-message squeeze --target=./src --output=./messages.json
```

#### Infuse

```sh
vue-i18n-locale-message infuse --target=./src --locales=./translated.json
```

#### push

```sh
vue-i18n-locale-message push --provider=l10n-service-provider \
  --conf=110n-service-provider-conf.json \
  --target-paths=./src/locales/*.json \
  --filename-match=^([\\w]*)\\.json
```

#### pull

```sh
vue-i18n-locale-message pull --provider=l10n-service-provider \
  --conf=110n-service-provider-conf.json \
  --output=./src/locales
```

## :book: API: Specifications

<p align="center"><img width="476px" height="544px" src="./assets/api-usage-image.png" alt="API Usage Image"></p>


### sqeeze (basePath: string, files: SFCFileInfo[]): MetaLocaleMessage

  * **Arguments:**
    * `{string} basePath`: The base path that single-file components are located in project
    * `{SFCFileInfo[]} files`: The target single-file components information
  * **Return:** `MetaLocaleMessage`

Squeeze the meta of locale messages from i18n custom block at single-file components. 

In about structure of the meta information that is returned with this function, You can see the [here](https://github.com/kazupon/vue-i18n-locale-message/blob/master/types/index.d.ts#L34-L81).

### infuse (basePath: string, sources: SFCFileInfo[], meta: MetaLocaleMessage): SFCFileInfo[]

  * **Arguments:**
    * `{string} basePath`: The base path that single-file components are located in project
    * `{SFCFileInfo[]} sources`: The target single-file components information
    * `{MetaLocaleMessage}`: The meta of locale message
  * **Return:** `SFCFileInfo[]`

Infuse the meta of locale messages to i18n custom block at single-file components.

`infuse` function will return new single-file components information that is updated with the single-file components information specified as `sources` and  the meta of locale message as `meta`.

## :notebook: CLI: Locale message squeezing rules

The structure of locale messages to be squeezed is layered with the **directory structure** and **single-file component (`.vue`) filename**.

This repotitory `demo` project directory structure:

```sh
cd demo
tree src
src
├── App.vue
├── components
│   ├── Modal.vue
│   └── nest
│       └── RankingTable.vue
├── i18n.js
├── locales
│   ├── en.json
│   └── ja.json
├── main.js
└── pages
    └── Login.vue

4 directories, 8 files
```

You use `vue-cli-locale-message` CLI, run `squeeze` command as follows:

```sh
vue-i18n-locale-message squeeze --target=./src --output=./messages.json
cat ./messages.json
```

You will get the following JSON structure (the following output results are commented To make it easier to understand):

```json5
{
  "ja": { // for `ja` locale`
    "App": { // src/App.vue
      "title": "アプリケーション",
      "lang": "言語切り替え"
    },
    "components": { // src/components
      "Modal": { // src/components/Modal.vue
        "ok": "OK",
        "cancel": "キャンセル"
      }
    },
    "pages": { // src/pages
      "Login": { // src/pages/Login.vue
        "id": "ユーザーID",
        "password": "パスワード",
        "confirm": "パスワードの確認入力",
        "button": "ログイン"
      }
    }
  },
  "en": { // for `en` locale
    "App": { // src/App.vue
      "title": "Application",
      "lang": "Change languages"
    },
    "components": { // src/components
      "Modal": { // src/components/Modal.vue
        "ok": "OK",
        "cancel": "Cancel"
      },
      "nest": { // src/components/nest
        "RankingTable": { // src/components/nest/RankingTable.vue
          "headers": {
            "rank": "Rank",
            "name": "Name",
            "score": "Score"
          }
        }
      }
    }
  }
}
```

## :scroll: Changelog
Details changes for each release are documented in the [CHANGELOG.md](https://github.com/kazupon/vue-i18n-locale-message/blob/master/CHANGELOG.md).


## :exclamation: Issues
Please make sure to read the [Issue Reporting Checklist](https://github.com/kazupon/vue-i18n-locale-message/blob/master/.github/CONTRIBUTING.md#issue-reporting-guidelines) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## :white_check_mark: TODO
Managed with [GitHub Projects](https://github.com/kazupon/vue-i18n-locale-message/issues?q=is%3Aissue+is%3Aopen+label%3Atodo)

## :copyright: License

[MIT](http://opensource.org/licenses/MIT)
