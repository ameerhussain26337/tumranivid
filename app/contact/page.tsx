export default function Contact() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>

        <p className="mb-8 text-gray-600">
          We are happy to hear from you.
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Get in Touch
            </h2>

            <p>
              If you have questions, suggestions, feedback, or
              concerns regarding TumraniVid, please contact us.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Email
            </h2>

            <p>
              You can contact us directly by email:
            </p>

            <a
              href="mailto:atumrani80@gmail.com"
              className="mt-2 inline-block font-medium text-blue-600 hover:underline"
            >
              atumrani80@gmail.com
            </a>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Copyright Concerns
            </h2>

            <p>
              If you believe that content processed through the
              service violates your rights, please contact us with
              sufficient information so that we can review the
              concern.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Response Time
            </h2>

            <p>
              We aim to review legitimate inquiries and respond as
              soon as reasonably possible.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


