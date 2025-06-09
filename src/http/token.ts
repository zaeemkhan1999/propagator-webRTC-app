import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token: string | undefined): boolean => {
  if (!token) return true;
  const decoded = jwtDecode<any>(token);
  if (decoded.exp < Date.now() / 1000) {
    return true;
  }
  return false;
};
