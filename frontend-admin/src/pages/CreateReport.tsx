import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader2, Camera, Upload, CheckCircle2, ArrowLeft, AlertTriangle, Search, Lightbulb, Droplets, Trash2, Map, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';

const CreateReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get user safely
    const [user] = useState<any>(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const [formData, setFormData] = useState({
        category: 'POTHOLE',
        description: '',
        location: '',
        image_url: '',
        latitude: '',
        longitude: ''
    });

    const categories = [
        { id: 'POTHOLE', label: 'Pothole', icon: <AlertTriangle size={24} /> },
        { id: 'GARBAGE', label: 'Garbage Dump', icon: <Trash2 size={24} /> },
        { id: 'STREET_LIGHT', label: 'Street Light', icon: <Lightbulb size={24} /> },
        { id: 'WATER_LEAK', label: 'Water Leak', icon: <Droplets size={24} /> },
        { id: 'TRAFFIC_SIGNAL', label: 'Traffic Signal', icon: <ShieldAlert size={24} /> },
        { id: 'OTHER', label: 'Other Issue', icon: <Map size={24} /> }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCategorySelect = (categoryId: string) => {
        setFormData(prev => ({ ...prev, category: categoryId }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const processFile = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Max 5MB allowed.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            setFormData(prev => ({ ...prev, image_url: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleLocation = () => {
        setLocationLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setFormData(prev => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                        location: prev.location || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                    }));
                    setLocationLoading(false);
                },
                (error) => {
                    console.error("Location error:", error);
                    alert("Could not detect location. Please check permissions.");
                    setLocationLoading(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setLocationLoading(false);
        }
    };

    const handleGeocode = async () => {
        if (!formData.location) return;
        setLocationLoading(true);
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lon
                }));
            } else {
                alert("Location not found. Please try a more specific address.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Failed to find location.");
        } finally {
            setLocationLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                alert("You must be logged in to create a report.");
                setLoading(false);
                return;
            }

            if (!formData.latitude || !formData.longitude) {
                alert("Please add a location to your report.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                userId: user.id || user.user_id,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                image_url: formData.image_url || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400"
            };

            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/reports`, payload);
            setLoading(false);
            navigate('/dashboard');

        } catch (error: any) {
            console.error("Failed to create report", error);
            const errorMessage = error.response?.data?.message || "Something went wrong";
            alert(`Failed to create report: ${errorMessage}`);
            setLoading(false);
        }
    };

    return (
        <Layout userRole={user?.role}>
            <div className="max-w-5xl mx-auto pb-24 mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center p-8 border-b border-white/10 bg-black/20 backdrop-blur-md relative z-20">
                        <button
                            onClick={() => navigate(-1)}
                            className="mr-5 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all group"
                        >
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Create New Report</h2>
                            <p className="text-indigo-300/80 font-medium text-sm mt-1 tracking-wide uppercase">Help us improve the city by reporting an issue</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 h-full relative z-10">
                        {/* Left Column: Image & Location */}
                        <div className="lg:col-span-2 p-8 bg-black/40 border-b lg:border-b-0 lg:border-r border-white/5 space-y-8">
                            {/* Image Upload Area */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Evidence Photo</label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative h-72 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${dragActive
                                        ? 'border-indigo-500 bg-indigo-500/10'
                                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20'
                                        }`}
                                >
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                                <Camera size={32} className="mb-2 text-indigo-400" />
                                                <span className="font-bold tracking-wide">Change Photo</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 transform group-hover:scale-105 transition-transform">
                                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-lg">
                                                <Upload size={28} />
                                            </div>
                                            <p className="text-white font-bold tracking-wide">Upload Photo</p>
                                            <p className="text-gray-500 text-xs mt-2 font-medium">Drag & drop or click</p>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </div>
                            </div>

                            {/* Location Status */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Location Status</label>
                                <div className={`p-5 rounded-2xl border transition-colors duration-300 ${formData.latitude ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/5' : 'bg-red-500/10 border-red-500/30'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${formData.latitude ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {formData.latitude ? (
                                                <CheckCircle2 size={24} />
                                            ) : (
                                                <AlertTriangle size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`font-bold tracking-wide ${formData.latitude ? 'text-green-400' : 'text-red-400'}`}>
                                                {formData.latitude ? 'Location Locked' : 'Location Required'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 font-medium font-mono">
                                                {formData.latitude
                                                    ? `${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}`
                                                    : 'Awaiting detection...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form Fields */}
                        <form onSubmit={handleSubmit} className="lg:col-span-3 p-8 space-y-8 flex flex-col h-full bg-white/[0.01]">

                            {/* Category Selection Grid */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Issue Category</label>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => handleCategorySelect(cat.id)}
                                            className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col gap-3 group ${formData.category === cat.id
                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-gray-400 hover:text-gray-200'
                                                }`}
                                        >
                                            <span className={`p-2 rounded-xl inline-flex w-fit ${formData.category === cat.id ? 'bg-indigo-500/30' : 'bg-white/5 group-hover:bg-white/10'}`}>{cat.icon}</span>
                                            <span className="text-sm font-bold tracking-wide">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe the issue in detail..."
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:bg-white/[0.05] transition-all resize-none shadow-inner"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Address / Landmark</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1 group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            onBlur={() => { if (formData.location && !formData.latitude) handleGeocode() }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGeocode(); } }}
                                            placeholder="Enter precise address"
                                            className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-gray-500 outline-none focus:border-indigo-500 focus:bg-white/[0.05] transition-all shadow-inner"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGeocode}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 p-1 transition-colors"
                                            title="Search for address"
                                        >
                                            <Search size={20} />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleLocation}
                                        disabled={locationLoading}
                                        className="px-5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl transition-all flex items-center justify-center min-w-[64px] shadow-lg group disabled:opacity-50"
                                        title="Auto-detect Location (GPS)"
                                    >
                                        {locationLoading ? <Loader2 size={24} className="animate-spin" /> : <MapPin size={24} className="group-hover:scale-110 transition-transform" />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Type address and press Enter to auto-fill coordinates</p>
                            </div>

                            <div className="flex-1"></div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg tracking-wide shadow-xl shadow-indigo-500/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : <CheckCircle2 size={24} />}
                                {loading ? 'Submitting Report...' : 'Submit Report'}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default CreateReport;
