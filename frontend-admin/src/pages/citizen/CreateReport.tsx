import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle, Droplets, Trash2, Lightbulb, ShieldAlert, FileText, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../api/axios';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ImageUploader from '../../components/forms/ImageUploader';
import Badge from '../../components/ui/Badge';
import { useTheme } from '../../contexts/ThemeContext';
import platformConfig from '../../config/platformConfig';

const CATEGORY_OPTIONS = [
    { value: 'Road Damage', label: 'Road / Potholes', icon: AlertCircle, priority: 'HIGH PRIORITY', sla: 'SLA: 24h', color: 'rose' },
    { value: 'Garbage Dump', label: 'Waste & Garbage', icon: Trash2, priority: 'URGENT', sla: 'SLA: 12h', color: 'amber' },
    { value: 'Streetlight Defect', label: 'Streetlight Error', icon: Lightbulb, priority: 'MEDIUM', sla: 'SLA: 12h', color: 'indigo' },
    { value: 'Water Leak', label: 'Water Supplies', icon: Droplets, priority: 'CRITICAL', sla: 'SLA: 6h', color: 'blue' },
    { value: 'Traffic Signal', label: 'Traffic Lights', icon: ShieldAlert, priority: 'EMERGENCY', sla: 'SLA: 4h', color: 'rose' },
    { value: 'Other Issue', label: 'Other Hazards', icon: FileText, priority: 'STANDARD', sla: 'SLA: 48h', color: 'slate' }
];

// Click to drop pin on Leaflet Map
const LocationPickerMarker = ({ position, setPosition, setFormData }: any) => {
    useMapEvents({
        click(e) {
            const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
            setPosition(newPos);
            setFormData((prev: any) => ({
                ...prev,
                latitude: e.latlng.lat.toFixed(6),
                longitude: e.latlng.lng.toFixed(6),
                location: prev.location || `Municipal Pin (${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)})`
            }));
        }
    });

    const markerIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #10b981; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 15px #10b981;"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
    });

    return position ? <Marker position={position} icon={markerIcon} /> : null;
};

