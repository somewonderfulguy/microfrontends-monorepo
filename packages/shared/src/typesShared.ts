import { FunctionComponent, HTMLProps } from 'react';

import { IButtonProps } from './components';
import { federatedComponent } from './hoc';

export type BlockComponent = FunctionComponent<HTMLProps<HTMLDivElement>>;
export type ButtonComponent = FunctionComponent<IButtonProps>;
export type FederatedComponent = typeof federatedComponent;