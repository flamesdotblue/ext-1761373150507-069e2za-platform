import { useState } from 'react';
import { HelpCircle, PlayCircle } from 'lucide-react';

const STEPS = [
  {
    title: 'Welcome to Nebula Studio',
    body: 'This interactive guide will introduce mesh editing, rigging, keyframing, and the scene editor. You can replay steps at any time.',
  },
  {
    title: 'Edit Mesh & Auto-Rig',
    body: 'Open the Mesh & Rig panel in the Workspace. Try adjusting Subdivision and Smooth, then click Generate to auto-rig your character.',
  },
  {
    title: 'Add Backgrounds',
    body: 'Drag and drop image files onto the viewport to populate environment backdrops. Use Layers to toggle visibility.',
  },
  {
    title: 'Light the Scene',
    body: 'Use the Lighting panel to tweak Ambient, Directional, and Point lights. Subtle changes enhance the mood dramatically.',
  },
  {
    title: 'Animate with Keyframes',
    body: 'Use the timeline controls to add keyframes and play/pause the preview. Fine-tune movement by adding more keyframes.',
  },
  {
    title: 'Bring Voices to Life',
    body: 'Open the Voice Lab to generate lines with pitch, speed, and tone settings. Sync dialogue with keyframes for expressive performances.',
  },
];

const EXAMPLES = [
  { name: 'Astronaut Idle Loop', desc: 'A subtle breathing + head tilt animation with ambient glow.' },
  { name: 'Robot Wave Gesture', desc: 'Mechanical arm wave synced with a friendly greeting.' },
  { name: 'Run Cycle Starter', desc: 'Blocking pass with key poses on 1s and 3s.' },
];

export default function Tutorial() {
  const [step, setStep] = useState(0);

  return (
    <section id="tutorials" className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle size={16} /> Interactive Tutorial
            </div>
            <div className="text-xs text-white/60">Step {step + 1} of {STEPS.length}</div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-4">
            <h4 className="text-sm font-medium">{STEPS[step].title}</h4>
            <p className="mt-2 text-sm text-white/70">{STEPS[step].body}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`rounded px-3 py-2 text-sm ${step === 0 ? 'bg-white/5 text-white/40' : 'bg-white/10 hover:bg-white/15'}`}
              >Previous</button>
              <button
                disabled={step === STEPS.length - 1}
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className={`rounded px-3 py-2 text-sm ${step === STEPS.length - 1 ? 'bg-white/5 text-white/40' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >Next</button>
            </div>
            <a href="#workspace" className="inline-flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-xs hover:bg-white/15">
              <PlayCircle size={14} /> Try this step in Workspace
            </a>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-3 text-sm font-medium">Example Projects</h3>
          <ul className="space-y-2">
            {EXAMPLES.map((ex) => (
              <li key={ex.name} className="rounded-lg border border-white/10 bg-black/30 p-3">
                <div className="text-sm font-medium">{ex.name}</div>
                <div className="text-xs text-white/60">{ex.desc}</div>
                <div className="mt-2 flex gap-2">
                  <a href="#workspace" className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/15">Open</a>
                  <button className="rounded bg-white/10 px-2 py-1 text-xs hover:bg-white/15">Duplicate</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
