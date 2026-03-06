import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icon in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DashboardMap = () => {
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/analytics/heatmap`);
                setReports(res.data);
            } catch (error) {
                console.error("Failed to fetch map data", error);
            }
        };

        fetchMapData();
    }, []);

    // Placeholder data if API returns empty (for demo)
    const displayData = reports.length > 0 ? reports : [
        { latitude: 12.9716, longitude: 77.5946, category: 'Pothole', status: 'OPEN', report_id: '1' },
        { latitude: 12.9800, longitude: 77.6000, category: 'Garbage', status: 'IN_PROGRESS', report_id: '2' },
        { latitude: 12.9600, longitude: 77.5800, category: 'Street Light', status: 'RESOLVED', report_id: '3' },
    ];

    return (
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-lg mb-8 h-[400px] relative z-0">
            <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Live Incident Map</h3>
            <div className="h-[320px] rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                <MapContainer center={[12.9716, 77.5946]} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        className="map-tiles"
                    />
                    {displayData.map((report, idx) => {
                        const lat = Number(report.latitude);
                        const lng = Number(report.longitude);
                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker key={report.report_id || idx} position={[lat, lng]}>
                                <Popup>
                                    <div className="font-sans">
                                        <h4 className="font-bold text-sm mb-1">{report.category || 'Issue'}</h4>
                                        <p className="text-xs text-gray-600 mb-1">Status: <span className="font-semibold">{report.status}</span></p>
                                        <a href={`/issues/${report.report_id}`} className="text-xs text-blue-500 hover:underline">View Details</a>
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

export default DashboardMap;
