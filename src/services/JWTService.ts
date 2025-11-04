import * as jwt from 'jsonwebtoken'

interface IJwtdata {
    uid: string
}


const sign = (data:  IJwtdata) => {
    
    if(!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";
    
    return jwt.sign(data,process.env.JWT_SECRET, { expiresIn: '720h' })
}

const verify = (token: string): IJwtdata | "INVALID_TOKEN" | "JWT_SECRET_NOT_FOUND" => {

    if(!process.env.JWT_SECRET) return "JWT_SECRET_NOT_FOUND";

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(typeof(decoded) == "string"){
            return "INVALID_TOKEN"
        }

        return decoded as IJwtdata
        
    } catch (error) {
        return "INVALID_TOKEN"
    }

};


export const JWTService = {
    sign,
    verify
}