import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("UserController", () => {
  let userController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      getUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    userController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("getUserProfile", () => {
    it("should return user data when valid token is provided", async () => {
      const mockUser = {
        id: 1,
        email: "user@example.com",
        role: "member",
        created_at: new Date(),
        updated_at: new Date(),
      };

      (authService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const mockRequest = {
        user: { userId: 1 },
      };

      const result = await userController.getUserProfile(mockRequest);

      expect(result).toEqual(mockUser);
      expect(authService.getUserById).toHaveBeenCalledWith(1);
    });

    it("should throw an error when user is not found", async () => {
      (authService.getUserById as jest.Mock).mockRejectedValue(
        new Error("User not found")
      );

      const mockRequest = {
        user: { userId: 999 },
      };

      await expect(
        userController.getUserProfile(mockRequest)
      ).rejects.toThrowError("User not found");
    });
  });
});
