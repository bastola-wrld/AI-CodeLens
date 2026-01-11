import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Loader2, Code2, AlertTriangle, CheckCircle2, Zap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { CONFIG } from './config';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import PaywallModal from './components/PaywallModal';

const AppContent: React.FC = () => {
  const { user, login: _login, signup: _signup, logout, credits, useCredit } = useAuth();
  const [code, setCode] = useState<string>('// Paste your code here for an AI review...\n\nfunction processData(items) {\n  let results = [];\n  for (var i = 0; i < items.length; i++) {\n    results.push(items[i] * 2);\n  }\n  return results;\n}');
  const [objective, setObjective] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [suggestedCode, setSuggestedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth & Paywall State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const analyzeCode = async () => {
    if (!code.trim()) return;

    // Check credits
    if (!user) {
      handleAuth('login');
      return;
    }
    if (!useCredit()) {
      setIsPaywallOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setReview('');
    setSuggestedCode(null);

    try {
      const systemPrompt = objective.trim()
        ? `You are an Elite AI Code Architect. 
           
           CRITICAL MISSION: The user has set this Objective: "${objective}".

  GUIDELINES:
1. STRICT EVALUATION: Is the current code actually doing what the Objective asks ? If it is doing something different or only partially correct, flag it as "FAIL" in the Objective Fulfillment section.
           2. AUTOMATIC FIX: If the code does not fully meet the Objective, you MUST provide a section with the exact header "### PROPOSED_SOLUTION" followed by a code block containing the complete, working code that fulfills the Objective.
           3. PROFESSIONAL AUDIT: Provide a standard review in Markdown with sections: "Objective Fulfillment", "Security", "Performance", and "Best Practices".
           
           Always be direct.If the code is irrelevant to the objective, say so.`
        : `You are an Elite AI Code Architect.Review the provided code for security, performance, and best practices. 
           Provide a concise, professional review in Markdown format with clearly labeled sections for "Security", "Performance", and "Best Practices".`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: CONFIG.MODEL,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Please review this code: \n\n\`\`\`\n${code}\n\`\`\``
            }
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const content = response.data.choices[0].message.content;
      setReview(content);

      // Extract suggested code if present using a robust regex that handles potential text between header and code
      const codeBlockRegex = /### PROPOSED_SOLUTION[\s\S]*?```(?:\w+)?\n([\s\S]*?)```/i;
      const match = content.match(codeBlockRegex);
      if (match) {
        setSuggestedCode(match[1].trim());
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Failed to connect to AI Core. Check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans text-gray-100 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AI CodeLens</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Simplified AI Architect</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase pb-1 border-b border-transparent hover:border-primary-500 hover:text-primary-400 transition-all cursor-pointer">Documentation</span>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-mono text-gray-400">
                {user.isPremium ? (
                  <span className="text-accent-cyan font-bold">UNLIMITED</span>
                ) : (
                  <span>CREDITS: <span className={credits === 0 ? 'text-red-500 font-bold' : 'text-white font-bold'}>{credits}</span>/5</span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-cyan p-[1px] cursor-pointer group" onClick={logout}>
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center group-hover:bg-transparent transition-all">
                  <User size={14} className="text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => handleAuth('login')} className="text-xs text-gray-400 hover:text-white transition-colors font-medium">Sign In</button>
              <button onClick={() => handleAuth('signup')} className="text-xs bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">Sign Up</button>
            </div>
          )}
        </div>
        <button
          onClick={analyzeCode}
          disabled={isLoading || !code.trim()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary-600/20 active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Zap size={18} />
          )}
          {isLoading ? 'Analyzing...' : 'Analyze Code'}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6">
        {/* Editor Side */}
        <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl relative">
          <div className="px-6 py-4 border-b border-white/5 flex items-center gap-2 bg-white/5">
            <Code2 size={16} className="text-primary-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Source Buffer</span>
          </div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              fontSize: 14,
              fontFamily: 'JetBrains Mono',
              minimap: { enabled: false },
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              renderLineHighlight: 'all',
              lineNumbersMinChars: 3,
            }}
          />
        </div>

        {/* Review Side */}
        <div className="w-[450px] flex flex-col gap-4">
          {/* Objective Input */}
          <div className="glass rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-accent-pink" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mission Objective</span>
            </div>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What should this code do? (e.g. 'Sort list by price')"
              className="w-full h-24 bg-black/20 rounded-xl p-4 text-xs outline-none border border-white/5 focus:border-primary-500/50 transition-all font-medium placeholder:text-gray-600 resize-none"
            />
          </div>

          <div className="flex-1 glass rounded-3xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Loader2 className="animate-spin text-primary-400" size={16} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Sparkles className="text-primary-400" size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Insights</span>
              </div>
              {suggestedCode && (
                <button
                  onClick={() => setCode(suggestedCode)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg font-bold text-[10px] transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
                >
                  <Zap size={12} />
                  Apply Fix
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
              {error && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                  <p className="text-xs text-rose-200 font-medium">{error}</p>
                </div>
              )}

              {!review && !isLoading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Code2 size={32} className="text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm">Ready for Review</p>
                    <p className="text-[10px] max-w-[200px]">Paste your code in the editor and click analyze to start the review.</p>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3 animate-pulse">
                      <div className="h-4 w-24 bg-white/10 rounded-full" />
                      <div className="h-2 w-full bg-white/5 rounded-full" />
                      <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                    </div>
                  ))}
                </div>
              )}

              {review && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-sm max-w-none text-xs leading-relaxed dark:prose-p:text-gray-300 dark:prose-strong:text-white dark:prose-headings:text-primary-400"
                >
                  <ReactMarkdown>{review}</ReactMarkdown>
                </motion.div>
              )}
            </div>
          </div>

          {/* Quick Stats/Status */}
          <div className="glass rounded-2xl px-6 py-4 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80">AI Core Active</span>
            </div>
            <div className="text-[8px] font-mono text-gray-500 uppercase">
              Model: {CONFIG.MODEL}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-3 text-[10px] text-gray-500 font-medium uppercase tracking-[0.3em] text-center border-t border-white/5 bg-black/20 backdrop-blur-xl">
        Built & Powered by CREATIVE WORLD &bull; Protocol v2.0
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />
    </div>
  );
};

import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
