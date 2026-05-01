using Microsoft.EntityFrameworkCore;
using SwapIt.Application.Common.Interfaces;
using SwapIt.Core.Entities;
using SwapIt.Core.Enums;

namespace SwapIt.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CategoryAttribute> CategoryAttributes => Set<CategoryAttribute>();
    public DbSet<ItemAttributeValue> ItemAttributeValues => Set<ItemAttributeValue>();
    public DbSet<Province> Provinces => Set<Province>();
    public DbSet<Trade> Trades => Set<Trade>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<OfferItem> OfferItems => Set<OfferItem>();
    public DbSet<Dispute> Disputes => Set<Dispute>();
    public DbSet<TradeEvent> TradeEvents => Set<TradeEvent>();
    public DbSet<EmailVerificationToken> EmailVerificationTokens => Set<EmailVerificationToken>();
    public DbSet<Suggestion> Suggestions => Set<Suggestion>();

    public async Task SeedAsync()
    {
        // Ensure database and tables are created before seeding
        await Database.EnsureCreatedAsync();

        // 1. Seed Provinces (States)
        if (!await Provinces.AnyAsync())
        {
            var provinces = new List<Province>
            {
                new(Guid.NewGuid().ToString("N"), "Punjab"),
                new(Guid.NewGuid().ToString("N"), "Sindh"),
                new(Guid.NewGuid().ToString("N"), "KPK"),
                new(Guid.NewGuid().ToString("N"), "Balochistan"),
                new(Guid.NewGuid().ToString("N"), "Gilgit Baltistan")
            };
            Provinces.AddRange(provinces);
            await SaveChangesAsync();
        }

        // 2. Seed Categories and Attributes
        if (!await Categories.AnyAsync())
        {
            var electronics = new Category(Guid.NewGuid().ToString("N"), "Electronics", "Cpu");
            var vehicles = new Category(Guid.NewGuid().ToString("N"), "Vehicles", "Car");
            var realEstate = new Category(Guid.NewGuid().ToString("N"), "Real Estate", "Home");
            var mobiles = new Category(Guid.NewGuid().ToString("N"), "Mobiles", "Smartphone");
            var laptops = new Category(Guid.NewGuid().ToString("N"), "Laptops", "Laptop");
            var homeAppliances = new Category(Guid.NewGuid().ToString("N"), "Home Appliances", "Microwave");
            var furniture = new Category(Guid.NewGuid().ToString("N"), "Furniture", "Sofa");
            var fashion = new Category(Guid.NewGuid().ToString("N"), "Fashion", "Sparkles");
            var pets = new Category(Guid.NewGuid().ToString("N"), "Pets", "Dog");
            var services = new Category(Guid.NewGuid().ToString("N"), "Services", "Briefcase");
            var books = new Category(Guid.NewGuid().ToString("N"), "Books", "HelpCircle");

            Categories.AddRange(electronics, vehicles, realEstate, mobiles, laptops, homeAppliances, furniture, fashion, pets, services, books);
            await SaveChangesAsync();

            // Seed Attributes for Electronics (Refined with Types)
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Type", "selection", electronics.Id) { IsRequired = true, Options = "[\"Mobile\", \"Laptop\", \"Tablet\", \"Camera\", \"Television\", \"Audio\", \"Gaming Console\", \"Fan\", \"AC\", \"Other\"]" },
                new(Guid.NewGuid().ToString("N"), "Brand", "text", electronics.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Model", "text", electronics.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Warranty", "selection", electronics.Id) { Options = "[\"No Warranty\", \"1-6 Months\", \"6-12 Months\", \"More than 1 Year\"]" }
            });

            // Seed Attributes for Vehicles
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Type", "selection", vehicles.Id) { IsRequired = true, Options = "[\"Car\", \"Motorcycle\", \"Truck\", \"Cycle\", \"Spare Parts\"]" },
                new(Guid.NewGuid().ToString("N"), "Make", "text", vehicles.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Model Year", "number", vehicles.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Fuel Type", "selection", vehicles.Id) { Options = "[\"Petrol\", \"Diesel\", \"Electric\", \"Hybrid\", \"CNG\"]" }
            });

            // Seed Attributes for Mobiles
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Type", "selection", mobiles.Id) { IsRequired = true, Options = "[\"Smartphones\", \"Basic Phones\", \"Tablets\", \"Wearables\", \"Accessories\"]" },
                new(Guid.NewGuid().ToString("N"), "Brand", "text", mobiles.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Storage", "selection", mobiles.Id) { Options = "[\"16GB\", \"32GB\", \"64GB\", \"128GB\", \"256GB\", \"512GB\", \"1TB\"]" },
                new(Guid.NewGuid().ToString("N"), "RAM", "selection", mobiles.Id) { Options = "[\"2GB\", \"4GB\", \"6GB\", \"8GB\", \"12GB\", \"16GB\"]" }
            });

            // Seed Attributes for Real Estate
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Type", "selection", realEstate.Id) { IsRequired = true, Options = "[\"House\", \"Apartment\", \"Plot\", \"Commercial\", \"Room\"]" },
                new(Guid.NewGuid().ToString("N"), "Area (Sq Ft)", "number", realEstate.Id),
                new(Guid.NewGuid().ToString("N"), "Bedrooms", "number", realEstate.Id)
            });

            // Seed Attributes for Books
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Genre", "selection", books.Id) { IsRequired = true, Options = "[\"Fiction\", \"Non-Fiction\", \"Educational\", \"Biography\", \"Comic/Manga\", \"Other\"]" },
                new(Guid.NewGuid().ToString("N"), "Condition", "selection", mobiles.Id) { Options = "[\"New\", \"Like New\", \"Used\", \"Old\"]" }
            });

            await SaveChangesAsync();
        }

        // 3. Seed Admin
        if (!await Users.AnyAsync())
        {
            var adminUser = new User(Guid.NewGuid().ToString("N"), "admin@example.com")
            {
                Name = "Admin User",
                Role = UserRole.Admin,
            };
            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "admin123");

            Users.Add(adminUser);
            await SaveChangesAsync();

            // 4. Seed Items (using newly created IDs)
            if (!await Items.AnyAsync())
            {
                var catId = (await Categories.FirstAsync(c => c.Name == "Electronics")).Id;
                var provId = (await Provinces.FirstAsync(p => p.Name == "Punjab")).Id;

                var items = new List<Item>
                {
                    new(Guid.NewGuid().ToString("N"), "iPhone 15 Pro", "Brand new iPhone 15 Pro, 256GB, Blue Titanium.", "[\"https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800\"]", catId, "New", adminUser.Id) 
                    { 
                        LtpValue = 1500,
                        ProvinceId = provId,
                        Location = "Gulberg, Lahore"
                    },
                    new(Guid.NewGuid().ToString("N"), "MacBook Air M2", "MacBook Air M2, 8GB RAM, 256GB SSD. Silver color.", "[\"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800\"]", catId, "Like New", adminUser.Id) 
                    { 
                        LtpValue = 1200,
                        ProvinceId = provId,
                        Location = "DHA Phase 5, Karachi"
                    }
                };
                Items.AddRange(items);
                await SaveChangesAsync();
            }
        }
    }

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

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasMany(x => x.Attributes).WithOne(x => x.Category).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Items).WithOne(x => x.Category).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CategoryAttribute>(entity =>
        {
            entity.ToTable("CategoryAttributes");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Type).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<ItemAttributeValue>(entity =>
        {
            entity.ToTable("ItemAttributeValues");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.HasOne(x => x.Item).WithMany(x => x.AttributeValues).HasForeignKey(x => x.ItemId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Attribute).WithMany(x => x.Values).HasForeignKey(x => x.AttributeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Province>(entity =>
        {
            entity.ToTable("Provinces");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasMany(x => x.Items).WithOne(x => x.Province).HasForeignKey(x => x.ProvinceId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.ToTable("Items");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(300);
            entity.Property(x => x.Description).IsRequired();
            entity.Property(x => x.Images).IsRequired();
            entity.Property(x => x.Condition).IsRequired().HasMaxLength(100);
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

        modelBuilder.Entity<Suggestion>(entity =>
        {
            entity.ToTable("Suggestions");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Type).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
