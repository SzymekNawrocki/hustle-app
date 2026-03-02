import AddOfferForm from "@/components/career/AddOfferForm";
import OfferList from "@/components/career/OfferList";
import { getOffers } from "./actions";

export default async function CareerPage() {
  const offers = await getOffers();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-bold text-base-content tracking-tight">Career</h1>
        <p className="text-base-content/60 mt-2 font-medium">Śledź aplikacje i statusy rekrutacji.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddOfferForm />
        </div>
        <div className="lg:col-span-2">
          <OfferList offers={offers} />
        </div>
      </div>
    </div>
  );
}
