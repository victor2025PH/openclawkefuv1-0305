import React, { useState } from 'react';
import { 
  Cpu, 
  Settings, 
  Bell, 
  Database, 
  Save, 
  Check, 
  Zap, 
  Trash2, 
  Send,
  Server
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { motion } from 'motion/react';

type SettingsTab = 'ai' | 'cluster' | 'alerts' | 'data';

export const SystemSettingsView: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock Form State
  const [formData, setFormData] = useState({
    // AI
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1',
    apiKey: 'sk-........................',
    model: 'gpt-4-turbo',
    // Cluster
    heartbeat: 15,
    maxAgents: 50,
    proxyStrategy: 'round_robin',
    // Alerts
    tgToken: '',
    tgChatId: '',
    // Data
    retention: '30d'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'ai', label: 'aiModels', icon: Cpu },
    { id: 'cluster', label: 'clusterSettings', icon: Server },
    { id: 'alerts', label: 'alertsNotifications', icon: Bell },
    { id: 'data', label: 'dataMaintenance', icon: Database },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col md:flex-row gap-6"
    >
      {/* Left Sidebar - Tabs */}
      <div className="w-full md:w-64 flex flex-col gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-gray-500 dark:text-slate-500'} />
              {t(tab.label as any)}
            </button>
          );
        })}
      </div>

      {/* Right Content - Form */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {/* AI & Models */}
          {activeTab === 'ai' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('aiModels')}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Configure external LLM providers for agent intelligence.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('defaultProvider')}</label>
                  <select 
                    value={formData.provider}
                    onChange={(e) => setFormData({...formData, provider: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="openai">{t('providerOpenAI')}</option>
                    <option value="anthropic">{t('providerAnthropic')}</option>
                    <option value="local">{t('providerLocal')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('apiEndpoint')}</label>
                  <input 
                    type="text" 
                    value={formData.endpoint}
                    onChange={(e) => setFormData({...formData, endpoint: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('apiKey')}</label>
                  <input 
                    type="password" 
                    value={formData.apiKey}
                    onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('defaultModel')}</label>
                  <input 
                    type="text" 
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 rounded-lg transition-colors text-sm font-medium">
                    <Zap size={16} />
                    {t('testConnection')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cluster Settings */}
          {activeTab === 'cluster' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('clusterSettings')}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Manage global parameters for distributed nodes.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('heartbeatInterval')}: <span className="font-mono text-blue-600 dark:text-blue-400">{formData.heartbeat}s</span>
                  </label>
                  <input 
                    type="range" 
                    min="5" 
                    max="60" 
                    step="1"
                    value={formData.heartbeat}
                    onChange={(e) => setFormData({...formData, heartbeat: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5s (High Load)</span>
                    <span>60s (Low Traffic)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('maxConcurrentAgents')}</label>
                  <input 
                    type="number" 
                    value={formData.maxAgents}
                    onChange={(e) => setFormData({...formData, maxAgents: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('proxyRotationStrategy')}</label>
                  <select 
                    value={formData.proxyStrategy}
                    onChange={(e) => setFormData({...formData, proxyStrategy: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="random">{t('strategyRandom')}</option>
                    <option value="round_robin">{t('strategyRoundRobin')}</option>
                    <option value="sticky">{t('strategySticky')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {activeTab === 'alerts' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('alertsNotifications')}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Configure notification channels for system anomalies.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('telegramBotToken')}</label>
                  <input 
                    type="password" 
                    value={formData.tgToken}
                    onChange={(e) => setFormData({...formData, tgToken: e.target.value})}
                    placeholder="123456789:ABCdef..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('telegramChatId')}</label>
                  <input 
                    type="text" 
                    value={formData.tgChatId}
                    onChange={(e) => setFormData({...formData, tgChatId: e.target.value})}
                    placeholder="-100123456789"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div className="pt-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors text-sm font-medium border border-blue-100 dark:border-transparent">
                    <Send size={16} />
                    {t('sendTestMessage')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('dataMaintenance')}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">Manage data retention and storage cleanup.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('chatLogRetention')}</label>
                  <select 
                    value={formData.retention}
                    onChange={(e) => setFormData({...formData, retention: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="7d">{t('retention7Days')}</option>
                    <option value="30d">{t('retention30Days')}</option>
                    <option value="forever">{t('retentionForever')}</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                  <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">{t('clearOfflineCache')}</h4>
                  <p className="text-xs text-red-600/80 dark:text-red-400/70 mb-3">{t('clearCacheWarning')}</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors text-sm font-medium border border-red-200 dark:border-red-800 shadow-sm">
                    <Trash2 size={16} />
                    {t('clearOfflineCache')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium shadow-sm transition-all ${
              showSuccess 
                ? 'bg-emerald-500 hover:bg-emerald-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : showSuccess ? (
              <Check size={20} />
            ) : (
              <Save size={20} />
            )}
            {showSuccess ? t('saved') : t('saveChanges')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
