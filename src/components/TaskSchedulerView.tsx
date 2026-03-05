import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Users, 
  Server, 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../i18n';
import { Task, TaskStatus, TaskType } from '../types';
import { MOCK_TASKS } from '../mockData';

export function TaskSchedulerView() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<TaskType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks
  const activeTasks = tasks.filter(task => task.status === 'running' || task.status === 'paused');
  const historyTasks = tasks.filter(task => task.status !== 'running' && task.status !== 'paused');

  const filteredHistory = historyTasks.filter(task => {
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'running': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
      case 'completed': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'failed': return 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-slate-500 bg-gray-50 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getTypeLabel = (type: TaskType) => {
    switch (type) {
      case 'mass_dm': return t('massDm');
      case 'keyword_listen': return t('keywordListen');
      case 'auto_reply': return t('autoReply');
      case 'warm_up': return t('warmUp');
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('activeTasks')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {activeTasks.length} {t('running').toLowerCase()} tasks
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-blue-600/20"
        >
          <Plus size={18} />
          {t('createTask')}
        </button>
      </div>

      {/* Active Tasks Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {activeTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${getStatusColor(task.status)}`}>
                    {t(task.status)}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{task.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{getTypeLabel(task.type)}</p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <Zap size={20} className="text-blue-500" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">{t('progress')}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{task.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-slate-700 pt-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Server size={12} /> {t('hostsCount')}
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">{task.hostCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Bot size={12} /> {t('agentsCount')}
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">{task.agentCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Clock size={12} /> {t('eta')}
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">{task.eta}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                {task.status === 'running' ? (
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 rounded-lg transition-colors">
                    <Pause size={16} /> {t('pause')}
                  </button>
                ) : (
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Play size={16} /> {t('resume')}
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Square size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Task History List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('taskHistory')}</h3>
          
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white w-full sm:w-64"
              />
            </div>
            <div className="relative">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TaskType | 'all')}
                className="appearance-none pl-4 pr-10 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white cursor-pointer"
              >
                <option value="all">{t('allStatus')}</option>
                <option value="mass_dm">{t('massDm')}</option>
                <option value="keyword_listen">{t('keywordListen')}</option>
                <option value="auto_reply">{t('autoReply')}</option>
                <option value="warm_up">{t('warmUp')}</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-4">{t('taskName')}</th>
                <th className="px-6 py-4">{t('taskType')}</th>
                <th className="px-6 py-4">{t('status')}</th>
                <th className="px-6 py-4">{t('totalProgress')}</th>
                <th className="px-6 py-4">{t('createdAt')}</th>
                <th className="px-6 py-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredHistory.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {task.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {getTypeLabel(task.type)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {t(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${task.status === 'failed' ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('createTask')}</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Task Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('taskName')}
                </label>
                <input 
                  type="text" 
                  placeholder={t('enterTaskName')}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('taskType')}
                </label>
                <select className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white">
                  <option value="">{t('selectTaskType')}</option>
                  <option value="mass_dm">{t('massDm')}</option>
                  <option value="keyword_listen">{t('keywordListen')}</option>
                  <option value="auto_reply">{t('autoReply')}</option>
                  <option value="warm_up">{t('warmUp')}</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('targetAudience')}
                </label>
                <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-slate-900/50">
                  <Upload className="text-slate-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{t('uploadFile')}</p>
                  <p className="text-xs text-slate-500 mt-1">.csv, .txt (Max 5MB)</p>
                </div>
              </div>

              {/* Execution Strategy */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('executionStrategy')}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center p-4 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-700 dark:text-blue-300">
                    <Zap size={24} className="mb-2" />
                    <span className="text-sm font-bold">{t('autoLoadBalance')}</span>
                    <span className="text-xs opacity-80 mt-1 text-center">{t('strategyDesc')}</span>
                  </button>
                  <button className="flex flex-col items-center p-4 border border-gray-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <Users size={24} className="mb-2" />
                    <span className="text-sm font-bold">{t('manualSelection')}</span>
                    <span className="text-xs opacity-80 mt-1 text-center">Manually pick agents</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900/50">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
              >
                {t('createTask')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
