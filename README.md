# mknode

Bootstrap Node.js projects with TypeScript, ESLint, Prettier and Docker

![Example](./example.svg)

## Overview

Tired of the tedious process of setting up NPM packages with all the necessary components, I developed a convenient tool to streamline the process. It uses my preferred configurations by default, but can be easily customized.

Although cloning a base repository, modifying `package.json` fields, and running `npm update` is an option, this tool allows you to get setup with a single command. It also offers the advantage of installing the latest versions of dependencies (unless specified otherwise), without being limited by the version ranges in the base repository's `package.json`.

Upon installation, you can find the configuration data for each file in `~/.config/mknode.json`. To modify the data for new projects, simply edit this file. For instance, to include [nodemon](https://www.npmjs.com/package/nodemon) in every project, add `nodemon` to the `devDependencies` array. Keep in mind that installing a new version of this package will overwrite any changes you've made.

## Installation

```
npm i -g mknode
```

Or use with npx:

```
npx mknode
```

## Usage

The CLI works like `npm init`. Just execute the following command and follow the prompts:

```
mknode
```

Or skip the prompts:

```
mknode -y
```
