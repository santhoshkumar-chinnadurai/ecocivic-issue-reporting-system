import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles?: string[] }) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    let user = null;
    try {
        user = userString && userString !== 'undefined' ? JSON.parse(userString) : null;
    } catch (e) {
        user = null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        console.warn(`ProtectedRoute: Access denied for role ${user.role}`);
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
