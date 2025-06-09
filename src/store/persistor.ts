import CryptoJS from "crypto-js";

const SECRET_KEY = `78b7ebea7af149a7e37d82502ed70ff3`;

export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const persistStore = (key: string, data: any) => {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

export const loadPersistedStore = (key: string) => {
  const encryptedData = localStorage.getItem(key);
  return encryptedData ? decryptData(encryptedData) : null;
};
