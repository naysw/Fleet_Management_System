import { Injectable } from "@nestjs/common";
import { ActivityLogRepository } from "../repositories/ActivityLogRepository";

@Injectable()
export class ActivityLogService {
  constructor(private readonly activityRepository: ActivityLogRepository) {}

  /**
   * create one activity
   *
   * @param params
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
    return await this.activityRepository.createOne({
      logName,
      subjectId,
      subjectType,
      causerId,
      causerType,
      description,
      properties,
      event,
    });
  }
}
