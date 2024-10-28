import Link from "next/link";
import { Button } from "../components/ui/button";
import HeaderAuth from "../components/headerAuth";
import { HighlightedText } from "../components/HighlightedText";

export default async function Index() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-4 py-8 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl">
      {/* Header and Navigation */}
      <HeaderAuth />
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

      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Transform Your Learning with{" "}
          <HighlightedText>MindHighlights</HighlightedText>
        </h1>
        <p className="text-xl mb-6">
          Organize thoughts, enhance learning, and boost research with
          AI-powered tools.
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="bg-white text-primary hover:bg-gray-100"
        >
          Start Free Trial
        </Button>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            title: "Organize Content",
            description:
              "Intuitive folders for quick access to research and notes.",
            icon: "📁",
          },
          {
            title: "AI-Powered Titles",
            description:
              "Generate insightful titles to enhance your study experience.",
            icon: "🤖",
          },
          {
            title: "For Everyone",
            description:
              "Adaptable for students, researchers, and lifelong learners.",
            icon: "🎓",
          },
        ].map((card, index) => (
          <div
            key={card.title}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-primary"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white relative inline-block">
              {card.title}
              <span className="absolute inset-x-0 bottom-0 h-2 bg-highlight opacity-50" />
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {card.description}
            </p>
          </div>
        ))}
      </section>

      {/* Promotional Video */}
      <section className="flex justify-center items-center mb-12">
        <div className="relative w-full max-w-2xl">
          <video controls className="rounded-lg shadow-lg w-full">
            <source src="/promo-video.mp4" type="video/mp4" />
            <track
              kind="captions"
              srcLang="en"
              label="English"
              src="/captions.vtt"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-primary bg-opacity-20 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner mb-12">
        <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          <HighlightedText>What Our Users Say</HighlightedText>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Transformed my research organization. The AI features are incredibly helpful!",
              author: "Jane Doe",
              role: "PhD Student",
              highlightWords: [
                "Transformed",
                "AI features",
                "incredibly helpful",
              ],
            },
            {
              quote:
                "An essential tool for enhancing study habits. Highly recommended!",
              author: "John Smith",
              role: "Undergraduate",
              highlightWords: [
                "essential tool",
                "enhancing study habits",
                "Highly recommended",
              ],
            },
            {
              quote: "The intuitive design makes organizing thoughts a breeze.",
              author: "Emily Clark",
              role: "Researcher",
              highlightWords: [
                "intuitive design",
                "organizing thoughts",
                "breeze",
              ],
            },
          ].map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                {testimonial.quote.split(" ").map((word, index) => (
                  <span
                    key={`${testimonial.author}-word-${index}`}
                    className="relative inline-block mr-1"
                  >
                    {testimonial.highlightWords.some((hw) =>
                      word.toLowerCase().includes(hw.toLowerCase())
                    ) ? (
                      <>
                        <span className="relative z-10">{word}</span>
                        <span
                          className="absolute inset-0 bg-highlight opacity-40 transform -skew-y-3"
                          style={{
                            clipPath: `polygon(0 ${Math.random() * 20 + 60}%, 100% ${Math.random() * 20 + 60}%, 100% 100%, 0 100%)`,
                          }}
                        />
                      </>
                    ) : (
                      word
                    )}
                  </span>
                ))}
              </p>
              <div className="flex items-center">
                <img
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${testimonial.author}`}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <span className="text-sm font-medium text-primary block">
                    {testimonial.author}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 relative inline-block">
          <span className="absolute inset-x-0 bottom-0 h-3 bg-highlight opacity-50" />
        </h3>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md mx-auto border border-primary">
          <p className="text-4xl font-bold text-primary mb-4">$9/month</p>
          <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>Unlimited Content Folders</li>
            <li>AI-Powered Title Generation</li>
            <li>Seamless Kindle Integration</li>
            <li>Priority Customer Support</li>
          </ul>
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors"
          >
            Start Your Free Trial
          </Button>
          <p className="text-sm text-gray-500 mt-4">No credit card required</p>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center bg-primary text-white py-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Supercharge Your Learning?
        </h2>
        <p className="text-xl mb-6">
          Join thousands of students and researchers using MindHighlights today!
        </p>
        <Link
          href="/sign-up"
          className="inline-block bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Highlighting Concept */}
      <section className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg mb-8">
        <h2 className="text-3xl font-bold mb-4">
          <HighlightedText>Highlight</HighlightedText> What Matters
        </h2>
        <p className="text-xl mb-6">
          Just like you highlight important text in your books, MindHighlights
          helps you
          <HighlightedText className="mx-2">
            emphasize and remember
          </HighlightedText>
          key information in your digital learning journey.
        </p>
        <div className="flex justify-center items-center">
          <span className="text-6xl mr-4">📚</span>
          <span className="text-4xl">➡️</span>
          <span className="text-6xl ml-4">💻</span>
        </div>
      </section>
    </main>
  );
}
