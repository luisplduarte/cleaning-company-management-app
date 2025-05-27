import { createRateSchema } from "@/lib/validations/rate";

describe("Rate Validation Schema", () => {
  describe("createRateSchema", () => {
    it("validates a valid rate input", () => {
      const validRate = {
        name: "Standard Rate",
        description: "Standard hourly rate for cleaning services",
        value: 25.5,
      };

      const result = createRateSchema.safeParse(validRate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validRate);
      }
    });

    describe("name validation", () => {
      it("requires name to be present", () => {
        const rate = {
          name: "",
          description: "Standard hourly rate for cleaning services",
          value: 25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Name is required",
            })
          );
        }
      });

      it("rejects undefined name", () => {
        const rate = {
          name: undefined,
          description: "Standard hourly rate for cleaning services",
          value: 25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_type",
              message: "Required",
            })
          );
        }
      });
    });

    describe("description validation", () => {
      it("requires description to be present", () => {
        const rate = {
          name: "Standard Rate",
          description: "",
          value: 25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Description is required",
            })
          );
        }
      });

      it("rejects undefined description", () => {
        const rate = {
          name: "Standard Rate",
          description: undefined,
          value: 25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_type",
              message: "Required",
            })
          );
        }
      });
    });

    describe("value validation", () => {
      it("requires value to be a number", () => {
        const rate: { name: string; description: string; value: string | number } = {
          name: "Standard Rate",
          description: "Standard hourly rate for cleaning services",
          value: "25.5", // Testing with string value
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_type",
              message: "Expected number, received string",
            })
          );
        }
      });

      it("rejects negative values", () => {
        const rate = {
          name: "Standard Rate",
          description: "Standard hourly rate for cleaning services",
          value: -25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Value must be positive",
            })
          );
        }
      });

      it("accepts zero value", () => {
        const rate = {
          name: "Standard Rate",
          description: "Standard hourly rate for cleaning services",
          value: 0,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(true);
      });

      it("accepts positive decimal values", () => {
        const rate = {
          name: "Standard Rate",
          description: "Standard hourly rate for cleaning services",
          value: 25.5,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(true);
      });

      it("accepts positive integer values", () => {
        const rate = {
          name: "Standard Rate",
          description: "Standard hourly rate for cleaning services",
          value: 25,
        };

        const result = createRateSchema.safeParse(rate);
        expect(result.success).toBe(true);
      });
    });
  });
});
