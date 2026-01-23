import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async create(email: string, pass: string) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }

  async findOneByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    let hashedToken: string | null = null; 
    
    if (refreshToken) {
      hashedToken = await bcrypt.hash(refreshToken, 10);
    }
    
    await this.repo.update(userId, {
      hashedRefreshToken: hashedToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.repo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'hashedRefreshToken'],
    });

    if (!user || !user.hashedRefreshToken) return null;

    const isMatching = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    return isMatching ? user : null;
  }
}
