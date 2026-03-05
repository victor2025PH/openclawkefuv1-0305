import { Host, Agent, AppInstance, ChatContact, ChatMessage, CRMData, Task, RiskMetric, RiskEvent, SandboxDevice } from './types';

// --- Phase 7 Data ---
export const MOCK_RISK_METRICS: RiskMetric = {
  banRate: 2.4,
  interceptions: 145,
  proxyFailures: 12
};

export const MOCK_RISK_EVENTS: RiskEvent[] = [
  {
    id: 'evt-01',
    timestamp: '10:42:15',
    level: 'warning',
    message: 'Node-03 Agent-5 triggered sending limits (TG). Auto-suspended.',
    nodeId: 'Node-03',
    agentId: 'Agent-5'
  },
  {
    id: 'evt-02',
    timestamp: '10:38:22',
    level: 'critical',
    message: 'High ban rate detected on subnet 192.168.1.x. Pausing all tasks.',
    nodeId: 'System'
  },
  {
    id: 'evt-03',
    timestamp: '10:15:00',
    level: 'info',
    message: 'Proxy rotation completed. 50 new IPs assigned.',
    nodeId: 'System'
  },
  {
    id: 'evt-04',
    timestamp: '09:55:10',
    level: 'warning',
    message: 'Device Dev-07 temperature high (45°C). Throttling performance.',
    nodeId: 'Node-02'
  }
];

export const MOCK_SANDBOX_DEVICES: SandboxDevice[] = [
  {
    id: 'dev-iso-01',
    name: 'Pixel 4a (Dev-12)',
    status: 'isolated',
    reason: 'Suspicious Activity',
    timeLeft: '23h 15m',
    nodeId: 'Node-03',
    accountAlias: 'TG-Marketing-05'
  },
  {
    id: 'dev-iso-02',
    name: 'Samsung S20 (Dev-08)',
    status: 'cooling',
    reason: 'Rate Limit Hit',
    timeLeft: '45m',
    nodeId: 'Node-01',
    accountAlias: 'FB-Lead-02'
  },
  {
    id: 'dev-iso-03',
    name: 'Xiaomi Note 10 (Dev-22)',
    status: 'isolated',
    reason: 'IP Blacklisted',
    timeLeft: '12h 00m',
    nodeId: 'Node-05',
    accountAlias: 'WA-Support-09'
  }
];

// --- Phase 1 & 2 Data ---
export const MOCK_HOSTS: Host[] = [
  { 
    id: '1', name: 'Node-01', ip: '192.168.1.101', devices: 12, agents: 5, latency: 12, cpuUsage: 24, ramUsage: 28, status: 'online',
    taskQueue: { total: 150, completed: 45, currentTask: 'Batch-TG-Invite-04' }
  },
  { 
    id: '2', name: 'Node-02', ip: '192.168.1.102', devices: 8, agents: 3, latency: 15, cpuUsage: 18, ramUsage: 22, status: 'online',
    taskQueue: { total: 80, completed: 78, currentTask: 'Data-Sync-FB-02' }
  },
  { 
    id: '3', name: 'Node-03', ip: '192.168.1.103', devices: 15, agents: 6, latency: 11, cpuUsage: 29, ramUsage: 30, status: 'online',
    taskQueue: { total: 200, completed: 12, currentTask: 'Warmup-IG-Accounts' }
  },
  { 
    id: '4', name: 'Node-04', ip: '192.168.1.104', devices: 0, agents: 0, latency: 0, cpuUsage: 0, ramUsage: 0, status: 'offline',
    taskQueue: { total: 0, completed: 0, currentTask: 'None' }
  },
  { 
    id: '5', name: 'Node-05', ip: '192.168.1.105', devices: 22, agents: 8, latency: 45, cpuUsage: 35, ramUsage: 42, status: 'warning',
    taskQueue: { total: 300, completed: 150, currentTask: 'Mass-DM-Campaign-A' }
  },
  { 
    id: '6', name: 'Node-06', ip: '192.168.1.106', devices: 10, agents: 4, latency: 13, cpuUsage: 21, ramUsage: 25, status: 'online',
    taskQueue: { total: 100, completed: 99, currentTask: 'Finalizing-Report' }
  },
  { 
    id: '7', name: 'Node-07', ip: '192.168.1.107', devices: 14, agents: 5, latency: 14, cpuUsage: 26, ramUsage: 29, status: 'online',
    taskQueue: { total: 120, completed: 30, currentTask: 'Content-Posting-Schedule' }
  },
  { 
    id: '8', name: 'Node-08', ip: '192.168.1.108', devices: 9, agents: 3, latency: 16, cpuUsage: 19, ramUsage: 23, status: 'online',
    taskQueue: { total: 50, completed: 10, currentTask: 'Friend-Request-Routine' }
  },
];

