import type CryptoJS from 'crypto-js';

export interface Auth {
  password?: string;
  server: string;
  username: string;
}

export interface AuthData {
  hash: CryptoJS.lib.WordArray;
  salt: string;
  server: string;
  username: string;
}
