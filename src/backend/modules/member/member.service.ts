import { UserService } from "../user/user.service";
import { CreateMemberDto } from "./dto/create-member.dto";
import MemberEntity from "./entity/member.entity";

const userService = new UserService();

export class MemberService {
  private readonly memberEntity = MemberEntity;



  async findAll({
    search,
    page = 1,
    limit = 10,
  }: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const skip = (page - 1) * limit;
  
    // Build match stage
    const match: any = {};
  
    if (search) {
      match.$or = [
        { "userId.name": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
      ];
    }
  
    // Aggregation pipeline
    const dataPipeline = [
      {
        $lookup: {
          from: "users",           // name of the user collection
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },     // because lookup returns array
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          // include member fields
          _id: 1,
          createdAt: 1,
          enrolledDate: 1,
          expiryDate: 1,
          feePaid: 1,
          // include user fields
          "userId.name": 1,
          "userId.email": 1,
          "userId.phone": 1,
          "userId.gender": 1,
        },
      },
    ];
  
    const data = await this.memberEntity.aggregate(dataPipeline);
  
    // Count total matching records
    const countPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      { $unwind: "$userId" },
      { $match: match },
      { $count: "totalRecords" },
    ];
  
    const countResult = await this.memberEntity.aggregate(countPipeline);
    const totalRecords = countResult[0]?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / limit);
  
    return {
      data,
      meta: { page, totalRecords, totalPages },
    };
  }
  

  async deleteMember(id: string) {

    const member = await this.memberEntity.findOne({ _id: id });


    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    return await this.memberEntity.findByIdAndDelete(id);
  }

  async createMember(payload: CreateMemberDto) {

    const { name, email, phone, gender, enrolledDate, expiryDate, feePaid } = payload;


    const user = await userService.createUser({
      name,
      email,
      role: "member",
      phone,
      gender,
    });

    const memberPayload = {
      userId: user._id,
      enrolledDate,
      expiryDate,
      feePaid,
    };


    return await this.memberEntity.create(memberPayload);

  }

  async updateMember(id: string, payload: Partial<CreateMemberDto>) {
    const { email } = payload;

    const member = await this.memberEntity.findOne({ _id: id });

    if (!member) {
      throw new Error(`Member with id ${id} not found`);
    }

    const existingMember = await this.memberEntity.findOne({ email: email?.trim()?.toLowerCase() });
    if (existingMember && existingMember._id.toString() !== id) {
      throw new Error(`Member with email ${email} already exists, please use a different email.`);
    }
    return await this.memberEntity.findByIdAndUpdate(id, payload, { new: true });
  }

}





