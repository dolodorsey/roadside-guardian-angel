// Resolves public asset paths correctly across all deployment targets
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
export const LOGO = asset('sos-logo.png');
