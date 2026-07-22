import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import CitizenDashboard from './citizen/CitizenDashboard';
import WorkerDashboard from './worker/WorkerDashboard';
import OfficialDashboard from './official/OfficialDashboard';
import AdminDashboard from './admin/AdminDashboard';
import Spinner from '../components/ui/Spinner';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                setUser(null);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
        setLoading(false);
    }, [navigate]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030712]">
                <Spinner size="lg" />
            </div>
        );
    }

    const renderDashboardByRole = () => {
        switch (user.role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'OFFICIAL':
                return <OfficialDashboard />;
            case 'WORKER':
                return <WorkerDashboard />;
            case 'CITIZEN':
            default:
                return <CitizenDashboard />;
        }
    };

    return (
        <DashboardLayout>
            {renderDashboardByRole()}
        </DashboardLayout>
    );
};

export default Dashboard;
