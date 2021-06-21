import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import Seo from '@/components/Seo';
import PublicChannel from '@/components/PublicChannel';
import PrivateChannel from '@/components/PrivateChannel';

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
        <PublicChannel />
        <PrivateChannel />
      </main>
    </>
  );
}
