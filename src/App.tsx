import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, FlaskConical, BookOpen, Info, ChevronRight, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { I18nProvider, useI18n } from './I18nContext';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Navbar = () => {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.about, icon: Info },
    { path: '/experiments', label: t.nav.experiments, icon: FlaskConical },
    { path: '/learn', label: t.nav.learn, icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#dadce0]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#1a73e8] rounded-lg flex items-center justify-between p-1.5 group-hover:rotate-12 transition-transform">
             <div className="w-1.5 h-full bg-white rounded-full" />
             <div className="w-1.5 h-full bg-white/50 rounded-full" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">llmcore<span className="text-[#1a73e8]">.cn</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#1a73e8]",
                location.pathname === item.path ? "text-[#1a73e8]" : "text-[#5f6368]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="labs-button-outline flex items-center gap-2 text-xs"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'zh' ? 'English' : '中文'}
        </button>
      </div>
    </nav>
  );
};

// --- Pages ---

const AboutPage = () => {
  const { t } = useI18n();
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen labs-grid">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-bold uppercase tracking-wider mb-6">
            Beta
          </span>
          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-[#202124] to-[#5f6368]">
            {t.about.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#5f6368] font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            {t.about.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/experiments" className="labs-button-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {t.about.exploreBtn}
            </Link>
            <Link to="/learn" className="labs-button-outline">
              {t.about.docsBtn}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-24 grid md:grid-cols-3 gap-8 text-left"
        >
          {[
            { title: t.about.features.aesthetic.title, desc: t.about.features.aesthetic.desc },
            { title: t.about.features.tools.title, desc: t.about.features.tools.desc },
            { title: t.about.features.content.title, desc: t.about.features.content.desc }
          ].map((feature, i) => (
            <div key={i} className="labs-card p-8">
              <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
              <p className="text-[#5f6368] text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const ImageGenTool = ({ onBack }: { onBack: () => void }) => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-flash-image-preview");

  const models = [
    { id: "gemini-3.1-flash-image-preview", name: "Gemini 3.1 Flash Image" },
    { id: "gemini-2.5-flash-image", name: "Gemini 2.5 Flash Image" },
  ];

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="text-sm font-bold text-[#1a73e8] mb-4 flex items-center gap-2 hover:underline"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        {t.experiments.backToList}
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="labs-card p-8 space-y-6">
            <div className="flex items-center gap-2 text-[#1a73e8] mb-2">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-bold uppercase tracking-wider">{t.experiments.imageGen.title}</span>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#5f6368] uppercase tracking-widest">
                {t.experiments.imageGen.selectModel}
              </label>
              <div className="flex flex-wrap gap-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                      selectedModel === m.id
                        ? "bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]"
                        : "bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4]"
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-[#5f6368] uppercase tracking-widest">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.experiments.imageGen.promptPlaceholder}
                className="w-full h-32 p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a73e8]/20 focus:border-[#1a73e8] transition-all resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={cn(
                "w-full labs-button-primary h-12 flex items-center justify-center gap-2",
                (loading || !prompt) && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.experiments.imageGen.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t.experiments.imageGen.generate}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 labs-card bg-[#f8f9fa] flex items-center justify-center overflow-hidden relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {resultImage ? (
                <motion.img
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  src={resultImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-12"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-8 h-8 text-[#dadce0]" />
                  </div>
                  <p className="text-[#5f6368] text-sm">{t.experiments.imageGen.resultPlaceholder}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#1a73e8]/20 border-t-[#1a73e8] rounded-full animate-spin" />
                  <p className="text-sm font-medium text-[#1a73e8]">{t.experiments.imageGen.generating}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExperimentsPage = () => {
  const { t } = useI18n();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: "image-gen",
      title: t.experiments.imageGen.title,
      desc: t.experiments.imageGen.desc,
      icon: ImageIcon,
      color: "bg-[#fce8e6] text-[#d93025]"
    }
  ];

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {!selectedTool ? (
          <>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#fce8e6] flex items-center justify-center text-[#d93025]">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-display font-bold">{t.experiments.title}</h2>
              </div>
              <p className="text-[#5f6368] max-w-2xl">{t.experiments.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div key={tool.id} className="labs-card p-8 flex flex-col h-full">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", tool.color)}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
                  <p className="text-[#5f6368] text-sm mb-8 flex-1">{tool.desc}</p>
                  <button
                    onClick={() => setSelectedTool(tool.id)}
                    className="labs-button-outline w-full flex items-center justify-center gap-2 group"
                  >
                    {t.experiments.tryNow}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          selectedTool === "image-gen" && <ImageGenTool onBack={() => setSelectedTool(null)} />
        )}
      </div>
    </div>
  );
};

const LearnPage = () => {
  const { t } = useI18n();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules = [
    { id: 'pytorch', title: t.learn.modules.pytorch, color: 'bg-[#ee4c2c]', icon: '🔥', content: "PyTorch is an open source machine learning framework based on the Torch library, used for applications such as computer vision and natural language processing." },
    { id: 'vllm', title: t.learn.modules.vllm, color: 'bg-[#1a73e8]', icon: '⚡', content: "vLLM is a high-throughput and memory-efficient serving engine for LLMs. It uses PagedAttention to manage KV cache memory efficiently." },
    { id: 'openclaw', title: t.learn.modules.openclaw, color: 'bg-[#202124]', icon: '🦞', content: "OpenClaw is a developer-centric framework for building autonomous AI agents that can interact with complex environments." },
  ];

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-display font-bold">{t.learn.title}</h2>
        </div>

        {selectedModule ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="labs-card p-12 bg-white"
          >
            <button
              onClick={() => setSelectedModule(null)}
              className="text-sm font-bold text-[#1a73e8] mb-8 flex items-center gap-2 hover:underline"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t.learn.backToList}
            </button>
            <div className="flex items-center gap-6 mb-8">
              <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center text-4xl", modules.find(m => m.id === selectedModule)?.color)}>
                {modules.find(m => m.id === selectedModule)?.icon}
              </div>
              <h3 className="text-4xl font-display font-bold">{modules.find(m => m.id === selectedModule)?.title}</h3>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-[#5f6368] leading-relaxed">
                {modules.find(m => m.id === selectedModule)?.content}
              </p>
              <div className="mt-12 p-8 bg-[#f8f9fa] rounded-2xl border border-[#dadce0]">
                <h4 className="font-bold mb-4">{t.learn.coreChapters}</h4>
                <ul className="space-y-3">
                  {t.learn.chapters.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[#5f6368]">
                      <div className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModule(m.id)}
                className="labs-card group cursor-pointer overflow-hidden"
              >
                <div className={cn("h-32 flex items-center justify-center text-4xl", m.color)}>
                  {m.icon}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#1a73e8] transition-colors">{m.title}</h3>
                  <p className="text-sm text-[#5f6368] mb-6">{t.learn.defaultDesc}</p>
                  <div className="flex items-center text-[#1a73e8] text-sm font-bold">
                    {t.learn.startLearning}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AboutPage />} />
            <Route path="/experiments" element={<ExperimentsPage />} />
            <Route path="/learn" element={<LearnPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="py-12 border-t border-[#dadce0] bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a73e8] rounded flex items-center justify-between p-1">
               <div className="w-1 h-full bg-white rounded-full" />
               <div className="w-1 h-full bg-white/50 rounded-full" />
            </div>
            <span className="font-display font-bold text-lg">llmcore.cn</span>
          </div>
          <div className="text-sm text-[#5f6368]">
            © 2026 llmcore.cn. Built for the AI generation.
          </div>
          <div className="flex gap-6 text-sm font-medium text-[#5f6368]">
            <a href="#" className="hover:text-[#1a73e8]">Privacy</a>
            <a href="#" className="hover:text-[#1a73e8]">Terms</a>
            <a href="#" className="hover:text-[#1a73e8]">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Router>
        <AppContent />
      </Router>
    </I18nProvider>
  );
}
