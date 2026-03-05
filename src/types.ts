export interface Host {
  id: string;
  name: string;
  ip: string;
  devices: number;
  agents: number;
  latency: number;
  cpuUsage: number;
  ramUsage: number;
  status: 'online' | 'offline' | 'warning';
  taskQueue: {
    total: number;
    completed: number;
    currentTask: string;
  };
}

export interface Agent {
  id: string;
  hostId: string;
  name: string;
  flow: string;
  deviceId: string;
  status: 'active' | 'idle' | 'error';
  messagesToday: number;
  lastActive: string;
  aiModel?: string;
  deviceCount?: number;
}

export interface AppInstance {
  id: string;
  agentId: string;
  platform: 'Telegram' | 'WhatsApp' | 'Facebook' | 'Instagram' | 'Twitter';
  alias: string; // e.g., "Account #05"
  phoneTail: string; // e.g., "8821"
  status: 'normal' | 'restricted' | 'banned';
  lastActive: string;
  cacheSize: string;
  strategyStatus?: 'listening' | 'hype' | 'support' | 'idle';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'customer' | 'system'; // Keep for backward compatibility, but rely on role for rendering
  role?: 'customer' | 'primary_ai' | 'collab_ai' | 'system';
  senderName?: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  card?: {
    title: string;
    description: string;
    buttons: string[];
  };
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  time: string;
  online: boolean;
  type: 'dm' | 'group';
  platform: 'Telegram' | 'WhatsApp' | 'Facebook' | 'Instagram';
  aiTags?: string[];
}

export interface CRMData {
  customerName: string;
  intentRating: 'High' | 'Medium' | 'Low';
  tags: string[];
  summary: string;
  dealStage: 'New' | 'Negotiation' | 'Closed' | 'Follow-up';
  estimatedValue: string;
}

export type AccountStatus = 'normal' | 'restricted' | 'banned' | 'dormant';
export type Platform = 'Telegram' | 'WhatsApp' | 'Facebook' | 'Instagram' | 'Twitter';

export interface Account {
  id: string;
  platform: Platform;
  alias: string;
  phoneNumber: string;
  hostNode: string;
  agentId: string;
  deviceId: string;
  proxyIp: string;
  countryCode: string;
  status: AccountStatus;
  messagesSent: number;
  messagesReceived: number;
  lastOnline: string;
  avatar?: string;
}

export type TaskStatus = 'running' | 'paused' | 'completed' | 'failed' | 'pending';
export type TaskType = 'mass_dm' | 'keyword_listen' | 'auto_reply' | 'warm_up';

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  status: TaskStatus;
  progress: number;
  hostCount: number;
  agentCount: number;
  eta: string;
  createdAt: string;
  targetCount: number;
  completedCount: number;
}

export interface RiskMetric {
  banRate: number; // percentage
  interceptions: number;
  proxyFailures: number;
}

export interface RiskEvent {
  id: string;
  timestamp: string;
  level: 'warning' | 'critical' | 'info';
  message: string;
  nodeId: string;
  agentId?: string;
}

export interface SandboxDevice {
  id: string;
  name: string;
  status: 'cooling' | 'isolated';
  reason: string;
  timeLeft: string; // e.g., "2h 15m"
  nodeId: string;
  accountAlias?: string;
}
