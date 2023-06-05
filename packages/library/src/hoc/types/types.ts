import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes
} from 'react'

export type HOCRefComponent<
  TRef,
  TProps extends object
> = ForwardRefExoticComponent<PropsWithoutRef<TProps> & RefAttributes<TRef>>
