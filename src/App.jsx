import { useState } from 'react';
import Hero from './components/Hero';
import Workspace from './components/Workspace';
import VoiceLab from './components/VoiceLab';
import Tutorial from './components/Tutorial';
import { Settings, HelpCircle, Music } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');

  return (
    <div className="min-h-screen w-full bg-[#0b0b10] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b10]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-fuchsia-500 to-indigo-600" />
            <div>
              <h1 className="font-semibold tracking-tight">Nebula Studio</h1>
              <p className="text-xs text-white/60">3D Character & Animation Suite</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`rounded-md px-3 py-2 text-sm transition ${
                activeTab === 'workspace' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >Workspace</button>
            <button
              onClick={() => setActiveTab('voicelab')}
              className={`rounded-md px-3 py-2 text-sm transition ${
                activeTab === 'voicelab' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >Voice Lab</button>
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`rounded-md px-3 py-2 text-sm transition ${
                activeTab === 'tutorials' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >Tutorials</button>
          </nav>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
              <Settings size={16} /> Settings
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500">
              <Music size={16} /> Import Audio
            </button>
          </div>
        </div>
      </header>

      <Hero />

      <main className="mx-auto max-w-7xl px-4 pb-24">
        {activeTab === 'workspace' && <Workspace />}
        {activeTab === 'voicelab' && <VoiceLab />}
        {activeTab === 'tutorials' && <Tutorial />}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4">
          <HelpCircle size={14} />
          <span>Need help? Open Tutorials for step-by-step guides and example projects.</span>
        </div>
      </footer>
    </div>
  );
}
