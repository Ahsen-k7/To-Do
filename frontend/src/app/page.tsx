import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { UseCases } from "@/components/landing/use-cases";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CallToAction } from "@/components/landing/call-to-action";
import { SiteFooter } from "@/components/landing/site-footer";
import styles from "@/components/landing/landing.module.css";

export default function Home() {
  return (
    <div className={styles.landing}>
      <a href="#main" className={styles.skipLink}>Skip to content</a>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <UseCases />
        <FeaturesSection />
        <HowItWorks />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  );
}
