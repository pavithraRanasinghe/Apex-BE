import jwt, { SignOptions } from 'jsonwebtoken';
import config from 'config';

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
