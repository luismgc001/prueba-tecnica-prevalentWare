import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// export const verifyToken = (token) =>
//   new Promise((resolve, reject) => {
//     jwt.verify(
//       token,
//       getKey,
//       {
//         algorithms: ["RS256"],
//         audience: process.env.AUTH0_AUDIENCE,
//         issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
//       },
//       (err, decoded) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(decoded);
//       }
//     );
//   });


// Crear contexto
const context = async ({ req }) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
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
          resolve(decodedToken);
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
