import { JwtPayload } from "jsonwebtoken";
import { SigningKey } from "jwks-rsa";

export interface JwksClient {
    getSigningKey(kid: string, callback: (err: Error | null, key: SigningKey) => void): void;
   }
   
export interface DecodedToken extends JwtPayload {
    sub: string;
    "https://prevalentware.com/roles": string[];
   }
   
export interface Context {
    user: {
      id: string;
      roles: string[];
    };
   }