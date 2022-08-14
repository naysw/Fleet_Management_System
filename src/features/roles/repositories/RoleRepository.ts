import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    try {
      return await this.prismaService.role.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "findById service error",
      );
    }
  }
}
