/**
 * Templates re-mount on every navigation, so this CSS fade runs on each route
 * change. It's pure CSS (no JS gate) and collapses to nothing under
 * prefers-reduced-motion, so it never delays the initial LCP.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
