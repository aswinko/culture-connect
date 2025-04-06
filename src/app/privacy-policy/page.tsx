import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
    return (
        <>
        <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-600">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="text-gray-600">
            We collect personal data, such as your name, email, and usage details, to improve our services.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
          <p className="text-gray-600">
            Your information is used for account management, service improvement, and security purposes.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Sharing</h2>
          <p className="text-gray-600">
            We do not sell your data. However, we may share it with trusted service providers for analytics and security.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Security Measures</h2>
          <p className="text-gray-600">
            We implement strong security measures to protect your data from unauthorized access.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal data. Contact us for assistance.
          </p>
        </section>
  
        <footer className="mt-10 text-gray-500 text-sm">
          <p>Last updated: March 2025</p>
        </footer>
      </main>
      <Footer />
      </>
    );
  }
  