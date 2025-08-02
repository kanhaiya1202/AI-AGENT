import React, { useState, useEffect, useContext, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage, disconnectSocket } from "../config/socket";
import { UserContext } from "../context/user.context";
import { createElement } from "react";
import Markdown from 'markdown-to-jsx'
import { getWebContainer } from "../config/webcontainer";


function SyntaxHighlightedCode(props) {
  const ref = useRef(null)

  React.useEffect(() => {
    if (ref.current && props.className?.includes('lang-') && window.hljs) {
      window.hljs.highlightElement(ref.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute('data-highlighted')
    }
  }, [props.className, props.children])

  return <code {...props} ref={ref} />
}

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidepanelOpen, setsidepanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state?.project)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useContext(UserContext)
  const messageBox = React.createRef()

  const [users, setUsers] = useState([])
  const [fileTree, setFileTree] = useState({})

  const [currentFile, setCurrentFile] = useState(null)
  const [openFiles, setOpenFiles] = useState([])

  const [webContainer, setWebContainer] = useState(null)
  const [iframeUrl, setIframeUrl] = useState(null)

  const [runProcess, setRunProcess] = useState(null)


  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  const handleUserClick = (id) => {
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });


  }

  function addCollaborators() {
    axios.put("/Project/add-user", {
      projectId: location.state.project._id,//project._id
      users: Array.from(selectedUserId)
    }).then(res => {
      console.log(res.data)
      // setProject(res.data.project);
      setModalOpen(false)
      // setSelectedUserId([]);
    }).catch(err => {
      console.log(err)
    })
  }

  const send = () => {
    if (!project || !project._id || !message.trim()) return;

    const messageData = {
      message: message.trim(),
      sender: user, //user?.email || 'Anonymous',
      timestamp: new Date()
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, { ...messageData }]); //, isOwn: true 

    // Send to other users
    sendMessage('project-message', messageData);
    setMessage("");
  }


  //new 
  function WriteAiMessage(message) {

    const messageObject = JSON.parse(message)

    return (
      <div
        className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
      >
        <Markdown
          children={messageObject.text}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>)
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

    if (!webContainer) {
      const container = getWebContainer();
      setWebContainer(container);
      console.log("container started");
    }


    // Listen for incoming messages
    receiveMessage('project-message', (data) => {
      console.log('Received message:', data);
      if (data.sender && data.sender._id === 'ai') {
        try {
          const message = JSON.parse(data.message);
          if (message.fileTree) {
            webContainer?.mount(message.fileTree);
            setFileTree(message.fileTree || {});
          }
        } catch (e) {
          console.error('Failed to parse AI message:', e);
        }
      }
      // Only add the message once
      setMessages(prev => [...prev, data]);
    });

    // Fetch project details
    axios.get(`/Project/get-project/${project._id}`).then(res => {

      setProject(res.data.project)
      setFileTree(res.data.project.fileTree || {})
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

  function saveFileTree(ft) {
    axios.put('/projects/update-file-tree', {
      projectId: project._id,
      fileTree: ft
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  }


  function scrollToBottom() {
    if (messageBox.current) {
      messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          <div
            ref={messageBox}
            style={{ scrollbarWidth: 'none' }} className=" px-4 py-2 message-box flex-grow flex bg-indigo-100/70 flex-col gap-2 overflow-y-auto  transition-all duration-500">
            {messages.length === 0 ? (
              <div className="text-center text-indigo-600 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, index) => (

                <div
                  key={index}

                  className={`message max-w-60 flex flex-col p-3 rounded-lg shadow ${msg.sender && msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${(msg.sender && user && msg.sender._id && user._id && msg.sender._id.toString() === user._id.toString()) ? 'ml-auto' : ''}`}
                >
                  <small className="opacity-80 text-xs mb-1">
                    {msg.sender.email}

                  </small>
                  {/* <p className="text-sm">{msg.message}</p> */}
                  <div className='text-sm'>
                    {msg.sender._id === 'ai' ?
                      WriteAiMessage(msg.message)
                      : <p>{msg.message}</p>}
                  </div>

                  <small className="opacity-60 text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))
            )}
          </div>

          <form className="inputField flex gap-2 bg-white/90 rounded-lg shadow p-2 animate-slideUp" onSubmit={handleUserClick}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 px-4 border-none outline-none rounded-md text-indigo-900 bg-transparent"
              type="text"
              placeholder="Type a message... (@ai for AI)"
              disabled={!socketConnected}
            />
            <button
              onClick={send}
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
      <section className="right  bg-red-50 flex-grow h-full flex">

        <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
          <div className="file-tree w-full">
            {
              fileTree && typeof fileTree === 'object' && Object.keys(fileTree).length > 0 ? (
                Object.keys(fileTree).map((file, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentFile(file);
                      if (file && typeof file === 'string') {
                        setOpenFiles(prev => {
                          if (!prev.includes(file)) {
                            return [...prev, file];
                          }
                          return prev;
                        });
                      }
                    }}
                    className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
                    <p
                      className='font-semibold text-lg'
                    >{file}</p>
                  </button>
                ))
              ) : (
                <div className="text-gray-500 p-4">No files found.</div>
              )
            }
          </div>

        </div>


        <div className="code-editor flex flex-col flex-grow h-full shrink">

          <div className="top flex justify-between w-full">

            <div className="files flex">
              {
                openFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFile(file)}
                    className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
                    <p
                      className='font-semibold text-lg'
                    >{file}</p>
                  </button>
                ))
              }
            </div>

            <div className="actions flex gap-2">
              <button
                onClick={async () => {
                  if (webContainer) {
                    await webContainer.mount(fileTree)
                  } else {
                    console.error("WebContainer is not initialized.");
                  }


                  const installProcess = await webContainer.spawn("npm", ["install"])



                  installProcess.output.pipeTo(new WritableStream({
                    write(chunk) {
                      console.log(chunk)
                    }
                  }))

                  if (runProcess) {
                    runProcess.kill()
                  }

                  let tempRunProcess = await webContainer.spawn("npm", ["start"]);

                  tempRunProcess.output.pipeTo(new WritableStream({
                    write(chunk) {
                      console.log(chunk)
                    }
                  }))

                  setRunProcess(tempRunProcess)

                  webContainer.on('server-ready', (port, url) => {
                    console.log(port, url)
                    setIframeUrl(url)
                  })

                }}
                className='p-2 px-4 bg-slate-300 text-white'
              >
                run
              </button>


            </div>
          </div>
          <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
            {
              fileTree && currentFile && fileTree[currentFile] && fileTree[currentFile].file && typeof fileTree[currentFile].file.contents === 'string' ? (
                <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                  <pre
                    className="hljs h-full">
                    <code
                      className="hljs h-full outline-none"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const updatedContent = e.target.innerText;
                        const ft = {
                          ...fileTree,
                          [currentFile]: {
                            file: {
                              contents: updatedContent
                            }
                          }
                        }
                        setFileTree(ft)
                        saveFileTree(ft)
                      }}
                      dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                      style={{
                        whiteSpace: 'pre-wrap',
                        paddingBottom: '25rem',
                        counterSet: 'line-numbering',
                      }}
                    />
                  </pre>
                </div>
              ) : (
                <div className="text-gray-500 p-4">No file selected or file is empty.</div>
              )
            }
          </div>

        </div>

        {iframeUrl && webContainer &&
          (<div className="flex min-w-96 flex-col h-full">
            <div className="address-bar">
              <input type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl} className="w-full p-2 px-4 bg-slate-200" />
            </div>
            <iframe src={iframeUrl} className="w-full h-full"></iframe>
          </div>)
        }


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