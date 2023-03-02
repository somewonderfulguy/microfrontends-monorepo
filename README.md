# Microfrontends with workspaces & rollup
This branch is abandoned. Please see master branch if you interested to see latest updates.

However, if you interested in example of microfrontends architecture using [workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/), [rollup](https://rollupjs.org/) (instead of Module federation) and [CRA](https://create-react-app.dev/).

Please, see architecture of project in `architecture.dio` file. You can open it right in VS Code if you have [Draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) plugin installed.

## Launch application

If you came from amother branch start with this command:
```
yarn wipe
```
Then, before first start, perform following commands:
```
yarn
yarn initialize
```
And now, whenever you develop just do this:
```
yarn start
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