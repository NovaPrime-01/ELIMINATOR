export interface Member {
  id: string;
  name: string;
  glory: number;
  role: 'Leader' | 'Officer' | 'Member';
  instagram?: string;
  password?: string;
}

export interface GuildInfo {
  name: string;
  level: number;
  maxMembers: number;
  description: string;
}
