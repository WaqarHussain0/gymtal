import MemberEntity from "../member/entity/member.entity";
import { CreateUserDto} from "./dto/create-user.dto";
import UserEntity from "./entity/user.entity";
import bcrypt from "bcryptjs";

export class UserService {


    private readonly userEntity = UserEntity;
    private readonly memberEntity = MemberEntity;

    async findByEmail(email: string) {
        return await this.userEntity.findOne({ email: email?.trim()?.toLowerCase() });
    }


    async createUser(payload: CreateUserDto) {


        const { name, email, password, role, phone, gender } = payload;

        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            throw new Error(`User with email ${email} already exists, please use a different email.`);
        }

        let hashedPassword = null;
        
        if (password) {
             hashedPassword = await bcrypt.hash(password, 10);
        }


        return await this.userEntity.create({ name, email, password: hashedPassword, role, phone, gender });
    }

    async updateUser(id: string, payload: Partial<CreateUserDto>) {
        const { name, email, role, phone, gender } = payload;

        const existingUser = await this.findByEmail(email as string);

        if (existingUser &&   existingUser._id.toString() !== id) {
            throw new Error(`User with email ${email} already exists, please use a different email.`);
        }



        return await this.userEntity.findByIdAndUpdate(id, {
            name,
            email,
            role,
            phone,
            gender,
        });
    }


    async findAll({ search, page = 1, limit = 10 }: { search?: string; page?: number; limit?: number }) {
        const query: Record<string, any> = { role: { $ne: 'member' } };
      
        // Search by name or email
        if (search) {
          query['$or'] = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ];
        }
      
        const skip = (page - 1) * limit;
      
        // Count total records
        const totalRecords = await this.userEntity.countDocuments(query);
      
        // Fetch paginated data
        const data = await this.userEntity
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
      
        const totalPages = Math.ceil(totalRecords / limit);
      
        return {
          data,
          meta: {
            page,
            totalRecords,
            totalPages,
          },
        };
      }
      


    async deleteUser(id: string) {
        const session = await this.userEntity.db.startSession();
        session.startTransaction();
      
        try {
          const user = await this.userEntity.findById(id).session(session);
      
          if (!user) {
            throw new Error(`User with id ${id} not found`);
          }
      
          await this.memberEntity.deleteMany({ userId: id }).session(session);
          const deletedUser = await this.userEntity.findByIdAndDelete(id).session(session);
      
          await session.commitTransaction();
          return deletedUser;
        } catch (err) {
          await session.abortTransaction();
          throw err;
        } finally {
          session.endSession();
        }
      }
      
}