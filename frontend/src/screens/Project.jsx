import React, { useState, useEffect } from "react"
import { useNavigation, useLocation } from "react-router-dom"
import axios from "../config/axios";

const Project = () => {
  const location = useLocation();
  const [sidepanelOpen, setsidepanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [project, setProject] = useState(location.state.project)

  // Example user list (replace with API data as needed)
  const [users, setUsers] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedUserId(prevSelectedUserId => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
    // Add your message sending logic here
  };

  function addCollaborators() {
    axios.put("/Project/add-user", {
      projectId: location.state.project._id,
      users: Array.from(selectedUserId)
    }).then(res => {
      console.log(res.data)
      setModalOpen(false)

    }).catch(err => {
      console.log(err)
    })

  }


  useEffect(() => {
    axios.get(`/Project/get-project/${location.state.project._id}`).then(res => {
      setProject(res.data.project)
    }).catch(err => {
      console.log(err)
    })

    axios.get('/users/all').then(res => {
      setUsers(res.data.users)
    }).catch(err => {
      console.log(err => {
        console.log(err)
      })
      // return res.status(400).json({error:err.message})
    })
  }, [])

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-indigo-100 via-blue-200 to-blue-400 transition-colors duration-700">

      <section className="left relative min-w-80 bg-white/80 border-r border-indigo-200 flex flex-col shadow-xl animate-fadeIn">
        <header className="flex items-center justify-between w-full p-4 bg-white/90 border-b border-indigo-100">
          {/* add user button */}
          <button
            className="p-2 cursor-pointer rounded hover:bg-indigo-100 transition-colors duration-200"
            onClick={() => setModalOpen(true)}
          >
            <i className="text-indigo-700 text-lg font-bold ri-add-large-line"></i>
          </button>

          {/* User Selection Modal */}

          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-2 p-6 animate-fadeIn flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-700">Select Users</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className=" cursor-pointer text-indigo-700 hover:text-indigo-900 text-2xl font-bold px-2"
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
                            // If already selected, remove from array
                            return prev.filter(id => id !== user._id);
                          } else {
                            // If not selected, add to array
                            return [...prev, user._id];
                          }
                        });
                      }}
                    >
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                        {user.name[0]}
                      </span>
                      <span className="text-indigo-900 font-medium">{user.name}</span>
                      {selectedUserId.includes(user._id) && (
                        <span className="ml-auto text-indigo-600 font-bold">Selected</span>
                      )}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full mt-auto py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-200"
                  onClick={addCollaborators}
                  disabled={selectedUserId.length === 0}
                >
                  Add Collaborator
                </button>
              </div>
            </div>
          )}
          <span className="text-lg font-bold text-indigo-700 tracking-wide animate-slideDown">Project Chat</span>
          <button
            onClick={() => setsidepanelOpen(!sidepanelOpen)}
            className="p-2 cursor-pointer rounded hover:bg-indigo-100 transition-colors duration-200"
            aria-label="Open Side Panel"
          >
            <i className="ri-group-line text-xl text-indigo-700"></i>
          </button>
        </header>

        <div className="conversation flex-grow flex flex-col">
          <div className="px-1 py-1 message-box flex-grow flex bg-indigo-100/70 flex-col gap-2 overflow-y-auto transition-all duration-500">
            <div className="message max-w-60 flex flex-col p-2 bg-indigo-600 w-fit rounded-md shadow animate-fadeInLeft">
              <small className="opacity-80 text-xs text-white">Alice</small>
              <p className="text-sm text-white">Hi, how are you? This is the project chat area. Let’s collaborate!</p>
            </div>
            <div className="ml-auto max-w-60 text-white message flex flex-col p-2 bg-indigo-500 w-fit rounded-md shadow animate-fadeInRight">
              <small className="opacity-80 text-xs text-white">You</small>
              <p className="text-sm">I’m good! Ready to discuss the project details.</p>
            </div>
          </div>

          <form className="inputField flex gap-2 bg-white/90 rounded-lg shadow p-2 animate-slideUp" onSubmit={handleSubmit}>
            <input
              className="flex-1 p-2 px-4 border-none outline-none rounded-md text-indigo-900 bg-transparent"
              type="text"
              placeholder="Enter Message"
            />
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors "
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </form>
        </div>

        <div className={`slidePanel w-full h-full transition-transform duration-500 ${sidepanelOpen ? 'translate-x-0' : '-translate-x-full'} bg-blue-50/90 absolute top-0 right-0 shadow-lg z-20 animate-slideIn`}>
          <header className="flex justify-end p-2 px-3">
            <button
              onClick={() => setsidepanelOpen(!sidepanelOpen)}
              className="p-2 cursor-pointer"
              aria-label="Close Side Panel"
            >
              <i className="ri-close-line text-xl text-indigo-700"></i>
            </button>
          </header>
          <div className="p-4 text-indigo-900 font-semibold ">
            <span className="text-lg font-bold text-indigo-700 tracking-wide animate-slideDown">Project User Collaborators</span>

            {project.users && project.users.map((user, index) => {
              return (
                <div key={index}>  
                  <ul className="mt-2 cursor-pointer space-y-1 flex items-baseline-last gap-3 text-blue-900">
                    <i className="ri-user-line"></i>
                    <li className="text-xl">{user.name}</li>
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* Animations (Tailwind CSS custom classes) */}
      <style>
        {`
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
        `}
      </style>
    </main>
  )
}

export default Project