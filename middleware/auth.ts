import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient, { SigningKey } from "jwks-rsa";

interface JwksClient {
  getSigningKey(kid: string, callback: (err: Error | null, key: SigningKey) => void): void;
 }
 
 interface DecodedToken extends JwtPayload {
  sub: string;
  "https://prevalentware.com/roles": string[];
 }
 
 interface Context {
  user: {
    id: string;
    roles: string[];
  };
 }

const client = jwksClient({
  jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void => {
  client.getSigningKey(header.kid!, (err: Error | null, key?: SigningKey) => {
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
};

// Crear contexto
const context = async ({ req }: { req: { headers: { authorization?: string } } }) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = await new Promise<DecodedToken>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ["RS256"],
          audience: process.env.AUTH0_AUDIENCE,
          issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
        },
        (err, decodedToken) => {
          if (err) reject(err);
          resolve(decodedToken as DecodedToken);
        }
      );
    });

    // Pasar roles y datos del usuario al contexto
    return {
      user: {
        id: decoded.sub,
        roles: decoded["https://prevalentware.com/roles"], // Namespace de los roles
      },
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
};
