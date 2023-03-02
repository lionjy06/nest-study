import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // constructor안에 repository를 넣어주는것이 권장사항이나 만약 service를 extends했는데 안될경우에는 constructor밖에 꺼내서 선언해줄수있다.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      // transaction에서는 this.userRepository를 쓰면 transaction이 안걸린다. 이유는 this.repository는 처음 연결시 걸리는거고 transaction을 열때 연결을 하고싶으면 queryRunner.manager.getRepository(엔티티이름).메소드를 해야 연결이된다.
      await queryRunner.manager.getRepository(User).save({
        password: hashedPassowrd,
        email,
        ...rest,
      });
      queryRunner.commitTransaction();
    } catch (e) {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
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

  async findById(myId: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: myId } });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
