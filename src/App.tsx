/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Edit2, 
  Trash2, 
  Plus, 
  Save, 
  Shield, 
  Star, 
  Target, 
  Zap,
  X,
  ChevronRight,
  Instagram
} from 'lucide-react';
import { Member, GuildInfo } from './types';

const INITIAL_GUILD: GuildInfo = {
  name: "ELIMINATOR",
  level: 4,
  maxMembers: 50,
  description: "The most powerful guild in the region. Join us to dominate!"
};

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'NOVA PR!ME', glory: 15000, role: 'Leader', password: 'Leader' },
  { id: '2', name: 'DRENZO PRIME', glory: 12000, role: 'Officer', password: 'DrenzoPrime' },
  { id: '3', name: 'SHADOW', glory: 8000, role: 'Member', password: 'Shadow' },
  { id: '4', name: 'ABHINAVV', glory: 7500, role: 'Member', password: 'Abhinav' },
  { id: '5', name: 'DYNIX PRIME', glory: 7000, role: 'Member', password: 'DynixPrime' },
  { id: '6', name: '1nonlyanant', glory: 6500, role: 'Member', password: 'Anant' },
  { id: '7', name: 'GT-AYUSH', glory: 6000, role: 'Member', password: 'GT-AYUSH' },
  { id: '8', name: 'ANURRRR', glory: 5500, role: 'Member', password: 'Anurag' },
];

