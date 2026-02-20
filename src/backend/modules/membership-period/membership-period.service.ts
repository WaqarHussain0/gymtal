import { CreateMembershipPeriodDto } from "./dto/create-membership-period.dto";
import MembershipPeriodEntity from "./entity/MembershipPeriod.entity";

export class MembershipPeriodService {
    private readonly membershipEntity = MembershipPeriodEntity;

    async createMembershipPeriod(data: CreateMembershipPeriodDto) {
        const period = await this.membershipEntity.create(data);
        return period;
    }

    async findLatestByUserId(userId: string) {
        return this.membershipEntity
            .findOne({ userId })
            .sort({ endDate: -1 });
    }
}
