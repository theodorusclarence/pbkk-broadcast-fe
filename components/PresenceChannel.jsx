import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';

import Chats from '@/components/Chats';

export default function PresenceChannel() {
  const [username, setUsername] = useState('Anonymous');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [members, setMembers] = useState([]);

  const handleMessage = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        name_from: username,
        message,
        scope: 'presence',
      };
      console.log(payload);
      setMessage('');
      axios.post('/api/message', payload);
    } else {
      setMessage(e.target.value);
    }
  };

  const PUSHER_APP_KEY = '9ca33e463c5cda281bc8';
  const PUSHER_APP_CLUSTER = 'ap1';
  useEffect(() => {
    console.log('members changed:', members);
  }, [members]);

  useEffect(() => {
    const token = document.head.querySelector(
      'meta[name="csrf-token"]'
    ).content;
    console.log('🚀 ~ file: index.jsx ~ line 31 ~ useEffect ~ token', token);
    const username = window.prompt('Username (Presence): ', 'Anonymous');
    setUsername(username);
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      encrypted: true,
      authEndpoint: '/broadcasting/auth',
      auth: { headers: { 'X-CSRF-Token': token, 'X-Name': username } },
    });

    const channel = pusher.subscribe('presence-message-notification');

    channel.bind('pusher:subscription_succeeded', (member) => {
      // For example
      // setMembers([...members, member]);
      console.log('member subscribed');
      console.log(member);
      const succeedMember = Object.keys(member.members);
      const cleanMember = succeedMember.filter((m) => m !== member.myID);
      setMembers(cleanMember);
    });

    channel.bind('pusher:member_added', (member) => {
      // For example
      // setMembers([...members, member]);
      console.log('member added');
      console.log(member);
      setMembers((prev) => [...prev, member.id]);
    });

    channel.bind('pusher:member_removed', (member) => {
      // For example
      // setMembers([...members, member]);
      console.log('member removed');
      console.log(member);
      setMembers((prev) =>
        prev.filter((memberState) => memberState !== member.id)
      );
    });

    channel.bind('pusher:subscription_error', (error) => {
      console.log(error);
    });

    channel.bind('message_created_boi', (data) => {
      setChats((chats) => [...chats, data]);
    });
  }, []);

  return (
    <>
      <section className='bg-dark'>
        <div className='flex flex-col items-center min-h-screen py-16 space-y-4 text-white layout'>
          <h1>Presence Broadcasting using Pusher</h1>
          <h3>Hello {username}!</h3>
          <ul>
            <li className='font-bold'>{members.length} Members online:</li>
            {members.map((member) => (
              <li key={member}>{member}</li>
            ))}
          </ul>
          <div className='w-full max-w-md'>
            <input
              type='text'
              value={message}
              onChange={handleMessage}
              onKeyDown={handleMessage}
              placeholder='Write your message, then press enter.'
              className='w-full border border-gray-600 rounded-lg bg-dark focus:ring-primary-400'
            />
          </div>

          {/* Messages */}
          <Chats chats={chats} />
        </div>
      </section>
    </>
  );
}
