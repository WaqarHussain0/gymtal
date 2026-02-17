import { CreatePlanDto } from "./dto/create-plan.dto";
import PlanEntity from "./entity/plan.entity";

export class PlanService {
  private readonly planEntity = PlanEntity;

  async findByName(name: string) {
    return await this.planEntity.findOne({ name: name?.trim() });
  }

  async createPlan(payload: CreatePlanDto) {
    const { name, duration, price, features } = payload;

    const existingPlan = await this.findByName(name);

    if (existingPlan) {
      throw new Error(
        `Plan with name ${name} already exists, please use a different name.`
      );
    }

    return await this.planEntity.create({
      name: name.trim(),
      duration,
      price,
      features,
    });
  }

  async updatePlan(id: string, payload: Partial<CreatePlanDto>) {
    const { name, duration, price, features } = payload;

    if (name) {
      const existingPlan = await this.findByName(name);

      if (existingPlan && existingPlan._id.toString() !== id) {
        throw new Error(
          `Plan with name ${name} already exists, please use a different name.`
        );
      }
    }

    return await this.planEntity.findByIdAndUpdate(
      id,
      {
        name: name?.trim(),
        duration,
        price,
        features,
      },
      { new: true }
    );
  }

  async findAll() {
    return await this.planEntity.find();
  }

  async deletePlan(id: string) {
    const plan = await this.planEntity.findOne({ _id: id });

    if (!plan) {
      throw new Error(`Plan with id ${id} not found`);
    }

    return await this.planEntity.findByIdAndDelete(id);
  }
}

