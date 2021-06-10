import Seo from '@/components/Seo';
import { useEffect, useState } from 'react';
import Chats from '@/components/Chats';

export default function Home() {
  const [username, setUsername] = useState('Anonymous');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([
    { id: '1', username: 'Anonymous', message: 'Halo Bambang' },
    { id: '2', username: 'Anonymous 2', message: 'Halo Bambang2' },
    { id: '3', username: 'Anonymous 3', message: 'Halo Bambang3' },
    { id: '4', username: 'Anonymous', message: 'Halo Bambang' },
  ]);

  const handleMessage = (e) => {
    if (e.keyCode === 13) {
      const payload = {
        username,
        message,
      };
      console.log(payload);
      setMessage('');
      // axios.post('http://localhost:5000/message', payload);
    } else {
      setMessage(e.target.value);
    }
  };

  useEffect(() => {
    // const username = window.prompt('Username: ', 'Anonymous');
    // setUsername(username);
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
