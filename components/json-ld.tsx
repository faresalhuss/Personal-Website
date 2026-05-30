export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Schema content is built server-side from trusted constants.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
