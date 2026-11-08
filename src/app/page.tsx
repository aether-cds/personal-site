import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Work from "@/components/sections/Work";
import Hero from "@/components/hero/Hero";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Work />
        <Contact />
      </main>

      <footer className="site-footer">
        <span>
          © {site.name} <span aria-hidden="true">·</span> {site.role}
        </span>
        <span>
          {site.location} <span aria-hidden="true">·</span> {site.coordinates}{" "}
          <span aria-hidden="true">·</span> {site.timezone}
        </span>
        <a href="#top" data-cursor="grow">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  );
}
