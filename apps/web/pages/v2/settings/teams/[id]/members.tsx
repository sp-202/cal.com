import { MembershipRole } from "@prisma/client";
import { useRouter } from "next/router";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Alert } from "@calcom/ui/v2/core";
import Meta from "@calcom/ui/v2/core/Meta";
import { getLayout } from "@calcom/ui/v2/core/layouts/AdminLayout";

import MemberListItem from "@components/v2/settings/MemberListItem";
import { UpgradeToFlexibleProModal } from "@components/v2/settings/UpgradeToFlexibleProModal";

const MembersView = () => {
  const { t } = useLocale();
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: team } = trpc.useQuery(["viewer.teams.get", { teamId: Number(router.query.id) }], {
    onError: () => {
      router.push("/settings");
    },
  });

  return (
    <>
      <Meta title="team_members" description="members_team_description" />
      <div>
        {team && (
          <>
            {team.membership.role === MembershipRole.OWNER &&
            team.membership.isMissingSeat &&
            team.requiresUpgrade ? (
              <Alert
                severity="warning"
                title={t("hidden_team_member_title")}
                message={
                  <>
                    {t("hidden_team_owner_message")} <UpgradeToFlexibleProModal teamId={team.id} />
                  </>
                }
                className="mb-4 "
              />
            ) : (
              <>
                {team.membership.isMissingSeat && (
                  <Alert
                    severity="warning"
                    title={t("hidden_team_member_title")}
                    message={t("hidden_team_member_message")}
                    className="mb-4 "
                  />
                )}
                {team.membership.role === MembershipRole.OWNER && team.requiresUpgrade && (
                  <Alert
                    severity="warning"
                    title={t("upgrade_to_flexible_pro_title")}
                    message={
                      <span>
                        {t("upgrade_to_flexible_pro_message")} <br />
                        <UpgradeToFlexibleProModal teamId={team.id} />
                      </span>
                    }
                    className="mb-4"
                  />
                )}
              </>
            )}
          </>
        )}

        <div>
          <ul className="divide-y divide-gray-200 rounded-md border ">
            {team?.members.map((member) => {
              return <MemberListItem key={member.id} team={team} member={member} />;
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

MembersView.getLayout = getLayout;

export default MembersView;
