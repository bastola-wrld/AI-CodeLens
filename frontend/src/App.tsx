import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import ChatPanel from './components/ChatPanel';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);

  // State for code and AI interaction
  const [code, setCode] = useState('// Your elite code starts here...\n\nfunction hello() {\n  console.log("Hello, AI world!");\n}');
  const [language, setLanguage] = useState('javascript');

  // Handlers for AI actions
  const [reviewFn, setReviewFn] = useState<(() => void) | null>(null);
  const [modifyFn, setModifyFn] = useState<(() => void) | null>(null);
  const [generateFn, setGenerateFn] = useState<(() => void) | null>(null);

  const handleSetReview = React.useCallback((fn: () => void) => setReviewFn(() => fn), []);
  const handleSetModify = React.useCallback((fn: () => void) => setModifyFn(() => fn), []);
  const handleSetGenerate = React.useCallback((fn: () => void) => setGenerateFn(() => fn), []);

  // Mobile & Layout State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'chat' | 'code'>('chat');

  if (!isAuthenticated) {
    return isLoginView ? (
      <LoginPage onToggleAuth={() => setIsLoginView(false)} />
    ) : (
      <SignupPage onToggleAuth={() => setIsLoginView(true)} />
    );
  }

  return (
    <div className="flex h-screen md:h-dvh bg-white dark:bg-background-dark text-gray-900 dark:text-gray-100 overflow-hidden font-sans relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-mesh opacity-50 dark:opacity-20 pointer-events-none" />

      {/* Sidebar - Mobile Drawer / Desktop Fixed */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 w-full">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-gray-100 dark:border-white/5 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500 hover:text-primary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setMobileView('chat')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mobileView === 'chat' ? 'bg-white dark:bg-white/10 shadow-sm text-primary-600' : 'text-gray-500'}`}
            >
              Chat
            </button>
            <button
              onClick={() => setMobileView('code')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${mobileView === 'code' ? 'bg-white dark:bg-white/10 shadow-sm text-primary-600' : 'text-gray-500'}`}
            >
              Code
            </button>
          </div>

          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Panel - Visible on Desktop OR if Mobile View is Chat */}
          <div className={`
                ${mobileView === 'chat' ? 'flex' : 'hidden'} 
                md:flex md:w-[450px] lg:w-[480px] flex-shrink-0 flex-col
                border-r border-gray-100 dark:border-white/5 
                bg-white/40 dark:bg-black/20 backdrop-blur-md w-full
            `}>
            <ChatPanel
              code={code}
              setCode={setCode}
              language={language}
              onReview={handleSetReview}
              onModify={handleSetModify}
              onGenerate={handleSetGenerate}
            />
          </div>

          {/* Editor Panel - Visible on Desktop OR if Mobile View is Code */}
          <div className={`
                ${mobileView === 'code' ? 'flex' : 'hidden'} 
                md:flex flex-1 flex-col 
                bg-white/20 dark:bg-transparent backdrop-blur-sm w-full
            `}>
            <EditorPanel
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onReview={() => reviewFn?.()}
              onModify={() => modifyFn?.()}
              onOptimize={() => modifyFn?.()}
              onGenerate={() => generateFn?.()}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
