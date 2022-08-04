export enum InfoForUser {
  BAD_REQUEST = 'Bad request. Id is invalid (not uuid)',
  OLD_PASSWORD_WRONG = 'oldPassowrd is wrong',
  DUBLICATE_DATA = 'The passed identifier already exists',
  ADDED_SUCCESSFULY = 'Added successfully',
  ACCESS_DENIED = 'Access Denied',
  CREDENTIALS_INCORRECT = 'Credentials incorrect',
  REFRESH_TOKEN_MALFORMED = 'Refresh token malformed',
}

export enum Env {
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  JWT_SECRET_REFRESH_KEY = 'JWT_SECRET_REFRESH_KEY',
  TOKEN_EXPIRE_TIME = 'TOKEN_EXPIRE_TIME',
  TOKEN_REFRESH_EXPIRE_TIME = 'TOKEN_REFRESH_EXPIRE_TIME',
}

export const notFound = (type: string) =>
  `${type[0].toUpperCase() + type.slice(1)} not found`;

export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  verbose: 4,
};
