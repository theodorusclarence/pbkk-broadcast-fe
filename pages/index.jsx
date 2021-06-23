import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

import Seo from '@/components/Seo';
import PublicChannel from '@/components/PublicChannel';
import PrivateChannel from '@/components/PrivateChannel';
import PresenceChannel from '@/components/PresenceChannel';

export default function Home() {
  return (
    <>
      <Seo />

      <main>
        <PublicChannel />
        <PrivateChannel />
        <PresenceChannel />
      </main>
    </>
  );
}
