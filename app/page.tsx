import { Button } from "../components/ui/button"

export default async function Index() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-8 py-12 max-w-5xl mx-auto bg-gradient-to-b from-white to-gray-100  rounded-lg shadow-lg">
      <h1 className="text-5xl font-bold text-center text-accent">
        Welcome to ReView
      </h1>
      <p className="text-xl text-center text-gray-700 dark:text-gray-300">
        Organize your thoughts, enhance your learning, and boost your research
        with ReView.
      </p>

      {/* Promotional Grid */}
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
            Whether you're a student, researcher, or lifelong learner, ReView
            adapts to your needs, making learning and organizing simpler than
            ever.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
        <h3 className="text-3xl font-medium text-center text-gray-800 dark:text-gray-100 mb-4">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Testimonial 1 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300">
              "ReView has transformed the way I organize my research. The AI
              features are incredibly helpful!"
            </p>
            <span className="mt-2 block text-sm text-right text-accent">
              - Jane Doe
            </span>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300">
              "An essential tool for any student looking to enhance their study
              habits."
            </p>
            <span className="mt-2 block text-sm text-right text-accent">
              - John Smith
            </span>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-gray-700 dark:text-gray-300">
              "The intuitive design makes organizing my thoughts a breeze."
            </p>
            <span className="mt-2 block text-sm text-right text-accent">
              - Emily Clark
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-accent">Basic</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">$9/month</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
            <li>Unlimited content folders</li>
            <li>AI-powered title generation</li>
            <li>Email support</li>
          </ul>
          <Button variant="primary" size="lg">
            Choose Basic
          </Button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-accent">Pro</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">$19/month</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
            <li>All Basic features</li>
            <li>Priority support</li>
            <li>Advanced analytics</li>
          </ul>
          <Button variant="primary" size="lg">
            Choose Pro
          </Button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2 text-accent">
            Enterprise
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">$49/month</p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4">
            <li>All Pro features</li>
            <li>Dedicated account manager</li>
            <li>Custom integrations</li>
          </ul>
          <Button variant="primary" size="lg">
            Choose Enterprise
          </Button>
        </div>
      </section>

      <p className="text-lg mt-8 text-center text-gray-700 dark:text-gray-300">
        Start organizing your thoughts and supercharging your learning journey
        with ReView today!
      </p>

      {/* Call to Action Button */}
      <div className="flex justify-center mt-4">
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </div>
    </main>
  )
}
