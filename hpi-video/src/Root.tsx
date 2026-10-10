import React from 'react';
import {Composition} from 'remotion';
import {HPI} from './HPI';
export const Root: React.FC = () => (
  <Composition id="HPI" component={HPI} durationInFrames={1800} fps={30} width={1920} height={1080} />
);
