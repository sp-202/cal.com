import type { Team } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import NoSSR from "@calcom/core/components/NoSSR";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { useParamsWithFallback } from "@calcom/lib/hooks/useParamsWithFallback";
import type { teamMetadataSchema } from "@calcom/prisma/zod-utils";
import { trpc } from "@calcom/trpc/react";
import { Button, Form, Meta, TextField, showToast } from "@calcom/ui";

import { getLayout } from "../../../../../settings/layouts/SettingsLayout";
import LicenseRequired from "../../../../common/components/LicenseRequired";

const paramsSchema = z.object({ id: z.coerce.number() });

const OrgEditPage = () => {
  const params = useParamsWithFallback();
  const input = paramsSchema.safeParse(params);

  if (!input.success) return <div>Invalid input</div>;

  return <OrgEditView orgId={input.data.id} />;
};

const OrgEditView = ({ orgId }: { orgId: number }) => {
  const [org] = trpc.viewer.organizations.adminGet.useSuspenseQuery({ id: orgId });

  return (
    <LicenseRequired>
      <Meta
        title={`Editing organization: ${org.name}`}
        description="Here you can edit a current organization."
      />
      <NoSSR>
        <OrgForm org={org} />
      </NoSSR>
    </LicenseRequired>
  );
};

type FormValues = {
  name: Team["name"];
  slug: Team["slug"];
  metadata: z.infer<typeof teamMetadataSchema>;
};

const OrgForm = ({
  org,
}: {
  org: FormValues & {
    id: Team["id"];
  };
}) => {
  const { t } = useLocale();
  const router = useRouter();
  const utils = trpc.useContext();
  const mutation = trpc.viewer.organizations.adminUpdate.useMutation({
    onSuccess: async () => {
      Promise.all([
        utils.viewer.organizations.adminGetAll.invalidate(),
        utils.viewer.organizations.adminGet.invalidate({
          id: org.id,
        }),
      ]);
      showToast("Organization updated successfully", "success");
      router.replace(`/settings/admin/organizations`);
    },
    onError: (err) => {
      console.error(err.message);
      showToast("There has been an error updating this organization.", "error");
    },
  });

  const form = useForm<FormValues>({
    defaultValues: org,
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      id: org.id,
      ...values,
    });
  };

  return (
    <Form form={form} className="space-y-4" handleSubmit={onSubmit}>
      <TextField label="Name" placeholder="example" required {...form.register("name")} />
      <TextField label="Slug" placeholder="example" required {...form.register("slug")} />
      <p className="text-default mt-2 text-sm">Changing the slug would reconfigure the organization domain</p>
      <TextField
        label="Domain for which invitations are auto-accepted"
        placeholder="abc.com"
        required
        {...form.register("metadata.orgAutoAcceptEmail")}
      />
      <Button type="submit" color="primary" loading={mutation.isLoading}>
        {t("save")}
      </Button>
    </Form>
  );
};

OrgEditPage.getLayout = getLayout;

export default OrgEditPage;
