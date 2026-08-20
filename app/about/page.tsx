export default function About() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">About TumraniVid</h1>

        <p className="mb-8 text-gray-600">
          A simple and user-friendly media processing platform.
        </p>

        <section className="space-y-6 leading-7">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              What is TumraniVid?
            </h2>

            <p>
              TumraniVid is an online tool designed to make media
              processing simple and convenient. Users can submit
              supported media URLs and access available information
              and download options.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Our Goal
            </h2>

            <p>
              Our goal is to provide a fast, simple, and
              user-friendly experience without requiring users to
              install additional software.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Supported Platforms
            </h2>

            <p>
              TumraniVid supports selected media platforms and may
              expand its supported services over time.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Responsible Use
            </h2>

            <p>
              Users are responsible for ensuring that they have the
              necessary rights or permissions to access and use any
              content processed through the service.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl font-semibold">
              Contact Us
            </h2>

            <p>
              For questions, feedback, or other inquiries, please
              contact us at:
            </p>

            <a
              href="mailto:atumrani80@gmail.com"
              className="mt-2 inline-block font-medium text-blue-600 hover:underline"
            >
              atumrani80@gmail.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}


