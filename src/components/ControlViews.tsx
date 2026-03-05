import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Trash2, 
  MessageCircle, 
  Smartphone, 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Mic, 
  User, 
  Tag, 
  FileText, 
  DollarSign, 
  Activity,
  Power,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Host, Agent, AppInstance, ChatMessage } from '../types';
import { generateAppInstances, MOCK_CONTACTS, MOCK_CHAT_HISTORY, MOCK_CRM_DATA } from '../mockData';
import { StatusBadge } from './ClusterViews';
import { useTranslation } from '../i18n';

// --- Phase 3: Agent Detail (App Matrix) ---

const AppCard: React.FC<{ 
  app: AppInstance; 
  isSelected: boolean;
  onSelect: (appId: string) => void;
  onClick: (app: AppInstance) => void 
}> = ({ app, isSelected, onSelect, onClick }) => {
  const { t } = useTranslation();
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Telegram': return <Send size={20} className="text-blue-500" />;
      case 'WhatsApp': return <MessageCircle size={20} className="text-green-500" />;
      case 'Facebook': return <MessageCircle size={20} className="text-blue-600" />;
      case 'Instagram': return <Smartphone size={20} className="text-pink-500" />;
      default: return <Bot size={20} className="text-gray-500" />;
    }
  };

  const getStrategyBadge = (status?: string) => {
    switch (status) {
      case 'listening': return <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-medium border border-indigo-200 dark:border-indigo-800">{t('statusListening')}</span>;
      case 'hype': return <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-medium border border-orange-200 dark:border-orange-800">{t('statusHype')}</span>;
      case 'support': return <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium border border-emerald-200 dark:border-emerald-800">{t('statusSupport')}</span>;
      default: return <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-[10px] font-medium border border-gray-200 dark:border-slate-600">{t('statusIdle')}</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-white dark:bg-slate-800 rounded-xl border p-4 shadow-sm hover:shadow-md transition-all group relative ${
        isSelected 
          ? 'border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400' 
          : 'border-gray-200 dark:border-slate-700'
      }`}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <input 
          type="checkbox" 
          checked={isSelected}
          onChange={() => onSelect(app.id)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center border border-gray-100 dark:border-slate-600">
          {getPlatformIcon(app.platform)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{app.alias}</h4>
          <p className="text-xs text-gray-500 font-mono">...{app.phoneTail}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <StatusBadge status={app.status} />
        {getStrategyBadge(app.strategyStatus)}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 dark:border-slate-700">
        <button className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-500 hover:text-blue-600 transition-colors" title={t('restart')}>
          <RefreshCw size={16} />
          <span className="text-[10px]">{t('restart')}</span>
        </button>
        <button className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-500 hover:text-red-600 transition-colors" title={t('clearCache')}>
          <Trash2 size={16} />
          <span className="text-[10px]">{t('clearCache')}</span>
        </button>
        <button 
          onClick={() => onClick(app)}
          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors" 
          title={t('viewChat')}
        >
          <MessageCircle size={16} />
          <span className="text-[10px]">{t('viewChat')}</span>
        </button>
      </div>
    </motion.div>
  );
};

export const AgentDetailView: React.FC<{ host: Host; agent: Agent; onBack: () => void; onAppSelect: (app: AppInstance) => void }> = ({ host, agent, onBack, onAppSelect }) => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  useEffect(() => {
    setApps(generateAppInstances(agent.id));
  }, [agent]);

  const toggleSelect = (appId: string) => {
    const newSelected = new Set(selectedApps);
    if (newSelected.has(appId)) {
      newSelected.delete(appId);
    } else {
      newSelected.add(appId);
    }
    setSelectedApps(newSelected);
  };

  const handleAssignTask = () => {
    // Mock task assignment
    alert(`Assigned task to ${selectedApps.size} apps`);
    setSelectedApps(new Set());
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>{t('dashboard')}</span>
            <span>/</span>
            <span>{t('hosts')}</span>
            <span>/</span>
            <span>{host.name}</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{agent.name}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {t('appMatrix')}
            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-md">{apps.length} {t('instances')}</span>
          </h2>
        </div>
      </div>

      {/* Collab Task Panel */}
      <AnimatePresence>
        {selectedApps.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 overflow-hidden"
          >
            <div className="flex items-center gap-3 text-blue-700 dark:text-blue-300 font-medium whitespace-nowrap">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Bot size={20} />
              </div>
              <span>{t('assignCollabTask')}</span>
              <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs">
                {selectedApps.size} {t('selected')}
              </span>
            </div>

            <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
              <input 
                type="text" 
                placeholder={t('targetGroupId')} 
                className="flex-1 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>{t('roleMainSupport')}</option>
                <option>{t('roleHypeSupport')}</option>
                <option>{t('roleObserver')}</option>
              </select>
            </div>

            <button 
              onClick={handleAssignTask}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm whitespace-nowrap transition-colors"
            >
              {t('executeTask')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {apps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app} 
            isSelected={selectedApps.has(app.id)}
            onSelect={toggleSelect}
            onClick={onAppSelect} 
          />
        ))}
      </div>
    </motion.div>
  );
};

// --- Phase 4: App Control (Chat & Device) ---

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const { t } = useTranslation();
  
  // System Message
  if (message.role === 'system') {
    return (
      <div className="flex justify-center my-4">
        <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-gray-200 dark:border-slate-700">
          {message.text}
        </span>
      </div>
    );
  }

  const isCustomer = message.role === 'customer';
  const isPrimaryAI = message.role === 'primary_ai';
  const isCollabAI = message.role === 'collab_ai';

  // Bubble Styling
  let bubbleClass = "bg-white border border-gray-100 text-gray-900 dark:bg-slate-700 dark:text-white dark:border-transparent rounded-tl-none"; // Default Customer
  let alignClass = "justify-start";
  let label = null;

  if (isPrimaryAI) {
    bubbleClass = "bg-blue-50 border border-blue-100 text-gray-800 dark:bg-blue-600 dark:text-white dark:border-transparent rounded-tr-none";
    alignClass = "justify-end";
    label = <span className="text-[9px] font-bold text-blue-600 dark:text-blue-100 mb-1 block uppercase tracking-wider">{t('rolePrimaryAI')}</span>;
  } else if (isCollabAI) {
    bubbleClass = "bg-purple-50 border border-purple-100 text-gray-800 dark:bg-purple-900/40 dark:text-purple-100 dark:border-purple-800 rounded-tr-none";
    alignClass = "justify-end";
    label = <span className="text-[9px] font-bold text-purple-600 dark:text-purple-300 mb-1 block uppercase tracking-wider">{t('roleCollabAI')}</span>;
  }

  return (
    <div className={`flex ${alignClass} mb-4 group`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${alignClass === 'justify-end' ? 'items-end' : 'items-start'}`}>
        {/* Sender Name for Group Context */}
        {message.senderName && (
          <span className="text-[10px] text-gray-400 mb-1 px-1">
            {message.senderName}
          </span>
        )}
        
        <div className={`rounded-2xl p-3 shadow-sm ${bubbleClass} w-full`}>
          {label}
          
          {/* Text Content */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
          
          {/* Rich Media Card */}
          {message.card && (
            <div className="mt-3 bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-black/5 dark:border-white/10">
              <h4 className="font-bold text-sm mb-1">{message.card.title}</h4>
              <p className="text-xs opacity-80 whitespace-pre-line mb-3 font-mono">{message.card.description}</p>
              <div className="flex flex-wrap gap-2">
                {message.card.buttons.map((btn, idx) => (
                  <button 
                    key={idx}
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-medium rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-600 text-center"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className={`text-[9px] mt-1 flex items-center gap-1 opacity-60 justify-end`}>
            <span>{message.timestamp}</span>
            {!isCustomer && <span>• {message.status}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppControlView: React.FC<{ host: Host; agent: Agent; app: AppInstance; onBack: () => void }> = ({ host, agent, app, onBack }) => {
  const { t } = useTranslation();
  const [manualOverride, setManualOverride] = useState(false);
  const [messages, setMessages] = useState(MOCK_CHAT_HISTORY);
  const [inputValue, setInputValue] = useState('');
  const [activeRightTab, setActiveRightTab] = useState<'crm' | 'orders' | 'collab'>('crm');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai', 
      role: 'primary_ai', // Default to Primary AI for manual sends
      senderName: 'Manual Override',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Telegram': return <Send size={14} className="text-blue-500" />;
      case 'WhatsApp': return <MessageCircle size={14} className="text-green-500" />;
      case 'Facebook': return <MessageCircle size={14} className="text-blue-600" />;
      case 'Instagram': return <Smartphone size={14} className="text-pink-500" />;
      default: return <Bot size={14} className="text-gray-500" />;
    }
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('Inquiry') || tag.includes('询价')) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
    if (tag.includes('Complaint') || tag.includes('投诉')) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>{host.name}</span>
              <span>/</span>
              <span>{agent.name}</span>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{app.alias}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {app.platform} {t('chatControl')}
              <StatusBadge status={app.status} />
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
          <span className={`text-sm font-medium ${manualOverride ? 'text-gray-500' : 'text-blue-600 dark:text-blue-400'}`}>{t('aiAutoPilot')}</span>
          <button 
            onClick={() => setManualOverride(!manualOverride)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${manualOverride ? 'bg-amber-500' : 'bg-gray-300 dark:bg-slate-600'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${manualOverride ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-medium ${manualOverride ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'}`}>{t('manualOverride')}</span>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left: Unified Inbox */}
        <div className="col-span-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User size={16} className="text-blue-500" /> {t('contacts')}
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder={t('searchContacts')} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 rounded-lg text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONTACTS.map(contact => (
              <div key={contact.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer border-b border-gray-100 dark:border-slate-700/50 ${contact.id === 'c1' ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                        {contact.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                        {getPlatformIcon(contact.platform)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{contact.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-gray-500">
                          {contact.type === 'dm' ? t('typeDM') : t('typeGroup')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate w-32">{contact.lastMessage}</p>
                      {contact.aiTags && contact.aiTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.aiTags.map(tag => (
                            <span key={tag} className={`text-[9px] px-1 rounded ${getTagColor(tag)}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">{contact.time}</p>
                    {contact.unreadCount > 0 && (
                      <span title={t('unread')} className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full mt-1">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Chat */}
        <div className="col-span-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden relative">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">CW</div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">CryptoWhale_99</h3>
                <p className="text-xs text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/> {t('status.online')}</p>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900/50">
            {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            {manualOverride ? (
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-blue-500"><Paperclip size={20} /></button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('typeMessage')} 
                  className="flex-1 bg-white border border-gray-200 dark:bg-slate-700 dark:border-transparent rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm"
                />
                <button onClick={handleSend} className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  <Send size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-gray-400 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                <Bot size={16} />
                <span className="text-sm">{t('aiHandling')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order & Control Panel */}
        <div className="col-span-3 flex flex-col gap-6">
          
          {/* Device Screen */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Smartphone size={16} className="text-blue-500" /> {t('liveScreen')}
            </h3>
            <div className="bg-slate-900 rounded-xl border-4 border-slate-800 overflow-hidden shadow-lg relative aspect-[9/16] flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-slate-500">
                <Smartphone size={48} className="mb-2 opacity-50" />
                <p className="text-xs font-mono">scrcpy_stream_05</p>
                <p className="text-[10px] opacity-50">60 FPS • 1080p</p>
              </div>
              {/* Simulated Screen Content Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
              <div className="absolute bottom-4 w-1/3 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>

          {/* Multi-function Panel */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700">
              <button 
                onClick={() => setActiveRightTab('crm')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeRightTab === 'crm' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                {t('tabCrm')}
              </button>
              <button 
                onClick={() => setActiveRightTab('orders')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeRightTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                {t('tabOrders')}
              </button>
              <button 
                onClick={() => setActiveRightTab('collab')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeRightTab === 'collab' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
              >
                {t('tabCollab')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5 overflow-y-auto flex-1">
              {activeRightTab === 'crm' && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">{t('intentRating')}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[85%]" />
                      </div>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{MOCK_CRM_DATA.intentRating}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('summary')}</p>
                    <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                      {MOCK_CRM_DATA.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {MOCK_CRM_DATA.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs rounded-md font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-gray-500">{t('dealStage')}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{MOCK_CRM_DATA.dealStage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{t('estValue')}</p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{MOCK_CRM_DATA.estimatedValue}</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 mt-2 bg-gray-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    {t('openInHubSpot')}
                  </button>
                </div>
              )}

              {activeRightTab === 'orders' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Order #ORD-2024-001</h4>
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] rounded-full font-medium border border-amber-200 dark:border-amber-800">
                        {t('statusCheckingHash')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">Item: Premium Subscription (1 Year)</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                        {t('confirmOrder')}
                      </button>
                      <button className="flex-1 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        {t('trackOrder')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeRightTab === 'collab' && (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-2">{t('triggerEngagement')}</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 mb-4 leading-relaxed">
                      {t('triggerEngagementDesc')}
                    </p>
                    <button 
                      onClick={() => alert(t('engagementTriggered'))}
                      className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Activity size={16} />
                      {t('triggerEngagement')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
