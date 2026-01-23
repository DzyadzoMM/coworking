import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Location } from './location.entity';

@Injectable()
export class LocationService {
  constructor(@InjectRepository(Location) private repo: Repository<Location>) {}
  
  async create(name: string, address: string, description?: string, image?: string){
    const location = this.repo.create({ name, address, description, image });
    return this.repo.save(location);
  }
  async findAll() {
    return await this.repo.find();
  }
  async findById(id: number) {
    const location = await this.repo.findOneBy({id});
    if(!location)
      throw new NotFoundException('Локації не існує')
    return  location;
  }
}
