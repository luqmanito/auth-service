import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { MemberDto } from "src/dto/member.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CustomError } from "src/utils/customError";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async login(body: MemberDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (user && bcrypt.compareSync(body.password, user.password)) {
      const { password, ...result } = user;
      const payload = { username: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload, { secret: "heavenshell" });
      return {
        data: {
          ...result,
          access_token: token,
        },
      };
    }
    throw new CustomError("Invalid email or password", 401);
  }

  async createUser(body: MemberDto) {
    const bcrypt = require("bcryptjs");
    const password = bcrypt.hashSync(body.password, 10);
    await this.prisma.user.create({
      data: {
        email: body.email,
        password,
        role: body.is_admin ? "admin" : "member",
      },
    });
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id : userId },
      select: {
        id: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return user;
  }
}
