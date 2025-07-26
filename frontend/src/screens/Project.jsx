import React from "react"
import { useNavigation, useLocation } from "react-router-dom"

const Project = () =>{
    const location = useLocation();
    console.log(location.state)
    return(
        <div>(location.state)</div>
    )
}

export default Project