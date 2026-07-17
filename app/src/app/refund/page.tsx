import BusinessPage from "@/components/store-business-page";

export default function RefundPage() {
  return (
    <BusinessPage title="Refund Policy">
      <p>We want you to be completely satisfied with your purchase. If you are not, we are here to help.</p>
      <div>
        <h2 className="text-xl font-semibold">Eligibility</h2>
        <p>Refunds are available within 7 days of delivery. The product must be unused, in original packaging, and accompanied by the receipt.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Non-Returnable Items</h2>
        <p>Personalized items, perishable goods, and products with broken seals are not eligible for return.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Refund Process</h2>
        <p>To initiate a return, contact our support team with your order ID. Once we receive and inspect the item, we will notify you of the approval or rejection of your refund.</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Refund Timeline</h2>
        <p>Approved refunds are processed within 5-7 business days. The funds will be credited back to your original payment method.</p>
      </div>
    </BusinessPage>
  );
}
