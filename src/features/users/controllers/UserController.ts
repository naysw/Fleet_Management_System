import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AdminGuard } from "src/features/auth/guards/AdminGuard";
import { JwtAuthGuard } from "src/features/auth/guards/JwtAuthGuard";
import { RoleService } from "src/features/roles/services/RoleService";
import { JoiValidationPipe } from "src/pipe/JoiValidationPipe";
import { ResponseResource } from "src/resources/ResponseResource";
import {
  CreateUserInput,
  createUserInputSchema,
} from "../input/CreateUserInput";
import {
  FindManyUserQueryInput,
  findManyUserQueryInputSchema,
} from "../input/FindManyUserQueryInput";
import {
  FindOneUserQueryInput,
  findOneUserQueryInputSchema,
} from "../input/FindOneUserQueryInput";
// import { JwtAuthGuard } from "../../auth/guards/JwtAuthGuard";
import {
  UpdateUserInput,
  updateUserInputSchema,
} from "../input/UpdateUserInput";
import { UserService } from "../services/UserService";

@Controller({
  path: "/api/users",
  version: "1",
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * find many user
   *
   * @param param0 FindManyUserQueryInput
   * @returns Promise<ResponseResource<User>>
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async findMany(
    @Query(new JoiValidationPipe(findManyUserQueryInputSchema))
    {
      take,
      skip,
      select,
      include,
      sort,
      orderBy,
      filter,
    }: FindManyUserQueryInput,
  ): Promise<ResponseResource<any>> {
    const users = await this.userService.findMany({
      take,
      skip,
      select,
      include,
      sort,
      orderBy,
      filter,
    });

    return new ResponseResource(users);
  }

  /**
   * ceate user
   *
   * @param param0 CreateUserInput
   * @param param1 FindOneUserQueryInput
   * @returns
   */
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body(new JoiValidationPipe(createUserInputSchema))
    {
      name,
      username,
      email,
      password,
      roleIds,
    }: Omit<CreateUserInput, "confirmPassword">,
    @Query(new JoiValidationPipe(findOneUserQueryInputSchema))
    { include }: FindOneUserQueryInput,
  ) {
    const isUserNameExist = await this.userService.findByUsername(username);

    if (isUserNameExist)
      throw new ConflictException(`Username ${username} is already taken`);

    if (roleIds)
      for (const roleId of roleIds) {
        await this.roleService.findByIdOrFail(roleId);
      }

    const user = await this.userService.create(
      {
        name,
        username,
        email,
        password,
        roleIds,
      },
      { include },
    );

    return new ResponseResource(user);
  }

  /**
   * find auth user
   *
   * @param req Request
   * @returns
   */
  @Get("/me")
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: any) {
    return new ResponseResource({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      roles: req.user.roles,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  }

  /**
   * update user
   *
   * @param input UpdateUserInput
   * @param req
   * @returns
   */
  @Patch(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body(new JoiValidationPipe(updateUserInputSchema))
    { name, email }: UpdateUserInput,
    @Query(new JoiValidationPipe(findOneUserQueryInputSchema))
    { include }: FindOneUserQueryInput,
  ): Promise<any> {
    await this.userService.findByIdOrFail(id);

    const user = await this.userService.update(
      id,
      {
        name,
        email,
      },
      { include },
    );

    return new ResponseResource(user);
  }

  /**
   * delete auth user account
   *
   * @return
   */
  @Delete(":id")
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.userService.findByIdOrFail(id);
    await this.userService.deleteById(id);

    return new ResponseResource(null).setMessage(`User ${id} deleted`);
  }
}
