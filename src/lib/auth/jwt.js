import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not defined. Set it in Vercel Environment Variables.",
    );
  }

  return secret;
}

export function signToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
