import { CreateUserDto} from "./dto/create-user.dto";
import UserEntity from "./entity/user.entity";
import bcrypt from "bcryptjs";

export class UserService {


    private readonly userEntity = UserEntity;

    async findByEmail(email: string) {
        return await this.userEntity.findOne({ email: email?.trim()?.toLowerCase() });
    }


    async createUser(payload: CreateUserDto) {
        const { name, email, password, role } = payload;

        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            throw new Error(`User with email ${email} already exists, please use a different email.`);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        return await this.userEntity.create({ name, email, password: hashedPassword, role });
    }

    async updateUser(id: string, payload: Partial<CreateUserDto>) {
        console.log(id,'!!!!!!!!!!!!!!!!');
        const { name, email, role } = payload;

        const existingUser = await this.findByEmail(email as string);
        console.log(existingUser?._id,'!!!!!!!!!!!!!!!!');

        if (existingUser &&   existingUser._id.toString() !== id) {
            throw new Error(`User with email ${email} already exists, please use a different email.`);
        }



        return await this.userEntity.findByIdAndUpdate(id, {
            name,
            email,
            role,
        });
    }


    async findAll() {
        return await this.userEntity.find();
    }


    async deleteUser(id: string) {

        const user = await this.userEntity.findOne({ _id: id });


        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return await this.userEntity.findByIdAndDelete(id);
    }
}