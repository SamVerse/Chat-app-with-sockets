import { useState , useEffect , useRef} from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000')

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [userId, setUserId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Set up socket event listeners
    const handleAssignUserId = (userId) => {
      console.log('User ID assigned:', userId);
      setUserId(userId);
    };

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('assignUserId', handleAssignUserId);
    socket.on('message', handleMessage);

    // Clean up function
    return () => {
      socket.off('assignUserId', handleAssignUserId);
      socket.off('message', handleMessage);
    };
  }, []); // Empty dependency array

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInput !== '') {
      const message = {
        userId: userId,
        text: messageInput
      };
      socket.emit('message', message);
      setMessageInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="px-6 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-white">Chat App <span className='text-amber-500'>Using Sockets</span></h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6" style={{scrollbarWidth: 'thin', scrollbarColor: '#4B5563 #1F2937'}}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="max-w-[80%] rounded-lg p-4 bg-gray-700 text-white break-words"
            >
              <strong>{message.userId}
              </strong>: {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form 
        onSubmit={sendMessage}
        className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2"
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App