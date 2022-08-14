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
} from "@nestjs/common";
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

  @Get()
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
  ) {
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

  @Post()
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

    if (roleIds) await this.roleService.existsRoleIds(roleIds);

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
  // @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: any) {
    return new ResponseResource({
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      phone: req.user.phone,
      emailVerifiedAt: req.user.emailVerifiedAt,
      phoneVerifiedAt: req.user.phoneVerifiedAt,
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
  // @UseGuards(JwtAuthGuard)
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
  // @UseGuards(JwtAuthGuard)
  async delete(@Param("id", new ParseUUIDPipe()) id: string) {
    await this.userService.findByIdOrFail(id);
    await this.userService.deleteById(id);

    return new ResponseResource(null).setMessage(`User ${id} deleted`);
  }
}
