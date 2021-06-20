import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import Seo from '@/components/Seo';
import Chats from '@/components/Chats';

export default function Home() {
  const [username, setUsername] = useState('Anonymous');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  const handleMessage = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        name_from: username,
        message,
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
    const token = document.head.querySelector(
      'meta[name="csrf-token"]'
    ).content;
    console.log('🚀 ~ file: index.jsx ~ line 31 ~ useEffect ~ token', token);
    // const username = window.prompt('Username: ', 'Anonymous');
    // setUsername(username);
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      encrypted: true,
      authEndpoint: '/broadcasting/auth',
      auth: { headers: { 'X-CSRF-Token': token } },
    });

    const channel = pusher.subscribe('private-message-notification');

    channel.bind('message_created_boi', (data) => {
      setChats((chats) => [...chats, data]);
    });
  }, []);

  return (
    <>
      <Seo />

      <main>
        <section className='bg-dark'>
          <div className='flex flex-col items-center min-h-screen py-16 space-y-4 text-white layout'>
            <h1>Broadcasting using Pusher</h1>
            <h3>Hello {username}!</h3>
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
      </main>
    </>
  );
}
