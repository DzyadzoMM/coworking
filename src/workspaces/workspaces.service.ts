import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { Repository} from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(@InjectRepository(Workspace) private repo: Repository<Workspace>) {}
  
  async create(name: string, type: string, price: number, locationId: number) {
  const workspace = this.repo.create({
    name,
    type,
    price,
    location: { id: locationId } // Передаємо тільки ID локації
  });
  return await this.repo.save(workspace);
}
async findAll() {
    return await this.repo.find();
  }
}
