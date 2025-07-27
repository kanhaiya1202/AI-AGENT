import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const Home = () => {
    const { user } = useContext(UserContext)
    const [model, setmodel] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setproject] = useState([])
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })

        axios.post('/Project/create', {
            name: projectName,
        }).then((res) => {
           
            console.log(res);
            setmodel(false)
        }).catch((error) => {
            console.log(error)

        })

    }

    useEffect(() => {
            axios.get("Project/all").then((res) => {
            console.log(res.data)
            setproject(res.data.Projects)
    
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <main className="p-3 h-screen bg-gradient-to-br from-indigo-100 via-blue-200 to-blue-400 ">
            <div className="project flex flex-wrap gap-3 ">
                <button
                    onClick={() => setmodel(true)}
                    className="p-4 border border-blue-600 hover:bg-blue-700 hover:text-white text-blue-900 rounded-md transition"
                >
                    <div className="text-xl font-bold ">New Project<i className="ri-link ml-2"></i></div>
                </button>
                {
                    project.map((project)=>(
                        <div onClick={()=>{navigate(`/Project`,{
                            state:{project}
                        })}} key={project._id} className="project p-4 flex flex-col gap-2 cursor-pointer border  border-blue-600 rounded-md min-w-52 hover:bg-white  text-blue-900 font-bold ">
                            {project.name}
                            <div className="flex gap-2 text-blue-900 font-bold text-l ">
                                <p><small><i className=" ri-user-line"></i> Collaborators: </small>{project.users.length}</p>
                            </div>
                        </div>
                        
                    ))
                }
            
            </div>

            {model && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-blue-700">Create New Project</h2>
                        <form
                            onSubmit={createProject}
                        >
                            <label className="block mb-2 text-blue-700 font-medium">Project Name</label>

                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text"
                                className="mt-1 block w-full border border-blue-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900"
                                required
                            />

                            <div className="flex justify-end mt-6 space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setmodel(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Create
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
