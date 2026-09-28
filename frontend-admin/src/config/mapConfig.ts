export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA90pvkeLfhraDXES8REKm_1anHZPhVJBc';

export type MapTileMode = 'google-streets' | 'google-hybrid' | 'google-satellite' | 'google-terrain' | 'dark';

export interface MapLayerConfig {
    id: MapTileMode;
    label: string;
    url: string;
    subdomains?: string[];
    maxZoom: number;
    attribution: string;
}

export const MAP_LAYERS: Record<MapTileMode, MapLayerConfig> = {
    'google-streets': {
        id: 'google-streets',
        label: 'Google Streets',
        url: `https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
    },
    'google-hybrid': {
        id: 'google-hybrid',
        label: 'Google Hybrid',
        url: `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
    },
    'google-satellite': {
        id: 'google-satellite',
        label: 'Google Satellite',
        url: `https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
    },
    'google-terrain': {
        id: 'google-terrain',
        label: 'Google Terrain',
        url: `https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
    },
    'dark': {
        id: 'dark',
        label: 'Dark Mode',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }
};

export default {
    GOOGLE_MAPS_API_KEY,
    MAP_LAYERS
};
