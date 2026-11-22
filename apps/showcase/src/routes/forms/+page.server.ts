import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { showcaseFormSchema } from "#lib/schemas/showcase-form.ts";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const form = await superValidate(
    {
      fullName: "Laura Ellis",
      email: "laura.ellis@coimui.dev",
      organization: "Northstar Engineering",
      seatCount: 45,
      deploymentModel: "cloud",
      releaseWindow: "next-sprint",
      notes: "",
      agreeTerms: true,
    },
    zod4(showcaseFormSchema),
  );

  return { form };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(showcaseFormSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return message(
      form,
      `Provisioning request queued for ${form.data.organization} (${form.data.seatCount} seats).`,
    );
  },
};
