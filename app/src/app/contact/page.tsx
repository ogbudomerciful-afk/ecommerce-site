import BusinessPage from "@/components/store-business-page";

export default function ContactPage() {
  return (
    <BusinessPage title="Contact Us">
      <p>We would love to hear from you. Reach out to us through any of the channels below:</p>
      <div className="mt-4 space-y-2">
        <p><strong>Email:</strong> support@phantomgadgets.store</p>
        <p><strong>Phone:</strong> +234 801 234 5678</p>
        <p><strong>Address:</strong> 15A Admiralty Way, Lekki, Lagos, Nigeria</p>
        <p><strong>Hours:</strong> Monday – Friday, 8:00 AM – 6:00 PM WAT</p>
      </div>
      <p className="mt-4">For order inquiries, please include your order ID. We typically respond within 24 hours.</p>
    </BusinessPage>
  );
}
