import BusinessPage from "@/components/store-business-page";

export default function FaqPage() {
  return (
    <BusinessPage title="Frequently Asked Questions">
      <div>
        <h2 className="text-xl font-semibold">Shipping and Delivery</h2>
        <p>We offer same-day delivery in Lagos and Abuja. For other locations, delivery takes 2-5 business days. Shipping fees are calculated at checkout.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Returns and Refunds</h2>
        <p>We accept returns within 7 days of delivery. Items must be in original packaging and unused. Refunds are processed within 5-7 business days after we receive the returned item.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <p>We accept card payments, bank transfers, and mobile money through Flutterwave. All transactions are secure and encrypted.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Warranty</h2>
        <p>Most products come with a 1-year manufacturer warranty. Warranty terms vary by product — check the product page for details.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Order Tracking</h2>
        <p>Once your order is shipped, you will receive a tracking number via email. You can also track your order in the Orders section of your account.</p>
      </div>
    </BusinessPage>
  );
}
