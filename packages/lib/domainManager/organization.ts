import { subdomainSuffix } from "@calcom/ee/organizations/lib/orgDomains";

import { deleteDnsRecord, addDnsRecord } from "./deploymentServices/cloudflare";
import {
  deleteDomain as deleteVercelDomain,
  createDomain as createVercelDomain,
} from "./deploymentServices/vercel";

export const deleteDomain = async (slug: string) => {
  const domain = `${slug}.${subdomainSuffix()}`;

  if (process.env.VERCEL_URL) {
    await deleteVercelDomain(domain);
  }

  if (process.env.CLOUDFLARE_DNS) {
    await deleteDnsRecord(domain);
  }
};

export const createDomain = async (slug: string) => {
  const domain = `${slug}.${subdomainSuffix()}`;
  if (process.env.VERCEL_URL) {
    await createVercelDomain(domain);
  }
  if (process.env.CLOUDFLARE_DNS) {
    await addDnsRecord(domain);
  }
};

export const renameDomain = async (oldSlug: string | null, newSlug: string) => {
  // First create new domain so that if it fails we still have the old domain
  await createDomain(newSlug);
  if (oldSlug) {
    await deleteDomain(oldSlug);
  }
};
