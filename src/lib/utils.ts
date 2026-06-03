import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = (path: string) => {
  const hostname = window.location.hostname;
  const isLocal = 
    hostname === "localhost" || 
    hostname === "127.0.0.1" || 
    hostname === "::1" ||
    hostname.startsWith("192.168.") || 
    hostname.startsWith("10.") ||
    hostname.startsWith("172.") ||
    hostname.endsWith(".local") ||
    window.location.port !== "";
  const base = isLocal ? "" : "https://sws-member-backend.vercel.app";
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};
