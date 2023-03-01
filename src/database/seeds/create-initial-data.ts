import { User } from '../../users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    await userRepository.save({
      email: 'ggg@gmail.com',
      firstName: 'sfvs',
      lastName: 'wdwdwd',
      nickname: 'hihi',
    });
  }
}
