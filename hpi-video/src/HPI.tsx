import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';

const GOLD = '#C9A24B';
const BG = '#0E1116';
const PANEL = '#1A1F28';
const TEXT = '#F2EFE8';
const MUTED = '#8B93A1';
const RED = '#E5635A';
const font = 'Helvetica Neue, Arial, sans-serif';

const useIn = (delay = 0) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping: 18}});
};

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12, dur - 12, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Frame: React.FC<{kicker: string; title: string; children: React.ReactNode; n: number}> = ({kicker, title, children, n}) => {
  const t = useIn(0);
  return (
    <AbsoluteFill style={{background: BG, fontFamily: font, color: TEXT, padding: '80px 110px'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: 14, height: '100%', background: GOLD}} />
      <div style={{color: GOLD, letterSpacing: 6, fontSize: 28, fontWeight: 700, opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>
        {kicker.toUpperCase()}
      </div>
      <div style={{fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 14, maxWidth: 1500, opacity: t, transform: `translateY(${(1 - t) * 30}px)`}}>{title}</div>
      <div style={{marginTop: 50}}>{children}</div>
      <div style={{position: 'absolute', bottom: 40, right: 110, color: MUTED, fontSize: 24}}>North America HPI Review · {n}/8</div>
    </AbsoluteFill>
  );
};

const Stat: React.FC<{value: string; label: string; delay: number; color?: string}> = ({value, label, delay, color = GOLD}) => {
  const t = useIn(delay);
  return (
    <div style={{background: PANEL, borderRadius: 20, padding: "30px 40px", flex: 1, opacity: t, transform: `scale(${0.9 + 0.1 * t})`}}>
      <div style={{fontSize: 100, fontWeight: 800, color, lineHeight: 1}}>{value}</div>
      <div style={{fontSize: 32, color: MUTED, marginTop: 16, lineHeight: 1.3}}>{label}</div>
    </div>
  );
};

const Bullet: React.FC<{text: string; delay: number; accent?: string}> = ({text, delay, accent = GOLD}) => {
  const t = useIn(delay);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 40, marginBottom: 20, opacity: t, transform: `translateX(${(1 - t) * -40}px)`}}>
      <div style={{width: 16, height: 16, borderRadius: 8, background: accent, flexShrink: 0}} />
      <div>{text}</div>
    </div>
  );
};