export const generateMockAgents = (hostId: string, count: number): Agent[] => {
  const flows = ['TG Marketing Group A', 'FB Inquiry Group B', 'IG Engagement Team', 'WhatsApp Support', 'Twitter Trends'];
  const statuses: Agent['status'][] = ['active', 'active', 'active', 'idle', 'error'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `agt-${hostId}-${i + 100}`,
    hostId,
    name: `Agent-${hostId}-${i + 1}`,
    flow: flows[i % flows.length],
    deviceId: `Dev-${hostId}-${200 + i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    messagesToday: Math.floor(Math.random() * 500) + 50,
    lastActive: `${Math.floor(Math.random() * 10)}m ago`
  }));
};

export const MOCK_GLOBAL_AGENTS: Agent[] = [
  {
    id: 'agt-global-001',
    hostId: 'Node-01',
    name: 'TG-Outreach-Alpha',
    flow: 'TG Marketing',
    deviceId: 'Dev-Group-A',
    status: 'active',
    messagesToday: 1240,
    lastActive: '2m ago',
    aiModel: 'GPT-4-Turbo',
    deviceCount: 12
  },
  {
    id: 'agt-global-002',
    hostId: 'Node-02',
    name: 'FB-Inquiry-Bot',
    flow: 'FB Inquiry',
    deviceId: 'Dev-Group-B',
    status: 'idle',
    messagesToday: 45,
    lastActive: '1h ago',
    aiModel: 'Claude-3-Opus',
    deviceCount: 5
  },
  {
    id: 'agt-global-003',
    hostId: 'Node-01',
    name: 'WA-Support-L1',
    flow: 'WhatsApp Support',
    deviceId: 'Dev-Group-C',
    status: 'active',
    messagesToday: 890,
    lastActive: 'Just now',
    aiModel: 'Qwen-Max',
    deviceCount: 8
  },
  {
    id: 'agt-global-004',
    hostId: 'Node-03',
    name: 'IG-Engagement-Pro',
    flow: 'IG Engagement',
    deviceId: 'Dev-Group-D',
    status: 'error',
    messagesToday: 0,
    lastActive: '5h ago',
    aiModel: 'GPT-3.5-Turbo',
    deviceCount: 20
  },
  {
    id: 'agt-global-005',
    hostId: 'Node-02',
    name: 'Twitter-Trend-Watcher',
    flow: 'Twitter Trends',
    deviceId: 'Dev-Group-E',
    status: 'active',
    messagesToday: 3200,
    lastActive: '1m ago',
    aiModel: 'Llama-3-70B',
    deviceCount: 15
  },
  {
    id: 'agt-global-006',
    hostId: 'Node-04',
    name: 'Cold-Email-Sender',
    flow: 'Email Marketing',
    deviceId: 'Dev-Group-F',
    status: 'idle',
    messagesToday: 120,
    lastActive: '30m ago',
    aiModel: 'Mistral-Large',
    deviceCount: 3
  },
  {
    id: 'agt-global-007',
    hostId: 'Node-01',
    name: 'TG-Group-Manager',
    flow: 'TG Management',
    deviceId: 'Dev-Group-G',
    status: 'active',
    messagesToday: 560,
    lastActive: '5m ago',
    aiModel: 'GPT-4o',
    deviceCount: 6
  }
];

// --- Phase 3 Data ---
export const generateAppInstances = (agentId: string): AppInstance[] => {
  const platforms: AppInstance['platform'][] = ['Telegram', 'WhatsApp', 'Facebook', 'Instagram'];
  const statuses: AppInstance['status'][] = ['normal', 'normal', 'normal', 'restricted', 'banned'];
  
  // Generate 12-20 apps per agent
  const count = Math.floor(Math.random() * 8) + 12;
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `app-${agentId}-${i}`,
    agentId,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    alias: `Account #${i + 1}`,
    phoneTail: Math.floor(1000 + Math.random() * 9000).toString(),
    status: statuses[Math.floor(Math.random() * 10) > 8 ? 2 : (Math.floor(Math.random() * 10) > 6 ? 1 : 0)], // mostly normal
    lastActive: `${Math.floor(Math.random() * 59)}m ago`,
    cacheSize: `${Math.floor(Math.random() * 500)}MB`
  }));
};

