import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user)
      throw new ConflictException({
        cause: '중복에러',
        description: '중복되는 이메일입니다.',
      });

    const hashedPassowrd = await bcrypt.hash(password, 5);

    return await this.userRepository.save({
      password: hashedPassowrd,
      email,
      ...rest,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
