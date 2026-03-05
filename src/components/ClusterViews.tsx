import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Bot, 
  Smartphone, 
  Activity, 
  Wifi,
  Cpu,
  MemoryStick,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Host, Agent } from '../types';
import { 
  MOCK_HOSTS, 
  generateMockAgents, 
  MOCK_MESSAGE_VOLUME, 
  MOCK_SYSTEM_LOAD, 
  MOCK_TOP_AGENTS, 
  MOCK_RECENT_ALERTS 
} from '../mockData';
import { useTranslation } from '../i18n';

// --- Shared Components ---

export const ProgressBar = ({ value, colorClass, height = "h-2" }: { value: number; colorClass: string; height?: string }) => (
  <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full ${height} overflow-hidden`}>
    <div 
      className={`${height} rounded-full ${colorClass} transition-all duration-500 ease-out`} 
      style={{ width: `${value}%` }}
    />
  </div>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();
  const colors: Record<string, string> = {
    online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    normal: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    offline: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400',
    idle: 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    restricted: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  
  const icons: Record<string, any> = {
    online: CheckCircle,
    active: Activity,
    normal: CheckCircle,
    offline: AlertCircle,
    idle: Clock,
    warning: AlertCircle,
    restricted: AlertCircle,
    error: AlertCircle,
    banned: AlertCircle
  };

  const Icon = icons[status] || Activity;
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1.5 w-fit ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      <Icon size={12} />
      {t(`status.${status}` as any)}
    </span>
  );
};

export const StatCard = ({ label, value, icon: Icon, colorClass }: { label: string; value: string; icon: any; colorClass: string }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-4 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon className={colorClass.replace('bg-', 'text-')} size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// --- Phase 1: Dashboard ---

const HostCard: React.FC<{ host: Host; onClick: (host: Host) => void }> = ({ host, onClick }) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onClick(host)}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${host.status === 'offline' ? 'bg-gray-100 text-gray-400 dark:bg-slate-700' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'}`}>
            <Server size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{host.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{host.ip}</p>
          </div>
        </div>
        <StatusBadge status={host.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Smartphone size={16} className="text-gray-400" />
          <span>{host.devices} {t('devices')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Bot size={16} className="text-gray-400" />
          <span>{host.agents} {t('agents')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 col-span-2">
          <Wifi size={16} className="text-gray-400" />
          <span>{host.latency}ms {t('latency')}</span>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-700">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><Cpu size={12}/> {t('cpu')}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{host.cpuUsage}%</span>
          </div>
          <ProgressBar value={host.cpuUsage} colorClass="bg-blue-500" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1"><MemoryStick size={12}/> {t('ram')}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{host.ramUsage}%</span>
          </div>
          <ProgressBar value={host.ramUsage} colorClass="bg-indigo-500" />
        </div>
      </div>
    </motion.div>
  );
};

export const DashboardView: React.FC = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      key="dashboard-view"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label={t('onlineHosts')} value="10/10" icon={Server} colorClass="bg-emerald-500 text-emerald-500" />
        <StatCard label={t('runningAgents')} value="50" icon={Bot} colorClass="bg-blue-500 text-blue-500" />
        <StatCard label={t('controlledDevices')} value="120+" icon={Smartphone} colorClass="bg-purple-500 text-purple-500" />
        <StatCard label={t('activeAlerts')} value="0" icon={Activity} colorClass="bg-amber-500 text-amber-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message Volume Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('messageVolume')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MESSAGE_VOLUME}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Load Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('systemLoad')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_SYSTEM_LOAD}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#ef4444" strokeWidth={2} dot={false} name="CPU" />
                <Line type="monotone" dataKey="ram" stroke="#8b5cf6" strokeWidth={2} dot={false} name="RAM" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top Agents & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Agents */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('topAgents')}</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">{t('viewAll')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500 border-b border-gray-100 dark:border-slate-700">
                <tr>
                  <th className="pb-3 font-medium">{t('agentNameId')}</th>
                  <th className="pb-3 font-medium text-right">{t('messages')}</th>
                  <th className="pb-3 font-medium text-right">{t('efficiency')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {MOCK_TOP_AGENTS.map((agent) => (
                  <tr key={agent.id} className="group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 font-medium text-gray-900 dark:text-white">{agent.name}</td>
                    <td className="py-3 text-right text-gray-600 dark:text-slate-300">{agent.messages}</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {agent.efficiency}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('recentAlerts')}</h3>
          <div className="space-y-4">
            {MOCK_RECENT_ALERTS.length > 0 ? (
              MOCK_RECENT_ALERTS.map((alert) => (
                <div key={alert.id} className="flex gap-3 items-start">
                  <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                    alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                    alert.type === 'error' ? 'bg-red-100 text-red-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <AlertCircle size={14} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 dark:text-slate-200 font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">{t('noAlerts')}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HostListView: React.FC<{ onHostSelect: (host: Host) => void }> = ({ onHostSelect }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      key="hosts-list"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('clusterNodes')}</h3>
        <div className="flex gap-2">
          <select className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>{t('allStatus')}</option>
            <option>{t('online')}</option>
            <option>{t('offline')}</option>
          </select>
          <select className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>{t('sortByName')}</option>
            <option>{t('sortByLoad')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_HOSTS.map((host) => (
          <HostCard key={host.id} host={host} onClick={onHostSelect} />
        ))}
      </div>
    </motion.div>
  );
};

// --- Phase 2: Host Detail ---

export const HostDetailView: React.FC<{ host: Host; onBack: () => void; onAgentSelect: (agent: Agent) => void }> = ({ host, onBack, onAgentSelect }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setAgents(generateMockAgents(host.id, host.agents));
  }, [host]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-500">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>{t('dashboard')}</span>
            <span>/</span>
            <span>{t('hosts')}</span>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{host.name}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            {host.name}
            <StatusBadge status={host.status} />
          </h2>
        </div>
      </div>

      {/* Host Overview Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('hostInfo')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">{t('ipAddress')}</p><p className="font-mono text-sm text-gray-700 dark:text-slate-300">{host.ip}</p></div>
              <div><p className="text-xs text-gray-500">{t('location')}</p><p className="text-sm text-gray-700 dark:text-slate-300">US-East-1</p></div>
              <div><p className="text-xs text-gray-500">{t('uptime')}</p><p className="text-sm text-gray-700 dark:text-slate-300">14d 2h 12m</p></div>
              <div><p className="text-xs text-gray-500">{t('version')}</p><p className="text-sm text-gray-700 dark:text-slate-300">v2.4.1</p></div>
            </div>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('resources')}</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{t('cpuLoad')}</span><span className="font-medium text-gray-700 dark:text-slate-300">{host.cpuUsage}%</span></div>
                <ProgressBar value={host.cpuUsage} colorClass="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{t('memoryUsage')}</span><span className="font-medium text-gray-700 dark:text-slate-300">{host.ramUsage}%</span></div>
                <ProgressBar value={host.ramUsage} colorClass="bg-indigo-500" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-gray-500">{t('diskIo')}</span><span className="font-medium text-gray-700 dark:text-slate-300">12%</span></div>
                <ProgressBar value={12} colorClass="bg-emerald-500" />
              </div>
            </div>
          </div>

          {/* Task Queue Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t('taskQueue')}</h3>
            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">{t('currentTask')}</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">{host.taskQueue.currentTask}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2"><span>{t('progress')}</span><span>{host.taskQueue.completed} / {host.taskQueue.total}</span></div>
              <ProgressBar value={(host.taskQueue.completed / (host.taskQueue.total || 1)) * 100} colorClass="bg-purple-500" height="h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('activeAgents')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-medium">{t('agentNameId')}</th>
                <th className="px-6 py-4 font-medium">{t('businessFlow')}</th>
                <th className="px-6 py-4 font-medium">{t('deviceId')}</th>
                <th className="px-6 py-4 font-medium">{t('status')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('msgsToday')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('lastActive')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {agents.map((agent) => (
                <tr key={agent.id} onClick={() => onAgentSelect(agent)} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors"><Bot size={18} /></div>
                      <div><p className="font-medium text-gray-900 dark:text-white">{agent.name}</p><p className="text-xs text-gray-500 font-mono">{agent.id}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><Layers size={14} className="text-gray-400" /><span className="text-gray-700 dark:text-slate-300">{agent.flow}</span></div></td>
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-slate-400">{agent.deviceId}</td>
                  <td className="px-6 py-4"><StatusBadge status={agent.status} /></td>
                  <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><span className="font-medium text-gray-900 dark:text-white">{agent.messagesToday}</span><MessageSquare size={14} className="text-gray-400" /></div></td>
                  <td className="px-6 py-4 text-right text-gray-500">{agent.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