const CreateReport: React.FC = () => {
    const navigate = useNavigate();
    const locationState = useLocation().state as any;
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [mapPosition, setMapPosition] = useState<[number, number]>([11.0168, 76.9558]);

    const user = (() => {
        try {
            const raw = localStorage.getItem('user');
            return raw && raw !== 'undefined' ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    })();

    const userId = user.user_id || user.id || 'anonymous';
    const [fakeStrikeCount, setFakeStrikeCount] = useState<number>(() => {
        return parseInt(localStorage.getItem(`fake_strikes_${userId}`) || '0', 10);
    });

    const [isBanned, setIsBanned] = useState<boolean>(() => {
        return user.is_banned || localStorage.getItem(`banned_${userId}`) === 'true' || parseInt(localStorage.getItem(`fake_strikes_${userId}`) || '0', 10) >= 3;
    });

    const [fakeImageDetected, setFakeImageDetected] = useState(false);
    const [scanMessage, setScanMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        category: locationState?.category || 'Road Damage',
        description: locationState?.description || '',
        location: locationState?.location || '',
        image_url: '',
        latitude: '11.0168',
        longitude: '76.9558'
    });

    const handleImageScanResult = (isValid: boolean, isFake: boolean, reason?: string) => {
        if (isFake) {
            setFakeImageDetected(true);
            setScanMessage(reason || 'AI Vision Alert: Fake image evidence detected.');

            const newStrikes = fakeStrikeCount + 1;
            setFakeStrikeCount(newStrikes);
            localStorage.setItem(`fake_strikes_${userId}`, newStrikes.toString());

            if (newStrikes >= 3) {
                setIsBanned(true);
                localStorage.setItem(`banned_${userId}`, 'true');
                user.is_banned = true;
                localStorage.setItem('user', JSON.stringify(user));
                alert(`ACCOUNT BANNED: You have accumulated 3 Strikes for uploading fake report images. Your account has been suspended by AI Fraud Enforcement.`);
            } else {
                alert(`AI Fraud Warning (Strike ${newStrikes}/3): Uploaded image detected as FAKE/INVALID. Do not submit fake evidence or your account will be BANNED.`);
            }
        } else {
            setFakeImageDetected(false);
            setScanMessage(null);
        }
    };

    const handleCategorySelect = (categoryVal: string) => {
        setFormData(prev => ({ ...prev, category: categoryVal }));
    };

    const handleLocationDetect = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setMapPosition([lat, lng]);
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat.toFixed(6),
                        longitude: lng.toFixed(6),
                        location: prev.location || `${platformConfig.city} (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error('Location error', error);
                    setMapPosition([platformConfig.defaultCoordinates.latitude, platformConfig.defaultCoordinates.longitude]);
                    setFormData(prev => ({
                        ...prev,
                        latitude: platformConfig.defaultCoordinates.latitude.toString(),
                        longitude: platformConfig.defaultCoordinates.longitude.toString(),
                        location: prev.location || `${platformConfig.city} Central District`
                    }));
                    setLocationLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert('Geolocation not supported by browser.');
            setLocationLoading(false);
        }
    };

    // AI Auto-Categorize Description
    const handleDescriptionChange = (text: string) => {
        setFormData(prev => ({ ...prev, description: text }));
        const lower = text.toLowerCase();
        if (lower.includes('water') || lower.includes('pipe') || lower.includes('leak')) {
            setFormData(prev => ({ ...prev, category: 'Water Leak' }));
        } else if (lower.includes('garbage') || lower.includes('trash') || lower.includes('waste') || lower.includes('smell')) {
            setFormData(prev => ({ ...prev, category: 'Garbage Dump' }));
        } else if (lower.includes('light') || lower.includes('dark') || lower.includes('power') || lower.includes('wire')) {
            setFormData(prev => ({ ...prev, category: 'Streetlight Defect' }));
        } else if (lower.includes('pothole') || lower.includes('road') || lower.includes('tar') || lower.includes('crack')) {
            setFormData(prev => ({ ...prev, category: 'Road Damage' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isBanned) {
            alert('SUBMISSION REJECTED: Your account is BANNED due to multiple fake image submissions.');
            return;
        }

        if (fakeImageDetected) {
            alert('SUBMISSION BLOCKED: AI Vision Filter detected that the attached image is fake/invalid. Please attach genuine field evidence.');
            return;
        }

        setLoading(true);

        const latVal = formData.latitude || platformConfig.defaultCoordinates.latitude.toString();
        const lngVal = formData.longitude || platformConfig.defaultCoordinates.longitude.toString();
        const locVal = formData.location || `${platformConfig.city} Center`;

        try {
            const payload = {
                ...formData,
                userId: user.user_id || user.id,
                latitude: parseFloat(latVal),
                longitude: parseFloat(lngVal),
                location: locVal,
                image_url: formData.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=640&q=80'
            };

            await api.post('/reports', payload);
            alert('Municipal Incident Logged Successfully! AI Auto-Routing Synced.');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Failed to submit report', error);
            alert('Failed to submit report. Please verify connection.');
        } finally {
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';
    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-300 pb-16">
                
                {/* Header title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white transition-all active:scale-95 shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Report Issue
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                Spatial AI Form
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                            Log municipal infrastructure defects to instantly alert ward crews & dispatch teams.
                        </p>
                    </div>
                </div>

                {/* Account Banned Warning Banner */}
                {isBanned && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-700 dark:text-rose-400 text-xs font-bold flex items-center gap-3">
                        <ShieldAlert size={20} className="shrink-0 text-rose-500" />
                        <div>
                            <span className="block font-black uppercase tracking-wider">Account Access Suspended</span>
                            <span className="font-medium">Your account has been restricted from submitting new civic reports due to multiple invalid/fake photo submissions. Contact system administrator for clearance.</span>
                        </div>
                    </div>
                )}

                {/* Active Strike Counter Warning */}
                {!isBanned && fakeStrikeCount > 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldAlert size={18} className="text-amber-600 dark:text-amber-400" />
                            <span>AI Vision Fraud Warning: {fakeStrikeCount}/3 Fraud Strikes Recorded on this account.</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 font-extrabold">
                            3 Strikes = Permanent Account Ban
                        </span>
                    </div>
                )}

                {/* Form Card Container */}
                <div className={`bg-white/95 dark:bg-[#090d16]/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-xl transition-colors ${isBanned ? 'opacity-50 pointer-events-none' : ''}`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Category selection selector */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    1. Select Issue Category
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <Sparkles size={11} /> AI Auto-Classifier Active
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {CATEGORY_OPTIONS.map((opt) => {
                                    const Icon = opt.icon;
                                    const isSelected = formData.category === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleCategorySelect(opt.value)}
                                            className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer active:scale-95 relative overflow-hidden ${
                                                isSelected 
                                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16, 185, 129,0.2)] font-extrabold'
                                                    : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start w-full">
                                                <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                    {opt.sla}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xs font-extrabold block text-slate-900 dark:text-white leading-tight">
                                                    {opt.label}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">
                                                    {opt.priority}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Location detect & Interactive Spatial Map Picker */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-4">
                                <span className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    2. Tamil Nadu Corporation & Address
                                </span>

                                {/* Tamil Nadu District & Corporation Dropdown */}
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                        Select Tamil Nadu Region / Municipal Corporation
                                    </label>
                                    <select
                                        onChange={(e) => {
                                            const corp = e.target.value;
                                            let coords: [number, number] = [11.0168, 76.9558];
                                            if (corp.includes('Chennai')) coords = [13.0827, 80.2707];
                                            else if (corp.includes('Madurai')) coords = [9.9252, 78.1198];
                                            else if (corp.includes('Trichy') || corp.includes('Tiruchirappalli')) coords = [10.7905, 78.7047];
                                            else if (corp.includes('Salem')) coords = [11.6643, 78.1460];
                                            else if (corp.includes('Tiruppur')) coords = [11.1085, 77.3411];
                                            else if (corp.includes('Erode')) coords = [11.3410, 77.7172];
                                            else if (corp.includes('Vellore')) coords = [12.9165, 79.1325];

                                            setMapPosition(coords);
                                            setFormData(prev => ({
                                                ...prev,
                                                latitude: coords[0].toFixed(6),
                                                longitude: coords[1].toFixed(6),
                                                location: prev.location || `${corp} Central Ward`
                                            }));
                                        }}
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 shadow-inner cursor-pointer"
                                    >
                                        <option value="Central Municipal District">Central Municipal District (Primary Hub)</option>
                                        <option value="Northern Regional Corporation">Northern Regional Corporation</option>
                                        <option value="Eastern Municipal Zone">Eastern Municipal Zone</option>
                                        <option value="Western District Corporation">Western District Corporation</option>
                                        <option value="Southern Regional Zone">Southern Regional Zone</option>
                                        <option value="Metropolitan Core Area">Metropolitan Core Area</option>
                                        <option value="Other Municipal Region">Other Municipal Region</option>
                                    </select>
                                </div>

                                <Input
                                    label="Incident Address / Landmark"
                                    placeholder="e.g. Near Singanallur Signal, Ward 4..."
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={handleLocationDetect}
                                            disabled={locationLoading}
                                            className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-xs flex items-center gap-1"
                                        >
                                            <Navigation size={12} /> {locationLoading ? 'Locating...' : 'Auto GPS'}
                                        </button>
                                    }
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Latitude Vector"
                                        placeholder="11.0168"
                                        value={formData.latitude}
                                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                                    />
                                    <Input
                                        label="Longitude Vector"
                                        placeholder="76.9558"
                                        value={formData.longitude}
                                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Interactive Spatial Leaflet Mini-Map Picker */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        GPS Pin Map (Click Map to Drop Pin)
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {formData.latitude}, {formData.longitude}
                                    </span>
                                </div>
                                
                                <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative shadow-inner">
                                    <MapContainer
                                        center={mapPosition}
                                        zoom={13}
                                        scrollWheelZoom={true}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; CARTO'
                                            url={tileUrl}
                                        />
                                        <LocationPickerMarker
                                            position={mapPosition}
                                            setPosition={setMapPosition}
                                            setFormData={setFormData}
                                        />
                                    </MapContainer>
                                </div>
                            </div>
                        </div>

                        {/* Image attachment uploader */}
                        <div className="pt-2">
                            <span className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                3. Photo Evidence
                            </span>
                            <ImageUploader 
                                onChange={(url) => setFormData({ ...formData, image_url: url })} 
                                onScanResult={handleImageScanResult}
                                label="Upload Field Photograph" 
                            />
                        </div>

                        {/* Description field with AI Auto-Tagging & Writing Assistant */}
                        <div className="space-y-3 pt-2">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                    4. Detailed Description
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
                                        AI Writer Active
                                    </span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const cat = formData.category;
                                            const loc = formData.location || `${platformConfig.city} Central District`;
                                            let aiText = '';
                                            if (cat === 'Road Damage') {
                                                aiText = `Severe deep pothole and road erosion logged at ${loc}. Causes vehicle damage and traffic slowdowns. Requires urgent asphalt resurfacing crew.`;
                                            } else if (cat === 'Water Leak') {
                                                aiText = `Major municipal water supply pipe leak at ${loc}. High pressure water wastage flooding sidewalk. Urgently requires pipe fitting crew.`;
                                            } else if (cat === 'Garbage Dump') {
                                                aiText = `Large uncollected municipal waste dump accumulating at ${loc}. Creating foul odor and sanitation hazard. Requires waste collection truck.`;
                                            } else if (cat === 'Streetlight Defect') {
                                                aiText = `Inoperative streetlight fixture at ${loc}. Creates dark hazard spot for pedestrians and traffic at night. Requires electrical repairs.`;
                                            } else if (cat === 'Traffic Signal') {
                                                aiText = `Malfunctioning traffic signal junction light at ${loc}. Causing traffic congestion and collision risk. Requires signal technician.`;
                                            } else {
                                                aiText = `Municipal infrastructure defect logged at ${loc}. Poses public inconvenience and requires ward inspector review.`;
                                            }
                                            setFormData(prev => ({ ...prev, description: aiText }));
                                        }}
                                        className="py-1 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                                    >
                                        <Sparkles size={13} /> Auto-Draft Description with AI
                                    </button>
                                    <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                                        {formData.description.length} chars
                                    </span>
                                </div>
                            </div>

                            <textarea
                                rows={4}
                                placeholder="Describe the defect or click 'Auto-Draft Description with AI' to let AI write a detailed report..."
                                value={formData.description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 shadow-inner text-xs leading-relaxed font-medium"
                            />

                            {/* Quick AI Template Chips */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 block">
                                    Quick AI Smart Templates (Click to Insert):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { label: 'High Hazard & Damage', text: `Severe hazard detected at ${formData.location || 'site'}. Causes immediate risk to vehicles and pedestrians.` },
                                        { label: 'Flooding / Leakage', text: `Continuous water flow/flooding at ${formData.location || 'site'}. Requires immediate pipeline repair.` },
                                        { label: 'Odor & Health Risk', text: `Uncollected waste accumulation causing severe odor and health hazard.` },
                                        { label: 'Nighttime Dark Spot', text: `Streetlight completely non-functional at night creating safety hazard.` }
                                    ].map((tmpl, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                description: prev.description ? `${prev.description} ${tmpl.text}` : tmpl.text
                                            }))}
                                            className="py-1 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                                        >
                                            {tmpl.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex justify-end">
                            <Button
                                type="submit"
                                loading={loading}
                                className="w-full md:w-max px-10 py-3 text-sm font-extrabold shadow-[0_0_20px_rgba(16, 185, 129,0.3)] rounded-2xl"
                            >
                                Dispatch Incident Report
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateReport;
