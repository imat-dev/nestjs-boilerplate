import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './../model/users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEvents } from './events/user.events';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await this.comparePassword(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  public async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already taken.');
    }

    const newUser = {
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    };

    const user = await this.userRepository.save(newUser);

    if (user) {
      this.eventEmitter.emit('user.created', user);
    }

    return user;
  }

  public async generateToken(user: User): Promise<string> {
    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });

    return token;
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
