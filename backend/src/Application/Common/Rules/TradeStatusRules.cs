using SwapIt.Core.Enums;

namespace SwapIt.Application.Common.Rules;

public static class TradeStatusRules
{
    public static bool CanTransition(TradeStatus current, TradeStatus next)
    {
        return current switch
        {
            TradeStatus.Pending => next is TradeStatus.Accepted or TradeStatus.Cancelled or TradeStatus.Disputed,
            TradeStatus.Accepted => next is TradeStatus.InProgress or TradeStatus.Cancelled or TradeStatus.Disputed,
            TradeStatus.InProgress => next is TradeStatus.Completed or TradeStatus.Cancelled or TradeStatus.Disputed,
            TradeStatus.Disputed => next is TradeStatus.InProgress or TradeStatus.Cancelled or TradeStatus.Completed,
            TradeStatus.Completed => false,
            TradeStatus.Cancelled => false,
            _ => false
        };
    }
}
