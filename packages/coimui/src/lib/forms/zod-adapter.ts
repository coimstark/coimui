export type CoimFieldErrors = Record<string, string | undefined>;

export interface CoimValidationResult<T> {
  success: boolean;
  data?: T;
  errors: CoimFieldErrors;
}

export interface CoimValidator<T> {
  validate: (values: unknown) => CoimValidationResult<T>;
  validateField: (field: keyof T & string, values: unknown) => string | undefined;
}

interface ZodIssueLike {
  path?: ReadonlyArray<PropertyKey>;
  message: string;
}

interface ZodSafeParseFailure {
  success: false;
  error: {
    issues: ZodIssueLike[];
  };
}

interface ZodSafeParseSuccess<T> {
  success: true;
  data: T;
}

export interface ZodSchemaLike<T> {
  safeParse: (input: unknown) => ZodSafeParseSuccess<T> | ZodSafeParseFailure;
}

interface StandardSchemaIssueLike {
  path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>;
  message: string;
}

export interface StandardSchemaLike<T> {
  "~standard": {
    validate: (
      input: unknown,
    ) => { value: T } | { issues: ReadonlyArray<StandardSchemaIssueLike> };
  };
}

function issuePathToKey(path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>): string {
  if (!path || path.length === 0) return "_root";
  return path
    .map((segment) =>
      typeof segment === "object" && segment !== null && "key" in segment
        ? String(segment.key)
        : String(segment),
    )
    .join(".");
}

/**
 * Schema-agnostic validation adapter that bridges Zod schemas (via `.safeParse`)
 * or Standard Schema v1 objects to flat `CoimFieldErrors` without adding a hard
 * runtime dependency on any specific validation library.
 */
export function createZodValidator<T extends Record<string, unknown>>(
  schema: ZodSchemaLike<T> | StandardSchemaLike<T>,
): CoimValidator<T> {
  const validate = (values: unknown): CoimValidationResult<T> => {
    if ("safeParse" in schema && typeof schema.safeParse === "function") {
      const result = schema.safeParse(values);
      if (result.success) {
        return { success: true, data: result.data, errors: {} };
      }
      const errors: CoimFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issuePathToKey(issue.path);
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }
      return { success: false, errors };
    }

    const std = (schema as StandardSchemaLike<T>)["~standard"];
    const out = std.validate(values);
    if ("issues" in out && out.issues) {
      const errors: CoimFieldErrors = {};
      for (const issue of out.issues) {
        const key = issuePathToKey(issue.path);
        if (!errors[key]) {
          errors[key] = issue.message;
        }
      }
      return { success: false, errors };
    }

    return {
      success: true,
      data: ("value" in out ? out.value : values) as T,
      errors: {},
    };
  };

  const validateField = (field: keyof T & string, values: unknown): string | undefined => {
    const res = validate(values);
    return res.errors[field];
  };

  return { validate, validateField };
}
