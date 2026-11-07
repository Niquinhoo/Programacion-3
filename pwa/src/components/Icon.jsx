import glyphs from '../assets/ionicons.json';

export default function Icon({ name, size = 22, className = '' }) {
  return <span aria-hidden="true" className={`icon ${className}`} style={{ fontSize: size }}>{String.fromCodePoint(glyphs[name])}</span>;
}
