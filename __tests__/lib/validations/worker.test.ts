import { createWorkerSchema, updateWorkerSchema } from "@/lib/validations/worker";

describe("Worker Validation Schemas", () => {
  describe("createWorkerSchema", () => {
    it("validates a valid worker input", () => {
      const validWorker = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: "15.50",
      };

      const result = createWorkerSchema.safeParse(validWorker);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          ...validWorker,
          hourly_rate: 15.5, // Should be transformed to number
        });
      }
    });

    it("validates hourly_rate as number", () => {
      const validWorker = {
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
        hourly_rate: 15.5,
      };

      const result = createWorkerSchema.safeParse(validWorker);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validWorker);
      }
    });

    describe("name validation", () => {
      it("requires name to be present", () => {
        const worker = {
          name: "",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Name is required",
            })
          );
        }
      });
    });

    describe("email validation", () => {
      it("requires a valid email format", () => {
        const worker = {
          name: "John Doe",
          email: "invalid-email",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Invalid email format",
            })
          );
        }
      });
    });

    describe("phone validation", () => {
      it("requires phone to be present", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Phone number is required",
            })
          );
        }
      });
    });

    describe("address validation", () => {
      it("requires country to be present", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Country is required",
            })
          );
        }
      });

      it("requires town to be present", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Town is required",
            })
          );
        }
      });

      it("requires ZIP code to be present", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "ZIP code is required",
            })
          );
        }
      });
    });

    describe("hourly_rate validation", () => {
      it("accepts valid string rate format", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "15.50",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.hourly_rate).toBe(15.5);
        }
      });

      it("accepts valid number rate", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: 15.5,
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.hourly_rate).toBe(15.5);
        }
      });

      it("rejects negative number rates", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: -15.5,
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Rate must be a non-negative number",
            })
          );
        }
      });

      it("rejects invalid string rate formats", () => {
        const worker = {
          name: "John Doe",
          email: "john@example.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
          hourly_rate: "invalid",
        };

        const result = createWorkerSchema.safeParse(worker);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Invalid rate format",
            })
          );
        }
      });
    });
  });

  describe("updateWorkerSchema", () => {
    it("should be identical to createWorkerSchema", () => {
      expect(updateWorkerSchema).toBe(createWorkerSchema);
    });
  });
});
