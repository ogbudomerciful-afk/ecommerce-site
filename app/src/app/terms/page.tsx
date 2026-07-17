import BusinessPage from "@/components/store-business-page";

export default function TermsPage() {
  return (
    <BusinessPage title="Terms and Conditions">
      <p>By using Phantom Gadgets, you agree to the following terms and conditions.</p>
      <div>
        <h2 className="text-xl font-semibold">Use of Site</h2>
        <p>You must be at least 18 years old to use this site. You are responsible for maintaining the confidentiality of your account.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Pricing and Payments</h2>
        <p>All prices are in Nigerian Naira (NGN) and include applicable taxes. We reserve the right to change prices without notice.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Orders</h2>
        <p>We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or suspected fraud.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Intellectual Property</h2>
        <p>All content on this site is the property of Phantom Gadgets and may not be reproduced without permission.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>Phantom Gadgets is not liable for any indirect, incidental, or consequential damages arising from your use of our products or services.</p>
      </div>
    </BusinessPage>
  );
}
