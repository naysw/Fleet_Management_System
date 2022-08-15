import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { IS_DEV } from "src/config/constants";
import { PrismaService } from "src/services/PrismaService";

@Injectable()
export class ActivityLogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * create one activity log
   *
   * @param input
   *
   * @returns
   */
  async createOne({
    logName,
    subjectId,
    subjectType,
    causerId,
    causerType,
    description,
    properties,
    event,
  }: {
    logName?: string;
    subjectId?: string;
    subjectType?: string;
    causerId?: string;
    causerType?: string;
    description: string;
    properties?: any;
    event?: string;
  }) {
    try {
      return await this.prismaService.activityLog.create({
        data: {
          subjectId,
          subjectType,
          causerId,
          causerType,
          logName: logName ? logName : "default",
          description,
          properties,
          event,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `activity log createOne error: ${IS_DEV && error}`,
      );
    }
  }
}
