import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    // For now, we'll use a simple random ID for the room
    const roomId = Math.random().toString(36).substr(2, 9);
    router.push(`/room/${roomId}`);
  };

  const handleJoinRoom = () => {
    router.push(`/room/${roomName}`);
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
      <button onClick={handleJoinRoom}>Join Room</button>

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default LandingPage;
