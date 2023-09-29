export const jwtConstants = {
  accessTokenSecret: process.env.accessTokenSecret,
  refreshTokenSecret: process.env.refreshTokenSecret,
  resetTokenSecret: process.env.resetTokenSecret,
  inviteTokenSecret: process.env.inviteTokenSecret,
  accessTokenExpirationTime: '10m',
  refreshTokenExpirationTime: '2h',
  resetTokenExpirationTime: '15m',
  inviteTokenExpirationTime: '24h',
};
