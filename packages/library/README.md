# CSS

Current configuration is css & css modules.

```
import from './styles.css';
import styles from './styles.module.css';
```

## Adding Sass & Sass Modules

TODO

## Adding Emotion

In order to add emotion, you need to install the following packages:

```
yarn add @emotion/react @emotion/styled
yarn add -D @emotion/jest
```

Update .eslintrc:

```
"rules": {
  ...
  "react/no-unknown-property": ["error", { "ignore": ["css"] }]
  ...
}
```

Update tsconfig.json:

```
"compilerOptions": {
  ...
  "jsxImportSource": "@emotion/react",
  ...
}
```

If you use `css`, then you need to add in this file:

```
/// <reference types="@emotion/react/types/css-prop" />

const Component = () => (
  <div
    css={css`
      color: hotpink;
    `}
  />
)
```

Why is this needed? It is because built files used in other projects will not have the typescript types. This is a way to tell typescript that this file has the types. Unfortunately not possible to add this to the `tsconfig.json` file.\
\
And finally, update `jest.config.cjs`:

```
snapshotSerializers: [..., '@emotion/jest/serializer', ...],
```

This is for more informative snapshots - the snapshots will contain styles information.

## Adding Styled Components

TODO
