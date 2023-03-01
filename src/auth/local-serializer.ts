import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    //super가 필요한 이유는 PassportSerializer를 상속받아 그안에 있는 constructor를 사용할것이기 때문
    super();
  }

  // 로그인에 성공했을떄 세션에 로그인 정보 전체를 저장하는것이 아닌 id만 저장하여 부하를 줄인다.
  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  // serializeUser 함수로 로그인 id를 세션에 저장했다면 그것을 꺼내올때 사용하는기능(req.user 가 필요할떄 꺼내쓰기위함)
  // deserializeUser의 첫번째 인자는 serializeUser에서 return한  user.id와 같은 값이어야함
  async deserializeUser(userId: User['id'], done: CallableFunction) {
    return await this.userRepository
      .findOneOrFail({
        where: { id: userId },
        select: ['id', 'email', 'nickname'],
      })
      .then((user) => {
        done(null, user); //만약 userId로 id를 찾아온다면 req.user 객체로 넘겨짐
      })
      .catch((err) => done(err));
  }
}
