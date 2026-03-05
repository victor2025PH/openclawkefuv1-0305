import React from 'react';
import { ShieldAlert, AlertTriangle, Activity, Lock, RefreshCw, Smartphone, UserX, Clock } from 'lucide-react';
import { MOCK_RISK_METRICS, MOCK_RISK_EVENTS, MOCK_SANDBOX_DEVICES } from '../mockData';
import { useTranslation } from '../i18n';

export const RiskControlView: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1. Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ban Rate */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserX size={80} className="text-red-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{t('banRate')}</span>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{MOCK_RISK_METRICS.banRate}%</span>
              <span className={`text-sm font-medium mb-1 ${MOCK_RISK_METRICS.banRate > 2 ? 'text-red-500' : 'text-green-500'}`}>
                {MOCK_RISK_METRICS.banRate > 2 ? '↑ High' : '↓ Low'}
              </span>
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${MOCK_RISK_METRICS.banRate > 5 ? 'bg-red-500' : MOCK_RISK_METRICS.banRate > 2 ? 'bg-orange-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min(MOCK_RISK_METRICS.banRate * 10, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-slate-400 mt-2">{t('today')}</span>
          </div>
        </div>

        {/* Interceptions */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert size={80} className="text-orange-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{t('interceptions')}</span>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{MOCK_RISK_METRICS.interceptions}</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <span className="text-xs text-slate-400 mt-2">{t('totalInterceptions')}</span>
          </div>
        </div>

        {/* Proxy Failures */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={80} className="text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{t('proxyFailures')}</span>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">{MOCK_RISK_METRICS.proxyFailures}</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '12%' }}></div>
            </div>
            <span className="text-xs text-slate-400 mt-2">{t('failedProxies')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Event Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
            <Activity size={18} className="text-slate-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">{t('eventTimeline')}</h3>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[500px]">
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200 dark:before:bg-slate-700">
              {MOCK_RISK_EVENTS.map((event) => (
                <div key={event.id} className="relative flex items-start group">
                  <div className={`absolute left-0 ml-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 ${
                    event.level === 'critical' ? 'bg-red-500' : 
                    event.level === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="ml-10 w-full">
                    <div className="bg-gray-50 dark:bg-slate-750 border border-gray-100 dark:border-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                          event.level === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                          event.level === 'warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}>
                          {event.level}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{event.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{event.message}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">
                          {event.nodeId}
                        </span>
                        {event.agentId && (
                          <span className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">
                            {event.agentId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Sandbox Isolation Zone */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">{t('sandboxIsolation')}</h3>
            </div>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full">
              {MOCK_SANDBOX_DEVICES.length}
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3">
            {MOCK_SANDBOX_DEVICES.map((device) => (
              <div key={device.id} className="bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-slate-400" />
                    <span className="font-medium text-sm text-slate-900 dark:text-slate-200">{device.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    device.status === 'isolated' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {t(device.status)}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{t('accountAlias')}:</span>
                    <span className="text-slate-700 dark:text-slate-300">{device.accountAlias || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{t('reason')}:</span>
                    <span className="text-red-500 dark:text-red-400">{device.reason}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{t('timeLeft')}:</span>
                    <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                      <Clock size={10} />
                      <span>{device.timeLeft}</span>
                    </div>
                  </div>
                </div>

                <button className="mt-3 w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-medium py-1.5 rounded transition-colors group">
                  <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                  {t('wipeAndReset')}
                </button>
              </div>
            ))}
            
            {MOCK_SANDBOX_DEVICES.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No devices in isolation.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
