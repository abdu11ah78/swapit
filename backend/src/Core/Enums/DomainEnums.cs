namespace SwapIt.Core.Enums;

public enum UserRole
{
    User = 0,
    Admin = 1
}

public enum ItemStatus
{
    Available = 0,
    InTrade = 1,
    Swapped = 2
}

public enum TradeStatus
{
    Pending = 0,
    Accepted = 1,
    InProgress = 2,
    Completed = 3,
    Disputed = 4,
    Cancelled = 5
}

public enum OfferStatus
{
    Open = 0,
    Countered = 1,
    Accepted = 2,
    Rejected = 3,
    Expired = 4
}

public enum NotificationType
{
    Info = 0,
    NewMessage = 1,
    OfferReceived = 2,
    OfferUpdated = 3,
    OfferAccepted = 4,
    OfferRejected = 5,
    TradeUpdate = 6,
    SmartMatch = 7,
    DisputeUpdate = 8,
    ItemView = 9,
    ItemLiked = 10
}

public enum DisputeStatus
{
    Open = 0,
    UnderReview = 1,
    Resolved = 2,
    Rejected = 3
}
