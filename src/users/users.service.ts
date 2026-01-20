import { Injectable, NotFoundException } from '@nestjs/common';
import {User} from './user.entity'
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';

@Injectable()
export class UsersService {
constructor(@InjectRepository(User) private repo: Repository<User>) {}

async create(email: string, pass: string) {
const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash(pass, salt);
const user = this.repo.create({ email, password: hashedPassword });
return this.repo.save(user);
}

async findOneByEmail(email: string) {
return this.repo.findOne({ where: { email } });
}
}