const Title: React.FC = () => {
  const t = useIn(0), s = useIn(20), u = useIn(45);
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${BG}, #1d2330)`, fontFamily: font, color: TEXT, justifyContent: 'center', padding: '0 140px'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: 14, height: '100%', background: GOLD}} />
      <div style={{color: GOLD, letterSpacing: 8, fontSize: 32, fontWeight: 700, opacity: t}}>BARRICK · HEALTH & SAFETY</div>
      <div style={{fontSize: 130, fontWeight: 800, lineHeight: 1.05, marginTop: 30, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
        September 2026<br />Safety Review
      </div>
      <div style={{fontSize: 52, color: GOLD, marginTop: 30, opacity: u}}>North America Region</div>
      <div style={{fontSize: 34, color: MUTED, marginTop: 24, maxWidth: 1300, opacity: u}}>
        What September’s eight events tell us, which problems keep repeating, and where leadership attention should go in October.
      </div>
    </AbsoluteFill>
  );
};

const Headline: React.FC = () => (
  <Frame n={1} kicker="The big picture" title="Fewer events — but every single one was a repeat">
    <div style={{display: 'flex', gap: 36}}>
      <Stat value="8" label="events in September (4 high-potential, 0 PFI)" delay={10} />
      <Stat value="8/8" label="repeat a mechanism already seen Jan–Aug" delay={22} color={RED} />
      <Stat value="75%" label="happened during maintenance (vs 30% Jan–Aug)" delay={34} />
      <Stat value="5/8" label="started with no defined or approved work method" delay={46} color={RED} />
    </div>
    <div style={{fontSize: 38, marginTop: 56, color: MUTED}}>The hazards are known. The lessons are not travelling between sites and crews.</div>
  </Frame>
);

const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const all = [13, 11, 8, 8, 8, 7, 14, 10, 8];
  const hp = [4, 6, 4, 5, 6, 4, 6, 6, 4];
  const H = 480;
  return (
    <Frame n={2} kicker="Dashboard" title="Volume fell; concentration rose">
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 36, height: H + 60}}>
        {months.map((m, i) => {
          const g = interpolate(f, [8 + i * 5, 28 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          const sep = i === 8;
          return (
            <div key={m} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontSize: 30, color: TEXT, marginBottom: 8, opacity: g}}>{all[i]}</div>
              <div style={{width: '100%', height: (all[i] / 14) * H * g, background: sep ? GOLD : '#4a5262', borderRadius: 8, position: 'relative'}}>
                <div style={{position: 'absolute', bottom: 0, width: '100%', height: (hp[i] / all[i]) * 100 + '%', background: sep ? '#8a6a24' : '#2f3643', borderRadius: 8}} />
              </div>
              <div style={{fontSize: 28, color: sep ? GOLD : MUTED, marginTop: 12}}>{m}</div>
            </div>
          );
        })}
      </div>
      <div style={{fontSize: 34, color: MUTED, marginTop: 20}}>Jan–Aug average: 9.9 events, 5.1 high-potential per month · September: 8 and 4 (darker = high-potential)</div>
    </Frame>
  );
};

const Energy: React.FC = () => (
  <Frame n={3} kicker="Insight 02" title="Stored energy in maintenance — and it is not electrical">
    <div style={{display: 'flex', gap: 36, marginBottom: 40}}>
      <Stat value="50%" label="of events carry the stored-energy fatal risk (vs 32%)" delay={8} color={RED} />
      <Stat value="75%" label="occurred during maintenance (vs 30%)" delay={20} />
    </div>
    <Bullet text="Tension in a pipe string" delay={34} />
    <Bullet text="Hydraulic pressure on an anchor bolt" delay={48} />
    <Bullet text="Gravity on a 100-ton ram" delay={62} />
    <Bullet text="Torque through a spinning bolt" delay={76} />
    <div style={{fontSize: 36, color: GOLD, marginTop: 10}}>Action: extend “verify zero energy” beyond electrical isolation.</div>
  </Frame>
);

const Method: React.FC = () => (
  <Frame n={4} kicker="Insights 03 & 04" title="Improvised tasks, and hands where a tool should be">
    <div style={{display: 'flex', gap: 36}}>
      <Stat value="5 of 8" label="tasks started without a defined way of doing them — a Line-Out quality failure" delay={8} color={RED} />
      <Stat value="3" label="finger injuries, one mechanism: a hand holding what a tool should hold" delay={22} color={RED} />
    </div>
    <Bullet text="Rule: no written method and supervisor sign-off, no start" delay={40} />
    <Bullet text="Fund a regional hands-free tooling list: clamps, holding devices, guards" delay={56} />
  </Frame>
);

const Contractors: React.FC = () => (
  <Frame n={5} kicker="Insights 05 & 06" title="Contractors and monitoring systems that never reported">
    <div style={{display: 'flex', gap: 36, marginBottom: 40}}>
      <Stat value="50%" label="of events involved contractors" delay={8} />
      <Stat value="3 of 5" label="injuries were contractor personnel" delay={20} color={RED} />
    </div>
    <Bullet text="New contractors work with a named buddy for their first 90 days" delay={34} />
    <Bullet text="Contractor non-routine tasks pass the same written-method gate" delay={48} />
    <Bullet text="Trucks not reporting brake events: an installed sensor that doesn’t report is an assumed control" delay={62} accent={RED} />
  </Frame>
);

