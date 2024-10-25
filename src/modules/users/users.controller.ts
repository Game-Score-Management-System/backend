import { Controller, Get, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
    // private readonly scoresService: ScoresService,
  ) {}

  @Get('profile/:id')
  getProfile(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getProfile(id);
  }

  @Patch('profile/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('asdasd', updateUserDto);
    return this.usersService.updateProfile(id, updateUserDto);
  }

  @Get('/scores/:id')
  getUserScores(@Param('id', ParseUUIDPipe) id: string) {
    // return this.scoresService.getUserScores(id);
  }

  @Get('admin')
  getAllPlayers() {
    return this.usersService.getAllPlayers();
  }

  @Patch('admin/:id')
  updateUser() {}

  @Delete('admin/:id')
  switchUserStatus() {}
}
