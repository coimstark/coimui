import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { profileSchema } from "#lib/schemas/profile.ts";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(zod4(profileSchema), {
    defaults: {
      fullName: "",
      email: "",
      role: "developer",
      weeklyDigest: true,
      acceptTerms: false,
    },
  });
  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(profileSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return message(form, `Saved profile for ${form.data.fullName} (${form.data.role}).`);
  },
};
