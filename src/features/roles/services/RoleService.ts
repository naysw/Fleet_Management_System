import { Injectable, NotFoundException } from "@nestjs/common";
import { RoleRepository } from "../repositories/RoleRepository";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  /**
   * find by id or fail
   *
   * @param id string
   * @returns
   */
  async findByIdOrFail(id: string) {
    const role = await this.roleRepository.findById(id);

    if (!role)
      throw new NotFoundException(
        `Role with id ${JSON.stringify(id)} not found`,
      );

    return role;
  }
}
