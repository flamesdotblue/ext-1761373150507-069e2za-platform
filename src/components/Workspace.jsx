import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Plus, Lightbulb, Camera, Layers, Boxes } from 'lucide-react';

function Section({ title, icon, children, right }) {
  const Icon = icon;
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Icon size={16} />
          {title}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export default function Workspace() {
  // Scene state
  const [backgrounds, setBackgrounds] = useState([]); // {name, url}
  const [lights, setLights] = useState({
    ambient: 0.3,
    directional: { intensity: 0.8, azimuth: 45, elevation: 45 },
    point: { intensity: 0.6, distance: 8 },
  });
  const [camera, setCamera] = useState({ type: 'perspective', fov: 60, orthoSize: 5 });
  const [timeline, setTimeline] = useState({ playing: false, time: 0, keyframes: [] }); // keyframes: {time, property, value}

  // Drag & Drop handlers for background assets
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const images = files.filter((f) => f.type.startsWith('image/'));
    const newItems = images.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }));
    if (newItems.length) setBackgrounds((prev) => [...prev, ...newItems]);
  };

  const onDragOver = (e) => e.preventDefault();

  // Timeline controls
  const rafRef = useRef(null);
  useEffect(() => {
    if (!timeline.playing) return;
    let last = performance.now();
    const loop = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setTimeline((t) => ({ ...t, time: (t.time + dt) % 10 }));
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [timeline.playing]);

  const addKeyframe = () => {
    setTimeline((t) => ({
      ...t,
      keyframes: [
        ...t.keyframes,
        { time: Number(t.time.toFixed(2)), property: 'armature.spine.rotateZ', value: Math.round(Math.random() * 45 - 22) },
      ],
    }));
  };

  const keyframeList = useMemo(
    () =>
      timeline.keyframes
        .slice()
        .sort((a, b) => a.time - b.time)
        .map((kf, i) => (
          <div key={i} className="flex items-center justify-between rounded-md bg-black/20 px-2 py-1 text-xs">
            <span className="text-white/70">t={kf.time}s</span>
            <span className="font-mono text-[11px] text-white/80">{kf.property} → {kf.value}</span>
          </div>
        )),
    [timeline.keyframes]
  );

  return (
    <section id="workspace" className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-9">
        <div
          className="relative h-[520px] w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#0f0f16] to-[#0a0a10]"
          onDrop={onDrop}
          onDragOver={onDragOver}
          title="Drop background images to add to the scene"
        >
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-md bg-black/40 px-2 py-1 text-xs">
            <span className="opacity-80">View: </span>
            <button
              className={`rounded px-2 py-1 ${camera.type === 'perspective' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setCamera((c) => ({ ...c, type: 'perspective' }))}
            >Perspective</button>
            <button
              className={`rounded px-2 py-1 ${camera.type === 'orthographic' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              onClick={() => setCamera((c) => ({ ...c, type: 'orthographic' }))}
            >Orthographic</button>
          </div>
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-md bg-black/40 px-2 py-1 text-xs">
            <button
              onClick={() => setTimeline((t) => ({ ...t, playing: !t.playing }))}
              className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 hover:bg-white/15"
            >
              {timeline.playing ? <Pause size={14} /> : <Play size={14} />}
              {timeline.playing ? 'Pause' : 'Play'}
            </button>
            <button onClick={addKeyframe} className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 hover:bg-white/15">
              <Plus size={14} /> Keyframe
            </button>
          </div>

          <div className="absolute inset-0 p-3">
            <div className="grid h-full grid-cols-12 gap-3">
              <div className="col-span-3 hidden flex-col gap-3 md:flex">
                <Section title="Mesh & Rig" icon={Boxes}>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between"><span>Subdivision</span><input type="range" min="0" max="3" defaultValue={1} className="w-32" /></div>
                    <div className="flex items-center justify-between"><span>Smooth</span><input type="range" min="0" max="100" defaultValue={40} className="w-32" /></div>
                    <div className="flex items-center justify-between"><span>Weight Paint</span><input type="range" min="0" max="100" defaultValue={60} className="w-32" /></div>
                    <div className="flex items-center justify-between"><span>Auto-Rig</span><button className="rounded bg-indigo-600 px-2 py-1 text-xs hover:bg-indigo-500">Generate</button></div>
                  </div>
                </Section>
                <Section title="Layers" icon={Layers}>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center justify-between"><span>Character</span><input type="checkbox" defaultChecked /></label>
                    <label className="flex items-center justify-between"><span>Props</span><input type="checkbox" defaultChecked /></label>
                    <label className="flex items-center justify-between"><span>Environment</span><input type="checkbox" defaultChecked /></label>
                  </div>
                </Section>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="flex h-full flex-col rounded-lg border border-white/10 bg-black/30">
                  <div className="flex items-center justify-between border-b border-white/10 p-2 text-xs">
                    <span className="opacity-80">Viewport</span>
                    <span className="font-mono text-white/70">t={timeline.time.toFixed(2)}s</span>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_23px,rgba(255,255,255,0.06)_24px),linear-gradient(90deg,transparent_23px,rgba(255,255,255,0.06)_24px)] bg-[length:24px_24px]" />
                    <div className="relative z-10 text-center text-sm text-white/70">
                      Drop images here to set parallax backgrounds. Adjust lights and camera on the right. Use timeline controls above to preview keyframes.
                    </div>
                    {backgrounds.length > 0 && (
                      <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-6 grid grid-cols-3 gap-3 opacity-80">
                          {backgrounds.slice(0, 6).map((bg, i) => (
                            <img key={i} src={bg.url} alt={bg.name} className="h-full w-full rounded object-cover" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/10 p-2">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      {Array.from({ length: 21 }).map((_, i) => (
                        <div key={i} className="relative h-10 w-8 flex-shrink-0">
                          <div className="absolute inset-x-1 bottom-0 top-0 border-l border-white/10" />
                          <div className="absolute inset-x-0 bottom-0 top-4 bg-white/5" />
                          <div className="absolute inset-x-0 top-0 text-center text-[10px] text-white/50">{i / 2}s</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-white/70">
                      {keyframeList}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
                <Section title="Lighting" icon={Lightbulb}>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span>Ambient</span><input type="range" min="0" max="1" step="0.01" value={lights.ambient} onChange={(e)=>setLights({...lights, ambient: parseFloat(e.target.value)})} className="w-28" /></div>
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Directional</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span>Intensity</span><input type="range" min="0" max="2" step="0.01" value={lights.directional.intensity} onChange={(e)=>setLights({...lights, directional:{...lights.directional, intensity: parseFloat(e.target.value)}})} className="w-28" /></div>
                        <div className="flex items-center justify-between"><span>Azimuth</span><input type="range" min="0" max="360" value={lights.directional.azimuth} onChange={(e)=>setLights({...lights, directional:{...lights.directional, azimuth: parseInt(e.target.value)}})} className="w-28" /></div>
                        <div className="flex items-center justify-between"><span>Elevation</span><input type="range" min="0" max="90" value={lights.directional.elevation} onChange={(e)=>setLights({...lights, directional:{...lights.directional, elevation: parseInt(e.target.value)}})} className="w-28" /></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wide text-white/50">Point</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span>Intensity</span><input type="range" min="0" max="2" step="0.01" value={lights.point.intensity} onChange={(e)=>setLights({...lights, point:{...lights.point, intensity: parseFloat(e.target.value)}})} className="w-28" /></div>
                        <div className="flex items-center justify-between"><span>Distance</span><input type="range" min="1" max="20" value={lights.point.distance} onChange={(e)=>setLights({...lights, point:{...lights.point, distance: parseInt(e.target.value)}})} className="w-28" /></div>
                      </div>
                    </div>
                  </div>
                </Section>
                <Section title="Camera" icon={Camera}>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span>Type</span>
                      <div className="flex gap-2">
                        <button className={`rounded px-2 py-1 ${camera.type==='perspective'?'bg-white/15':'hover:bg-white/10'}`} onClick={()=>setCamera({...camera, type:'perspective'})}>Perspective</button>
                        <button className={`rounded px-2 py-1 ${camera.type==='orthographic'?'bg-white/15':'hover:bg-white/10'}`} onClick={()=>setCamera({...camera, type:'orthographic'})}>Ortho</button>
                      </div>
                    </div>
                    {camera.type === 'perspective' ? (
                      <div className="flex items-center justify-between"><span>FOV</span><input type="range" min="20" max="100" value={camera.fov} onChange={(e)=>setCamera({...camera, fov: parseInt(e.target.value)})} className="w-28" /></div>
                    ) : (
                      <div className="flex items-center justify-between"><span>Ortho Size</span><input type="range" min="1" max="20" value={camera.orthoSize} onChange={(e)=>setCamera({...camera, orthoSize: parseInt(e.target.value)})} className="w-28" /></div>
                    )}
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/60">
          <div>Drag-and-drop background images directly onto the viewport. Use the timeline to preview keyframes.</div>
          <div>Lighting: A {lights.ambient.toFixed(2)} | D {lights.directional.intensity.toFixed(2)} | P {lights.point.intensity.toFixed(2)} • Camera: {camera.type === 'perspective' ? `FOV ${camera.fov}` : `Ortho ${camera.orthoSize}`}</div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-medium">Scene Browser</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2"><span>Character</span><span className="text-white/60">Armature • Mesh</span></li>
            <li className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2"><span>Camera</span><span className="text-white/60">{camera.type}</span></li>
            <li className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2"><span>Lights</span><span className="text-white/60">3</span></li>
            <li className="flex items-center justify-between rounded-md bg-black/20 px-3 py-2"><span>Backgrounds</span><span className="text-white/60">{backgrounds.length}</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