// --- Phase 4 Data ---
export const MOCK_CONTACTS: ChatContact[] = [
  { 
    id: 'c1', 
    name: 'Alex Chen', 
    avatar: 'AC', 
    lastMessage: 'Is the rate negotiable?', 
    unreadCount: 2, 
    time: '10:42 AM', 
    online: true,
    type: 'dm',
    platform: 'Telegram',
    aiTags: ['Inquiry']
  },
  { 
    id: 'c2', 
    name: 'Sarah Jones', 
    avatar: 'SJ', 
    lastMessage: 'Thanks for the info.', 
    unreadCount: 0, 
    time: 'Yesterday', 
    online: false,
    type: 'dm',
    platform: 'WhatsApp'
  },
  { 
    id: 'c3', 
    name: 'CryptoWhale_99', 
    avatar: 'CW', 
    lastMessage: 'I have 50k USDT to swap.', 
    unreadCount: 1, 
    time: '10:30 AM', 
    online: true,
    type: 'dm',
    platform: 'Telegram',
    aiTags: ['High Value']
  },
  { 
    id: 'c4', 
    name: 'Mike Ross', 
    avatar: 'MR', 
    lastMessage: 'When can we start?', 
    unreadCount: 0, 
    time: 'Yesterday', 
    online: false,
    type: 'dm',
    platform: 'Facebook'
  },
  { 
    id: 'c5', 
    name: 'Support Group #4', 
    avatar: 'SG', 
    lastMessage: 'User123: My payment failed...', 
    unreadCount: 5, 
    time: 'Mon', 
    online: false,
    type: 'group',
    platform: 'Telegram',
    aiTags: ['Complaint']
  },
];

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
  { id: 'm1', sender: 'customer', text: 'Hi, I saw your post about decentralized resource trading. Is this TrustLink?', timestamp: '10:25 AM', status: 'read' },
  { id: 'm2', sender: 'ai', text: 'Hello! Yes, this is TrustLink official support. We specialize in secure, decentralized resource allocation. How can I assist you today?', timestamp: '10:25 AM', status: 'read' },
  { id: 'm3', sender: 'customer', text: 'I have about 50k USDT I want to swap for computing credits. What is your current rate?', timestamp: '10:28 AM', status: 'read' },
  { id: 'm4', sender: 'ai', text: 'For a volume of 50k USDT, we can offer a Tier-2 rate of 1.05 credits per USDT. This includes our standard slippage protection.', timestamp: '10:29 AM', status: 'read' },
  { id: 'm5', sender: 'customer', text: 'That sounds decent. Do you support TRC20?', timestamp: '10:30 AM', status: 'read' },
  { id: 'm6', sender: 'ai', text: 'Yes, we fully support TRC20, ERC20, and BEP20 networks. TRC20 is recommended for lower gas fees.', timestamp: '10:30 AM', status: 'read' },
  { id: 'm7', sender: 'customer', text: 'Okay, I might need to split the transaction. Is that allowed?', timestamp: '10:31 AM', status: 'read' },
  { id: 'm8', sender: 'ai', text: 'Absolutely. You can split it into multiple batches. However, for the Tier-2 rate, the total daily volume needs to exceed 10k.', timestamp: '10:31 AM', status: 'read' },
];

export const MOCK_CRM_DATA: CRMData = {
  customerName: 'CryptoWhale_99',
  intentRating: 'High',
  tags: ['#HighVolume', '#USDT', '#TRC20', '#ComputeCredits'],
  summary: 'Customer wants to swap 50k USDT for computing credits. Interested in Tier-2 rates. Prefers TRC20 network. Considering split transactions.',
  dealStage: 'Negotiation',
  estimatedValue: '$52,500'
};

