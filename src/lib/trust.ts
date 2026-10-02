import { isOsiLicense, maintenanceOf, observationFor, OBSERVED_ON } from "@/lib/catalog";
import type { ServerRecord } from "@/lib/types";

export type TrustLine = {
  label: string;
  value: string;
  tone: "recorded" | "caution" | "absent";
};

export function trustReport(server: ServerRecord) {
  const observed = observationFor(server);
  const lines: TrustLine[] = [];
  const cautions: string[] = [...server.warnings];

  lines.push({
    label: "Source",
    value: server.repository ? `Public repository ${server.repository}` : "No public repository recorded",
    tone: server.repository ? "recorded" : "absent",
  });

  if (!observed) {
    lines.push({
      label: "License",
      value: "Not observed",
      tone: "absent",
    });
  } else if (!observed.license || observed.license === "NOASSERTION") {
    lines.push({
      label: "License",
      value: "GitHub reported no SPDX license (NOASSERTION)",
      tone: "caution",
    });
    cautions.push("No SPDX license was detected on the observation date. Read the repository before you redistribute it.");
  } else {
    lines.push({
      label: "License",
      value: isOsiLicense(observed.license) ? `${observed.license}, OSI-style` : observed.license,
      tone: "recorded",
    });
  }

  const maintenance = maintenanceOf(server);
  if (maintenance === "archived") {
    lines.push({ label: "Maintenance", value: "Repository archived", tone: "caution" });
    cautions.push("The repository is archived.");
  } else if (maintenance === "recent" && observed) {
    lines.push({
      label: "Maintenance",
      value: `Pushed ${observed.pushedAt}. Observed ${OBSERVED_ON}.`,
      tone: "recorded",
    });
  } else if (maintenance === "quiet" && observed) {
    lines.push({
      label: "Maintenance",
      value: `Last push ${observed.pushedAt}, which is quiet relative to ${OBSERVED_ON}.`,
      tone: "caution",
    });
  } else {
    lines.push({ label: "Maintenance", value: "No repository observation", tone: "absent" });
  }

  if (observed?.stars != null) {
    lines.push({
      label: "Stars",
      value: `${observed.stars.toLocaleString("en-US")} on the repository. Not an install count, and not a safety score.`,
      tone: "recorded",
    });
  }

  if (observed?.openIssues != null) {
    lines.push({
      label: "Open issues",
      value: String(observed.openIssues),
      tone: "recorded",
    });
  }

  lines.push({
    label: "Transport",
    value: server.transports.join(", "),
    tone: "recorded",
  });

  lines.push({
    label: "Auth",
    value: server.auth.required ? server.auth.note : "No third-party credential recorded.",
    tone: server.auth.required ? "caution" : "recorded",
  });

  const writes = server.tools.filter((tool) => tool.permission !== "read");
  if (writes.length > 0) {
    lines.push({
      label: "Writes",
      value: `${writes.length} transcribed tool${writes.length === 1 ? "" : "s"} can change something.`,
      tone: "caution",
    });
  }

  if (server.publisher === "community") {
    lines.push({
      label: "Publisher",
      value: "Community project. Not the vendor's own server unless the page says otherwise.",
      tone: "caution",
    });
  } else if (server.official) {
    lines.push({
      label: "Publisher",
      value: "Published by the organization that operates the service, or by the reference project.",
      tone: "recorded",
    });
  }

  if (server.repositoryNote) {
    lines.push({ label: "Reading the stars", value: server.repositoryNote, tone: "caution" });
  }

  return {
    observedOn: OBSERVED_ON,
    lines,
    cautions: unique(cautions),
  };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
