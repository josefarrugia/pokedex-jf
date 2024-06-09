# Pokedex Explorer

## Description

This is a Pokedex Explorer where you can browse through a list of Pokemon, view detailed information and stats of each
Pokemon, add them to your favourites and filter/search by the name of the Pokemon or by their type.

## ✨ Features

- ⚡️ **Table View of Pokemon List**: Data is being fetched on the fly with the use of Apollo whilst browsing through the
  list
- ❤️ **Favourites Management**: Users can add and remove their favourites from a separate page with the use of 🍍Pinia
- 🔍 **Easy Searching of Pokemon**: Users can search easily looking for a Pokemon or can filter by type
- 🌟 **Simple UI/UX**: Users can enjoy a smooth experience browsing through the list whether they are on their desktop
  machine or their mobile device

## 🛠️ Tech Implementation

1. [Use of Vuetify for UI/UX](https://vuetifyjs.com/en/)
2. [Pinia for State Management](https://pinia.vuejs.org/)
3. [Vue 3](https://vuejs.org/)(https://vuejs.org/)
4. [Prettier to make the code looking pretty](https://prettier.io/)

## 🔮 Future Features and Wishes

- [ ] Sort data by column
- [ ] Pinia Persist Storage for Favourites
- [ ] Fix `console warning` messages
- [ ] Improve GQL implementation with codegen generation
- [ ] Add more TypeScript types

## 💿 Install

Set up your project using your preferred package manager. Use the corresponding command to install the dependencies:

| Package Manager                                           | Command        |
|-----------------------------------------------------------|----------------|
| [yarn](https://yarnpkg.com/getting-started)               | `yarn install` |
| [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) | `npm install`  |
| [pnpm](https://pnpm.io/installation)                      | `pnpm install` |
| [bun](https://bun.sh/#getting-started)                    | `bun install`  |

These features are curated to provide a seamless development experience from setup to deployment, ensuring that your
Vuetify application is both powerful and maintainable.

## 💡 Usage

This section covers how to start the development server and build the project for production.

### Starting the Development Server

To start the development server with hot-reload, run the following command. The server will be accessible
at [http://localhost:3000](http://localhost:3000):

```bash
yarn dev
```

(Repeat for npm, pnpm, and bun with respective commands.)

> Add NODE_OPTIONS='--no-warnings' to suppress the JSON import warnings that happen as part of the Vuetify import
> mapping. If you are on Node [v21.3.0](https://nodejs.org/en/blog/release/v21.3.0) or higher, you can change this to
> NODE_OPTIONS='--disable-warning=5401'. If you don't mind the warning, you can remove this from your package.json dev
> script.

### Building for Production

To build your project for production, use:

```bash
npm build
```

(Repeat for npm, pnpm, and bun with respective commands.)

Once the build process is completed, your application will be ready for deployment in a production environment.

## ❗️ Important Links

- 🙋🏻‍ [LinkedIn of Jose Farrugia](https://www.linkedin.com/josefarrugia)
- 🌐 [PokeAPI](https://pokeapi.co/docs/graphql)
