import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DEFAULT_TAKE, IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";
import { registerInclude, registerOrderBy } from "src/utils/queryBuilder";
import { CreateUserInput } from "../input/CreateUserInput";
import { FindManyUserQueryInput } from "../input/FindManyUserQueryInput";
import { FindOneUserQueryInput } from "../input/FindOneUserQueryInput";
import { UpdateUserInput } from "../input/UpdateUserInput";

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * find many users
   *
   * @param param
   * @returns
   */
  async findMany({
    take,
    skip,
    keyword,
    include,
    select,
    sort,
    orderBy,
  }: FindManyUserQueryInput) {
    try {
      return await this.prismaService.user.findMany({
        where: {
          OR: keyword && [
            {
              name: {
                contains: String(keyword) || undefined,
              },
            },
            {
              email: {
                contains: String(keyword) || undefined,
              },
            },
          ],
        },
        include: {
          roles: registerInclude(include, "roles")
            ? { select: { role: true } }
            : false,
        },
        take: take ? Number(take) : DEFAULT_TAKE,
        skip: skip ? Number(skip) : undefined,
        orderBy: registerOrderBy(orderBy),
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `user findMany error: ${IS_DEV && error}`,
      );
    }
  }

  /**
   * find user by unique
   *
   * @param input
   * @returns
   */
  async findUnique(
    input: Prisma.UserWhereUniqueInput,
    { include }: FindOneUserQueryInput,
  ) {
    try {
      return await this.prismaService.user.findUnique({
        where: input,
        include: {
          roles: registerInclude(include, "roles")
            ? { select: { role: true } }
            : false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `user findUnique error: ${IS_DEV && error}`,
      );
    }
  }

  /**
   * create one user
   *
   * @param input Prisma.UserCreateInput
   * @returns
   */
  async create(
    {
      name,
      email,
      username,
      password,
      roleIds,
    }: Omit<CreateUserInput, "confirmPassword">,
    { include }: FindOneUserQueryInput,
  ) {
    try {
      return await this.prismaService.user.create({
        data: {
          name,
          email,
          username,
          password,
          roles:
            roleIds && roleIds.length > 0
              ? {
                  create: roleIds.map((roleId) => ({
                    role: {
                      connect: { id: roleId },
                    },
                  })),
                }
              : undefined,
        },
        include: {
          roles: registerInclude(include, "roles")
            ? { select: { role: true } }
            : false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `user create error: ${IS_DEV && error}`,
      );
    }
  }

  /**
   * update one user by phone
   *
   * @param input Prisma.UserUpdateInput
   * @returns
   */
  async update(
    id: string,
    { name, email, password }: UpdateUserInput,
    { include }: FindOneUserQueryInput,
  ) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          name,
          email,
          password,
        },
        include: {
          roles: registerInclude(include, "roles")
            ? { select: { role: true } }
            : false,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `user update error: ${IS_DEV && error}`,
      );
    }
  }

  /**
   * delete user by id
   *
   * @param id string
   * @returns
   */
  async deleteById(id: string) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        IS_DEV ? error : "delete user error",
      );
    }
  }
}
