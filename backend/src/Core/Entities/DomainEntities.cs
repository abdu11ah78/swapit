using SwapIt.Core.Enums;

namespace SwapIt.Core.Entities;

public class User(string id, string email)
{
    public string Id { get; set; } = id;
    public string? Name { get; set; }
    public string Email { get; set; } = email;
    public string? PhoneNumber { get; set; }
    public DateTime? EmailVerified { get; set; }
    public string? Image { get; set; }
    public string? PasswordHash { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public double TrustScore { get; set; } = 100d;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Item> Items { get; set; } = new List<Item>();
    public ICollection<Review> AuthoredReviews { get; set; } = new List<Review>();
    public ICollection<Review> ReceivedReviews { get; set; } = new List<Review>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public ICollection<Offer> SentOffers { get; set; } = new List<Offer>();
    public ICollection<Dispute> CreatedDisputes { get; set; } = new List<Dispute>();
    public ICollection<Dispute> ReviewedDisputes { get; set; } = new List<Dispute>();
    public ICollection<EmailVerificationToken> EmailTokens { get; set; } = new List<EmailVerificationToken>();
    public ICollection<Trade> TradesAsBuyer { get; set; } = new List<Trade>();
    public ICollection<Trade> TradesAsSeller { get; set; } = new List<Trade>();
}

public class Item(string id, string title, string description, string images, string categoryId, string condition, string ownerId)
{
    public string Id { get; set; } = id;
    public string Title { get; set; } = title;
    public string Description { get; set; } = description;
    public string Images { get; set; } = images;
    
    public string CategoryId { get; set; } = categoryId;
    public Category Category { get; set; } = null!;

    public string? ProvinceId { get; set; }
    public Province? Province { get; set; }

    public string Condition { get; set; } = condition;
    public string? Location { get; set; } 
    public int LtpValue { get; set; }
    public ItemStatus Status { get; set; } = ItemStatus.Available;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string OwnerId { get; set; } = ownerId;
    public User Owner { get; set; } = null!;

    public ICollection<Trade> Trades { get; set; } = new List<Trade>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<OfferItem> OfferLinks { get; set; } = new List<OfferItem>();
    public ICollection<ItemAttributeValue> AttributeValues { get; set; } = new List<ItemAttributeValue>();
}

public class Category(string id, string name, string icon)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public string Icon { get; set; } = icon;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CategoryAttribute> Attributes { get; set; } = new List<CategoryAttribute>();
    public ICollection<Item> Items { get; set; } = new List<Item>();
}

public class CategoryAttribute(string id, string name, string type, string categoryId)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public string Type { get; set; } = type; // text, number, selection
    public string? Options { get; set; } // JSON string for options
    public bool IsRequired { get; set; }
    
    public string CategoryId { get; set; } = categoryId;
    public Category Category { get; set; } = null!;
    public ICollection<ItemAttributeValue> Values { get; set; } = new List<ItemAttributeValue>();
}

public class ItemAttributeValue(string id, string itemId, string attributeId, string value)
{
    public string Id { get; set; } = id;
    public string ItemId { get; set; } = itemId;
    public Item Item { get; set; } = null!;
    public string AttributeId { get; set; } = attributeId;
    public CategoryAttribute Attribute { get; set; } = null!;
    public string Value { get; set; } = value;
}

public class Province(string id, string name)
{
    public string Id { get; set; } = id;
    public string Name { get; set; } = name;
    public bool IsActive { get; set; } = true;

    public ICollection<Item> Items { get; set; } = new List<Item>();
}

public class Trade(string id, string buyerId, string sellerId, string itemId)
{
    public string Id { get; set; } = id;
    public TradeStatus Status { get; set; } = TradeStatus.Pending;
    public bool EscrowHold { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string BuyerId { get; set; } = buyerId;
    public User Buyer { get; set; } = null!;
    public string SellerId { get; set; } = sellerId;
    public User Seller { get; set; } = null!;

    public string ItemId { get; set; } = itemId;
    public Item MainItem { get; set; } = null!;

    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
    public ICollection<Dispute> Disputes { get; set; } = new List<Dispute>();
    public ICollection<TradeEvent> Lifecycle { get; set; } = new List<TradeEvent>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

public class Offer(string id, string tradeId, string makerId)
{
    public string Id { get; set; } = id;
    public int OfferedLtp { get; set; }
    public string? Message { get; set; }
    public OfferStatus Status { get; set; } = OfferStatus.Open;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string TradeId { get; set; } = tradeId;
    public Trade Trade { get; set; } = null!;
    public string MakerId { get; set; } = makerId;
    public User Maker { get; set; } = null!;
    public string? OfferedItemId { get; set; }
    public Item? OfferedItem { get; set; }
    public ICollection<OfferItem> Items { get; set; } = new List<OfferItem>();

    public string? ParentOfferId { get; set; }
    public Offer? ParentOffer { get; set; }
    public ICollection<Offer> CounterOffers { get; set; } = new List<Offer>();
}

public class Review(string id, int rating, string authorId, string targetId)
{
    public string Id { get; set; } = id;
    public int Rating { get; set; } = rating;
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string AuthorId { get; set; } = authorId;
    public User Author { get; set; } = null!;
    public string TargetId { get; set; } = targetId;
    public User Target { get; set; } = null!;
    public string? TradeId { get; set; }
    public Trade? Trade { get; set; }
}

public class Notification(string id, NotificationType type, string message, string userId)
{
    public string Id { get; set; } = id;
    public NotificationType Type { get; set; } = type;
    public string Message { get; set; } = message;
    public bool Read { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = userId;
    public User User { get; set; } = null!;
}

public class OfferItem(string id, string offerId, string itemId)
{
    public string Id { get; set; } = id;
    public string OfferId { get; set; } = offerId;
    public string ItemId { get; set; } = itemId;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Offer Offer { get; set; } = null!;
    public Item Item { get; set; } = null!;
}

public class Dispute(string id, string reason, string tradeId, string reporterId)
{
    public string Id { get; set; } = id;
    public string Reason { get; set; } = reason;
    public string? Evidence { get; set; }
    public DisputeStatus Status { get; set; } = DisputeStatus.Open;
    public string? Resolution { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string TradeId { get; set; } = tradeId;
    public Trade Trade { get; set; } = null!;
    public string ReporterId { get; set; } = reporterId;
    public User Reporter { get; set; } = null!;
    public string? ReviewerId { get; set; }
    public User? Reviewer { get; set; }
}

public class TradeEvent(string id, string tradeId, TradeStatus toStatus)
{
    public string Id { get; set; } = id;
    public string TradeId { get; set; } = tradeId;
    public TradeStatus? FromStatus { get; set; }
    public TradeStatus ToStatus { get; set; } = toStatus;
    public string? ActorId { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Trade Trade { get; set; } = null!;
}

public class EmailVerificationToken(string id, string token, string userId, DateTime expiresAt)
{
    public string Id { get; set; } = id;
    public string Token { get; set; } = token;
    public string UserId { get; set; } = userId;
    public DateTime ExpiresAt { get; set; } = expiresAt;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}

public class Suggestion(string id, string type, string name, string userId)
{
    public string Id { get; set; } = id;
    public string Type { get; set; } = type; // "Category", "Attribute", etc.
    public string Name { get; set; } = name;
    public bool IsApproved { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = userId;
    public User User { get; set; } = null!;
}
