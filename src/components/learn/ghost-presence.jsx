'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Users, Sparkles } from 'lucide-react';

export default function GhostPresence({ channelId, userName }) {
  const [presenceCount, setPresenceCount] = useState(1);
  const [syncedUsers, setSyncedUsers] = useState([]);

  useEffect(() => {
    if (!channelId) return;

    const channel = supabase.channel(`ghost_mode_${channelId}`, {
      config: {
        presence: {
          key: userName || 'Anonymous Ghost',
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.keys(newState);
        setSyncedUsers(users);
        setPresenceCount(users.length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // console.log('Ghost joined:', key);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // console.log('Ghost left:', key);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, userName]);

  if (presenceCount <= 1) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md animate-pulse">
      <div className="relative">
        <Users className="w-4 h-4 text-blue-400" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-glow-blue" />
      </div>
      <span className="text-xs font-bold text-blue-300">
        {presenceCount - 1} other {presenceCount - 1 === 1 ? 'Ghost' : 'Ghosts'} lurking here
      </span>
      <Sparkles className="w-3 h-3 text-blue-400/50" />
    </div>
  );
}
