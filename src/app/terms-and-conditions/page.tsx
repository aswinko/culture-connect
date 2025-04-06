import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function TermsAndConditions() {
    return (
        <>
        <Navbar />  
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to our platform. By accessing or using our services, you agree to these Terms and Conditions. Please read them carefully.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
          <p className="text-gray-600">
            You agree to use our services responsibly and comply with all applicable laws. Any misuse may result in termination of access.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Privacy & Data</h2>
          <p className="text-gray-600">
            We value your privacy. Our data collection and usage are explained in our <Link href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</Link>.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Limitation of Liability</h2>
          <p className="text-gray-600">
            We are not responsible for any indirect damages arising from the use of our services.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
          <p className="text-gray-600">
            We may update these Terms. Continued use of our services means you accept the changes.
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
  