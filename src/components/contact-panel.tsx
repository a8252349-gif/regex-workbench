import type { Dictionary } from "@/src/i18n/dictionaries/en";
import { siteConfig } from "@/src/lib/site-config";

export function ContactPanel({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section className="article-section callout" aria-labelledby="contact-channel-heading">
      <h2 id="contact-channel-heading">{dictionary.contact.heading}</h2>
      <p>{dictionary.contact.instructions}</p>
      {siteConfig.contactEmail ? (
        <p><strong>{dictionary.contact.label}:</strong> <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></p>
      ) : (
        <p className="status status-warning">{dictionary.contact.missing}</p>
      )}
    </section>
  );
}
