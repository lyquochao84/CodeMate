const { hash, compare } = require('bcryptjs');

async function hashPassword(password) {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
}

async function verifyPassword(password, hashedPassword) {
    const isValid = await compare(password, hashedPassword);
    return isValid;
}   

module.exports = { hashPassword, verifyPassword };