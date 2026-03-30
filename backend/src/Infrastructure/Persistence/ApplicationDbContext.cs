using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Trade> Trades => Set<Trade>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<OfferItem> OfferItems => Set<OfferItem>();
    public DbSet<Dispute> Disputes => Set<Dispute>();
    public DbSet<TradeEvent> TradeEvents => Set<TradeEvent>();
    public DbSet<EmailVerificationToken> EmailVerificationTokens => Set<EmailVerificationToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(x => x.Email).IsUnique();
            entity.Property(x => x.Role).HasConversion<string>().HasDefaultValue(UserRole.User);
            entity.Property(x => x.TrustScore).HasDefaultValue(100d);

            entity.HasMany(x => x.Items).WithOne(x => x.Owner).HasForeignKey(x => x.OwnerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.AuthoredReviews).WithOne(x => x.Author).HasForeignKey(x => x.AuthorId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.ReceivedReviews).WithOne(x => x.Target).HasForeignKey(x => x.TargetId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.Notifications).WithOne(x => x.User).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.SentOffers).WithOne(x => x.Maker).HasForeignKey(x => x.MakerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.CreatedDisputes).WithOne(x => x.Reporter).HasForeignKey(x => x.ReporterId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.ReviewedDisputes).WithOne(x => x.Reviewer).HasForeignKey(x => x.ReviewerId).OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(x => x.EmailTokens).WithOne(x => x.User).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.TradesAsBuyer).WithOne(x => x.Buyer).HasForeignKey(x => x.BuyerId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.TradesAsSeller).WithOne(x => x.Seller).HasForeignKey(x => x.SellerId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Items");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(300);
            entity.Property(x => x.Description).IsRequired();
            entity.Property(x => x.Images).IsRequired();
            entity.Property(x => x.Category).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Condition).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Location).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Status).HasConversion<string>().HasDefaultValue(ItemStatus.Available);
            entity.Property(x => x.LtpValue).HasDefaultValue(0);
            entity.HasMany(x => x.Trades).WithOne(x => x.MainItem).HasForeignKey(x => x.ItemId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.Offers).WithOne(x => x.OfferedItem).HasForeignKey(x => x.OfferedItemId).OnDelete(DeleteBehavior.SetNull);
            entity.HasMany(x => x.OfferLinks).WithOne(x => x.Item).HasForeignKey(x => x.ItemId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Trade>(entity =>
        {
            entity.ToTable("Trades");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Status).HasConversion<string>().HasDefaultValue(TradeStatus.Pending);
            entity.Property(x => x.EscrowHold).HasDefaultValue(false);
            entity.HasMany(x => x.Offers).WithOne(x => x.Trade).HasForeignKey(x => x.TradeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Disputes).WithOne(x => x.Trade).HasForeignKey(x => x.TradeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Lifecycle).WithOne(x => x.Trade).HasForeignKey(x => x.TradeId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Reviews).WithOne(x => x.Trade).HasForeignKey(x => x.TradeId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Offer>(entity =>
        {
            entity.ToTable("Offers");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.OfferedLtp).HasDefaultValue(0);
            entity.Property(x => x.Status).HasConversion<string>().HasDefaultValue(OfferStatus.Open);
            entity.HasIndex(x => new { x.TradeId, x.Status });
            entity.HasIndex(x => x.ExpiresAt);
            entity.HasMany(x => x.Items).WithOne(x => x.Offer).HasForeignKey(x => x.OfferId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.ParentOffer)
                .WithMany(x => x.CounterOffers)
                .HasForeignKey(x => x.ParentOfferId)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("Reviews");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.HasIndex(x => new { x.AuthorId, x.TargetId, x.TradeId }).IsUnique();
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.ToTable("Notifications");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Type).HasConversion<string>();
            entity.Property(x => x.Message).IsRequired();
            entity.Property(x => x.Read).HasDefaultValue(false);
            entity.HasIndex(x => new { x.UserId, x.CreatedAt });
        });

        modelBuilder.Entity<OfferItem>(entity =>
        {
            entity.ToTable("OfferItems");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.HasIndex(x => new { x.OfferId, x.ItemId }).IsUnique();
        });

        modelBuilder.Entity<Dispute>(entity =>
        {
            entity.ToTable("Disputes");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Status).HasConversion<string>().HasDefaultValue(DisputeStatus.Open);
        });

        modelBuilder.Entity<TradeEvent>(entity =>
        {
            entity.ToTable("TradeEvents");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.FromStatus).HasConversion<string>();
            entity.Property(x => x.ToStatus).HasConversion<string>();
            entity.HasIndex(x => new { x.TradeId, x.CreatedAt });
        });

        modelBuilder.Entity<EmailVerificationToken>(entity =>
        {
            entity.ToTable("EmailVerificationTokens");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Token).IsRequired();
            entity.HasIndex(x => x.Token).IsUnique();
            entity.HasIndex(x => new { x.UserId, x.ExpiresAt });
        });
    }
}
