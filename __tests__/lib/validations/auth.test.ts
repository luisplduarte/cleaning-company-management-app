import { signUpSchema, signInSchema } from "@/lib/validations/auth";

describe("Auth Validation Schemas", () => {
  describe("signUpSchema", () => {
    it("validates valid signup data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "Test123!@#",
        confirmPassword: "Test123!@#",
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    describe("name validation", () => {
      it("requires name to be at least 2 characters", () => {
        const data = {
          name: "J",
          email: "john@example.com",
          password: "Test123!@#",
          confirmPassword: "Test123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Name must be at least 2 characters",
            })
          );
        }
      });

      it("rejects empty name", () => {
        const data = {
          name: "",
          email: "john@example.com",
          password: "Test123!@#",
          confirmPassword: "Test123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Name must be at least 2 characters",
            })
          );
        }
      });
    });

    describe("email validation", () => {
      it("requires valid email format", () => {
        const data = {
          name: "John Doe",
          email: "invalid-email",
          password: "Test123!@#",
          confirmPassword: "Test123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Please enter a valid email address",
            })
          );
        }
      });

      it("rejects empty email", () => {
        const data = {
          name: "John Doe",
          email: "",
          password: "Test123!@#",
          confirmPassword: "Test123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Please enter a valid email address",
            })
          );
        }
      });
    });

    describe("password validation", () => {
      it("requires minimum length of 8 characters", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "Test1!",
          confirmPassword: "Test1!",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password must be at least 8 characters",
            })
          );
        }
      });

      it("requires at least one uppercase letter", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "test123!@#",
          confirmPassword: "test123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password must contain at least one uppercase letter",
            })
          );
        }
      });

      it("requires at least one lowercase letter", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "TEST123!@#",
          confirmPassword: "TEST123!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password must contain at least one lowercase letter",
            })
          );
        }
      });

      it("requires at least one number", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "TestTest!@#",
          confirmPassword: "TestTest!@#",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password must contain at least one number",
            })
          );
        }
      });

      it("requires at least one special character", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "TestTest123",
          confirmPassword: "TestTest123",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password must contain at least one special character",
            })
          );
        }
      });
    });

    describe("password confirmation", () => {
      it("requires passwords to match", () => {
        const data = {
          name: "John Doe",
          email: "john@example.com",
          password: "Test123!@#",
          confirmPassword: "Test123!@$",
        };

        const result = signUpSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Passwords do not match",
            })
          );
        }
      });
    });
  });

  describe("signInSchema", () => {
    it("validates valid signin data", () => {
      const validData = {
        email: "john@example.com",
        password: "Test123!@#",
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    describe("email validation", () => {
      it("requires valid email format", () => {
        const data = {
          email: "invalid-email",
          password: "Test123!@#",
        };

        const result = signInSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Please enter a valid email address",
            })
          );
        }
      });

      it("rejects empty email", () => {
        const data = {
          email: "",
          password: "Test123!@#",
        };

        const result = signInSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Please enter a valid email address",
            })
          );
        }
      });
    });

    describe("password validation", () => {
      it("requires password to be present", () => {
        const data = {
          email: "john@example.com",
          password: "",
        };

        const result = signInSchema.safeParse(data);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Password is required",
            })
          );
        }
      });

      it("accepts any non-empty password", () => {
        const data = {
          email: "john@example.com",
          password: "any-password",
        };

        const result = signInSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });
});
