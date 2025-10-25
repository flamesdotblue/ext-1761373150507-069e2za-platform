import { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, Play, Pause, Wand2 } from 'lucide-react';

function useSpeechSynthesis() {
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.onvoiceschanged = load;
    return () => {
      try { synth.onvoiceschanged = null; } catch {}
    };
  }, []);
  return voices;
}

export default function VoiceLab() {
  const [text, setText] = useState('Hello! I am your character. Let\'s bring this scene to life.');
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [tone, setTone] = useState('Warm');
  const voices = useSpeechSynthesis();
  const [voiceURI, setVoiceURI] = useState('');
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef(null);

  const resolvedVoice = useMemo(() => {
    const match = voices.find(v => v.voiceURI === voiceURI);
    if (match) return match;
    // pick a default English voice if possible
    return voices.find(v => /en[-_]/i.test(v.lang)) || voices[0];
  }, [voices, voiceURI]);

  const play = () => {
    if (!text.trim()) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = resolvedVoice || null;
    u.pitch = pitch;
    u.rate = rate;
    // basic "tone" shaping via punctuation and emphasis
    if (tone === 'Warm') u.text = text.replace(/\./g, '…');
    if (tone === 'Crisp') u.text = text.replace(/,/g, ';');
    if (tone === 'Dramatic') u.text = text.replace(/([.!?])/g, '$1\n');
    u.onend = () => setPlaying(false);
    utteranceRef.current = u;
    setPlaying(true);
    synth.speak(u);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setPlaying(false);
  };

  return (
    <section id="voicelab" className="mt-12 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium">AI Voice Generation Lab</h3>
        <div className="text-xs text-white/60">Generate realistic character voices with adjustable parameters</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs text-white/60">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full resize-y rounded-md border border-white/10 bg-black/30 p-3 outline-none ring-0 placeholder:text-white/40"
            placeholder="Type the dialogue to synthesize..."
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!playing ? (
              <button onClick={play} className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm hover:bg-indigo-500">
                <Play size={16} /> Generate & Play
              </button>
            ) : (
              <button onClick={stop} className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/15">
                <Pause size={16} /> Stop
              </button>
            )}
            <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs text-white/70">
              <Mic size={14} /> Browser TTS used for local preview
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-white/50">Voice</div>
            <select
              value={voiceURI}
              onChange={(e) => setVoiceURI(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/30 p-2 text-sm"
            >
              <option value="">System Default</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} • {v.lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 text-xs uppercase tracking-wide text-white/50">Tone</div>
            <div className="flex gap-2">
              {['Warm', 'Crisp', 'Dramatic'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded px-3 py-1 text-sm ${tone === t ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}`}
                >
                  <Wand2 className="mr-1 inline" size={14} />{t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="mb-1 text-xs text-white/60">Pitch {pitch.toFixed(2)}</div>
              <input type="range" min="0.5" max="2" step="0.01" value={pitch} onChange={(e)=>setPitch(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="mb-1 text-xs text-white/60">Speed {rate.toFixed(2)}</div>
              <input type="range" min="0.5" max="2" step="0.01" value={rate} onChange={(e)=>setRate(parseFloat(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="mb-1 text-xs text-white/60">Energy</div>
              <input type="range" min="0" max="1" step="0.01" defaultValue={0.5} className="w-full" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-white/70">
            Voices are generated locally via the browser's SpeechSynthesis API for preview. For production-grade AI voices, connect your preferred provider in Settings.
          </div>
        </div>
      </div>
    </section>
  );
}
