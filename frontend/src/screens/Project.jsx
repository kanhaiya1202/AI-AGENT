import React, { useState } from "react"
import { useNavigation, useLocation } from "react-router-dom"

const Project = () => {
  const location = useLocation();
  const [sidepanelOpen, setsidepanelOpen] = useState(false)

  return (
    <main className="h-screen w-screen flex bg-gradient-to-br from-indigo-100 via-blue-200 to-blue-400 transition-colors duration-700">

      <section className="left relative min-w-72 bg-white/80 border-r border-indigo-200 flex flex-col shadow-xl animate-fadeIn">
        <header className="flex items-center justify-between w-full p-4 bg-white/90 border-b border-indigo-100">
          <span className="text-lg font-bold text-indigo-700 tracking-wide animate-slideDown">Project Chat</span>
          <button
            onClick={() => setsidepanelOpen(!sidepanelOpen)}
            className="p-2 rounded hover:bg-indigo-100 transition-colors duration-200"
            aria-label="Open Side Panel"
          >
            <i className="ri-group-line text-xl text-indigo-600"></i>
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

          <form className="inputField flex gap-2 bg-white/90 rounded-lg shadow p-2 animate-slideUp">
            <input
              className="flex-1 p-2 px-4 border-none outline-none rounded-md text-indigo-900 bg-transparent"
              type="text"
              placeholder="Enter Message"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors duration-200"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </form>
        </div>

        <div className={`slidePanel w-full h-full transition-transform duration-500 ${sidepanelOpen ? 'translate-x-0' : '-translate-x-full'} bg-blue-50/90 absolute top-0 right-0 shadow-lg z-20 animate-slideIn`}>
          <header className="flex justify-end p-2 px-3">
            <button
              onClick={() => setsidepanelOpen(!sidepanelOpen)}
              className="p-2"
              aria-label="Close Side Panel"
            >
              <i className="ri-close-line text-xl text-indigo-700"></i>
            </button>
          </header>
          <div className="p-4 text-indigo-900 font-semibold">
            <h1>Project Members</h1>
            <ul className="mt-2 space-y-1">
              <li>- Alice</li>
            </ul>
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