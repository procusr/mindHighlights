import { HighlightedText } from "@/components/HighlightedText";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default async function Index() {
  const benefits = [
    "Unlimited Content Folders",
    "AI-Powered Title Generation",
    "Seamless Kindle Integration",
    "Priority Customer Support",
    "Advanced Search Features",
    "Cloud Sync Across Devices",
  ];

  return (
    <main className="flex-1 flex flex-col gap-6 px-4 py-8 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      <nav className="flex justify-center space-x-6 mb-4">
        {[
          { href: "#features", label: "Features" },
          { href: "#pricing", label: "Pricing" },
          { href: "#contact", label: "Contact" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-800 dark:text-gray-200 font-medium px-3 py-2 rounded-md transition-all duration-300 relative group"
          >
            <span className="relative z-10">{item.label}</span>
            <span className="absolute inset-0 bg-highlight opacity-0 group-hover:opacity-50 transition-opacity duration-300 transform -skew-y-3 rounded-md" />
          </Link>
        ))}
      </nav>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <p className="text-sm font-medium text-yellow-800">
          🔥 Special Launch Offer: Get 50% off your first 3 months • Ends in{" "}
          <span className="font-bold">24:00:00</span>
        </p>
      </div>

      <section className="text-center py-16 bg-primary text-white rounded-lg mb-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 px-4">
          <h1 className="text-5xl font-bold mb-6">
            <HighlightedText>Save Hours of Study Time</HighlightedText>
          </h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            Join 10,000+ students who use MindHighlights to learn faster and
            retain more
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/sign-up"
              className="inline-block bg-white text-primary font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <p className="text-sm text-white/80">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          <img
            src="/trusted-by-logos/harvard.png"
            className="h-8"
            alt="Harvard"
          />
          <img
            src="/trusted-by-logos/stanford.png"
            className="h-8"
            alt="Stanford"
          />
          <p className="text-sm text-gray-600">
            Trusted by students from top universities
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Smart Organization",
            description:
              "Automatically organize your research and notes with AI-powered folders",
            icon: "📁",
          },
          {
            title: "AI Insights",
            description:
              "Generate powerful insights and connections across your content",
            icon: "🤖",
          },
          {
            title: "Learn Faster",
            description:
              "Retain more information with our proven learning optimization system",
            icon: "🚀",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="text-5xl mb-6">{card.icon}</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {card.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {card.description}
            </p>
            <Link
              href="/features"
              className="text-primary font-medium mt-4 inline-block hover:underline"
            >
              Learn more →
            </Link>
          </div>
        ))}
      </section>

      <section className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md mx-auto border-2 border-primary hover:transform hover:scale-105 transition-all duration-300 mb-12">
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-bl-lg">
          Most Popular
        </div>
        <p className="text-5xl font-bold text-primary mb-2">$9</p>
        <p className="text-gray-600 mb-6">/month</p>
        <ul className="text-left space-y-4 mb-8">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              {benefit}
            </li>
          ))}
        </ul>
        <Button
          variant="primary"
          size="lg"
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-lg transition-colors"
        >
          Start 14-Day Free Trial
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Cancel anytime • Money-back guarantee
        </p>
      </section>

      <section className="text-center bg-primary text-white py-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-xl mb-6">
          Join thousands of successful students using MindHighlights today!
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-primary hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
        >
          Get Started Now
        </Button>
      </section>
    </main>
  );
}
