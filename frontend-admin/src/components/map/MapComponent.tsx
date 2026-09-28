import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../api/axios';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import { useTheme } from '../../contexts/ThemeContext';
import { Layers, Navigation, ExternalLink, MapPin } from 'lucide-react';
import platformConfig from '../../config/platformConfig';
import { MAP_LAYERS, type MapTileMode } from '../../config/mapConfig';

interface MapComponentProps {
    fullScreen?: boolean;
}

const CATEGORIES = ['ALL', 'Garbage Dump', 'Road Damage', 'Water Leak', 'Electrical', 'Streetlight Defect'];

const MapComponent: React.FC<MapComponentProps> = ({ fullScreen = false }) => {
    const { theme } = useTheme();
    const [mapLayer, setMapLayer] = useState<MapTileMode>('google-streets');
    const [reports, setReports] = useState<any[]>([]);
    const [filteredReports, setFilteredReports] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If dark theme is initially active, default to dark layer or google streets
        if (theme === 'dark') {
            setMapLayer('dark');
        } else {
            setMapLayer('google-streets');
        }
    }, [theme]);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const res = await api.get('/analytics/heatmap').catch(() => ({ data: [] }));
                setReports(res.data);
                setFilteredReports(res.data);
            } catch (error) {
                console.error('Failed to fetch heatmap data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMapData();
    }, []);

    useEffect(() => {
        let result = reports;
        
        if (selectedCategory !== 'ALL') {
            result = result.filter(r => r.category?.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                                       selectedCategory.toLowerCase().includes(r.category?.toLowerCase()));
        }
        
        if (selectedStatus !== 'ALL') {
            result = result.filter(r => r.status === selectedStatus);
        }
        
        setFilteredReports(result);
    }, [selectedCategory, selectedStatus, reports]);

    const getMarkerIcon = (status: string) => {
        let color = '#f43f5e'; // Neon Rose for open/pending
        if (status === 'RESOLVED') color = '#10b981'; // Neon Emerald for solved
        else if (status === 'IN_PROGRESS') color = '#f59e0b'; // Amber for in-progress
        else if (status === 'APPROVED' || status === 'ASSIGNED') color = '#10b981'; // Neon Blue for assigned

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${color}; 
                width: 14px; 
                height: 14px; 
                border-radius: 50%; 
                border: 2px solid #ffffff; 
                box-shadow: 0 0 10px ${color};
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });
    };

    const currentLayer = MAP_LAYERS[mapLayer] || MAP_LAYERS['google-streets'];

    if (loading) {
        return (
            <div className="h-96 w-full flex items-center justify-center panel-cyber-glass">
                <Spinner size="md" />
            </div>
        );
    }

    return (
        <div className={`relative w-full ${fullScreen ? 'h-[75vh]' : 'h-96'} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-900 bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row z-0 shadow-2xl transition-colors duration-300`}>
            
            {/* Sidebar Map Controls */}
            <div className="w-full md:w-64 bg-white/95 dark:bg-[#060814]/95 backdrop-blur-md border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-900 p-4 space-y-4 z-10 text-left overflow-y-auto max-h-[75vh]">
                
                {/* Header & Google Maps badge */}
                <div className="pb-3 border-b border-slate-200 dark:border-slate-900">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
                            Map Engine
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Google Maps API
                        </span>
                    </div>

                    {/* Layer Selector */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                        <button
                            type="button"
                            onClick={() => setMapLayer('google-streets')}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left flex items-center gap-1.5 ${
                                mapLayer === 'google-streets'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span>🗺️</span>
                            <span className="truncate">Streets</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMapLayer('google-satellite')}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left flex items-center gap-1.5 ${
                                mapLayer === 'google-satellite'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span>🛰️</span>
                            <span className="truncate">Satellite</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMapLayer('google-hybrid')}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left flex items-center gap-1.5 ${
                                mapLayer === 'google-hybrid'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span>🔀</span>
                            <span className="truncate">Hybrid</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMapLayer('dark')}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-left flex items-center gap-1.5 ${
                                mapLayer === 'dark'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span>🌙</span>
                            <span className="truncate">Dark</span>
                        </button>
                    </div>
                </div>

                {/* Spatial Category Filter */}
                <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Category Filter</span>
                    <div className="flex flex-wrap md:flex-col gap-1.5 mt-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-2.5 py-1.5 text-left rounded-lg text-xs font-bold transition-all w-max md:w-full ${
                                    selectedCategory === cat
                                        ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm font-extrabold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/50'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Legend */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-900">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">Status Legend</span>
                    <div className="space-y-2 mt-2 text-xs font-medium">
                        <button 
                            onClick={() => setSelectedStatus(selectedStatus === 'OPEN' ? 'ALL' : 'OPEN')}
                            className={`flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${selectedStatus === 'OPEN' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Pending</span>
                            <Badge variant="danger">{reports.filter(r => r.status === 'OPEN').length}</Badge>
                        </button>
                        <button 
                            onClick={() => setSelectedStatus(selectedStatus === 'IN_PROGRESS' ? 'ALL' : 'IN_PROGRESS')}
                            className={`flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${selectedStatus === 'IN_PROGRESS' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> In Progress</span>
                            <Badge variant="warning">{reports.filter(r => r.status === 'IN_PROGRESS').length}</Badge>
                        </button>
                        <button 
                            onClick={() => setSelectedStatus(selectedStatus === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
                            className={`flex items-center justify-between w-full p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors ${selectedStatus === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Solved</span>
                            <Badge variant="success">{reports.filter(r => r.status === 'RESOLVED').length}</Badge>
                        </button>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 h-full z-0 relative">
                <MapContainer 
                    center={[platformConfig.defaultCoordinates.latitude, platformConfig.defaultCoordinates.longitude]}
                    zoom={13} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        key={mapLayer}
                        attribution={currentLayer.attribution}
                        url={currentLayer.url}
                        subdomains={currentLayer.subdomains || ['0', '1', '2', '3']}
                        maxZoom={currentLayer.maxZoom}
                    />
                    {filteredReports.map((report, idx) => {
                        const lat = Number(report.latitude);
                        const lng = Number(report.longitude);
                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker 
                                key={report.report_id || idx} 
                                position={[lat, lng]}
                                icon={getMarkerIcon(report.status)}
                            >
                                <Popup>
                                    <div className="p-2.5 text-left font-sans min-w-[180px] bg-slate-900 dark:bg-slate-950 text-white rounded-xl shadow-2xl border border-slate-800">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-xs font-bold text-white leading-tight">{report.category}</span>
                                            <span className="text-[9px] text-slate-400 font-mono">#{report.report_id?.slice(0, 4) || idx}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-300 mt-1">Status: <span className="font-bold text-emerald-400">{report.status}</span></p>
                                        
                                        <div className="h-[1px] bg-slate-800 my-2"></div>
                                        
                                        <div className="space-y-1.5">
                                            <a 
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                                            >
                                                <Navigation size={12} />
                                                <span>Navigate with Google Maps</span>
                                            </a>
                                            <a 
                                                href={`/issues/${report.report_id}`} 
                                                className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                                            >
                                                <ExternalLink size={12} />
                                                <span>Inspect Incident Details</span>
                                            </a>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapComponent;
