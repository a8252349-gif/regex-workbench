export function GuideVisual({ slug, title, description }: { slug: string; title: string; description: string }) {
  const seed = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const nodes = Array.from({ length: 5 }, (_, index) => ({ x: 90 + index * 165, y: 90 + ((seed + index * 37) % 3) * 50 }));
  return (
    <svg className="guide-visual" viewBox="0 0 850 280" role="img" aria-labelledby={`${slug}-title ${slug}-desc`}>
      <title id={`${slug}-title`}>{title}</title>
      <desc id={`${slug}-desc`}>{description}</desc>
      <rect x="1" y="1" width="848" height="278" rx="18" fill="none" stroke="currentColor" />
      {nodes.slice(0, -1).map((node, index) => <line key={`line-${index}`} x1={node.x + 54} y1={node.y + 26} x2={nodes[index + 1].x} y2={nodes[index + 1].y + 26} stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)" />)}
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="currentColor" /></marker></defs>
      {nodes.map((node, index) => <g key={`node-${index}`}><rect x={node.x} y={node.y} width="108" height="54" rx="9" fill="none" stroke="currentColor" strokeWidth="2" /><text x={node.x + 54} y={node.y + 32} textAnchor="middle" fill="currentColor" fontSize="14">{index + 1}</text></g>)}
      <text x="425" y="245" textAnchor="middle" fill="currentColor" fontSize="16">{title.slice(0, 72)}</text>
    </svg>
  );
}
