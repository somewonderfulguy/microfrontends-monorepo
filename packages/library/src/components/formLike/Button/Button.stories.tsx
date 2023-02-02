import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Button from './Button'

export default {
  title: 'Controls & Inputs/Button',
  component: Button
} as ComponentMeta<typeof Button>

// export const Primary = () => <Button>Click!</Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  // primary: true,
  // label: 'Button',
};

export const Secondary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Secondary.args = {
  // primary: true,
  // label: 'Button',
  children: 'Click for no reason',
  isPreview: true
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   isPreview: true
// };