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
}

export const platformConfig: PlatformConfig = {
    appName: 'CivicConnect',
    tagline: 'Report. Resolve. Improve Your Community.',
    orgName: 'Municipal Public Works & Administration',
    city: 'Metropolitan City',
    region: 'Central Municipal District',
    country: 'Municipal Region',
    supportEmail: 'support@civic-connect.org',
    supportPhone: '+1 (800) 555-CIVIC',
    officeAddress: 'Municipal Administration Building, Civic Center Square',
    defaultCoordinates: {
        latitude: 11.0168,
        longitude: 76.9558
    }
};

export default platformConfig;
