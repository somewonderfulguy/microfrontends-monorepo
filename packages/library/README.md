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
  "types": [
    ...,
    "@emotion/react/types/css-prop",
    ...
  ],
  ...
}
```

## Adding Styled Components

TODO
