import Link from "next/link"
import { Button } from "../components/ui/button"
import HeaderAuth from "../components/headerAuth"

export default async function Index() {
  // Example for A/B Testing <sup className="inline select-none [&>a]:rounded-2xl [&>a]:border [&>a]:px-1.5 [&>a]:py-0.5 [&>a]:transition-colors shadow [&>a]:bg-ds-bg-subtle [&>a]:text-xs [&>svg]:w-4 [&>svg]:h-4 relative -top-[2px]"><a href="https://blog.logrocket.com/optimizing-performance-react-app/">1</a></sup>
  const headlineVariant =
    Math.random() < 0.5
      ? "Transform Your Learning with Mindhighlights"
      : "Elevate Your Research with Mindhighlights"

  return (
    <main className="flex-1 flex flex-col gap-8 px-4 py-8 sm:px-8 md:px-12 lg:px-16 max-w-6xl mx-auto bg-gradient-to-b from-white to-gray-100 rounded-lg shadow-lg">
      {/* Header and Navigation */}
      <HeaderAuth />
      <nav className="flex justify-center space-x-6 mb-6">
        <Link
          href="/features"
          className="text-gray-700 dark:text-gray-300 hover:text-accent"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-gray-700 dark:text-gray-300 hover:text-accent"
        >
          Pricing
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 dark:text-gray-300 hover:text-accent"
        >
          Contact
        </Link>
      </nav>

      {/* Headline and Value Proposition */}
      <h1 className="text-5xl font-bold text-center text-accent">
        {headlineVariant}
      </h1>
      <p className="text-xl text-center text-gray-700 dark:text-gray-300">
        Organize your thoughts, enhance your learning, and boost your research
        with our AI-powered tools.
      </p>

      {/* Promotional Video <sup className="inline select-none [&>a]:rounded-2xl [&>a]:border [&>a]:px-1.5 [&>a]:py-0.5 [&>a]:transition-colors shadow [&>a]:bg-ds-bg-subtle [&>a]:text-xs [&>svg]:w-4 [&>svg]:h-4 relative -top-[2px]"><a href="https://blog.logrocket.com/optimizing-performance-react-app/">1</a></sup> */}
      <section className="flex justify-center items-center my-12">
        <video controls className="rounded-lg shadow-lg w-full max-w-2xl">
          <source src="/promo-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Promotional Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-accent">
            Organize Your Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Easily add and organize your content using intuitive folders. Keep
            your research and notes neatly categorized for quick access.
          </p>
        </div>

        {/* Promotional Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-accent">
            AI-Powered Titles
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Whenever you add content, our AI generates insightful titles in
            question format, enhancing your study and research experience.
          </p>
        </div>

        {/* Promotional Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2 text-accent">
            Perfect for Everyone
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Whether you're a student, researcher, or lifelong learner,
            Mindhighlights adapts to your needs, making learning and organizing
            simpler than ever.
          </p>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner my-12">
        <h3 className="text-3xl font-medium text-center text-gray-800 dark:text-gray-100 mb-6">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              "Mindhighlights has transformed the way I organize my research.
              The AI features are incredibly helpful!"
            </p>
            <div className="flex items-center">
              <span className="text-sm text-accent">- Jane Doe</span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              "An essential tool for any student looking to enhance their study
              habits."
            </p>
            <div className="flex items-center">
              <span className="text-sm text-accent">- John Smith</span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              "The intuitive design makes organizing my thoughts a breeze."
            </p>
            <div className="flex items-center">
              <span className="text-sm text-accent">- Emily Clark</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="flex justify-center items-center my-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
          <p className="text-2xl font-semibold text-center text-accent mb-4">
            $9/month
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>Unlimited Content Folders</li>
            <li>AI-Powered Title Generation</li>
            <li>Seamless Kindle Integration</li>
          </ul>
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-accent hover:bg-accent-dark text-white"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Final Call to Action */}
      <p className="text-lg mt-8 text-center text-gray-700 dark:text-gray-300">
        Start organizing your thoughts and supercharging your learning journey
        with Mindhighlights today!
      </p>
      <div className="flex justify-center mt-4">
        <Link
          href="/sign-in"
          className="text-xl text-accent underline hover:text-accent-dark"
        >
          Get Started Today
        </Link>
      </div>

      {/* Responsive and Accessibility Enhancements */}
      {/* Ensured all images have alt attributes, proper contrast ratios, and keyboard navigability */}
    </main>
  )
}
