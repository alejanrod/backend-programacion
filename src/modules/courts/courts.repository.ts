// Encapsula el acceso directo a la base de datos para canchas.
import { ICourt } from "./courts.model";
import { CourtModel } from "./courts.schema";

export class CourtsRepository {
  public async create(courtData: ICourt) {
    return CourtModel.create(courtData);
  }

  public async findAll() {
    return CourtModel.find();
  }

  public async findById(id: string) {
    return CourtModel.findById(id);
  }

  public async findByName(name: string) {
    return CourtModel.findOne({ name });
  }

  public async update(id: string, courtData: Partial<ICourt>) {
    return CourtModel.findByIdAndUpdate(id, courtData, {
      new: true,
      runValidators: true
    });
  }

  public async delete(id: string) {
    return CourtModel.findByIdAndDelete(id);
  }
}
