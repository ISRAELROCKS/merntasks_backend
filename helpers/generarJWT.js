import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    });
};

export default generarJWT;


// sign metodo que permite generar un json web token