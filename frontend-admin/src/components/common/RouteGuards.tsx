import React from 'react';
import ProtectedRoute from './ProtectedRoute';

export const CitizenRoute = ({ children }: { children: React.ReactElement }) => (
    <ProtectedRoute allowedRoles={['CITIZEN']}>{children}</ProtectedRoute>
);

export const WorkerRoute = ({ children }: { children: React.ReactElement }) => (
    <ProtectedRoute allowedRoles={['WORKER']}>{children}</ProtectedRoute>
);

export const OfficialRoute = ({ children }: { children: React.ReactElement }) => (
    <ProtectedRoute allowedRoles={['OFFICIAL']}>{children}</ProtectedRoute>
);

export const AdminRoute = ({ children }: { children: React.ReactElement }) => (
    <ProtectedRoute allowedRoles={['ADMIN']}>{children}</ProtectedRoute>
);
