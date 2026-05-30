// lib/auth-utils.ts
import { jwtVerify, decodeJwt } from 'jose';

export interface FirebaseUserProfile {
  uid: string;
  name?: string;
  email?: string;
  picture?: string;
}

export function getUserFromToken(token: string): FirebaseUserProfile | null {
  try {
    const payload = decodeJwt(token);
    return {
      uid: payload.sub as string,
      name: payload.name as string,
      email: payload.email as string,
      picture: payload.picture as string,
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
}