using Microsoft.EntityFrameworkCore;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    DbSet<Item> Items { get; }
    DbSet<Category> Categories { get; }
    DbSet<CategoryAttribute> CategoryAttributes { get; }
    DbSet<ItemAttributeValue> ItemAttributeValues { get; }
    DbSet<Province> Provinces { get; }
    DbSet<Trade> Trades { get; }
    DbSet<TradeEvent> TradeEvents { get; }
    DbSet<Offer> Offers { get; }
    DbSet<OfferItem> OfferItems { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<Dispute> Disputes { get; }
    DbSet<Review> Reviews { get; }
    DbSet<EmailVerificationToken> EmailVerificationTokens { get; }
    DbSet<Suggestion> Suggestions { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task SeedAsync();
}
