import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './local-auth.service';
import { LocalStrategy } from './local-strategy';
import { LocalSerializer } from './local-serializer';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [AuthService, LocalStrategy, LocalSerializer, UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    //session:true면 session에 저장되는거고 쿠키 쓰려면 false해야한다.
    PassportModule.register({ session: true }),
  ],
})
export class AuthModule {}
