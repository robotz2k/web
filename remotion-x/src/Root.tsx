import { AbsoluteFill, Composition, Sequence } from "remotion";
import { T } from "./data";
import { Anatomy, Checklist, Intro, Separation, Verdict } from "./Scenes";
import { World3D } from "./Scene3D";

const XVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#070b14" }}>
    <Sequence from={T.intro.from} durationInFrames={T.intro.dur} premountFor={30}>
      <Intro />
    </Sequence>
    <Sequence from={T.anatomy.from} durationInFrames={T.anatomy.dur} premountFor={30}>
      <Anatomy dur={T.anatomy.dur} />
    </Sequence>
    <Sequence from={T.separation.from} durationInFrames={T.separation.dur} premountFor={30}>
      <Separation dur={T.separation.dur} />
    </Sequence>
    <Sequence from={T.world.from} durationInFrames={T.world.dur} premountFor={30}>
      <World3D dur={T.world.dur} />
    </Sequence>
    <Sequence from={T.checklist.from} durationInFrames={T.checklist.dur} premountFor={30}>
      <Checklist dur={T.checklist.dur} />
    </Sequence>
    <Sequence from={T.verdict.from} durationInFrames={T.verdict.dur} premountFor={30}>
      <Verdict dur={T.verdict.dur} />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="X"
        component={XVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
