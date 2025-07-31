import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const ProtectedRoute = ({ children }) => {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setLoading(false);
            return;
        }

        // Verify token with backend
        axios.get('/users/profile')
            .then((res) => {
                setUser(res.data.user);
                setIsAuthenticated(true);
            })
            .catch((err) => {
                console.error('Authentication failed:', err);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [setUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-700 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;