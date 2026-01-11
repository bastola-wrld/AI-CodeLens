import React from 'react';
import Editor from '@monaco-editor/react';
import { Play, Copy, Save, Sparkles, Wand2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import { DiffEditor } from '@monaco-editor/react';

interface EditorPanelProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    originalCode?: string; // For Diff View
    onReview?: () => void;
    onModify?: () => void;
    onOptimize?: () => void;
    onGenerate?: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    code, setCode, language, setLanguage, originalCode, onReview, onModify, onOptimize, onGenerate
}) => {
    const [isDiffMode, setIsDiffMode] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'code' | 'review'>('code');
    const languages = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css'];

    return (
        <div className="h-full flex flex-col bg-transparent relative group">
            {/* Premium Header/Tabs */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 dark:border-white/5 bg-white/40 dark:bg-black/20 backdrop-blur-xl z-10 gap-4 md:gap-0">
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl">
                    <TabButton
                        active={activeTab === 'code'}
                        onClick={() => setActiveTab('code')}
                        label="Source Output"
                    />
                    <TabButton
                        active={activeTab === 'review'}
                        onClick={() => setActiveTab('review')}
                        label="Architect Audit"
                    />
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-glow" />
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-[10px] font-bold uppercase tracking-[0.15em] outline-none cursor-pointer hover:text-primary-500 transition-colors"
                        >
                            {languages.map((lang) => (
                                <option key={lang} value={lang} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                                    {lang}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {activeTab === 'code' && (
                            <button
                                onClick={() => setIsDiffMode(!isDiffMode)}
                                className={`text-[9px] font-bold px-4 py-2 rounded-xl transition-all tracking-wider ${isDiffMode ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'glass-dark text-gray-400 hover:text-white'}`}
                            >
                                {isDiffMode ? 'EXIT DIFF' : 'DIFF ENGINE'}
                            </button>
                        )}
                        <span className="w-px h-4 bg-gray-100 dark:bg-white/10 mx-2" />
                        <ToolbarButton icon={<Play size={14} />} label="Execute" onClick={() => { }} />
                        <ToolbarButton icon={<Copy size={14} />} label="Clone" onClick={() => navigator.clipboard.writeText(code)} />
                        <ToolbarButton icon={<Save size={14} />} label="Deploy" onClick={() => { }} primary />
                    </div>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden bg-white/5 dark:bg-black/20">
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple blur-[150px] rounded-full" />
                </div>

                <div className="relative h-full z-10">
                    {activeTab === 'code' ? (
                        isDiffMode && originalCode ? (
                            <DiffEditor
                                height="100%"
                                language={language}
                                original={originalCode}
                                modified={code}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    readOnly: true,
                                    automaticLayout: true,
                                    padding: { top: 32 },
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                    lineNumbers: 'on',
                                    renderSideBySide: true,
                                }}
                            />
                        ) : (
                            <Editor
                                height="100%"
                                language={language}
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: true,
                                    scrollBeyondLastLine: false,
                                    readOnly: false,
                                    automaticLayout: true,
                                    padding: { top: 32 },
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                }}
                            />
                        )
                    ) : (
                        <div className="h-full p-12 overflow-y-auto custom-scrollbar text-sm">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto space-y-10"
                            >
                                <div>
                                    <h3 className="text-4xl font-display font-extrabold tracking-tight mb-2">Architect Engagement</h3>
                                    <p className="text-gray-500 font-medium tracking-wide">Autonomous Code Audit System v4.2</p>
                                </div>

                                <div className="p-10 premium-card space-y-4">
                                    <div className="flex items-center gap-3 text-primary-600 uppercase text-[10px] font-black tracking-[0.3em]">
                                        <Sparkles size={16} />
                                        <span>System Status</span>
                                    </div>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                        Architect Engine is currently processing the workspace history. Real-time feedback and security vulnerabilities will manifest here upon connection.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <MetricCard label="Stability" value="98.2%" color="text-teal-500" />
                                    <MetricCard label="Latency" value="14ms" color="text-blue-500" />
                                    <MetricCard label="Security" value="S-Tier" color="text-accent-rose" />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </div>

                {activeTab === 'code' && (
                    <motion.div
                        className="absolute bottom-10 right-10 flex flex-col gap-3 z-30"
                    >
                        <FloatingAction icon={<Sparkles size={20} />} label="Audit" color="bg-primary-600" onClick={onReview} />
                        <FloatingAction icon={<Wand2 size={20} />} label="Evolve" color="bg-accent-purple" onClick={onModify} />
                        <FloatingAction icon={<Zap size={20} />} label="Optimize" color="bg-accent-amber" onClick={onOptimize} />
                        <FloatingAction icon={<Save size={20} />} label="Synthesize" color="bg-accent-teal" onClick={onGenerate} />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${active
            ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
    >
        {label}
    </button>
);

const MetricCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="p-4 glass rounded-[1.5rem] border border-white/5 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
);

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean }> = ({
    icon, label, onClick, primary
}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all active:scale-95 text-xs font-semibold ${primary
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 hover:bg-primary-500'
            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const FloatingAction: React.FC<{ icon: React.ReactNode; label: string; color: string; onClick?: () => void }> = ({ icon, label, color, onClick }) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${color} text-white flex items-center gap-3 pr-5 pl-4 py-3 rounded-2xl shadow-xl shadow-black/20 group relative overflow-hidden`}
    >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        {icon}
        <span className="text-sm font-bold tracking-tight">{label}</span>
    </motion.button>
);

export default EditorPanel;
