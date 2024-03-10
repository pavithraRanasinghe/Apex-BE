import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

/**
 * To generate new JWT token
 * 
 * @param payload Token payload
 * @param keyName Token key
 * @param options Expiration time
 * @returns String token
 */
export const generateToken = (
  payload: Object,
  keyName: 'accessTokenPrivateKey',
  options: SignOptions
) => {
  config.get<string>(keyName);
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });

};

/**
 * To verify token is valid or not
 * 
 * @param token JWT access token
 * @param keyName Token key
 * @returns Payload and options
 */
export const verifyToken = <T>(
  token: string,
  keyName: 'accessTokenPublicKey'
): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      'base64'
    ).toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
