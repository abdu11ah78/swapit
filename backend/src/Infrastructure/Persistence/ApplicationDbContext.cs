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
    public DbSet<Message> Messages => Set<Message>();

    public async Task SeedAsync()
    {
        // Ensure database and tables are created before seeding
        await Database.EnsureCreatedAsync();

        // Check if our new taxonomy is already seeded
        var hasNewTaxonomy = await Categories.AnyAsync(c => c.Name == "Tech & Digital Assets");
        if (!hasNewTaxonomy)
        {
            // Clear related tables first to avoid FK constraint violations
            Disputes.RemoveRange(Disputes);
            Reviews.RemoveRange(Reviews);
            Messages.RemoveRange(Messages);
            Offers.RemoveRange(Offers);
            Trades.RemoveRange(Trades);
            ItemAttributeValues.RemoveRange(ItemAttributeValues);
            Items.RemoveRange(Items);
            CategoryAttributes.RemoveRange(CategoryAttributes);
            Categories.RemoveRange(Categories);
            await SaveChangesAsync();
        }

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
            // Level 1: Roots
            var tech = new Category(Guid.NewGuid().ToString("N"), "Tech & Digital Assets", "Smartphone");
            var mobility = new Category(Guid.NewGuid().ToString("N"), "Mobility & Vehicles", "Car");
            var lifestyle = new Category(Guid.NewGuid().ToString("N"), "Lifestyle, Fashion & Luxury", "Sparkles");
            var community = new Category(Guid.NewGuid().ToString("N"), "Community, Hobbies & Kids", "HelpCircle");
            var home = new Category(Guid.NewGuid().ToString("N"), "Home Essentials & General Barter", "Home");

            Categories.AddRange(tech, mobility, lifestyle, community, home);
            await SaveChangesAsync();

            // Level 2: Tech & Digital Assets
            var mobilesWearables = new Category(Guid.NewGuid().ToString("N"), "Mobiles & Wearables", "Smartphone") { ParentId = tech.Id };
            var computersEnt = new Category(Guid.NewGuid().ToString("N"), "Computers & Entertainment", "Laptop") { ParentId = tech.Id };
            var powerSolutions = new Category(Guid.NewGuid().ToString("N"), "Power Solutions", "Zap") { ParentId = tech.Id };

            // Level 2: Mobility & Vehicles
            var automotive = new Category(Guid.NewGuid().ToString("N"), "Automotive", "Car") { ParentId = mobility.Id };
            var twoThreeWheelers = new Category(Guid.NewGuid().ToString("N"), "Two-Wheelers & Three-Wheelers", "Bike") { ParentId = mobility.Id };
            var partsMaint = new Category(Guid.NewGuid().ToString("N"), "Parts & Maintenance", "Settings") { ParentId = mobility.Id };

            // Level 2: Lifestyle, Fashion & Luxury
            var apparel = new Category(Guid.NewGuid().ToString("N"), "Apparel & Wearables", "Shirt") { ParentId = lifestyle.Id };
            var personalCare = new Category(Guid.NewGuid().ToString("N"), "Personal Care & Cosmetics", "Sparkles") { ParentId = lifestyle.Id };
            var jewellery = new Category(Guid.NewGuid().ToString("N"), "Jewellery & Accessories", "Sparkles") { ParentId = lifestyle.Id };

            // Level 2: Community, Hobbies & Kids
            var kidsBaby = new Category(Guid.NewGuid().ToString("N"), "Kids & Baby Gear", "Smile") { ParentId = community.Id };
            var hobbiesRecreation = new Category(Guid.NewGuid().ToString("N"), "Hobbies & Recreation", "BookOpen") { ParentId = community.Id };
            var artsCrafts = new Category(Guid.NewGuid().ToString("N"), "Arts & Crafts", "Palette") { ParentId = community.Id };

            // Level 2: Home Essentials & General Barter
            var homeAppliances = new Category(Guid.NewGuid().ToString("N"), "Home Appliances", "Microwave") { ParentId = home.Id };
            var furnitureDecor = new Category(Guid.NewGuid().ToString("N"), "Furniture & Decor", "Sofa") { ParentId = home.Id };
            var householdTools = new Category(Guid.NewGuid().ToString("N"), "Household & Tools", "Wrench") { ParentId = home.Id };

            Categories.AddRange(
                mobilesWearables, computersEnt, powerSolutions,
                automotive, twoThreeWheelers, partsMaint,
                apparel, personalCare, jewellery,
                kidsBaby, hobbiesRecreation, artsCrafts,
                homeAppliances, furnitureDecor, householdTools
            );
            await SaveChangesAsync();

            // Level 3 (Leaves): Mobiles & Wearables
            var mobilePhones = new Category(Guid.NewGuid().ToString("N"), "Mobile Phones", "Smartphone") { ParentId = mobilesWearables.Id };
            var tablets = new Category(Guid.NewGuid().ToString("N"), "Tablets", "Tablet") { ParentId = mobilesWearables.Id };
            var smartWatches = new Category(Guid.NewGuid().ToString("N"), "Smart Watches", "Watch") { ParentId = mobilesWearables.Id };
            var mobileAccessories = new Category(Guid.NewGuid().ToString("N"), "Accessories", "Smartphone") { ParentId = mobilesWearables.Id };

            // Level 3 (Leaves): Computers & Entertainment
            var computerAccessories = new Category(Guid.NewGuid().ToString("N"), "Computers & Accessories", "Laptop") { ParentId = computersEnt.Id };
            var televisions = new Category(Guid.NewGuid().ToString("N"), "Televisions & Accessories", "Tv") { ParentId = computersEnt.Id };
            var videoAudios = new Category(Guid.NewGuid().ToString("N"), "Video-Audios", "Mic") { ParentId = computersEnt.Id };
            var gamesEnt = new Category(Guid.NewGuid().ToString("N"), "Games & Entertainment", "Gamepad") { ParentId = computersEnt.Id };
            var cameras = new Category(Guid.NewGuid().ToString("N"), "Cameras & Accessories", "Camera") { ParentId = computersEnt.Id };

            // Level 3 (Leaves): Power Solutions
            var generatorsPower = new Category(Guid.NewGuid().ToString("N"), "Generators, UPS & Power Solutions", "Zap") { ParentId = powerSolutions.Id };

            Categories.AddRange(mobilePhones, tablets, smartWatches, mobileAccessories, computerAccessories, televisions, videoAudios, gamesEnt, cameras, generatorsPower);

            // Level 3 (Leaves): Automotive
            var cars = new Category(Guid.NewGuid().ToString("N"), "Cars", "Car") { ParentId = automotive.Id };
            var carsInstallments = new Category(Guid.NewGuid().ToString("N"), "Cars on Installments", "Car") { ParentId = automotive.Id };
            var busesTrucks = new Category(Guid.NewGuid().ToString("N"), "Buses, Vans & Trucks", "Truck") { ParentId = automotive.Id };
            var otherVehicles = new Category(Guid.NewGuid().ToString("N"), "Other Vehicles", "Car") { ParentId = automotive.Id };

            // Level 3 (Leaves): Two-Wheelers & Three-Wheelers
            var bikesMotorcycles = new Category(Guid.NewGuid().ToString("N"), "Bikes & Motorcycles", "Bike") { ParentId = twoThreeWheelers.Id };
            var bicycles = new Category(Guid.NewGuid().ToString("N"), "Bicycles", "Bike") { ParentId = twoThreeWheelers.Id };
            var scootyScooters = new Category(Guid.NewGuid().ToString("N"), "Scooty & Scooters", "Bike") { ParentId = twoThreeWheelers.Id };
            var rickshawChingchi = new Category(Guid.NewGuid().ToString("N"), "Rickshaw & Chingchi", "Bike") { ParentId = twoThreeWheelers.Id };
            var atvQuads = new Category(Guid.NewGuid().ToString("N"), "ATV & Quads", "Bike") { ParentId = twoThreeWheelers.Id };

            // Level 3 (Leaves): Parts & Maintenance
            var spareParts = new Category(Guid.NewGuid().ToString("N"), "Spare Parts", "Settings") { ParentId = partsMaint.Id };
            var carCare = new Category(Guid.NewGuid().ToString("N"), "Car Care", "Settings") { ParentId = partsMaint.Id };
            var carsAcc = new Category(Guid.NewGuid().ToString("N"), "Cars Accessories", "Settings") { ParentId = partsMaint.Id };
            var bikesAcc = new Category(Guid.NewGuid().ToString("N"), "Bikes Accessories", "Settings") { ParentId = partsMaint.Id };
            var bikeCare = new Category(Guid.NewGuid().ToString("N"), "Bike Care", "Settings") { ParentId = partsMaint.Id };
            var oilLubricants = new Category(Guid.NewGuid().ToString("N"), "Oil & Lubricants", "Settings") { ParentId = partsMaint.Id };

            Categories.AddRange(cars, carsInstallments, busesTrucks, otherVehicles, bikesMotorcycles, bicycles, scootyScooters, rickshawChingchi, atvQuads, spareParts, carCare, carsAcc, bikesAcc, bikeCare, oilLubricants);

            // Level 3 (Leaves): Apparel & Wearables
            var clothes = new Category(Guid.NewGuid().ToString("N"), "Clothes", "Shirt") { ParentId = apparel.Id };
            var footwear = new Category(Guid.NewGuid().ToString("N"), "Footwear", "Shirt") { ParentId = apparel.Id };
            var bags = new Category(Guid.NewGuid().ToString("N"), "Bags", "Shirt") { ParentId = apparel.Id };
            var watches = new Category(Guid.NewGuid().ToString("N"), "Watches", "Watch") { ParentId = apparel.Id };
            var wedding = new Category(Guid.NewGuid().ToString("N"), "Wedding", "Sparkles") { ParentId = apparel.Id };

            // Level 3 (Leaves): Personal Care & Cosmetics
            var makeup = new Category(Guid.NewGuid().ToString("N"), "Makeup", "Sparkles") { ParentId = personalCare.Id };
            var skinHair = new Category(Guid.NewGuid().ToString("N"), "Skin & Hair", "Sparkles") { ParentId = personalCare.Id };
            var fragrance = new Category(Guid.NewGuid().ToString("N"), "Fragrance", "Sparkles") { ParentId = personalCare.Id };
            var bathBody = new Category(Guid.NewGuid().ToString("N"), "Bath & Body", "Sparkles") { ParentId = personalCare.Id };

            // Level 3 (Leaves): Jewellery & Accessories
            var jewelleryLeaf = new Category(Guid.NewGuid().ToString("N"), "Jewellery", "Sparkles") { ParentId = jewellery.Id };
            var fashionAcc = new Category(Guid.NewGuid().ToString("N"), "Fashion Accessories", "Sparkles") { ParentId = jewellery.Id };
            var diyJewellery = new Category(Guid.NewGuid().ToString("N"), "DIY Jewellery", "Sparkles") { ParentId = jewellery.Id };

            Categories.AddRange(clothes, footwear, bags, watches, wedding, makeup, skinHair, fragrance, bathBody, jewelleryLeaf, fashionAcc, diyJewellery);

            // Level 3 (Leaves): Kids & Baby Gear
            var kidsClothing = new Category(Guid.NewGuid().ToString("N"), "Kids Clothing", "Smile") { ParentId = kidsBaby.Id };
            var kidsAccessories = new Category(Guid.NewGuid().ToString("N"), "Kids Accessories", "Smile") { ParentId = kidsBaby.Id };
            var toys = new Category(Guid.NewGuid().ToString("N"), "Toys", "Smile") { ParentId = kidsBaby.Id };
            var babyGear = new Category(Guid.NewGuid().ToString("N"), "Baby Gear", "Smile") { ParentId = kidsBaby.Id };
            var kidsFurniture = new Category(Guid.NewGuid().ToString("N"), "Kids Furniture", "Smile") { ParentId = kidsBaby.Id };
            var kidsVehicles = new Category(Guid.NewGuid().ToString("N"), "Kids Vehicles", "Smile") { ParentId = kidsBaby.Id };
            var swingsSlides = new Category(Guid.NewGuid().ToString("N"), "Swings & Slides", "Smile") { ParentId = kidsBaby.Id };
            var bathDiapers = new Category(Guid.NewGuid().ToString("N"), "Bath & Diapers", "Smile") { ParentId = kidsBaby.Id };

            // Level 3 (Leaves): Hobbies & Recreation
            var booksMagazines = new Category(Guid.NewGuid().ToString("N"), "Books & Magazines", "BookOpen") { ParentId = hobbiesRecreation.Id };
            var sportsEquip = new Category(Guid.NewGuid().ToString("N"), "Sports Equipment", "Trophy") { ParentId = hobbiesRecreation.Id };
            var gymFitness = new Category(Guid.NewGuid().ToString("N"), "Gym & Fitness", "Trophy") { ParentId = hobbiesRecreation.Id };
            var musicalInstr = new Category(Guid.NewGuid().ToString("N"), "Musical Instruments", "Music") { ParentId = hobbiesRecreation.Id };
            var campingHiking = new Category(Guid.NewGuid().ToString("N"), "Camping & Hiking", "Map") { ParentId = hobbiesRecreation.Id };
            var collectables = new Category(Guid.NewGuid().ToString("N"), "Collectables", "Trophy") { ParentId = hobbiesRecreation.Id };

            // Level 3 (Leaves): Arts & Crafts
            var artsCraftsLeaf = new Category(Guid.NewGuid().ToString("N"), "Arts & Crafts", "Palette") { ParentId = artsCrafts.Id };
            var craftsDiySupplies = new Category(Guid.NewGuid().ToString("N"), "Crafts & DIY Supplies", "Palette") { ParentId = artsCrafts.Id };

            Categories.AddRange(kidsClothing, kidsAccessories, toys, babyGear, kidsFurniture, kidsVehicles, swingsSlides, bathDiapers, booksMagazines, sportsEquip, gymFitness, musicalInstr, campingHiking, collectables, artsCraftsLeaf, craftsDiySupplies);

            // Level 3 (Leaves): Home Appliances
            var refrigerators = new Category(Guid.NewGuid().ToString("N"), "Refrigerators & Freezers", "Microwave") { ParentId = homeAppliances.Id };
            var acCoolers = new Category(Guid.NewGuid().ToString("N"), "AC & Coolers", "Microwave") { ParentId = homeAppliances.Id };
            var washingMachines = new Category(Guid.NewGuid().ToString("N"), "Washing Machines & Dryers", "Microwave") { ParentId = homeAppliances.Id };
            var microwaves = new Category(Guid.NewGuid().ToString("N"), "Microwaves & Ovens", "Microwave") { ParentId = homeAppliances.Id };
            var kitchenAppliances = new Category(Guid.NewGuid().ToString("N"), "Kitchen Appliances", "Microwave") { ParentId = homeAppliances.Id };
            var waterDispensers = new Category(Guid.NewGuid().ToString("N"), "Water Dispensers", "Microwave") { ParentId = homeAppliances.Id };
            var fans = new Category(Guid.NewGuid().ToString("N"), "Fans", "Microwave") { ParentId = homeAppliances.Id };
            var heaters = new Category(Guid.NewGuid().ToString("N"), "Heaters & Geysers", "Microwave") { ParentId = homeAppliances.Id };
            var airPurifiers = new Category(Guid.NewGuid().ToString("N"), "Air Purifiers & Humidifiers", "Microwave") { ParentId = homeAppliances.Id };
            var sewingMachines = new Category(Guid.NewGuid().ToString("N"), "Sewing Machines", "Microwave") { ParentId = homeAppliances.Id };
            var irons = new Category(Guid.NewGuid().ToString("N"), "Irons & Steamers", "Microwave") { ParentId = homeAppliances.Id };

            // Level 3 (Leaves): Furniture & Decor
            var sofaChairs = new Category(Guid.NewGuid().ToString("N"), "Sofa & Chairs", "Sofa") { ParentId = furnitureDecor.Id };
            var bedsWardrobes = new Category(Guid.NewGuid().ToString("N"), "Beds & Wardrobes", "Sofa") { ParentId = furnitureDecor.Id };
            var tablesDining = new Category(Guid.NewGuid().ToString("N"), "Tables & Dining", "Sofa") { ParentId = furnitureDecor.Id };
            var officeFurniture = new Category(Guid.NewGuid().ToString("N"), "Office Furniture", "Sofa") { ParentId = furnitureDecor.Id };
            var homeDecoration = new Category(Guid.NewGuid().ToString("N"), "Home Decoration", "Sofa") { ParentId = furnitureDecor.Id };
            var lighting = new Category(Guid.NewGuid().ToString("N"), "Lighting", "Sofa") { ParentId = furnitureDecor.Id };
            var paintingMirrors = new Category(Guid.NewGuid().ToString("N"), "Painting & Mirrors", "Sofa") { ParentId = furnitureDecor.Id };
            var rugsCarpets = new Category(Guid.NewGuid().ToString("N"), "Rugs & Carpets", "Sofa") { ParentId = furnitureDecor.Id };
            var curtainsBlinds = new Category(Guid.NewGuid().ToString("N"), "Curtains & Blinds", "Sofa") { ParentId = furnitureDecor.Id };

            // Level 3 (Leaves): Household & Tools
            var kitchenEssentials = new Category(Guid.NewGuid().ToString("N"), "Kitchen Essentials", "Utensils") { ParentId = householdTools.Id };
            var homeEssentials = new Category(Guid.NewGuid().ToString("N"), "Home Essentials", "Home") { ParentId = householdTools.Id };
            var bathroomAccessories = new Category(Guid.NewGuid().ToString("N"), "Bathroom Accessories", "Home") { ParentId = householdTools.Id };
            var gardenOutdoor = new Category(Guid.NewGuid().ToString("N"), "Garden & Outdoor", "Home") { ParentId = householdTools.Id };
            var toolsEquipment = new Category(Guid.NewGuid().ToString("N"), "Tools & DIY Equipment", "Wrench") { ParentId = householdTools.Id };
            var homeDiy = new Category(Guid.NewGuid().ToString("N"), "Home DIY & Renovations", "Wrench") { ParentId = householdTools.Id };

            Categories.AddRange(
                refrigerators, acCoolers, washingMachines, microwaves, kitchenAppliances, waterDispensers, fans, heaters, airPurifiers, sewingMachines, irons,
                sofaChairs, bedsWardrobes, tablesDining, officeFurniture, homeDecoration, lighting, paintingMirrors, rugsCarpets, curtainsBlinds,
                kitchenEssentials, homeEssentials, bathroomAccessories, gardenOutdoor, toolsEquipment, homeDiy
            );

            await SaveChangesAsync();

            // Seed Attributes for Mobile Phones
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Brand", "selection", mobilePhones.Id) { IsRequired = true, Options = "[\"Apple\", \"Samsung\", \"Xiaomi\", \"Infinix\", \"Tecno\", \"Vivo\", \"Oppo\", \"Realme\", \"OnePlus\", \"Google\", \"Huawei\", \"Other\"]" },
                new(Guid.NewGuid().ToString("N"), "RAM", "selection", mobilePhones.Id) { IsRequired = true, Options = "[\"2GB\", \"4GB\", \"6GB\", \"8GB\", \"12GB\", \"16GB\"]" },
                new(Guid.NewGuid().ToString("N"), "Storage", "selection", mobilePhones.Id) { IsRequired = true, Options = "[\"32GB\", \"64GB\", \"128GB\", \"256GB\", \"512GB\", \"1TB\"]" },
                new(Guid.NewGuid().ToString("N"), "Warranty", "selection", mobilePhones.Id) { Options = "[\"No Warranty\", \"1-6 Months\", \"6-12 Months\", \"More than 1 Year\"]" }
            });

            // Seed Attributes for Tablets
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Brand", "text", tablets.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Storage", "selection", tablets.Id) { Options = "[\"32GB\", \"64GB\", \"128GB\", \"256GB\", \"512GB\"]" },
                new(Guid.NewGuid().ToString("N"), "Screen Size", "text", tablets.Id)
            });

            // Seed Attributes for Smart Watches
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Brand", "text", smartWatches.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Heart Rate Monitor", "selection", smartWatches.Id) { Options = "[\"Yes\", \"No\"]" }
            });

            // Seed Attributes for Computers & Accessories
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Brand", "text", computerAccessories.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "RAM", "selection", computerAccessories.Id) { Options = "[\"4GB\", \"8GB\", \"16GB\", \"32GB\", \"64GB\"]" },
                new(Guid.NewGuid().ToString("N"), "Processor", "text", computerAccessories.Id)
            });

            // Seed Attributes for Cars
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Make", "text", cars.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Model Year", "number", cars.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Fuel Type", "selection", cars.Id) { Options = "[\"Petrol\", \"Diesel\", \"Electric\", \"Hybrid\", \"CNG\"]" },
                new(Guid.NewGuid().ToString("N"), "KM Driven", "number", cars.Id)
            });

            // Seed Attributes for Clothes
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Size", "selection", clothes.Id) { IsRequired = true, Options = "[\"XS\", \"S\", \"M\", \"L\", \"XL\", \"XXL\"]" },
                new(Guid.NewGuid().ToString("N"), "Gender", "selection", clothes.Id) { Options = "[\"Men\", \"Women\", \"Unisex\", \"Kids\"]" }
            });

            // Seed Attributes for Sofa & Chairs
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Seating Capacity", "number", sofaChairs.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Material", "selection", sofaChairs.Id) { Options = "[\"Wood\", \"Fabric\", \"Leather\", \"Metal\", \"Other\"]" }
            });

            // Seed Attributes for Kitchen Essentials
            CategoryAttributes.AddRange(new List<CategoryAttribute>
            {
                new(Guid.NewGuid().ToString("N"), "Material", "text", kitchenEssentials.Id) { IsRequired = true },
                new(Guid.NewGuid().ToString("N"), "Brand", "text", kitchenEssentials.Id)
            });

            await SaveChangesAsync();
        }

        // 3. Seed Users
        if (!await Users.AnyAsync())
        {
            var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();

            var adminUser = new User(Guid.NewGuid().ToString("N"), "admin@example.com")
            {
                Name = "Admin User",
                Role = UserRole.Admin,
                LtpBalance = 5000,
                PhoneNumber = "+1112223333"
            };
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "admin123");
            Users.Add(adminUser);

            var userA = new User(Guid.NewGuid().ToString("N"), "userA@example.com")
            {
                Name = "User A",
                Role = UserRole.User,
                LtpBalance = 1000,
                PhoneNumber = "+1234567890"
            };
            userA.PasswordHash = hasher.HashPassword(userA, "user123");
            Users.Add(userA);

            var userB = new User(Guid.NewGuid().ToString("N"), "userB@example.com")
            {
                Name = "User B",
                Role = UserRole.User,
                LtpBalance = 1000,
                PhoneNumber = "+19876543210"
            };
            userB.PasswordHash = hasher.HashPassword(userB, "user123");
            Users.Add(userB);

            var bannedUser = new User(Guid.NewGuid().ToString("N"), "banned@example.com")
            {
                Name = "Banned User",
                Role = UserRole.User,
                LtpBalance = 500,
                PhoneNumber = "+15555555555",
                IsBanned = true
            };
            bannedUser.PasswordHash = hasher.HashPassword(bannedUser, "user123");
            Users.Add(bannedUser);

            await SaveChangesAsync();

            // 4. Seed Items (using newly created IDs)
            if (!await Items.AnyAsync())
            {
                var catId = (await Categories.FirstAsync(c => c.Name == "Mobile Phones")).Id;
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

            // 5. Seed Messages & Message Requests
            if (!await Messages.AnyAsync())
            {
                var msg1 = new Message(Guid.NewGuid().ToString("N"), userA.Id, userB.Id, "Hello User B, is your item still available?")
                {
                    CreatedAt = DateTime.UtcNow.AddMinutes(-30)
                };
                var msg2 = new Message(Guid.NewGuid().ToString("N"), userB.Id, userA.Id, "Yes, it is! What are you offering?")
                {
                    CreatedAt = DateTime.UtcNow.AddMinutes(-25)
                };
                var msg3 = new Message(Guid.NewGuid().ToString("N"), userA.Id, userB.Id, "I have an iPhone 15 Pro. We can swap it.")
                {
                    CreatedAt = DateTime.UtcNow.AddMinutes(-20)
                };
                Messages.AddRange(msg1, msg2, msg3);

                // Seed a message request: User B sent message to Admin User, but Admin User has never replied
                var reqMsg = new Message(Guid.NewGuid().ToString("N"), userB.Id, adminUser.Id, "Hi admin, I need help with my account.")
                {
                    CreatedAt = DateTime.UtcNow.AddMinutes(-10)
                };
                Messages.Add(reqMsg);

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
            entity.Property(x => x.Role).HasConversion<string>();
            entity.Property(x => x.TrustScore).HasDefaultValue(100d);
            entity.Property(x => x.LtpBalance).HasDefaultValue(0);

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
            entity.HasMany(x => x.SentMessages).WithOne(x => x.Sender).HasForeignKey(x => x.SenderId).OnDelete(DeleteBehavior.Restrict);
            entity.HasMany(x => x.ReceivedMessages).WithOne(x => x.Receiver).HasForeignKey(x => x.ReceiverId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.HasMany(x => x.Attributes).WithOne(x => x.Category).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Cascade);
            entity.HasMany(x => x.Items).WithOne(x => x.Category).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Parent)
                  .WithMany(x => x.Children)
                  .HasForeignKey(x => x.ParentId)
                  .OnDelete(DeleteBehavior.Restrict);
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
            entity.Property(x => x.TradeId).HasMaxLength(64).IsRequired(false);
            entity.Property(x => x.ReportedUserId).HasMaxLength(64).IsRequired(false);

            entity.HasOne(x => x.ReportedUser)
                .WithMany()
                .HasForeignKey(x => x.ReportedUserId)
                .OnDelete(DeleteBehavior.Restrict);
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

        modelBuilder.Entity<Message>(entity =>
        {
            entity.ToTable("Messages");
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Id).HasMaxLength(64);
            entity.Property(x => x.Content).IsRequired();
            entity.Property(x => x.IsRead).HasDefaultValue(false);
            entity.HasIndex(x => new { x.SenderId, x.ReceiverId });
            entity.HasIndex(x => x.CreatedAt);
        });
    }
}
