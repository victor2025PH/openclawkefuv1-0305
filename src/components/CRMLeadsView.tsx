import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { 
  Search, Filter, MoreHorizontal, MessageSquare, 
  Phone, Mail, Calendar, User, ArrowRight, X,
  CheckCircle, Clock, AlertCircle, Send, Bot, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
export type LeadStatus = 'new' | 'engaging' | 'qualified' | 'converted' | 'lost';
export type IntentRating = 'hot' | 'warm' | 'cold';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'human';
  content: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  platform: 'telegram' | 'whatsapp' | 'facebook' | 'instagram' | 'twitter';
  source: string;
  status: LeadStatus;
  intent: IntentRating;
  summary: string;
  budget?: string;
  lastActive: string;
  avatar?: string;
  chatHistory: ChatMessage[];
}

const MOCK_LEADS: Lead[] = [
  {
    id: 'L001',
    name: 'Alice Chen',
    platform: 'telegram',
    source: 'Crypto Group A',
    status: 'new',
    intent: 'hot',
    summary: 'Interested in decentralized exchange listings. Budget approx 5000 USDT.',
    budget: '5000 USDT',
    lastActive: '10 mins ago',
    chatHistory: [
      { id: 'm1', sender: 'ai', content: 'Hello! I noticed you are interested in DEX listings.', timestamp: '10:00 AM' },
      { id: 'm2', sender: 'user', content: 'Yes, looking for options.', timestamp: '10:05 AM' },
      { id: 'm3', sender: 'ai', content: 'We have a few premium slots available. What is your budget?', timestamp: '10:06 AM' },
      { id: 'm4', sender: 'user', content: 'Around 5k.', timestamp: '10:10 AM' },
    ]
  },
  {
    id: 'L002',
    name: 'John Doe',
    platform: 'facebook',
    source: 'FB Ads',
    status: 'engaging',
    intent: 'warm',
    summary: 'Asking about API rate limits. Potential enterprise client.',
    lastActive: '2 hours ago',
    chatHistory: [
        { id: 'm1', sender: 'user', content: 'Hi, what are your API limits?', timestamp: '09:00 AM' },
        { id: 'm2', sender: 'ai', content: 'Standard tier is 100 req/min. Enterprise is custom.', timestamp: '09:01 AM' },
        { id: 'm3', sender: 'user', content: 'Can I get a quote for 1M req/day?', timestamp: '09:15 AM' },
    ]
  },
  {
    id: 'L003',
    name: 'Michael Smith',
    platform: 'whatsapp',
    source: 'Referral',
    status: 'qualified',
    intent: 'hot',
    summary: 'Ready to sign contract. Needs final approval on terms.',
    budget: 'Enterprise',
    lastActive: '1 day ago',
    chatHistory: [
      { id: 'm1', sender: 'ai', content: 'Here is the contract draft.', timestamp: 'Yesterday' },
      { id: 'm2', sender: 'user', content: 'Looks good. Just need to check with legal.', timestamp: 'Yesterday' },
    ]
  },
  {
    id: 'L004',
    name: 'Sarah Jones',
    platform: 'twitter',
    source: 'Twitter Thread',
    status: 'new',
    intent: 'cold',
    summary: 'Just asking general questions about the product.',
    lastActive: '5 mins ago',
    chatHistory: [
      { id: 'm1', sender: 'user', content: 'Is this open source?', timestamp: '11:00 AM' },
      { id: 'm2', sender: 'ai', content: 'Partially. The core is open source.', timestamp: '11:01 AM' },
    ]
  },
  {
    id: 'L005',
    name: 'David Lee',
    platform: 'telegram',
    source: 'Direct Message',
    status: 'converted',
    intent: 'hot',
    summary: 'Payment received. Onboarding scheduled.',
    budget: '2000 USDT',
    lastActive: '3 days ago',
    chatHistory: [
      { id: 'm1', sender: 'user', content: 'Payment sent.', timestamp: 'Monday' },
      { id: 'm2', sender: 'ai', content: 'Confirmed. Welcome aboard!', timestamp: 'Monday' },
    ]
  }
];