const Repeats: React.FC = () => {
  const rows: [string, string][] = [
    ['Carlin', '4th mobile-equipment loss of control in 2026'],
    ['Cortez', '4th positive-communication failure in 2026'],
    ['Turquoise Ridge', 'Pipe release again — same site, 4 months later'],
    ['Phoenix + Pueblo Viejo', 'Fastener failures: a pattern now at 4 sites'],
  ];
  return (
    <Frame n={6} kicker="Repeat events" title="Every September event already had a precedent">
      {rows.map(([a, b], i) => {
        const t = useIn(10 + i * 14);
        return (
          <div key={a} style={{display: 'flex', gap: 30, background: PANEL, borderRadius: 16, padding: '22px 34px', marginBottom: 20, opacity: t, transform: `translateX(${(1 - t) * 60}px)`}}>
            <div style={{width: 520, fontSize: 40, fontWeight: 700, color: GOLD}}>{a}</div>
            <div style={{fontSize: 38}}>{b}</div>
          </div>
        );
      })}
    </Frame>
  );
};

const Icam: React.FC = () => {
  const f = useCurrentFrame();
  const bars: [string, number, string][] = [
    ['Absent / failed defences', 4, RED],
    ['Individual / team actions', 2, GOLD],
    ['Organisational factors', 1, GOLD],
    ['Pending — no causes recorded', 1, MUTED],
  ];
  return (
    <Frame n={7} kicker="Root cause — ICAM" title="Half of the events trace to a defence that was missing or failed">
      {bars.map(([l, v, c], i) => {
        const g = interpolate(f, [8 + i * 8, 34 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={l} style={{display: 'flex', alignItems: 'center', marginBottom: 24}}>
            <div style={{width: 560, fontSize: 36}}>{l}</div>
            <div style={{height: 54, width: v * 190 * g, background: c, borderRadius: 8}} />
            <div style={{fontSize: 40, marginLeft: 20, fontWeight: 700, opacity: g}}>{v}</div>
          </div>
        );
      })}
      <div style={{fontSize: 34, color: MUTED, marginTop: 20}}>Only 2 of 8 investigations are closed — the rest are preliminary.</div>
    </Frame>
  );
};

const Close: React.FC = () => {
  const t = useIn(0);
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${BG}, #1d2330)`, fontFamily: font, color: TEXT, justifyContent: 'center', padding: '0 140px'}}>
      <div style={{position: 'absolute', top: 0, left: 0, width: 14, height: '100%', background: GOLD}} />
      <div style={{color: GOLD, letterSpacing: 6, fontSize: 30, fontWeight: 700, opacity: t}}>FOCUS FOR OCTOBER</div>
      <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1.1, marginTop: 24, opacity: t}}>The gap is lesson transfer,<br />not hazard identification.</div>
      <div style={{marginTop: 40}}>
        <Bullet text="One-page alerts from every closed investigation, verified in the field in 30 days" delay={20} />
        <Bullet text="No written method, no start" delay={34} />
        <Bullet text="Hands-free tooling and zero-energy checks for tension, pressure and gravity" delay={48} />
      </div>
    </AbsoluteFill>
  );
};

const scenes: [React.FC, number][] = [
  [Title, 180], [Headline, 240], [Chart, 270], [Energy, 270], [Method, 210], [Contractors, 210], [Repeats, 150], [Icam, 120],
];

export const HPI: React.FC = () => {
  let start = 0;
  const seqs = [...scenes, [Close, 1800 - scenes.reduce((a, s) => a + s[1], 0)] as [React.FC, number]];
  return (
    <AbsoluteFill style={{background: BG}}>
      {seqs.map(([C, d], i) => {
        const el = (
          <Sequence key={i} from={start} durationInFrames={d}>
            <Fade dur={d}><C /></Fade>
          </Sequence>
        );
        start += d;
        return el;
      })}
    </AbsoluteFill>
  );
};
