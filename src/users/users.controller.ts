import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  ParseIntPipe,
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
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(new NotLoggedInGuard())
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(new LocalAuthGuard())
  @ApiOperation({
    summary: '로그인인 기능',
    description: '로그인을 통한 유저 auth',
  })
  async login(@UserDecorator() user) {
    // return await this.authService.validateUser(user.email, user.password);
    console.log('hi');
  }

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    req.logOut((err) => {
      if (err) res.redirect('/');
      else res.status(201).send('로그아웃 완료');
    });
    res.clearCookie('testSession', { httpOnly: true });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/findUser')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    // parseIntPipe는 string을 number로 변환해준다. param, query, body모두 사용자로부터 넘겨받을때는 '1','2' 이런식으로 string타입이다. 그래서 parseIntPipe를 통해 number로 바꿔주는것이다.
    // parseIntPipe말고도 때에따라 parseArrayPipe같은것도 사용할수있다. parseArrayPipe같이 옵션을 붙일수 있는경우는 new를 앞에 붙여준다. ex. new ParseArrayPipe({items:string, seperator:','})
    return this.usersService.findById(id);
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
