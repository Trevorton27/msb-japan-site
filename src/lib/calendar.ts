export function generateICS(event: {
  title: string;
  description?: string;
  location?: string;
  startsAt: Date;
  endsAt: Date;
  url?: string;
}): string {
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MSB Japan//Events//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(event.startsAt)}`,
    `DTEND:${fmt(event.endsAt)}`,
    `SUMMARY:${escapeICS(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
  }
  if (event.location) {
    lines.push(`LOCATION:${escapeICS(event.location)}`);
  }
  if (event.url) {
    lines.push(`URL:${event.url}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}
