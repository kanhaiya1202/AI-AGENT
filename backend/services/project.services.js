
import ProjectModel from "../model/project.model.js";

export const createProject = async ({
    name, userId,
    
}) =>{
    if(!name){
        throw new Error('Name is required')
    }
    if(!userId){
        throw new Error('UserId is required')
    }

    try {
        const project = await ProjectModel.create({
            name,
            users: [userId]
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