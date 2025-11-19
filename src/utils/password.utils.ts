import bcryptjs from 'bcryptjs';

export async function hashPassword(password : string){
    return await bcryptjs.hash(password, 10);
};

export async function comparePassword(password : string, hashedPassword : string){
    return await bcryptjs.compare(password, hashedPassword);
}