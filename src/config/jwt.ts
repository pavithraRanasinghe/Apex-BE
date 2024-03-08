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