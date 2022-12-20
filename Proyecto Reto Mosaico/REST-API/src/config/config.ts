export default {
    expiresIn: '15m',
    refresh_expiresIn: '23h',
    secret: process.env.JWT_SECRET || 'somesecrettoken',
    refresh_secret: process.env.JWT_SECRET || 'somesecretrefreshtoken',
    MODO: 'developer',
};
