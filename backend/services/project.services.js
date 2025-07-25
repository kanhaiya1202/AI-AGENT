import mongoose from "mongoose";
import ProjectModel from "../model/project.model.js";


export const createProject = async ({
    name, useId
    
}) =>{
    if(!name){
        throw new Error('Name is required')
    }
    if(!useId){
        throw new Error('UserId is required')
    }

    try {
        const project = await ProjectModel.create({
            name,
            users: [useId]
        });
        return project;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Project with this name already exists');
        }
        throw error;
    }
    return project
}

export const getAllProjectByUserId = async ({useId}) =>{
    if(!useId){
       throw new Error('UserId is required')
    }

    const allUserProject = await ProjectModel.find({
        users:useId
    })
    return allUserProject
}


export const addUsersToProject = async ({ projectId, users, useId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(useId => !mongoose.Types.ObjectId.isValid(useId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!useId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(useId)) {
        throw new Error("Invalid userId")
    }

    console.log(useId)
    const project = await ProjectModel.findOne({
        _id: projectId,
        users: useId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

    const updatedProject = await ProjectModel.findOneAndUpdate({
        _id: projectId
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    })

    return updatedProject
}

