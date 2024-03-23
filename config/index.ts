const process = { env: { SERVER_URL: null } };

export const config = {
  serverUrl: process.env.SERVER_URL || '',
  version: '1.15.0',
  format: 'json',
  clientApplication: import.meta.client ? window.origin : 'web',
};
