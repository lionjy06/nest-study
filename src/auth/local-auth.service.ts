import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pwd: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) return null;
    console.log(pwd, user.password);
    const result = await bcrypt.compare(pwd, user.password);

    if (result) {
      const { password, ...res } = user;

      return res;
    }
    return null;
  }
}
