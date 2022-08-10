import { FunctionComponent, HTMLProps } from 'react';

import { IButtonProps } from './components';

export type BlockComponent = FunctionComponent<HTMLProps<HTMLDivElement>>;
export type ButtonComponent = FunctionComponent<IButtonProps>;