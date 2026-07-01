import Link from "next/link";

export default function RootNotFound() {
  return <main id="main-content"><section className="content-page content-header"><h1>Page not found</h1><p>The requested page does not exist.</p><Link className="button button-primary" href="/en/">Open Regex Workbench</Link></section></main>;
}
