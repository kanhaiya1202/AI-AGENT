import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const Home = () => {
    const { user } = useContext(UserContext)
    const [modal, setModal] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        if (!projectName.trim()) return;

        setCreating(true);
        axios.post('/Project/create', {
            name: projectName.trim(),
        }).then((res) => {
            console.log(res);
            setModal(false)
            setProjectName('')
            fetchProjects(); // Refresh projects list
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setCreating(false);
        })
    }

    const fetchProjects = () => {
        setLoading(true);
        axios.get("Project/all").then((res) => {
            console.log(res.data)
            setProjects(res.data.Projects)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false);
        })
    }

    const logout = () => {
        axios.get('/users/logOut').then(() => {
            localStorage.removeItem('token');
            navigate('/');
        }).catch(err => {
            console.log(err);
            localStorage.removeItem('token');
            navigate('/');
        });
    }

    useEffect(() => {
        fetchProjects();
    }, [])

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
            {/* Navigation Header */}
            <nav className="flex justify-between items-center p-6 lg:px-12 border-b border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold tracking-wide">
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        CollabSpace
                    </span>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-gray-300">Welcome, {user?.name || 'User'}</span>
                   
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all duration-300 text-red-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="p-6 lg:px-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Your Projects</h1>
                    <p className="text-gray-300">Create and manage your collaborative projects</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Create New Project Button */}
                        <button
                            onClick={() => setModal(true)}
                            className="group p-6 border-2 border-dashed border-white/20 hover:border-purple-400/50 rounded-2xl transition-all duration-300 hover:bg-white/5 min-h-[200px] flex flex-col items-center justify-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <i className="ri-add-line text-2xl text-white"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-2">New Project</h3>
                            <p className="text-gray-400 text-center">Create a new collaborative project</p>
                        </button>

                        {/* Project Cards */}
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project }
                                    })
                                }}
                                className="group cursor-pointer p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl min-h-[200px] flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                        <i className="ri-folder-line text-xl text-white"></i>
                                    </div>
                                    <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full">
                                        Active
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 capitalize group-hover:text-purple-300 transition-colors">
                                    {project.name}
                                </h3>

                                <div className="mt-auto flex items-center justify-between text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <i className="ri-user-line"></i>
                                        <span>{project.users?.length || 0} members</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <i className="ri-time-line"></i>
                                        <span>Recent</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && projects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="ri-folder-open-line text-3xl text-gray-400"></i>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-gray-300">No Projects Yet</h3>
                        <p className="text-gray-400 mb-6">Create your first project to get started with collaboration</p>
                        <button
                            onClick={() => setModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                        >
                            Create Project
                        </button>
                    </div>
                )}
            </div>

            {/* Create Project Modal */}
            {modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-white/20">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-200">
                                    Project Name
                                </label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-400"
                                    placeholder="Enter project name"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(false);
                                        setProjectName('');
                                    }}
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !projectName.trim()}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creating ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </div>
                                    ) : (
                                        'Create'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home;