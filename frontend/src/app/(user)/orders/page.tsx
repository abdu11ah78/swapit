"use client"

import React from "react"
import { useTradesQuery, useUpdateTradeStatusMutation } from "@/features/trades/trades.hooks"
import { TradesList } from "@/features/trades/components/TradesList"
import { useCreateDisputeMutation } from "@/features/disputes/disputes.hooks"
import { useSubmitReviewMutation } from "@/features/reviews/reviews.hooks"
import { useAppContext } from "@/context/AppContext"

export default function OrdersPage() {
    const { currentUser } = useAppContext()
    const { data, isLoading, isError } = useTradesQuery()
    const updateTradeStatus = useUpdateTradeStatusMutation()
    const createDispute = useCreateDisputeMutation()
    const submitReview = useSubmitReviewMutation()
    const [selectedTradeId, setSelectedTradeId] = React.useState("")
    const [disputeReason, setDisputeReason] = React.useState("")
    const [disputeEvidence, setDisputeEvidence] = React.useState("")
    const [reviewRating, setReviewRating] = React.useState(5)
    const [reviewComment, setReviewComment] = React.useState("")

    const trades = data?.trades ?? []
    const selectedTrade = trades.find((t) => t.id === selectedTradeId)
    const reviewTargetId =
        selectedTrade
            ? selectedTrade.buyerId === currentUser?.id
                ? selectedTrade.sellerId
                : selectedTrade.buyerId
            : ""

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-[#115e59]">
            <main className="max-w-7xl mx-auto pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-2 italic uppercase">Barter <span className="text-[#4d7c0f] not-italic">Ledger</span></h1>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Protocol Transaction History</p>
                </div>

                {isLoading ? (
                    <p className="text-slate-500 font-bold">Loading trades...</p>
                ) : isError ? (
                    <p className="text-red-500 font-bold">Unable to load trades right now.</p>
                ) : (
                    <>
                        <TradesList
                            trades={trades}
                            isUpdating={updateTradeStatus.isPending}
                            onMarkCompleted={(tradeId) =>
                                updateTradeStatus.mutate({ tradeId, status: "COMPLETED" })
                            }
                        />

                        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white border border-slate-100 rounded-2xl p-6">
                                <h2 className="text-lg font-black mb-4 uppercase tracking-wider">Open Dispute</h2>
                                <select
                                    value={selectedTradeId}
                                    onChange={(e) => setSelectedTradeId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                >
                                    <option value="">Select trade</option>
                                    {trades.map((trade) => (
                                        <option key={trade.id} value={trade.id}>
                                            {trade.id} ({trade.status})
                                        </option>
                                    ))}
                                </select>
                                <textarea
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                    placeholder="Reason for dispute"
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                    rows={3}
                                />
                                <textarea
                                    value={disputeEvidence}
                                    onChange={(e) => setDisputeEvidence(e.target.value)}
                                    placeholder="Evidence (optional)"
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                    rows={2}
                                />
                                <button
                                    disabled={createDispute.isPending || !selectedTradeId || disputeReason.length < 10}
                                    onClick={() =>
                                        createDispute.mutate({
                                            tradeId: selectedTradeId,
                                            reason: disputeReason,
                                            evidence: disputeEvidence || undefined,
                                        })
                                    }
                                    className="px-4 py-2 rounded-xl bg-[#115e59] text-white text-xs font-black uppercase disabled:opacity-60"
                                >
                                    {createDispute.isPending ? "Submitting..." : "Open Dispute"}
                                </button>
                            </div>

                            <div className="bg-white border border-slate-100 rounded-2xl p-6">
                                <h2 className="text-lg font-black mb-4 uppercase tracking-wider">Leave Review</h2>
                                <select
                                    value={selectedTradeId}
                                    onChange={(e) => setSelectedTradeId(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                >
                                    <option value="">Select trade</option>
                                    {trades
                                        .filter((trade) => trade.status === "COMPLETED")
                                        .map((trade) => (
                                            <option key={trade.id} value={trade.id}>
                                                {trade.id}
                                            </option>
                                        ))}
                                </select>
                                <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                />
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Review comment"
                                    className="w-full rounded-xl border border-slate-200 p-3 mb-3"
                                    rows={2}
                                />
                                <button
                                    disabled={submitReview.isPending || !selectedTradeId || !reviewTargetId}
                                    onClick={() =>
                                        submitReview.mutate({
                                            tradeId: selectedTradeId,
                                            targetId: reviewTargetId,
                                            rating: reviewRating,
                                            comment: reviewComment || undefined,
                                        })
                                    }
                                    className="px-4 py-2 rounded-xl bg-[#4d7c0f] text-white text-xs font-black uppercase disabled:opacity-60"
                                >
                                    {submitReview.isPending ? "Submitting..." : "Leave Review"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
