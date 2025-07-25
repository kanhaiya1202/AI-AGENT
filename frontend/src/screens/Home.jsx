import React, { useContext, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";

const Home = () => {
    const { user } = useContext(UserContext)
    const [model , setmodel] = useState(false)
    const [projectName , setProjectName] = useState(' ')

    function createProject(e){
        e.preventDefault() 
         console.log({projectName })
        
        axios.post('/Project/create',{
            name:projectName,
        }).then((res) =>{
            console.log(res);
            setmodel(false)
        }).catch((error) =>{
            console.log(error)
            
        })

    }
    return (
        <main className="p-4 h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex">
            <div className="project mb-6">
                <button
                    onClick={() => setmodel(true)}
                    className="p-4 border border-blue-600 hover:bg-blue-700 hover:text-white rounded-md transition"
                >
                    <div className="text-l ">New Project<i className="ri-link ml-2"></i></div>
                </button>
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