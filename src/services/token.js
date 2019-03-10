import jwt from 'jsonwebtoken';

export default  async function createToken(user, secret, expiresIn)  {
    const { id, email, username, roles } = user;
    return await jwt.sign({ id, email, username, roles }, secret, {
        expiresIn,
    });
}
