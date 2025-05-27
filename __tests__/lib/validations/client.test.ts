import { createClientSchema, updateClientSchema } from "@/lib/validations/client";

describe("Client Validation Schema", () => {
  describe("createClientSchema", () => {
    it("validates a valid client input", () => {
      const validClient = {
        name: "ACME Corp",
        email: "contact@acme.com",
        phone: "123456789",
        country: "Portugal",
        town: "Lisbon",
        zipCode: "1000-100",
      };

      const result = createClientSchema.safeParse(validClient);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validClient);
      }
    });

    describe("name validation", () => {
      it("requires name to be present", () => {
        const client = {
          name: "",
          email: "contact@acme.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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
        const client = {
          name: undefined,
          email: "contact@acme.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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

    describe("email validation", () => {
      it("requires a valid email format", () => {
        const client = {
          name: "ACME Corp",
          email: "invalid-email",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Invalid email format",
            })
          );
        }
      });

      it("rejects undefined email", () => {
        const client = {
          name: "ACME Corp",
          email: undefined,
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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

    describe("phone validation", () => {
      it("requires phone to be present", () => {
        const client = {
          name: "ACME Corp",
          email: "contact@acme.com",
          phone: "",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Phone number is required",
            })
          );
        }
      });

      it("rejects undefined phone", () => {
        const client = {
          name: "ACME Corp",
          email: "contact@acme.com",
          phone: undefined,
          country: "Portugal",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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

    describe("address validation", () => {
      it("requires country to be present", () => {
        const client = {
          name: "ACME Corp",
          email: "contact@acme.com",
          phone: "123456789",
          country: "",
          town: "Lisbon",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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
        const client = {
          name: "ACME Corp",
          email: "contact@acme.com",
          phone: "123456789",
          country: "Portugal",
          town: "",
          zipCode: "1000-100",
        };

        const result = createClientSchema.safeParse(client);
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
        const client = {
          name: "ACME Corp",
          email: "contact@acme.com",
          phone: "123456789",
          country: "Portugal",
          town: "Lisbon",
          zipCode: "",
        };

        const result = createClientSchema.safeParse(client);
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
  });

  describe("updateClientSchema", () => {
    it("should be identical to createClientSchema", () => {
      expect(updateClientSchema).toBe(createClientSchema);
    });
  });
});
