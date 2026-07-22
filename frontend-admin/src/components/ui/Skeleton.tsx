import React from 'react';

interface SkeletonProps {
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`animate-pulse bg-slate-900 border border-slate-850 rounded-xl ${className}`} />
    );
};

export default Skeleton;
