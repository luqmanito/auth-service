import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Request,
  UseGuards,
  Param,
} from "@nestjs/common";
import { SUCCESS_STATUS } from "src/dto";
import { MemberDto } from "src/dto/member.dto";
import { JwtAuthGuard } from "src/utils/jwt-auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async createUser(@Body() body: MemberDto) {
    try {
      const data = await this.authService.createUser(body);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: "success create account",
        },
      };
    } catch (error) {
      throw error;
    }
  }
  @Post("login")
  async login(@Body() body: MemberDto) {
    try {
      const { data } = await this.authService.login(body);
      return {
        data: data,
        _meta: {
          code: HttpStatus.CREATED,
          status: SUCCESS_STATUS,
          message: "success login",
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getUserProfile(@Request() req: any) {
    const userId = req.user.userId;
    return this.authService.getUserById(userId);
  }

  @Get(":id")
  async getUserById(@Param("id") id: number) {
    return this.authService.getUserById(id);
  }
}
