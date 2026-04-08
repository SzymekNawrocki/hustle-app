import AddOfferForm from "@/components/career/AddOfferForm";
import OfferList from "@/components/career/OfferList";
import { getOffers } from "./actions";

export default async function CareerPage() {
  const offers = await getOffers();

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      <div>
        <h1 className="text-3xl lg:text-5xl font-display text-foreground tracking-tight border-l-4 border-primary pl-4">Career</h1>
        <p className="text-muted-foreground mt-2 font-display tracking-wide text-xs">Track your applications and recruitment status.</p>
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