// --- Dashboard Charts Data ---
export const MOCK_MESSAGE_VOLUME = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 1200 },
  { time: '12:00', value: 2800 },
  { time: '16:00', value: 3500 },
  { time: '20:00', value: 2100 },
  { time: '23:59', value: 800 },
];

export const MOCK_SYSTEM_LOAD = [
  { time: '00:00', cpu: 20, ram: 40 },
  { time: '04:00', cpu: 15, ram: 35 },
  { time: '08:00', cpu: 45, ram: 60 },
  { time: '12:00', cpu: 70, ram: 75 },
  { time: '16:00', cpu: 85, ram: 80 },
  { time: '20:00', cpu: 60, ram: 65 },
  { time: '23:59', cpu: 30, ram: 50 },
];

export const MOCK_TOP_AGENTS = [
  { id: '1', name: 'Agent-Alpha', messages: 1250, efficiency: 98 },
  { id: '2', name: 'Agent-Beta', messages: 1100, efficiency: 95 },
  { id: '3', name: 'Agent-Gamma', messages: 980, efficiency: 92 },
  { id: '4', name: 'Agent-Delta', messages: 850, efficiency: 90 },
  { id: '5', name: 'Agent-Epsilon', messages: 720, efficiency: 88 },
];

export const MOCK_RECENT_ALERTS = [
  { id: '1', type: 'warning', message: 'High CPU usage on Node-05', time: '10m ago' },
  { id: '2', type: 'error', message: 'Agent-102 connection lost', time: '25m ago' },
  { id: '3', type: 'info', message: 'System backup completed', time: '1h ago' },
];

