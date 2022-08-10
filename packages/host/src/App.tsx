import React, { ComponentType, lazy } from 'react';

import { ButtonComponent } from 'shared/src/typesShared';

import { federatedComponent } from 'hoc';

const Button = federatedComponent<ButtonComponent>(lazy(() => import('shared/Button')));
const SubApplication = federatedComponent<ComponentType>(lazy(() => import('sub-application/app')));

function App() {
  return (
    <div className="App">
      Button from shared<br />
      <Button type="button">Click for no reason</Button>
      <SubApplication />
    </div>
  );
}

export default App;
