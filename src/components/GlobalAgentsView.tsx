import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Play, 
  Pause, 
  RotateCw, 
  Settings, 
  MoreHorizontal,
  Bot,
  Layers,
  Smartphone,
  Cpu,
  Server
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n';
import { Agent } from '../types';
import { MOCK_GLOBAL_AGENTS } from '../mockData';
import { StatusBadge } from './ClusterViews';

export const GlobalAgentsView: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [hostFilter, setHostFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter Logic
  const filteredAgents = MOCK_GLOBAL_AGENTS.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHost = hostFilter === 'all' || agent.hostId === hostFilter;
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesHost && matchesStatus;
  });

  // Unique Hosts for Filter
  const hosts = Array.from(new Set(MOCK_GLOBAL_AGENTS.map(a => a.hostId))).sort();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 h-full flex flex-col"
    >
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          {t('createAgent')}
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Host Filter */}
          <div className="relative">
            <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={hostFilter}
              onChange={(e) => setHostFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">{t('allHosts')}</option>
              {hosts.map(host => (
                <option key={host} value={host}>{host}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder={t('searchAgents')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">{t('agentName')} / ID</th>
                <th className="px-6 py-4 font-medium">{t('hostNode')}</th>
                <th className="px-6 py-4 font-medium">{t('businessFlow')}</th>
                <th className="px-6 py-4 font-medium">{t('aiModel')}</th>
                <th className="px-6 py-4 font-medium">{t('controlledDevicesCount')}</th>
                <th className="px-6 py-4 font-medium">{t('status')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  {/* Agent Name / ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <Bot size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{agent.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{agent.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Host Node */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Server size={14} className="text-gray-400" />
                      <span className="text-gray-700 dark:text-slate-300 font-mono">{agent.hostId}</span>
                    </div>
                  </td>

                  {/* Business Flow */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-gray-400" />
                      <span className="text-gray-700 dark:text-slate-300">{agent.flow}</span>
                    </div>
                  </td>

                  {/* AI Model */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={14} className="text-purple-500" />
                      <span className="text-gray-900 dark:text-white font-medium">{agent.aiModel || 'GPT-4'}</span>
                    </div>
                  </td>

                  {/* Controlled Devices */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Smartphone size={14} className="text-gray-400" />
                      <span className="text-gray-700 dark:text-slate-300">{agent.deviceCount || 1} Devices</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={agent.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title={agent.status === 'active' ? t('pause') : t('play')}
                      >
                        {agent.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        title={t('restart')}
                      >
                        <RotateCw size={16} />
                      </button>
                      <button 
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                        title={t('editConfig')}
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Mock) */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-900/50">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {t('showing')} <span className="font-medium">1</span> {t('of')} <span className="font-medium">{Math.ceil(filteredAgents.length / 10)}</span> {t('results')}
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              {t('prev')}
            </button>
            <button className="px-3 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50" disabled>
              {t('next')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
