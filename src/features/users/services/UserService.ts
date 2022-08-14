import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { hashSync } from "bcrypt";
import { CreateUserInput } from "../input/CreateUserInput";
import { FindManyUserQueryInput } from "../input/FindManyUserQueryInput";
import { FindOneUserQueryInput } from "../input/FindOneUserQueryInput";
import { UpdateUserInput } from "../input/UpdateUserInput";
import { UserRepository } from "../repositories/UserRepository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * find many user
   *
   * @param input FindManyUserQueryInput
   * @return
   */
  async findMany({
    take,
    keyword,
    skip,
    include,
    filter,
    select,
    sort,
  }: FindManyUserQueryInput) {
    const users = await this.userRepository.findMany({
      take,
      keyword,
      skip,
      include,
      filter,
      select,
      sort,
    });

    return users.map((user) => this.userResource(user));
  }

  /**
   * find user unique
   *
   * @param id: string
   */
  async findById(id: string) {
    const user = await this.userRepository.findUnique({ id });

    return {
      ...user,
      roles: user.roles.map((role) => role.role),
    };
  }

  /**
   * find user by username
   *
   * @param username string
   * @returns Promise<User>
   */
  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findUnique({ username });
  }

  /**
   * find by id or fail
   *
   * @param id string
   * @returns Promise<User>
   */
  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.userRepository.findUnique({ id });

    if (!user)
      throw new NotFoundException(
        `User not found with id ${JSON.stringify(id)}`,
      );

    return user;
  }

  /**
   * create one user
   *
   * @param input Prisma.UserCreateInput
   * @returns Promise<User>
   */
  async create(
    {
      name,
      username,
      email,
      password,
      roleIds,
    }: Omit<CreateUserInput, "confirmPassword">,
    { include }: FindOneUserQueryInput,
  ): Promise<Omit<User, "password">> {
    const user = await this.userRepository.create(
      {
        name,
        email,
        username,
        password: hashSync(password, 15),
        roleIds,
      },
      { include },
    );

    // TODO assign user to customer role

    return this.userResource(user);
  }

  /**
   * update user
   *
   * @param id
   * @param input
   * @returns
   */
  async update(
    id: string,
    { name, email, password }: UpdateUserInput,
    { include }: FindOneUserQueryInput,
  ) {
    if (email) {
      const emailExists = await this.userRepository.findUnique({ email });

      if (emailExists)
        throw new ConflictException(`email already exits ${email}`);
    }

    const user = await this.userRepository.update(
      id,
      {
        name,
        email: email ? email : undefined,
        password: password ? hashSync(password, 15) : undefined,
      },
      { include },
    );

    return this.userResource(user);
  }

  /**
   * delete user from given id
   *
   * @param id string
   */
  async deleteById(id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  /**
   * map user
   *
   * @param user User
   */
  public userResource({
    id,
    name,
    username,
    email,
    password,
    createdAt,
    updatedAt,
    roles,
  }: any) {
    return {
      id,
      name,
      username,
      email,
      createdAt,
      updatedAt,
      roles: roles && roles.map((role) => role.role),
    };
  }
}
