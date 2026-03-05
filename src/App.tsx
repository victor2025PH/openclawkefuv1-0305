import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Server, 
  Bot, 
  Users, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Search,
  Activity,
  Globe,
  ListTodo,
  ShieldAlert,
  Target
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Host, Agent, AppInstance } from './types';
import { DashboardView, HostDetailView, HostListView } from './components/ClusterViews';
import { AgentDetailView, AppControlView } from './components/ControlViews';
import { AccountManagementView } from './components/AccountManagementView';
import { TaskSchedulerView } from './components/TaskSchedulerView';
import { RiskControlView } from './components/RiskControlView';
import { CRMLeadsView } from './components/CRMLeadsView';
import { SystemSettingsView } from './components/SystemSettingsView';
import { GlobalAgentsView } from './components/GlobalAgentsView';
import { I18nProvider, useTranslation, TranslationKey } from './i18n';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TranslationKey>('dashboard');
  
  // Navigation State
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppInstance | null>(null);

  // Navigation Handlers
  const handleHostSelect = (host: Host) => {
    setSelectedHost(host);
    setActiveTab('hosts'); // Ensure tab highlights correctly
  };

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleAppSelect = (app: AppInstance) => {
    setSelectedApp(app);
  };

  const handleBackToDashboard = () => {
    setSelectedHost(null);
    setSelectedAgent(null);
    setSelectedApp(null);
    setActiveTab('dashboard');
  };

  const handleBackToHost = () => {
    setSelectedAgent(null);
    setSelectedApp(null);
  };

  const handleBackToAgent = () => {
    setSelectedApp(null);
  };

  const navItems: { id: TranslationKey; icon: any }[] = [
    { id: 'dashboard', icon: LayoutDashboard },
    { id: 'hosts', icon: Server },
    { id: 'agents', icon: Bot },
    { id: 'tasks', icon: ListTodo },
    { id: 'accounts', icon: Users },
    { id: 'crmLeads', icon: Target },
    { id: 'riskControl', icon: ShieldAlert },
    { id: 'settings', icon: Settings },
  ];

  // Determine current view title
  const getTitle = () => {
    if (selectedApp) return t('appControl');
    if (selectedAgent) return t('agentDetails');
    if (selectedHost) return t('hostDetails');
    return t(activeTab);
  };

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100`}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col fixed h-full z-10 transition-colors duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-slate-700">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">{t('appName')}</h1>
            <p className="text-xs text-gray-500 font-medium">{t('appSubtitle')}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                // Reset drill-down state when switching main tabs
                setSelectedHost(null);
                setSelectedAgent(null);
                setSelectedApp(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon size={20} />
              {t(item.id)}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-slate-700">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                AD
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('adminUser')}</p>
                <p className="text-xs text-gray-500">admin@openclaw.io</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-hidden">
        
        {/* Top Bar */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{getTitle()}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm">{t('overview')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')} 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors"
              />
            </div>
            
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Globe size={18} />
              {language === 'en' ? '中文' : 'EN'}
            </button>

            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          {selectedApp && selectedAgent && selectedHost ? (
            <AppControlView 
              key="app-control" 
              host={selectedHost} 
              agent={selectedAgent} 
              app={selectedApp} 
              onBack={handleBackToAgent} 
            />
          ) : selectedAgent && selectedHost ? (
            <AgentDetailView 
              key="agent-detail" 
              host={selectedHost} 
              agent={selectedAgent} 
              onBack={handleBackToHost} 
              onAppSelect={handleAppSelect} 
            />
          ) : selectedHost ? (
            <HostDetailView 
              key="host-detail" 
              host={selectedHost} 
              onBack={handleBackToDashboard} 
              onAgentSelect={handleAgentSelect} 
            />
          ) : activeTab === 'dashboard' ? (
            <DashboardView 
              key="dashboard" 
            />
          ) : activeTab === 'hosts' ? (
            <HostListView 
              key="hosts-list" 
              onHostSelect={handleHostSelect} 
            />
          ) : activeTab === 'agents' ? (
            <GlobalAgentsView 
              key="agents-list"
            />
          ) : activeTab === 'tasks' ? (
            <TaskSchedulerView 
              key="tasks-list"
            />
          ) : activeTab === 'accounts' ? (
            <AccountManagementView 
              key="accounts-list"
            />
          ) : activeTab === 'riskControl' ? (
            <RiskControlView 
              key="risk-control"
            />
          ) : activeTab === 'crmLeads' ? (
            <CRMLeadsView 
              key="crm-leads"
            />
          ) : activeTab === 'settings' ? (
            <SystemSettingsView 
              key="settings"
            />
          ) : (
            <div key="wip" className="flex flex-col items-center justify-center h-96 text-gray-400">
              <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                <LayoutDashboard size={48} className="opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-slate-300">{t('wip')}</h3>
              <p>{t('wipDesc')}</p>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </I18nProvider>
  );
}
