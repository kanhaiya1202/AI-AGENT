import React, { useState, useEffect, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage, disconnectSocket } from "../config/socket";
import { UserContext } from "../context/user.context";

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidepanelOpen, setsidepanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state?.project)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useContext(UserContext)

  const [users, setUsers] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  function addCollaborators() {
    axios.put("/Project/add-user", {
      projectId: project._id,
      users: Array.from(selectedUserId)
    }).then(res => {
      console.log(res.data)
      setProject(res.data.project);
      setModalOpen(false)
      setSelectedUserId([]);
    }).catch(err => {
      console.log(err)
    })
  }

  const send = () => {
    if (!project || !project._id || !message.trim()) return;
    
    const messageData = {
      message: message.trim(),
      sender: user?.email || 'Anonymous',
      timestamp: new Date()
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, { ...messageData, isOwn: true }]);
    
    // Send to other users
    sendMessage('project-message', messageData);
    setMessage("");
  }

  useEffect(() => {
    if (!project || !project._id) {
      navigate('/home');
      return;
    }

    // Initialize socket connection
    const socket = initializeSocket(project._id);
    
    socket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setSocketConnected(false);
    });

    // Listen for incoming messages
    receiveMessage('project-message', (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, { ...data, isOwn: false }]);
    });

    // Fetch project details
    axios.get(`/Project/get-project/${project._id}`).then(res => {
      setProject(res.data.project)
    }).catch(err => {
      console.log(err)
    });

    // Fetch all users for collaboration
    axios.get('/users/all').then(res => {
      setUsers(res.data.users)
    }).catch(err => {
      console.log(err);
    });

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, [project?._id, navigate, user]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Project Not Found</h2>
          <button 
            onClick={() => navigate('/home')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen  w-screen flex bg-gradient-to-br from-indigo-100 via-blue-200 to-blue-400 transition-colors duration-700">

      <section className="left relative min-w-80 bg-white/80 border-r border-indigo-200 flex flex-col shadow-xl animate-fadeIn">
        <header className="flex items-center justify-between w-full p-4 bg-white/90 border-b border-indigo-100">
          {/* Socket Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 cursor-pointer rounded hover:bg-indigo-100 transition-colors duration-200"
              onClick={() => setModalOpen(true)}
            >
              <i className="text-indigo-700 text-lg font-bold ri-add-large-line"></i>
            </button>
            <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                 title={socketConnected ? 'Connected' : 'Disconnected'}>
            </div>
          </div>

          {/* User Selection Modal */}
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 animate-fadeIn flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-700">Select Users</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="cursor-pointer text-indigo-700 hover:text-indigo-900 text-2xl font-bold px-2"
                    aria-label="Close Modal"
                  >
                    &times;
                  </button>
                </div>
                <ul className="divide-y divide-indigo-100 max-h-60 overflow-y-auto mb-4">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-indigo-50 transition rounded ${selectedUserId.includes(user._id) ? 'bg-indigo-100' : ''}`}
                      onClick={() => {
                        setSelectedUserId(prev => {
                          if (prev.includes(user._id)) {
                            return prev.filter(id => id !== user._id);
                          } else {
                            return [...prev, user._id];
                          }
                        });
                      }}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                      <span className="text-indigo-900 font-medium">{user.name}</span>
                      {selectedUserId.includes(user._id) && (
                        <span className="ml-auto text-indigo-600 font-bold">Selected</span>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full mt-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
                  onClick={addCollaborators}
                  disabled={selectedUserId.length === 0}
                >
                  Add Collaborator
                </button>
              </div>
            </div>
          )}
          
          <span className="text-lg font-bold text-indigo-700 tracking-wide animate-slideDown">
            {project.name}
          </span>
          
          <button
            onClick={() => setsidepanelOpen(!sidepanelOpen)}
            className="p-2 cursor-pointer rounded hover:bg-indigo-100 transition-colors duration-200"
            aria-label="Open Side Panel"
          >
            <i className="ri-group-line text-xl text-indigo-700"></i>
          </button>
        </header>

        <div className="conversation min-h-9 flex-grow flex flex-col">
          <div style={{scrollbarWidth: 'none'}}  className=" px-4 py-2 message-box flex-grow flex bg-indigo-100/70 flex-col gap-2 overflow-y-auto  transition-all duration-500"> 
            {messages.length === 0 ? (
              <div className="text-center text-indigo-600 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message max-w-60 flex flex-col p-3 rounded-lg shadow ${
                    msg.isOwn 
                      ? 'ml-auto bg-indigo-600 text-white animate-fadeInRight' 
                      : 'bg-white text-indigo-900 animate-fadeInLeft'
                  }`}
                >
                  <small className="opacity-80 text-xs mb-1">
                    {msg.isOwn ? 'You' : msg.sender}
                  </small>
                  <p className="text-sm">{msg.message}</p>
                  <small className="opacity-60 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <form className="inputField flex gap-2 bg-white/90 rounded-lg shadow p-2 animate-slideUp" onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 px-4 border-none outline-none rounded-md text-indigo-900 bg-transparent"
              type="text"
              placeholder="Enter Message"
              disabled={!socketConnected}
            />
            <button
              type="submit"
              disabled={!socketConnected || !message.trim()}
              className="px-4 py-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </form>
        </div>

        <div className={`slidePanel w-full h-full transition-transform duration-500 ${sidepanelOpen ? 'translate-x-0' : '-translate-x-full'} bg-blue-50/90 absolute top-0 right-0 shadow-lg z-20 animate-slideIn`}>
          <header className="flex justify-between items-center p-4 border-b border-indigo-200">
            <span className="text-lg font-bold text-indigo-700">Collaborators</span>
            <button
              onClick={() => setsidepanelOpen(!sidepanelOpen)}
              className="p-2 cursor-pointer rounded hover:bg-indigo-100"
              aria-label="Close Side Panel"
            >
              <i className="ri-close-line text-xl text-indigo-700"></i>
            </button>
          </header>
          <div className="p-4">
            {project && project.users && project.users.map((user, index) => (
              <div key={user._id || index} className="flex items-center gap-3 p-2 hover:bg-indigo-100 rounded">
                <span className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </span>
                <span className="text-indigo-900 font-medium">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animations (Tailwind CSS custom classes) */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s; }
        .animate-fadeInLeft { animation: fadeInLeft 0.7s; }
        .animate-fadeInRight { animation: fadeInRight 0.7s; }
        .animate-slideDown { animation: slideDown 0.5s; }
        .animate-slideUp { animation: slideUp 0.5s; }
        .animate-slideIn { animation: slideIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px);} to { opacity: 1; transform: translateX(0);} }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px);} to { opacity: 1; transform: translateX(0);} }
      `}</style>
    </main>
  )
}

export default Project