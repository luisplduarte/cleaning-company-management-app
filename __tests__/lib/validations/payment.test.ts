import { createPaymentSchema, updatePaymentStatusSchema } from "@/lib/validations/payment";
import { PaymentStatus } from "@prisma/client";

describe("Payment Validation Schemas", () => {
  describe("createPaymentSchema", () => {
    it("validates a valid payment input", () => {
      const validPayment = {
        amount: 100.50,
        job_id: "test-job-id",
        status: "WAITING_PAYMENT" as PaymentStatus,
      };

      const result = createPaymentSchema.safeParse(validPayment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPayment);
      }
    });

    describe("amount validation", () => {
      it("requires amount to be a number", () => {
        const payment: { amount: unknown; job_id: string; status: PaymentStatus } = {
          amount: "100.50",
          job_id: "test-job-id",
          status: "WAITING_PAYMENT",
        };

        const result = createPaymentSchema.safeParse(payment);
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

      it("requires amount to be positive", () => {
        const payment = {
          amount: -100.50,
          job_id: "test-job-id",
          status: "WAITING_PAYMENT" as PaymentStatus,
        };

        const result = createPaymentSchema.safeParse(payment);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "too_small",
              message: "Number must be greater than 0",
            })
          );
        }
      });

      it("rejects zero amount", () => {
        const payment = {
          amount: 0,
          job_id: "test-job-id",
          status: "WAITING_PAYMENT" as PaymentStatus,
        };

        const result = createPaymentSchema.safeParse(payment);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "too_small",
              message: "Number must be greater than 0",
            })
          );
        }
      });
    });

    describe("job_id validation", () => {
      it("requires job_id to be present", () => {
        const payment = {
          amount: 100.50,
          job_id: "",
          status: "WAITING_PAYMENT" as PaymentStatus,
        };

        const result = createPaymentSchema.safeParse(payment);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "too_small",
              message: "Job ID is required",
            })
          );
        }
      });

      it("rejects undefined job_id", () => {
        const payment = {
          amount: 100.50,
          job_id: undefined,
          status: "WAITING_PAYMENT" as PaymentStatus,
        };

        const result = createPaymentSchema.safeParse(payment);
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

    describe("status validation", () => {
      it("defaults to WAITING_PAYMENT when status is not provided", () => {
        const payment = {
          amount: 100.50,
          job_id: "test-job-id",
        };

        const result = createPaymentSchema.safeParse(payment);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe("WAITING_PAYMENT");
        }
      });

      it("accepts valid status values", () => {
        const validStatuses: PaymentStatus[] = ["WAITING_PAYMENT", "ISSUED", "COMPLETED"];

        validStatuses.forEach(status => {
          const payment = {
            amount: 100.50,
            job_id: "test-job-id",
            status,
          };

          const result = createPaymentSchema.safeParse(payment);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data.status).toBe(status);
          }
        });
      });

      it("rejects invalid status values", () => {
        const payment = {
          amount: 100.50,
          job_id: "test-job-id",
          status: "INVALID_STATUS" as PaymentStatus,
        };

        const result = createPaymentSchema.safeParse(payment);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_enum_value",
              message: "Invalid enum value. Expected 'WAITING_PAYMENT' | 'ISSUED' | 'COMPLETED', received 'INVALID_STATUS'",
            })
          );
        }
      });
    });
  });

  describe("updatePaymentStatusSchema", () => {
    it("validates valid status update", () => {
      const validStatuses: PaymentStatus[] = ["WAITING_PAYMENT", "ISSUED", "COMPLETED"];

      validStatuses.forEach(status => {
        const update = { status };
        const result = updatePaymentStatusSchema.safeParse(update);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.status).toBe(status);
        }
      });
    });

    it("requires status to be present", () => {
      const update = {};
      const result = updatePaymentStatusSchema.safeParse(update);
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

    it("rejects invalid status values", () => {
      const update = { status: "INVALID_STATUS" as PaymentStatus };
      const result = updatePaymentStatusSchema.safeParse(update);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]).toEqual(
          expect.objectContaining({
            code: "invalid_enum_value",
            message: "Invalid enum value. Expected 'WAITING_PAYMENT' | 'ISSUED' | 'COMPLETED', received 'INVALID_STATUS'",
          })
        );
      }
    });
  });
});
