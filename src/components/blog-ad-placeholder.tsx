type BlogAdPlaceholderProps = {
  placement: "list" | "article";
};

export function BlogAdPlaceholder({ placement }: BlogAdPlaceholderProps) {
  return (
    <aside className={`blog-ad-placeholder blog-ad-placeholder-${placement}`} aria-label="Advertisement placeholder">
      <span className="blog-ad-placeholder-label">ADVERTISEMENT</span>
      <strong>Responsive ad space</strong>
      <small>Google AdSense placement placeholder</small>
    </aside>
  );
}
