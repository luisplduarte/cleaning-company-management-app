import { jobFormSchema, jobUpdateSchema, JobType, JobStatus, statusTransitions } from "@/lib/validations/job";

describe("Job Validation Schemas", () => {
  describe("jobFormSchema", () => {
    it("validates a valid job input", () => {
      const validJob = {
        title: "Office Cleaning",
        description: "Weekly office cleaning service",
        location: "Lisbon",
        type: JobType.COMMERCIAL,
        status: JobStatus.PENDING,
        start_date: "2025-06-01T09:00",
        end_date: "2025-06-01T17:00",
        clientId: "client-123",
        workerId: "worker-123",
      };

      const result = jobFormSchema.safeParse(validJob);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validJob);
      }
    });

    describe("basic field validations", () => {
      const baseJob = {
        title: "Office Cleaning",
        description: "Weekly office cleaning service",
        location: "Lisbon",
        type: JobType.COMMERCIAL,
        status: JobStatus.PENDING,
        start_date: "2025-06-01T09:00",
        end_date: "2025-06-01T17:00",
        clientId: "client-123",
        workerId: "worker-123",
      };

      it.each([
        ["title", ""],
        ["description", ""],
        ["location", ""],
        ["clientId", ""],
        ["workerId", ""],
      ])("requires %s to be present", (field, value) => {
        const job = { ...baseJob, [field]: value };
        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: expect.stringContaining("required"),
            })
          );
        }
      });
    });

    describe("type validation", () => {
      it("accepts valid job types", () => {
        const validTypes = Object.values(JobType);
        validTypes.forEach(type => {
          const job = {
            title: "Office Cleaning",
            description: "Weekly office cleaning service",
            location: "Lisbon",
            type,
            status: JobStatus.PENDING,
            start_date: "2025-06-01T09:00",
            end_date: "2025-06-01T17:00",
            clientId: "client-123",
            workerId: "worker-123",
          };

          const result = jobFormSchema.safeParse(job);
          expect(result.success).toBe(true);
        });
      });

      it("rejects invalid job types", () => {
        const job = {
          title: "Office Cleaning",
          description: "Weekly office cleaning service",
          location: "Lisbon",
          type: "INVALID_TYPE" as JobType,
          status: JobStatus.PENDING,
          start_date: "2025-06-01T09:00",
          end_date: "2025-06-01T17:00",
          clientId: "client-123",
          workerId: "worker-123",
        };

        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_enum_value",
              message: "Invalid enum value. Expected 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL', received 'INVALID_TYPE'",
            })
          );
        }
      });
    });

    describe("status validation", () => {
      it("accepts valid job statuses", () => {
        const validStatuses = Object.values(JobStatus);
        validStatuses.forEach(status => {
          const job = {
            title: "Office Cleaning",
            description: "Weekly office cleaning service",
            location: "Lisbon",
            type: JobType.COMMERCIAL,
            status,
            start_date: "2025-06-01T09:00",
            end_date: "2025-06-01T17:00",
            clientId: "client-123",
            workerId: "worker-123",
          };

          const result = jobFormSchema.safeParse(job);
          expect(result.success).toBe(true);
        });
      });

      it("rejects invalid job statuses", () => {
        const job = {
          title: "Office Cleaning",
          description: "Weekly office cleaning service",
          location: "Lisbon",
          type: JobType.COMMERCIAL,
          status: "INVALID_STATUS" as JobStatus,
          start_date: "2025-06-01T09:00",
          end_date: "2025-06-01T17:00",
          clientId: "client-123",
          workerId: "worker-123",
        };

        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              code: "invalid_enum_value",
              message: "Invalid enum value. Expected 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED', received 'INVALID_STATUS'",
            })
          );
        }
      });
    });

    describe("date validation", () => {
      it("accepts valid datetime format", () => {
        const job = {
          title: "Office Cleaning",
          description: "Weekly office cleaning service",
          location: "Lisbon",
          type: JobType.COMMERCIAL,
          status: JobStatus.PENDING,
          start_date: "2025-06-01T09:00",
          end_date: "2025-06-01T17:00",
          clientId: "client-123",
          workerId: "worker-123",
        };

        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(true);
      });

      it("rejects invalid datetime format", () => {
        const job = {
          title: "Office Cleaning",
          description: "Weekly office cleaning service",
          location: "Lisbon",
          type: JobType.COMMERCIAL,
          status: JobStatus.PENDING,
          start_date: "2025-06-01", // Missing time
          end_date: "2025-06-01", // Missing time
          clientId: "client-123",
          workerId: "worker-123",
        };

        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "Invalid datetime format",
            })
          );
        }
      });

      it("ensures end_date is after start_date", () => {
        const job = {
          title: "Office Cleaning",
          description: "Weekly office cleaning service",
          location: "Lisbon",
          type: JobType.COMMERCIAL,
          status: JobStatus.PENDING,
          start_date: "2025-06-01T17:00",
          end_date: "2025-06-01T09:00", // Before start_date
          clientId: "client-123",
          workerId: "worker-123",
        };

        const result = jobFormSchema.safeParse(job);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "End date must be after start date and dates must be valid",
            })
          );
        }
      });
    });
  });

  describe("jobUpdateSchema", () => {
    const baseUpdate = {
      currentStatus: JobStatus.PENDING,
      status: JobStatus.IN_PROGRESS,
      title: "Updated Office Cleaning",
      description: "Updated description",
      location: "Porto",
      type: JobType.COMMERCIAL,
      start_date: "2025-06-01T10:00",
      end_date: "2025-06-01T18:00",
    };

    it("validates a valid update", () => {
      const result = jobUpdateSchema.safeParse(baseUpdate);
      expect(result.success).toBe(true);
    });

    describe("status transition validation", () => {
      it("validates allowed status transitions", () => {
        Object.entries(statusTransitions).forEach(([currentStatus, allowedTransitions]) => {
          allowedTransitions.forEach(newStatus => {
            const update = {
              currentStatus: currentStatus as JobStatus,
              status: newStatus,
            };

            const result = jobUpdateSchema.safeParse(update);
            expect(result.success).toBe(true);
          });
        });
      });

      it("rejects invalid status transitions", () => {
        const invalidTransitions = [
          { current: JobStatus.PENDING, next: JobStatus.COMPLETED },
          { current: JobStatus.COMPLETED, next: JobStatus.IN_PROGRESS },
          { current: JobStatus.CANCELLED, next: JobStatus.PENDING },
        ];

        invalidTransitions.forEach(({ current, next }) => {
          const update = {
            currentStatus: current,
            status: next,
          };

          const result = jobUpdateSchema.safeParse(update);
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error.issues[0]).toEqual(
              expect.objectContaining({
                message: "Invalid status transition",
              })
            );
          }
        });
      });
    });

    describe("date validation", () => {
      it("accepts valid partial date updates", () => {
        const update = {
          start_date: "2025-06-01T10:00",
        };

        const result = jobUpdateSchema.safeParse(update);
        expect(result.success).toBe(true);
      });

      it("validates date order when both dates are provided", () => {
        const update = {
          start_date: "2025-06-01T17:00",
          end_date: "2025-06-01T10:00", // Before start_date
        };

        const result = jobUpdateSchema.safeParse(update);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0]).toEqual(
            expect.objectContaining({
              message: "End date must be after start date",
            })
          );
        }
      });

      it("allows valid date updates", () => {
        const update = {
          start_date: "2025-06-01T10:00",
          end_date: "2025-06-01T18:00",
        };

        const result = jobUpdateSchema.safeParse(update);
        expect(result.success).toBe(true);
      });
    });

    it("allows partial updates", () => {
      const partialUpdates = [
        { title: "New Title" },
        { description: "New Description" },
        { location: "New Location" },
        { type: JobType.INDUSTRIAL },
      ];

      partialUpdates.forEach(update => {
        const result = jobUpdateSchema.safeParse(update);
        expect(result.success).toBe(true);
      });
    });
  });
});
