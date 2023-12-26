import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { io, Socket } from 'socket.io-client';

import EstimationTool from '../../components/estimationtool'
import Button from '../../components/button'

// Define the type for the votes state
interface Votes {
  [key: string]: number | null;
}

// Define the type for the participants state
interface Participants {
  [key: string]: null;
}

const storyPoints = [1, 2, 3, 4, 6, 8, 13, 21];

const RoomPage = () => {
    const router = useRouter();
    // Extract roomId and admin flag from the query parameters
    const { roomId } = router.query as { roomId: string; admin: string };

    // State to manage whether the current user is an admin
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // State to manage for who is admin
    const [adminName, setAdminName] = useState('');

    // State for the participant's name input
    const [participantName, setParticipantName] = useState<string>('');

    // State to track participants in the room
    const [participants, setParticipants] = useState<Participants>({});
    // const [participants, setParticipants] = useState([]);
    // State to track whether the current user has joined the room
    const [hasJoined, setHasJoined] = useState<boolean>(false);

    // State to track votes of participants
    const [votes, setVotes] = useState<Votes>({});

    // State to manage visibility of votes
    const [showVotes, setShowVotes] = useState<boolean>(false);

    // State for the socket connection with explicit type
    const [socket, setSocket] = useState<Socket | null>(null);


    useEffect(() => {
        console.log("Start!")
        // Initialize the socket connection and set it in state
        const newSocket = io('http://localhost:3000', {
            path: '/api/socket/io',
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        });
        setSocket(newSocket)

        newSocket.on('connect_error', (err) => {
        console.log('Connection failed: ', err.message);
        // You can implement additional logic here, like showing an error message to the user
        });
        console.log("Use effect")
        console.log("Getting roomid!")
        console.log(`Room ID is ${roomId}`)
        console.log(`Participants:`)
        console.log(participants)
        if (roomId) {
            console.log("New viewer arrived!")
            console.log("Contact Server!")
            newSocket.emit('joinRoom', roomId);
            newSocket.on('participantsUpdate', (updatedParticipants) => {
                console.log("Received participants update from server:", updatedParticipants);
                setParticipants(updatedParticipants);
              });
            return () => {
              newSocket.off('participantsUpdate');
              newSocket.emit('leaveRoom', roomId, participantName);
            };
          };
    }, [roomId]);

    useEffect(() => {
        // Check if the user is an admin from the URL query
        setIsAdmin(router.query.admin === 'true');
    }, [router.query.admin]);

    // Handle joining as a participant
    const handleJoinParticipant = () => {
    if (!participantName || !socket) return;
  
    // Add the participant to the state
    setParticipants((currentParticipants) => ({
      ...currentParticipants,
      [participantName]: null,
    }));
  
    // Emit the participant's name to the server
    socket.emit("newParticipant", { roomId, name: participantName });
  
    // Mark that the user has joined
    setHasJoined(true);
  };

    // Handle joining as an admin
    const handleJoinAdmin = () => {
        if (!participantName) return;
        setIsAdmin(true);
        setAdminName(participantName); // Set admin name here
    };

    const handleLeaveRoom = () => {
        if (socket && hasJoined) {
            // Emit the "leaveRoom" event to remove the participant from the room
            socket.emit("leaveRoom", roomId, participantName);
        }
        router.push('/'); // Redirects to the home page
    };
    
    // Handle voting
    const handleVote = (point: number) => {
        setVotes(currentVotes => ({ ...currentVotes, [participantName]: point }));
    };


    const handleShowVotes = () => {
        setShowVotes(true);
      };

    // Handle resetting votes
    const handleResetVotes = () => {
        setShowVotes(false);
        setVotes({});
    };

  // Render the component
    return (
        <div className="container">
            <div className="room-info-container">
                <h1>Welcome to Room: {roomId}</h1>
                <h2>Room Admin {adminName}</h2>
            {isAdmin && <span className="admin-indicator">[Admin]</span>}
            </div>
        <div className="join-container">
            <input
                type="text"
                placeholder="Enter your name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                disabled={hasJoined}
            />  
            <div className="join-button-container">
                <Button text="Join as Participant" onClick={handleJoinParticipant} colorScheme="black" />
                <Button text="Join as Admin" onClick={handleJoinAdmin} colorScheme="black" />
                <Button text="Leave Room"  onClick={handleLeaveRoom} colorScheme="white" />
            </div>
        </div>

        <div className="voters-estimate-container">
            <div className="voters-container">
            <h2>Your Point Estimate</h2>
                <div className="vote-options">
                    {storyPoints.map(point => (
                    <button key={point} onClick={() => handleVote(point)} disabled={!hasJoined}>
                        {point}
                    </button>
                    ))}
                    <div>
                        {isAdmin && (
                        <>
                        <Button text="Show Votes" onClick={handleShowVotes} colorScheme="black" />
                        <Button text="Reset Votes"  onClick={handleResetVotes} colorScheme="white" />
                        </>
                        )}
                    </div>    
                </div>
                <h2>Voters</h2>
                <ul>
                    {Object.keys(participants).map(key => (
                    <li key={key}>
                        {participants[key]} {showVotes && votes[key] ? `: Voted ${votes[key]}` : ': Voting...'}
                    </li>
                    ))}
                </ul>
            </div>


            <div className="estimation-tool-container">
                <h2>Point Calculator</h2>
                <EstimationTool/>
            </div>
        </div>
        
        <style jsx>{`
            .room-container {
                padding: 20px;
                text-align: center;
                height:100%;
            }
            .vote-options button {
                margin: 5px;  
            }
            .join-container {
                display:flex;
                flex-direction: column;
            }
            .join-button-container {
                display: flex;
            }
            .join-container, .voters-estimate-container{
                border: 1px solid #eaeaea; /* Light grey border */
                padding: 20px; /* Add some padding inside the container */
                margin: 20px 0; /* Add some margin for spacing between containers */
                border-radius: 10px; /* Rounded corners for a modern look */
                box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.07); /* Subtle shadow for depth */
            }
            .voters-container ul {
                list-style-type: none; /* Removes bullet points */
                padding-left: 0; /* Removes default padding */
            } 
            .voters-estimate-container {
                display:flex;
            }
            .voters-container {
                margin-bottom: 10px; /* Adjust as needed */
            }
        `}</style>

        </div>
    );
};

export default RoomPage;
