export interface PlatformConfig {
    appName: string;
    tagline: string;
    orgName: string;
    city: string;
    region: string;
    country: string;
    supportEmail: string;
    supportPhone: string;
    officeAddress: string;
    defaultCoordinates: {
        latitude: number;
        longitude: number;
    };
    googleMapsApiKey?: string;
}

export const platformConfig: PlatformConfig = {
    appName: 'EcoCivic',
    tagline: 'Smart, Sustainable & Greener Community Governance',
    orgName: 'EcoCivic Municipal & Environmental Services',
    city: 'Eco-Metropolis City',
    region: 'Green Municipal District',
    country: 'India',
    supportEmail: 'support@ecocivic.org',
    supportPhone: '+91 (800) 555-ECO',
    officeAddress: 'EcoCivic Central Hub, Green Square Avenue',
    defaultCoordinates: {
        latitude: 11.0168,
        longitude: 76.9558
    },
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyA90pvkeLfhraDXES8REKm_1anHZPhVJBc'
};

export default platformConfig;
