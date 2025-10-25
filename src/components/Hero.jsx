import Spline from '@splinetool/react-spline';
import { Rocket, Wand2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,9,20,0.2),rgba(8,8,11,0.85))]" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Design, rig, and animate in one sleek workspace
          </h2>
          <p className="mt-3 text-white/70">
            A fast, intuitive 3D animation application with Blender-like controls, real-time rendering, and an AI voice lab for lifelike character performances.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#workspace" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm hover:bg-indigo-500">
              <Rocket size={16} /> Launch Workspace
            </a>
            <a href="#tutorials" className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              <Wand2 size={16} /> Guided Tour
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
