// Encapsula el acceso directo a la base de datos para horarios.
import { FilterQuery } from "mongoose";

import { ISchedule } from "./schedules.model";
import { ScheduleModel } from "./schedules.schema";

export class SchedulesRepository {
  public async create(scheduleData: ISchedule) {
    return ScheduleModel.create(scheduleData);
  }

  public async findAll(filters: FilterQuery<ISchedule> = {}) {
    return ScheduleModel.find(filters).populate("courtId");
  }

  public async findById(id: string) {
    return ScheduleModel.findById(id).populate("courtId");
  }

  public async findOneBySlot(scheduleData: {
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
  }) {
    return ScheduleModel.findOne(scheduleData);
  }

  public async update(id: string, scheduleData: Partial<ISchedule>) {
    return ScheduleModel.findByIdAndUpdate(id, scheduleData, {
      new: true,
      runValidators: true
    }).populate("courtId");
  }
}
