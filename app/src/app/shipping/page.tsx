import BusinessPage from "@/components/store-business-page";

export default function ShippingPage() {
  return (
    <BusinessPage title="Shipping Policy">
      <p>We offer reliable and fast shipping across Nigeria and select international locations.</p>
      <div>
        <h2 className="text-xl font-semibold">Delivery Times</h2>
        <p>Lagos & Abuja: Same-day delivery for orders placed before 2:00 PM. Other cities: 2-5 business days. International: 7-14 business days.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Shipping Fees</h2>
        <p>Free shipping on orders above ₦50,000. Standard shipping fees range from ₦1,500 to ₦5,000 depending on location and package weight.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Order Tracking</h2>
        <p>You will receive a tracking number once your order is dispatched. Use it to track your package in real-time.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Damaged or Lost Packages</h2>
        <p>If your package arrives damaged or is lost in transit, contact us within 48 hours. We will arrange a replacement or full refund.</p>
      </div>
    </BusinessPage>
  );
}
