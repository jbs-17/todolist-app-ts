

import UserModel from "../models/user.model.js";

import * as z from 'zod';
import { comparePassword, hashPassword } from "../utils/password.utils.js";




const UserValidation = z.object({
    email: z.email(),
    password: z.string().min(8)
});

class UserService {

    /**
     * create and save new one user with email and password is required
     * return _id from created and saved user
     */
    async newuser({ email, password }) {
        // validasi 
        await UserValidation.parseAsync({ email, password });

        // buat dan simpan
        const passwordHash = await hashPassword(password);
        const user = await (new UserModel({ email, password: passwordHash })).save();


        // jika berhasil berikan id user
        return {
            success: true,
            user
        }
    }

    async deleteUser({ _id }: { _id: string }) {
        const { deletedCount, acknowledged } = await UserModel.deleteOne({
            _id
        });

        return {
            success: deletedCount === 1 && acknowledged,
            deletedCount,
            acknowledged
        }
    }


    async findById({ _id }: { _id: string }) {
        const user = await UserModel.findById(_id);
        if (user) return {
            success: true,
            user
        }

        return {
            success: false,
            user: null
        }

    }

    async findByEmail({ email }) {
        await z.email().parseAsync(email);

        const user = await UserModel.findOne({ email });

        if (user) return {
            success: false,
            user
        }


        return {
            success: true,
            user: null
        }
    }


    async authenticate({ email, password }: { email: string, password: string }) {
        await UserValidation.parseAsync({ email, password });

        const { success, user } = await this.findByEmail({ email });
        if (!success && !user) {
            return { success: false, user: null }
        };

        const correctPassword = await comparePassword(password, user!.password);
        if (!correctPassword) {
            return { success: false, user: null }
        }

        return { success: true, user: user! };
    }

    async updateEmail({ email, newEmail, password }: { email: string, newEmail: string, password: string }) {
        const zod = await z.object({
            email: z.email(),
            newEmail: z.email(),
            password: z.string().min(8)
        })
            .safeParseAsync({
                email, newEmail, password
            });

        if (!zod.success) {
            return { success: false }
        }

        const authenticated = await this.authenticate({ email, password });
        if (!authenticated.success) return { success: false };


        const { acknowledged, modifiedCount } = await UserModel.updateOne(
            { email },
            { $set: { email: newEmail } });

        if (acknowledged && modifiedCount === 1) return { success: true };

        return {
            success: false
        }


    }


    async updatePassword({ _id, email, password, newPassword }: { _id?: string, email?: string, password: string, newPassword: string }) {
        if (!_id || !email) {
            return {
                success: false
            }
        }

        if (_id) {
            await z.string().min(8).parseAsync(_id);
        } else {
            await z.email().parseAsync(email);
        }

        await z.string().min(8).parseAsync(password);
        await z.string().min(8).parseAsync(newPassword);

        const authenticated = await this.authenticate({ email, password });
        if (!authenticated.success) return { success: false };

        const { acknowledged, modifiedCount } = await UserModel.updateOne(
            { $or: [{ email }, { _id }] },
            { $set: { password: newPassword } });

        if (acknowledged && modifiedCount === 1) return { success: true };

        return {
            success: false
        }

    }


};


export default new UserService();