import React, { ComponentType, lazy } from 'react';

import { BlockComponent, ButtonComponent } from 'shared/src/typesShared';

import { federatedComponent } from 'hoc';

const Block = federatedComponent<BlockComponent>(lazy(() => import('shared/Block')));
const Button = federatedComponent<ButtonComponent>(lazy(() => import('shared/Button')));
const SubApplication = federatedComponent<ComponentType>(lazy(() => import('sub-application/app')));

function App() {
  return (
    <div className="App">
      <Block>I am a text in a shared block</Block>
      <Button type="button">Click for no reason</Button>
      <SubApplication />
    </div>
  );
}

export default App;
