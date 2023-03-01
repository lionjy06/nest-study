import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { User } from './entities/user.entity';
import { UserDecorator } from 'src/common/decorator/user.decorator';
import { AuthService } from 'src/auth/local-auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(new NotLoggedInGuard())
  @ApiOperation({
    summary: '로그인인 기능',
    description: '로그인을 통한 유저 auth',
  })
  async login(@UserDecorator() user) {
    // return await this.authService.validateUser(user.email, user.password);
    console.log('hi');
  }

  @UseGuards(LoggedInGuard)
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  async logout(@UserDecorator() user) {
    console.log(user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/findUser')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