export default function App() {
  const [isEntered, setIsEntered] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [guild, setGuild] = useState<GuildInfo>(() => {
    const saved = localStorage.getItem('ff_guild_info_v2');
    return saved ? JSON.parse(saved) : INITIAL_GUILD;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('ff_guild_members_v2');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const totalGlory = members.reduce((sum, m) => sum + (Number(m.glory) || 0), 0);

  const [editingGuild, setEditingGuild] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = username.trim();
    if (!trimmedName) return;

    const member = members.find(
      (m) => m.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (member) {
      if (member.password === password) {
        setLoginError('');
        setIsEntered(true);
      } else {
        setLoginError('Incorrect password.');
      }
    } else {
      setLoginError('Username not found in guild members.');
    }
  };

  useEffect(() => {
    localStorage.setItem('ff_guild_info_v2', JSON.stringify(guild));
    localStorage.setItem('ff_guild_members_v2', JSON.stringify(members));
  }, [guild, members]);

  const handleUpdateGuild = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setGuild({
      ...guild,
      name: formData.get('name') as string,
      level: Number(formData.get('level')),
      maxMembers: Number(formData.get('maxMembers')),
      description: formData.get('description') as string,
    });
    setEditingGuild(false);
  };

  const handleUpdateMember = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedMember: Member = {
      id: editingMember?.id || Date.now().toString(),
      name: formData.get('name') as string,
      glory: Number(formData.get('glory')),
      role: formData.get('role') as Member['role'],
      instagram: formData.get('instagram') as string,
      password: formData.get('password') as string,
    };

    if (isAddingMember) {
      setMembers([...members, updatedMember]);
    } else {
      setMembers(members.map(m => m.id === updatedMember.id ? updatedMember : m));
    }
    setEditingMember(null);
    setIsAddingMember(false);
  };

  const deleteMember = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#FF6321] selection:text-white">
      {/* Entry Screen */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            key="entry"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              <Shield className="w-24 h-24 text-[#FF6321] mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(255,99,33,0.5)]" />
              <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white text-center mb-8">
                Welcome to <span className="text-[#FF6321]">Eliminator</span>
              </h1>
              
              <form onSubmit={handleEnter} className="w-full space-y-4 bg-[#151515] p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Username</label>
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                      setLoginError('');
                    }}
                    className={`w-full bg-white/5 border ${loginError === 'Username not found in guild members.' ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6321] transition-all text-white`}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setLoginError('');
                    }}
                    className={`w-full bg-white/5 border ${loginError === 'Incorrect password.' ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6321] transition-all text-white`}
                    placeholder="Enter your password"
                  />
                  {loginError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-xs mt-2 font-bold"
                    >
                      {loginError}
                    </motion.p>
                  )}
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#FF6321] hover:bg-[#D84315] text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,99,33,0.3)] mt-4"
                >
                  Enter Guild
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#FF6321]/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#FF6321]/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-12">
        {/* Guild Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#151515] border border-white/5 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button 
              onClick={() => setEditingGuild(true)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
            >
              <Edit2 className="w-5 h-5 text-[#FF6321] group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,99,33,0.3)] overflow-hidden">
              <img src="/logo.jpg" alt="Guild Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">{guild.name}</h1>
                <span className="px-3 py-1 bg-[#FF6321] text-xs font-bold rounded-full uppercase tracking-widest">LVL {guild.level}</span>
              </div>
              <p className="text-gray-400 max-w-xl mb-6 font-medium leading-relaxed">{guild.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                    <Trophy className="w-3 h-3 text-[#FF6321]" />
                    Total Glory
                  </div>
                  <div className="text-2xl font-black italic">{totalGlory.toLocaleString()}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                    <Users className="w-3 h-3 text-[#FF6321]" />
                    Members
                  </div>
                  <div className="text-2xl font-black italic">{members.length} / {guild.maxMembers}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Members Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tight flex items-center gap-3">
              <Users className="w-6 h-6 text-[#FF6321]" />
              Guild Members
            </h2>
            <button 
              onClick={() => {
                setIsAddingMember(true);
                setEditingMember({ id: '', name: '', glory: 0, role: 'Member', instagram: '', password: '' });
              }}
              className="flex items-center gap-2 bg-[#FF6321] hover:bg-[#D84315] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_10px_20px_rgba(255,99,33,0.2)] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Add Player
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-[#151515] border border-white/5 rounded-3xl p-6 hover:border-[#FF6321]/30 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setEditingMember(member)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteMember(member.id)}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#FF6321]/50 transition-all">
                      {member.role === 'Leader' ? (
                        <Shield className="w-8 h-8 text-[#FF6321]" />
                      ) : member.role === 'Officer' ? (
                        <Star className="w-8 h-8 text-yellow-500" />
                      ) : (
                        <Users className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black uppercase italic">{member.name}</h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                          member.role === 'Leader' ? 'bg-[#FF6321] text-white' : 
                          member.role === 'Officer' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-400'
                        }`}>
                          {member.role}
                        </span>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <StatItem label="Glory" value={member.glory.toLocaleString()} icon={<Trophy className="w-3 h-3" />} />
                        {member.instagram && (
                          <a 
                            href={member.instagram.startsWith('http') ? member.instagram : `https://instagram.com/${member.instagram.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-xl text-white hover:scale-110 transition-transform shadow-[0_4px_10px_rgba(220,39,67,0.3)]"
                            onClick={(e) => e.stopPropagation()}
                            title="Instagram Profile"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {editingGuild && (
          <Modal title="Edit Guild Info" onClose={() => setEditingGuild(false)}>
            <form onSubmit={handleUpdateGuild} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Guild Name" name="name" defaultValue={guild.name} required />
                <Input label="Guild Level" name="level" type="number" defaultValue={guild.level} required />
                <Input label="Max Members" name="maxMembers" type="number" defaultValue={guild.maxMembers} required />
              </div>
              <TextArea label="Description" name="description" defaultValue={guild.description} required />
              <button type="submit" className="w-full bg-[#FF6321] py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#D84315] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                Update Guild
              </button>
            </form>
          </Modal>
        )}

        {editingMember && (
          <Modal title={isAddingMember ? "Add New Player" : "Edit Player Stats"} onClose={() => { setEditingMember(null); setIsAddingMember(false); }}>
            <form onSubmit={handleUpdateMember} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Player Name" name="name" defaultValue={editingMember.name} required />
                <Input label="Glory" name="glory" type="number" defaultValue={editingMember.glory} required />
                <Input label="Password" name="password" type="text" defaultValue={editingMember.password || ''} required placeholder="Set player password" />
                <Input label="Instagram Link / Username" name="instagram" defaultValue={editingMember.instagram || ''} placeholder="e.g. https://instagram.com/username" />
                <div className="col-span-full">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Guild Role</label>
                  <select 
                    name="role" 
                    defaultValue={editingMember.role}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6321] transition-all appearance-none"
                  >
                    <option value="Member">Member</option>
                    <option value="Officer">Officer</option>
                    <option value="Leader">Leader</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#FF6321] py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-[#D84315] transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {isAddingMember ? "Add Player" : "Save Changes"}
              </button>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto px-4 py-12 text-center text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">
        Free Fire Guild Management Dashboard &copy; 2026
      </footer>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
      <div className="flex items-center gap-1 text-[8px] text-gray-500 font-black uppercase tracking-tighter mb-0.5">
        <span className="text-[#FF6321]">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-black italic">{value}</div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#1a1a1a] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      <input 
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6321] transition-all"
      />
    </div>
  );
}

function TextArea({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
      <textarea 
        {...props}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6321] transition-all resize-none"
      />
    </div>
  );
}
