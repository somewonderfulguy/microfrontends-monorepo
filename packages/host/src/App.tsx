import React, { ComponentType, lazy } from 'react';

import { BlockComponent, ButtonComponent, FederatedComponent } from 'shared/src/typesShared';
import { federatedComponent as sharedFederatedComponent } from 'shared/build-npm/hoc';

const federatedComponent: FederatedComponent = sharedFederatedComponent;

const Block = federatedComponent<BlockComponent>(lazy(() => import('shared-mf/Block')));
const Button = federatedComponent<ButtonComponent>(lazy(() => import('shared-mf/Button')));
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
