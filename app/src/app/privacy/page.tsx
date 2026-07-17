import BusinessPage from "@/components/store-business-page";

export default function PrivacyPage() {
  return (
    <BusinessPage title="Privacy Policy">
      <p>At Phantom Gadgets, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.</p>
      <div>
        <h2 className="text-xl font-semibold">Information We Collect</h2>
        <p>We collect your name, email address, phone number, and delivery address when you create an account or place an order.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">How We Use Your Information</h2>
        <p>We use your information to process orders, send order updates, and improve our services. We do not sell or share your data with third parties for marketing purposes.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Data Security</h2>
        <p>We use SSL encryption and secure payment processors to protect your data. Access to your personal information is restricted to authorized personnel only.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>We use cookies to enhance your browsing experience. You can disable cookies in your browser settings, but some features may not work properly.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>If you have questions about this policy, contact us at privacy@phantomgadgets.store.</p>
      </div>
    </BusinessPage>
  );
}
