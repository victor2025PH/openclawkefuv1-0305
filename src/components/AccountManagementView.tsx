import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Smartphone, 
  Server, 
  Globe, 
  MoreHorizontal, 
  RefreshCw, 
  Unlink, 
  MessageCircle, 
  Facebook, 
  Instagram, 
  Twitter, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { MOCK_ACCOUNTS } from '../mockData';
import { Account, AccountStatus, Platform } from '../types';

export const AccountManagementView: React.FC = () => {
  const { t } = useTranslation();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredAccounts = useMemo(() => {
    return MOCK_ACCOUNTS.filter(account => {
      // Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        account.alias.toLowerCase().includes(searchLower) || 
        account.phoneNumber.includes(searchQuery);

      // Platform
      const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(account.platform);

      // Status
      const matchesStatus = selectedStatus === 'all' || account.status === selectedStatus;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [searchQuery, selectedPlatforms, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
    setCurrentPage(1);
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'Telegram': return <MessageCircle size={18} className="text-blue-400" />;
      case 'WhatsApp': return <MessageCircle size={18} className="text-green-500" />;
      case 'Facebook': return <Facebook size={18} className="text-blue-600" />;
      case 'Instagram': return <Instagram size={18} className="text-pink-500" />;
      case 'Twitter': return <Twitter size={18} className="text-sky-400" />;
      default: return <Globe size={18} />;
    }
  };

  const getStatusBadge = (status: AccountStatus) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle size={12} /> {t('statusNormal')}
          </span>
        );
      case 'restricted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <AlertTriangle size={12} /> {t('statusRestricted')}
          </span>
        );
      case 'banned':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle size={12} /> {t('statusBanned')}
          </span>
        );
      case 'dormant':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
            <Moon size={12} /> {t('statusDormant')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t('searchAccounts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 transition-colors"
            />
          </div>

          {/* Platform Filter (Simple Multi-select simulation) */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-900 p-1 rounded-lg border border-gray-200 dark:border-slate-700">
            {(['Telegram', 'WhatsApp', 'Facebook', 'Instagram'] as Platform[]).map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`p-1.5 rounded-md transition-all ${
                  selectedPlatforms.includes(p)
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-slate-300'
                }`}
                title={p}
              >
                {getPlatformIcon(p)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AccountStatus | 'all')}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="normal">{t('statusNormal')}</option>
              <option value="restricted">{t('statusRestricted')}</option>
              <option value="banned">{t('statusBanned')}</option>
              <option value="dormant">{t('statusDormant')}</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download size={16} />
            {t('exportData')}
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">{t('account')}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">{t('routing')}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">{t('network')}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">{t('activity')}</th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-slate-200 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700/50">
              {paginatedAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  {/* Account Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        {account.avatar ? (
                          <span className="font-bold text-gray-600 dark:text-slate-300">{account.avatar}</span>
                        ) : (
                          getPlatformIcon(account.platform)
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                          {getPlatformIcon(account.platform)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{account.alias}</div>
                        <div className="text-xs text-gray-500 font-mono">{account.phoneNumber}</div>
                      </div>
                    </div>
                  </td>

                  {/* Routing */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                        <Server size={12} className="text-gray-400" />
                        <span>{account.hostNode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-1 h-4 border-l border-gray-300 dark:border-slate-600 ml-1.5"></div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                        <Smartphone size={12} className="text-gray-400" />
                        <span className="font-mono">{account.deviceId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Network */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-400" />
                        <span className="font-mono text-gray-700 dark:text-slate-300">{account.proxyIp}</span>
                      </div>
                      <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 text-xs rounded text-center w-fit">
                        {account.countryCode}
                      </span>
                    </div>
                  </td>

                  {/* Activity & Risk */}
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(account.status)}
                        <span className="text-xs text-gray-400">{account.lastOnline}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          {t('sent')}: <span className="font-medium text-gray-900 dark:text-white">{account.messagesSent}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          {t('received')}: <span className="font-medium text-gray-900 dark:text-white">{account.messagesReceived}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('unbindDevice')}
                      >
                        <Unlink size={16} />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={t('switchIp')}
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {t('showing')} <span className="font-medium text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredAccounts.length)}</span> {t('of')} <span className="font-medium text-gray-900 dark:text-white">{filteredAccounts.length}</span> {t('results')}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
