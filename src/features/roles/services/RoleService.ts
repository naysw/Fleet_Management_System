import { Injectable, NotFoundException } from "@nestjs/common";
import { RoleRepository } from "../repositories/RoleRepository";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async existsRoleIds(ids: string[]) {
    for (const id of ids) {
      await this.findOrFailById(id);
    }
  }

  async findOrFailById(id: string) {
    const role = await this.roleRepository.findById(id);

    if (!role)
      throw new NotFoundException(
        `Role with id ${JSON.stringify(id)} not found`,
      );

    return role;
  }
}
