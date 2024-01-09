The project is a playground for learning and practicing modern frontend technologies.

It is a monorepo that consists of 3 packages:

- host - the main application that uses other packages
- sub-application - the application that is used by host amd potentially can be used as standalone application
- library - the library of reusable components

Please, see architecture of project in `architecture.dio` file. You can open it right in VS Code if you have [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) plugin installed.

Architecture plans:

- migrate every package to Vite
- migrate monorepo to Nx
- create an app or components and share them via Module Federation (microfrontends)

## Storybook (library package)

If you run library package you'll notice that Storybook is heavily modified.\
It is still in progress with customizing it.

What is done so far:

- changing theme of the storybook itself in top bar (however only `yellow` theme is looking okay, rest to be improved)
- it is possible to change theme of components as well as select multiple themes at once in top bar (for this I created custom Storybook [addon](https://storybook.js.org/addons/storybook-addon-multiselect/))

What is to be done:

- finish theming of the storybook itself
- implement switching language of components

How Storybook UI and multiple theme variations look like:

![image](https://github.com/somewonderfulguy/microfrontends-monorepo/assets/23312484/604af243-509d-43c0-8611-4fb3bfd3d8dd)

You can change the theme of the Storybook itself using "Theme Storybook" dropdown in top panel - it will change the theme of the outer shell, not internal components (compare with screenshot above):

![image](https://github.com/somewonderfulguy/cyberpunk/assets/23312484/3e02345a-6117-474f-bd01-75824cd0b839)


## Launch application

Before first start, perform following commands:

```
yarn
yarn initialize
```

And now, whenever you develop just do this:

```
yarn start
```

## Edit shared components

Assuming you are working with some library component and see changes in Storybook but you want your changes to be in other projects (host and sub-application). Then yo need to perform this:

```
cd ./packages/library
yarn build:rollup
```

Do the same thing when you edit sub-appication code and want to see your changes in host application:

```
cd ./packages/sub-application
yarn build:rollup
```

## Build & serve

This is quite straightforward process:

```
yarn build
yarn serve
```

Now you can open http://localhost:5003 and ensure that all the components from separate project have been successfuly built into single application that is named as `host` in the file directory.

## Library tests

Go to `library` project (`cd ./packages/library`). Here you can run tests. The project completely covered with tests as library elements expected to be reusable and very stable.
Following command runs tests in watch mode:

```
yarn test
```

For test coverage run:

```
yarn test:coverage
```

And then you can open `library/coverage/lcov-report/index.html` in your browser to see test coverage report.
