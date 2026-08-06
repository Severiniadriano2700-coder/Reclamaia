import { Navbar } from "@/components/marketing/navbar"
import { Hero } from "@/components/marketing/hero"
import { Problem } from "@/components/marketing/problem"
import { Solution } from "@/components/marketing/solution"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Stats } from "@/components/marketing/stats"
import { UseCases } from "@/components/marketing/use-cases"
import { ClaimDemo } from "@/components/marketing/claim-demo"
import { Benefits } from "@/components/marketing/benefits"
import { Testimonials } from "@/components/marketing/testimonials"
import { Comparison } from "@/components/marketing/comparison"
import { Pricing } from "@/components/marketing/pricing"
import { Faq } from "@/components/marketing/faq"
import { FinalCta } from "@/components/marketing/final-cta"
import { Footer } from "@/components/marketing/footer"
import { siteConfig } from "@/lib/site"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/favicon.svg`,
      sameAs: [siteConfig.links.twitter, siteConfig.links.linkedin],
    },
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "LegalService",
      operatingSystem: "Web",
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
    },
  ],
}

export default function Home() {
  return (
    <div className="noise-overlay">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Stats />
        <UseCases />
        <ClaimDemo />
        <Benefits />
        <Testimonials />
        <Comparison />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
