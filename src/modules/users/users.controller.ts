import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles/roles.guard';
import { Roles } from '@/common/decorators/roles/roles.decorator';
import { roles } from '@/interfaces/role.interface';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(roles.ADMIN)
  @Get('admin')
  getAllPlayers(@Req() req: Request) {
    console.log(req.user);
    return this.usersService.getAllPlayers();
  }

  @Patch('admin/:id')
  updateUser() {}

  @Delete('admin/:id')
  switchUserStatus() {}
}
