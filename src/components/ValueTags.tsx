import "../styles/valueTags.css";

interface ValueTagsProps {
  tags: string[];
  className?: string;
}

export function ValueTags({ tags, className }: ValueTagsProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={className ? `value-tags ${className}` : "value-tags"}>
      {tags.map((tag) => (
        <li key={tag} className="value-tag">
          #{tag}
        </li>
      ))}
    </ul>
  );
}