const COLUMNS: { id: LeadStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New Leads', color: 'bg-blue-500' },
  { id: 'engaging', label: 'Engaging', color: 'bg-yellow-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-purple-500' },
  { id: 'converted', label: 'Converted', color: 'bg-green-500' },
];

export function CRMLeadsView() {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!selectedLead || !newMessage.trim()) return;
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'human',
      content: newMessage,
      timestamp: 'Just now'
    };

    const updatedLead = {
      ...selectedLead,
      chatHistory: [...selectedLead.chatHistory, msg]
    };

    setLeads(leads.map(l => l.id === selectedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    setNewMessage('');
  };

  const getIntentColor = (intent: IntentRating) => {
    switch (intent) {
      case 'hot': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'warm': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'cold': return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getPlatformIcon = (platform: string) => {
    // In a real app, use specific icons. Using generic for now or text.
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('leadsHub')}</h2>
          <p className="text-gray-500 dark:text-slate-400">{t('crmDescription')}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder={t('searchContacts')}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-[1000px] pb-4">
          {COLUMNS.map(column => (
            <div key={column.id} className="flex-1 flex flex-col min-w-[280px]">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-gray-700 dark:text-slate-200">{t(column.id)}</h3>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    {leads.filter(l => l.status === column.id).length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <div className="flex-1 bg-gray-100/50 dark:bg-slate-800/30 rounded-xl p-3 overflow-y-auto space-y-3 border border-gray-200/50 dark:border-slate-700/50">
                {leads.filter(l => l.status === column.id).map(lead => (
                  <motion.div
                    layoutId={lead.id}
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{lead.name}</h4>
                          <p className="text-xs text-gray-500">{lead.source}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getIntentColor(lead.intent)}`}>
                        {t(lead.intent)}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-600 dark:text-slate-300 line-clamp-2 bg-gray-50 dark:bg-slate-900/50 p-2 rounded border border-gray-100 dark:border-slate-800">
                        <span className="text-blue-500 mr-1">AI:</span>
                        {lead.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="capitalize bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-slate-300">
                          {lead.platform}
                        </span>
                        {lead.budget && (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {lead.budget}
                          </span>
                        )}
                      </div>
                      <span>{lead.lastActive}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-[500px] bg-white dark:bg-slate-900 shadow-2xl z-50 border-l border-gray-200 dark:border-slate-700 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedLead.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getIntentColor(selectedLead.intent)}`}>
                        {t(selectedLead.intent)}
                      </span>
                      <span className="text-xs text-gray-500">• {selectedLead.source}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Info Cards */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">{t('budget')}</div>
                    <div className="font-mono text-gray-900 dark:text-white font-medium">
                      {selectedLead.budget || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="text-xs text-gray-500 uppercase font-semibold mb-1">{t('platform')}</div>
                    <div className="capitalize text-gray-900 dark:text-white font-medium">
                      {selectedLead.platform}
                    </div>
                  </div>
                  <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">{t('aiSummary')}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                      {selectedLead.summary}
                    </p>
                  </div>
                </div>

                {/* Chat History */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare size={18} />
                      {t('chatHistory')}
                    </h3>
                    <button className="text-xs text-blue-600 hover:underline">
                      {t('export')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedLead.chatHistory.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.sender === 'ai' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300' :
                          msg.sender === 'human' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' :
                          'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {msg.sender === 'ai' ? <Bot size={14} /> : 
                           msg.sender === 'human' ? <UserIcon size={14} /> :
                           <UserIcon size={14} />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-white border border-gray-100 text-gray-900 dark:bg-slate-800 dark:text-white dark:border-transparent rounded-tr-none' 
                            : msg.sender === 'human'
                            ? 'bg-blue-600 text-white rounded-tl-none'
                            : 'bg-purple-50 border border-purple-100 text-gray-800 dark:bg-purple-900/20 dark:text-slate-200 dark:border-purple-800 rounded-tl-none'
                        }`}>
                          <p>{msg.content}</p>
                          <span className="text-[10px] opacity-50 mt-1 block">
                            {msg.timestamp} • {msg.sender === 'human' ? 'You' : msg.sender === 'ai' ? 'AI Agent' : 'Customer'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t('typeMessage')}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white shadow-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <button className="w-full py-2.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <UserIcon size={16} />
                  {t('takeOver')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
