import { describe, expect, it } from "vitest";
import { createZodValidator, type StandardSchemaLike, type ZodSchemaLike } from "./index.js";

describe("createZodValidator adapter", () => {
  it("maps .safeParse() issues into flat field errors without importing zod in core", () => {
    const mockZod: ZodSchemaLike<{ email: string; profile: { age: number } }> = {
      safeParse(input: unknown) {
        const v = input as { email?: string; profile?: { age?: number } };
        const issues = [];
        if (!v?.email || !v.email.includes("@")) {
          issues.push({ path: ["email"], message: "Invalid email" });
        }
        if ((v?.profile?.age ?? 0) < 18) {
          issues.push({ path: ["profile", "age"], message: "Must be 18+" });
        }
        return issues.length > 0
          ? { success: false, error: { issues } }
          : { success: true, data: v as { email: string; profile: { age: number } } };
      },
    };

    const validator = createZodValidator(mockZod);
    const bad = validator.validate({ email: "invalid", profile: { age: 15 } });
    expect(bad.success).toBe(false);
    expect(bad.errors).toEqual({
      email: "Invalid email",
      "profile.age": "Must be 18+",
    });
    expect(validator.validateField("email", { email: "ok@coimui.dev", profile: { age: 25 } })).toBeUndefined();

    const good = validator.validate({ email: "ok@coimui.dev", profile: { age: 25 } });
    expect(good.success).toBe(true);
    expect(good.data?.email).toBe("ok@coimui.dev");
  });

  it("supports Standard Schema v1 validation", () => {
    const std: StandardSchemaLike<{ name: string }> = {
      "~standard": {
        validate(input: unknown) {
          const obj = input as { name?: string };
          if (!obj?.name) {
            return { issues: [{ path: [{ key: "name" }], message: "Required" }] };
          }
          return { value: { name: obj.name } };
        },
      },
    };

    const validator = createZodValidator(std);
    expect(validator.validate({}).errors.name).toBe("Required");
    expect(validator.validate({ name: "CoimUI" }).success).toBe(true);
  });
});
