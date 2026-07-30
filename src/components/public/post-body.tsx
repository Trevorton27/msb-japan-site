// Renders a ContentPost body. Posts migrated from the old site store HTML;
// posts written in the admin are plain text and keep pre-wrap rendering.
export function PostBody({ body }: { body: string }) {
  const isHtml = /^\s*</.test(body);

  if (!isHtml) {
    return (
      <div className="text-charcoal-600 mt-8 max-w-none leading-relaxed whitespace-pre-wrap">
        {body}
      </div>
    );
  }

  return (
    <div
      className="post-body text-charcoal-600 mt-8 max-w-none leading-relaxed"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