// --- Phase 5 Data ---
import { Account } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-001',
    platform: 'Telegram',
    alias: 'Support_Main_01',
    phoneNumber: '+1 202 555 0101',
    hostNode: 'Node-01',
    agentId: 'Agent-Alpha',
    deviceId: 'Pixel-7-001',
    proxyIp: '104.238.12.45',
    countryCode: 'US',
    status: 'normal',
    messagesSent: 145,
    messagesReceived: 320,
    lastOnline: '2m ago',
    avatar: 'S1'
  },
  {
    id: 'acc-002',
    platform: 'Telegram',
    alias: 'Marketing_Lead_05',
    phoneNumber: '+44 7700 900077',
    hostNode: 'Node-02',
    agentId: 'Agent-Beta',
    deviceId: 'Galaxy-S23-012',
    proxyIp: '185.199.108.153',
    countryCode: 'UK',
    status: 'restricted',
    messagesSent: 890,
    messagesReceived: 45,
    lastOnline: '15m ago',
    avatar: 'M5'
  },
  {
    id: 'acc-003',
    platform: 'WhatsApp',
    alias: 'Sales_Rep_03',
    phoneNumber: '+55 11 99999-0003',
    hostNode: 'Node-01',
    agentId: 'Agent-Alpha',
    deviceId: 'Pixel-6-003',
    proxyIp: '200.147.67.1',
    countryCode: 'BR',
    status: 'normal',
    messagesSent: 56,
    messagesReceived: 78,
    lastOnline: '1h ago',
    avatar: 'S3'
  },
  {
    id: 'acc-004',
    platform: 'Telegram',
    alias: 'Outreach_Bot_09',
    phoneNumber: '+7 900 123 45 67',
    hostNode: 'Node-03',
    agentId: 'Agent-Gamma',
    deviceId: 'Xiaomi-13-009',
    proxyIp: '95.213.255.1',
    countryCode: 'RU',
    status: 'banned',
    messagesSent: 0,
    messagesReceived: 0,
    lastOnline: '3d ago',
    avatar: 'O9'
  },
  {
    id: 'acc-005',
    platform: 'Facebook',
    alias: 'Community_Mgr_02',
    phoneNumber: '+1 415 555 0199',
    hostNode: 'Node-02',
    agentId: 'Agent-Beta',
    deviceId: 'iPhone-14-022',
    proxyIp: '192.0.2.1',
    countryCode: 'US',
    status: 'dormant',
    messagesSent: 0,
    messagesReceived: 12,
    lastOnline: '5d ago',
    avatar: 'C2'
  },
  {
    id: 'acc-006',
    platform: 'Telegram',
    alias: 'Support_Backup_02',
    phoneNumber: '+62 812 3456 7890',
    hostNode: 'Node-01',
    agentId: 'Agent-Alpha',
    deviceId: 'Pixel-7-002',
    proxyIp: '103.11.12.13',
    countryCode: 'ID',
    status: 'normal',
    messagesSent: 210,
    messagesReceived: 180,
    lastOnline: '5m ago',
    avatar: 'S2'
  },
  {
    id: 'acc-007',
    platform: 'Telegram',
    alias: 'Dev_Test_Account',
    phoneNumber: '+86 138 0013 8000',
    hostNode: 'Node-04',
    agentId: 'Agent-Delta',
    deviceId: 'Emulator-001',
    proxyIp: '47.243.12.1',
    countryCode: 'HK',
    status: 'normal',
    messagesSent: 12,
    messagesReceived: 5,
    lastOnline: 'Just now',
    avatar: 'D1'
  },
  {
    id: 'acc-008',
    platform: 'Instagram',
    alias: 'Brand_Ambassador_01',
    phoneNumber: '+33 6 12 34 56 78',
    hostNode: 'Node-03',
    agentId: 'Agent-Gamma',
    deviceId: 'iPhone-15-001',
    proxyIp: '51.15.12.34',
    countryCode: 'FR',
    status: 'restricted',
    messagesSent: 45,
    messagesReceived: 120,
    lastOnline: '45m ago',
    avatar: 'B1'
  },
  {
    id: 'acc-009',
    platform: 'Telegram',
    alias: 'Crypto_Signal_01',
    phoneNumber: '+971 50 123 4567',
    hostNode: 'Node-05',
    agentId: 'Agent-Epsilon',
    deviceId: 'Samsung-S22-005',
    proxyIp: '2.50.12.1',
    countryCode: 'AE',
    status: 'normal',
    messagesSent: 1500,
    messagesReceived: 2300,
    lastOnline: '1m ago',
    avatar: 'C1'
  },
  {
    id: 'acc-010',
    platform: 'WhatsApp',
    alias: 'CS_Agent_04',
    phoneNumber: '+91 98765 43210',
    hostNode: 'Node-01',
    agentId: 'Agent-Alpha',
    deviceId: 'Pixel-6-004',
    proxyIp: '103.25.12.1',
    countryCode: 'IN',
    status: 'normal',
    messagesSent: 89,
    messagesReceived: 112,
    lastOnline: '10m ago',
    avatar: 'C4'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task-001',
    name: 'TrustLink TG Mass DM',
    type: 'mass_dm',
    status: 'running',
    progress: 45,
    hostCount: 5,
    agentCount: 24,
    eta: '2h 15m',
    createdAt: '2023-10-27T08:00:00Z',
    targetCount: 5000,
    completedCount: 2250
  },
  {
    id: 'task-002',
    name: 'FB Lead Mining - Group A',
    type: 'keyword_listen',
    status: 'running',
    progress: 72,
    hostCount: 3,
    agentCount: 12,
    eta: '45m',
    createdAt: '2023-10-27T09:30:00Z',
    targetCount: 1000,
    completedCount: 720
  },
  {
    id: 'task-003',
    name: 'WhatsApp Auto-Reply Service',
    type: 'auto_reply',
    status: 'paused',
    progress: 30,
    hostCount: 2,
    agentCount: 8,
    eta: 'Paused',
    createdAt: '2023-10-26T14:00:00Z',
    targetCount: 0,
    completedCount: 1500
  },
  {
    id: 'task-004',
    name: 'New Accounts Warm-up',
    type: 'warm_up',
    status: 'completed',
    progress: 100,
    hostCount: 8,
    agentCount: 32,
    eta: '-',
    createdAt: '2023-10-25T10:00:00Z',
    targetCount: 32,
    completedCount: 32
  },
  {
    id: 'task-005',
    name: 'Competitor Analysis',
    type: 'keyword_listen',
    status: 'failed',
    progress: 12,
    hostCount: 1,
    agentCount: 4,
    eta: '-',
    createdAt: '2023-10-27T10:15:00Z',
    targetCount: 500,
    completedCount: 60
  }
];
