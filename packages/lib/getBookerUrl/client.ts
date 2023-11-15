import { getOrgFullOrigin } from "@calcom/ee/organizations/lib/orgDomains";

export const getUserBookerUrlSync = (user: { organization: { slug: string | null } }) => {
  return getOrgFullOrigin(user.organization.slug ?? "");
};

export const getTeamBookerUrlSync = (team: { organization: { slug: string | null } | null }) => {
  return getOrgFullOrigin(team.organization?.slug ?? "");
};
