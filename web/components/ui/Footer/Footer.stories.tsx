import { StoryFn, Meta } from '@storybook/react';
import { RecoilRoot } from 'recoil';
import { Footer } from './Footer';

const meta = {
  title: 'owncast/Layout/Footer',
  component: Footer,
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        searchParams: {},
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;

const Template: StoryFn<typeof Footer> = args => (
  <RecoilRoot>
    <Footer {...args} />
  </RecoilRoot>
);

export const Example = {
  render: Template,

  args: {
    version: 'v1.2.3',
  },
};
