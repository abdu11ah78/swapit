"use client";

import { Gavel, RefreshCcw } from "lucide-react";
import { OffersList } from "@/features/offers/components/OffersList";
import {
  useDecideOfferMutation,
  useOffersQuery,
} from "@/features/offers/offers.hooks";

export default function MyOffersPage() {
  const { data, isLoading, isError, refetch } = useOffersQuery();
  const decideOfferMutation = useDecideOfferMutation();
  const offers = data?.offers ?? [];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#115e59] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-2">
            <Gavel className="w-7 h-7 text-[#4d7c0f]" />
            My Offers
          </h1>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-[#115e59] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-slate-500 font-bold">Loading offers...</p>
        ) : isError ? (
          <p className="text-red-500 font-bold">
            Could not fetch offers right now. Please try again.
          </p>
        ) : (
          <OffersList
            offers={offers}
            isUpdating={decideOfferMutation.isPending}
            onAccept={(offerId) =>
              decideOfferMutation.mutate({ offerId, action: "ACCEPT" })
            }
            onReject={(offerId) =>
              decideOfferMutation.mutate({ offerId, action: "REJECT" })
            }
            onCounter={(offerId) =>
              decideOfferMutation.mutate({ offerId, action: "COUNTER" })
            }
          />
        )}
      </div>
    </div>
  );
}
