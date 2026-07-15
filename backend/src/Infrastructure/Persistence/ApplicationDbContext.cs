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

        // 1. Seed Provinces
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
            // Level 1: Root categories
            var tech      = new Category(Guid.NewGuid().ToString("N"), "Tech & Digital Assets", "Smartphone");
            var mobility  = new Category(Guid.NewGuid().ToString("N"), "Mobility & Vehicles", "Car");
            var lifestyle = new Category(Guid.NewGuid().ToString("N"), "Lifestyle, Fashion & Luxury", "Sparkles");
            var community = new Category(Guid.NewGuid().ToString("N"), "Community, Hobbies & Kids", "HelpCircle");
            var home      = new Category(Guid.NewGuid().ToString("N"), "Home Essentials & General Barter", "Home");
            Categories.AddRange(tech, mobility, lifestyle, community, home);
            await SaveChangesAsync();

            // Level 2
            var mobilesWearables   = new Category(Guid.NewGuid().ToString("N"), "Mobiles & Wearables", "Smartphone")     { ParentId = tech.Id };
            var computersEnt       = new Category(Guid.NewGuid().ToString("N"), "Computers & Entertainment", "Laptop")    { ParentId = tech.Id };
            var powerSolutions     = new Category(Guid.NewGuid().ToString("N"), "Power Solutions", "Zap")                  { ParentId = tech.Id };
            var automotive         = new Category(Guid.NewGuid().ToString("N"), "Automotive", "Car")                       { ParentId = mobility.Id };
            var twoThreeWheelers   = new Category(Guid.NewGuid().ToString("N"), "Two-Wheelers & Three-Wheelers", "Bike")   { ParentId = mobility.Id };
            var partsMaint         = new Category(Guid.NewGuid().ToString("N"), "Parts & Maintenance", "Settings")         { ParentId = mobility.Id };
            var apparel            = new Category(Guid.NewGuid().ToString("N"), "Apparel & Wearables", "Shirt")            { ParentId = lifestyle.Id };
            var personalCare       = new Category(Guid.NewGuid().ToString("N"), "Personal Care & Cosmetics", "Sparkles")   { ParentId = lifestyle.Id };
            var jewellery          = new Category(Guid.NewGuid().ToString("N"), "Jewellery & Accessories", "Sparkles")     { ParentId = lifestyle.Id };
            var kidsBaby           = new Category(Guid.NewGuid().ToString("N"), "Kids & Baby Gear", "Smile")               { ParentId = community.Id };
            var hobbiesRecreation  = new Category(Guid.NewGuid().ToString("N"), "Hobbies & Recreation", "BookOpen")        { ParentId = community.Id };
            var artsCrafts         = new Category(Guid.NewGuid().ToString("N"), "Arts & Crafts", "Palette")                { ParentId = community.Id };
            var homeAppliances     = new Category(Guid.NewGuid().ToString("N"), "Home Appliances", "Microwave")            { ParentId = home.Id };
            var furnitureDecor     = new Category(Guid.NewGuid().ToString("N"), "Furniture & Decor", "Sofa")               { ParentId = home.Id };
            var householdTools     = new Category(Guid.NewGuid().ToString("N"), "Household & Tools", "Wrench")             { ParentId = home.Id };
            Categories.AddRange(mobilesWearables, computersEnt, powerSolutions, automotive, twoThreeWheelers, partsMaint,
                                 apparel, personalCare, jewellery, kidsBaby, hobbiesRecreation, artsCrafts,
                                 homeAppliances, furnitureDecor, householdTools);
            await SaveChangesAsync();

            // Level 3 — Tech
            var mobilePhones      = new Category(Guid.NewGuid().ToString("N"), "Mobile Phones", "Smartphone")              { ParentId = mobilesWearables.Id };
            var tablets           = new Category(Guid.NewGuid().ToString("N"), "Tablets", "Tablet")                        { ParentId = mobilesWearables.Id };
            var smartWatches      = new Category(Guid.NewGuid().ToString("N"), "Smart Watches", "Watch")                   { ParentId = mobilesWearables.Id };
            var mobileAccs        = new Category(Guid.NewGuid().ToString("N"), "Accessories", "Smartphone")                { ParentId = mobilesWearables.Id };
            var computers         = new Category(Guid.NewGuid().ToString("N"), "Computers & Accessories", "Laptop")        { ParentId = computersEnt.Id };
            var televisions       = new Category(Guid.NewGuid().ToString("N"), "Televisions & Accessories", "Tv")          { ParentId = computersEnt.Id };
            var videoAudios       = new Category(Guid.NewGuid().ToString("N"), "Video-Audios", "Mic")                      { ParentId = computersEnt.Id };
            var gamesEnt          = new Category(Guid.NewGuid().ToString("N"), "Games & Entertainment", "Gamepad")         { ParentId = computersEnt.Id };
            var cameras           = new Category(Guid.NewGuid().ToString("N"), "Cameras & Accessories", "Camera")          { ParentId = computersEnt.Id };
            var generatorsPower   = new Category(Guid.NewGuid().ToString("N"), "Generators, UPS & Power Solutions", "Zap") { ParentId = powerSolutions.Id };
            // Level 3 — Mobility
            var cars              = new Category(Guid.NewGuid().ToString("N"), "Cars", "Car")                              { ParentId = automotive.Id };
            var carsInstallments  = new Category(Guid.NewGuid().ToString("N"), "Cars on Installments", "Car")              { ParentId = automotive.Id };
            var busesTrucks       = new Category(Guid.NewGuid().ToString("N"), "Buses, Vans & Trucks", "Truck")            { ParentId = automotive.Id };
            var otherVehicles     = new Category(Guid.NewGuid().ToString("N"), "Other Vehicles", "Car")                    { ParentId = automotive.Id };
            var bikesMotorcycles  = new Category(Guid.NewGuid().ToString("N"), "Bikes & Motorcycles", "Bike")              { ParentId = twoThreeWheelers.Id };
            var bicycles          = new Category(Guid.NewGuid().ToString("N"), "Bicycles", "Bike")                         { ParentId = twoThreeWheelers.Id };
            var scootyScooters    = new Category(Guid.NewGuid().ToString("N"), "Scooty & Scooters", "Bike")                { ParentId = twoThreeWheelers.Id };
            var rickshawChingchi  = new Category(Guid.NewGuid().ToString("N"), "Rickshaw & Chingchi", "Bike")              { ParentId = twoThreeWheelers.Id };
            var atvQuads          = new Category(Guid.NewGuid().ToString("N"), "ATV & Quads", "Bike")                      { ParentId = twoThreeWheelers.Id };
            var spareParts        = new Category(Guid.NewGuid().ToString("N"), "Spare Parts", "Settings")                  { ParentId = partsMaint.Id };
            var carCare           = new Category(Guid.NewGuid().ToString("N"), "Car Care", "Settings")                     { ParentId = partsMaint.Id };
            var carsAcc           = new Category(Guid.NewGuid().ToString("N"), "Cars Accessories", "Settings")             { ParentId = partsMaint.Id };
            var bikesAcc          = new Category(Guid.NewGuid().ToString("N"), "Bikes Accessories", "Settings")            { ParentId = partsMaint.Id };
            var bikeCare          = new Category(Guid.NewGuid().ToString("N"), "Bike Care", "Settings")                    { ParentId = partsMaint.Id };
            var oilLubricants     = new Category(Guid.NewGuid().ToString("N"), "Oil & Lubricants", "Settings")             { ParentId = partsMaint.Id };
            // Level 3 — Lifestyle
            var clothes           = new Category(Guid.NewGuid().ToString("N"), "Clothes", "Shirt")                         { ParentId = apparel.Id };
            var footwear          = new Category(Guid.NewGuid().ToString("N"), "Footwear", "Shirt")                        { ParentId = apparel.Id };
            var bags              = new Category(Guid.NewGuid().ToString("N"), "Bags", "Shirt")                            { ParentId = apparel.Id };
            var watches           = new Category(Guid.NewGuid().ToString("N"), "Watches", "Watch")                         { ParentId = apparel.Id };
            var wedding           = new Category(Guid.NewGuid().ToString("N"), "Wedding", "Sparkles")                      { ParentId = apparel.Id };
            var makeup            = new Category(Guid.NewGuid().ToString("N"), "Makeup", "Sparkles")                       { ParentId = personalCare.Id };
            var skinHair          = new Category(Guid.NewGuid().ToString("N"), "Skin & Hair", "Sparkles")                  { ParentId = personalCare.Id };
            var fragrance         = new Category(Guid.NewGuid().ToString("N"), "Fragrance", "Sparkles")                    { ParentId = personalCare.Id };
            var bathBody          = new Category(Guid.NewGuid().ToString("N"), "Bath & Body", "Sparkles")                  { ParentId = personalCare.Id };
            var jewelleryLeaf     = new Category(Guid.NewGuid().ToString("N"), "Jewellery", "Sparkles")                    { ParentId = jewellery.Id };
            var fashionAcc        = new Category(Guid.NewGuid().ToString("N"), "Fashion Accessories", "Sparkles")          { ParentId = jewellery.Id };
            var diyJewellery      = new Category(Guid.NewGuid().ToString("N"), "DIY Jewellery", "Sparkles")                { ParentId = jewellery.Id };
            // Level 3 — Community
            var kidsClothing      = new Category(Guid.NewGuid().ToString("N"), "Kids Clothing", "Smile")                   { ParentId = kidsBaby.Id };
            var kidsAccessories   = new Category(Guid.NewGuid().ToString("N"), "Kids Accessories", "Smile")                { ParentId = kidsBaby.Id };
            var toys              = new Category(Guid.NewGuid().ToString("N"), "Toys", "Smile")                            { ParentId = kidsBaby.Id };
            var babyGear          = new Category(Guid.NewGuid().ToString("N"), "Baby Gear", "Smile")                       { ParentId = kidsBaby.Id };
            var kidsFurniture     = new Category(Guid.NewGuid().ToString("N"), "Kids Furniture", "Smile")                  { ParentId = kidsBaby.Id };
            var kidsVehicles      = new Category(Guid.NewGuid().ToString("N"), "Kids Vehicles", "Smile")                   { ParentId = kidsBaby.Id };
            var swingsSlides      = new Category(Guid.NewGuid().ToString("N"), "Swings & Slides", "Smile")                 { ParentId = kidsBaby.Id };
            var bathDiapers       = new Category(Guid.NewGuid().ToString("N"), "Bath & Diapers", "Smile")                  { ParentId = kidsBaby.Id };
            var booksMagazines    = new Category(Guid.NewGuid().ToString("N"), "Books & Magazines", "BookOpen")            { ParentId = hobbiesRecreation.Id };
            var sportsEquip       = new Category(Guid.NewGuid().ToString("N"), "Sports Equipment", "Trophy")               { ParentId = hobbiesRecreation.Id };
            var gymFitness        = new Category(Guid.NewGuid().ToString("N"), "Gym & Fitness", "Trophy")                  { ParentId = hobbiesRecreation.Id };
            var musicalInstr      = new Category(Guid.NewGuid().ToString("N"), "Musical Instruments", "Music")             { ParentId = hobbiesRecreation.Id };
            var campingHiking     = new Category(Guid.NewGuid().ToString("N"), "Camping & Hiking", "Map")                  { ParentId = hobbiesRecreation.Id };
            var collectables      = new Category(Guid.NewGuid().ToString("N"), "Collectables", "Trophy")                   { ParentId = hobbiesRecreation.Id };
            var artsCraftsLeaf    = new Category(Guid.NewGuid().ToString("N"), "Arts & Crafts", "Palette")                 { ParentId = artsCrafts.Id };
            var craftsDiy         = new Category(Guid.NewGuid().ToString("N"), "Crafts & DIY Supplies", "Palette")         { ParentId = artsCrafts.Id };
            // Level 3 — Home
            var refrigerators     = new Category(Guid.NewGuid().ToString("N"), "Refrigerators & Freezers", "Microwave")   { ParentId = homeAppliances.Id };
            var acCoolers         = new Category(Guid.NewGuid().ToString("N"), "AC & Coolers", "Microwave")                { ParentId = homeAppliances.Id };
            var washingMachines   = new Category(Guid.NewGuid().ToString("N"), "Washing Machines & Dryers", "Microwave")   { ParentId = homeAppliances.Id };
            var microwavesOvens   = new Category(Guid.NewGuid().ToString("N"), "Microwaves & Ovens", "Microwave")          { ParentId = homeAppliances.Id };
            var kitchenAppliances = new Category(Guid.NewGuid().ToString("N"), "Kitchen Appliances", "Microwave")          { ParentId = homeAppliances.Id };
            var waterDispensers   = new Category(Guid.NewGuid().ToString("N"), "Water Dispensers", "Microwave")            { ParentId = homeAppliances.Id };
            var fans              = new Category(Guid.NewGuid().ToString("N"), "Fans", "Microwave")                        { ParentId = homeAppliances.Id };
            var heaters           = new Category(Guid.NewGuid().ToString("N"), "Heaters & Geysers", "Microwave")          { ParentId = homeAppliances.Id };
            var airPurifiers      = new Category(Guid.NewGuid().ToString("N"), "Air Purifiers & Humidifiers", "Microwave") { ParentId = homeAppliances.Id };
            var sewingMachines    = new Category(Guid.NewGuid().ToString("N"), "Sewing Machines", "Microwave")             { ParentId = homeAppliances.Id };
            var irons             = new Category(Guid.NewGuid().ToString("N"), "Irons & Steamers", "Microwave")            { ParentId = homeAppliances.Id };
            var sofaChairs        = new Category(Guid.NewGuid().ToString("N"), "Sofa & Chairs", "Sofa")                    { ParentId = furnitureDecor.Id };
            var bedsWardrobes     = new Category(Guid.NewGuid().ToString("N"), "Beds & Wardrobes", "Sofa")                 { ParentId = furnitureDecor.Id };
            var tablesDining      = new Category(Guid.NewGuid().ToString("N"), "Tables & Dining", "Sofa")                  { ParentId = furnitureDecor.Id };
            var officeFurniture   = new Category(Guid.NewGuid().ToString("N"), "Office Furniture", "Sofa")                 { ParentId = furnitureDecor.Id };
            var homeDecoration    = new Category(Guid.NewGuid().ToString("N"), "Home Decoration", "Sofa")                  { ParentId = furnitureDecor.Id };
            var lighting          = new Category(Guid.NewGuid().ToString("N"), "Lighting", "Sofa")                         { ParentId = furnitureDecor.Id };
            var paintingMirrors   = new Category(Guid.NewGuid().ToString("N"), "Painting & Mirrors", "Sofa")               { ParentId = furnitureDecor.Id };
            var rugsCarpets       = new Category(Guid.NewGuid().ToString("N"), "Rugs & Carpets", "Sofa")                   { ParentId = furnitureDecor.Id };
            var curtainsBlinds    = new Category(Guid.NewGuid().ToString("N"), "Curtains & Blinds", "Sofa")                { ParentId = furnitureDecor.Id };
            var kitchenEssentials = new Category(Guid.NewGuid().ToString("N"), "Kitchen Essentials", "Utensils")           { ParentId = householdTools.Id };
            var homeEssentials    = new Category(Guid.NewGuid().ToString("N"), "Home Essentials", "Home")                  { ParentId = householdTools.Id };
            var bathroomAccs      = new Category(Guid.NewGuid().ToString("N"), "Bathroom Accessories", "Home")             { ParentId = householdTools.Id };
            var gardenOutdoor     = new Category(Guid.NewGuid().ToString("N"), "Garden & Outdoor", "Home")                 { ParentId = householdTools.Id };
            var toolsEquipment    = new Category(Guid.NewGuid().ToString("N"), "Tools & DIY Equipment", "Wrench")          { ParentId = householdTools.Id };
            var homeDiy           = new Category(Guid.NewGuid().ToString("N"), "Home DIY & Renovations", "Wrench")         { ParentId = householdTools.Id };

            Categories.AddRange(
                mobilePhones, tablets, smartWatches, mobileAccs, computers, televisions, videoAudios, gamesEnt, cameras, generatorsPower,
                cars, carsInstallments, busesTrucks, otherVehicles, bikesMotorcycles, bicycles, scootyScooters, rickshawChingchi, atvQuads,
                spareParts, carCare, carsAcc, bikesAcc, bikeCare, oilLubricants,
                clothes, footwear, bags, watches, wedding, makeup, skinHair, fragrance, bathBody, jewelleryLeaf, fashionAcc, diyJewellery,
                kidsClothing, kidsAccessories, toys, babyGear, kidsFurniture, kidsVehicles, swingsSlides, bathDiapers,
                booksMagazines, sportsEquip, gymFitness, musicalInstr, campingHiking, collectables, artsCraftsLeaf, craftsDiy,
                refrigerators, acCoolers, washingMachines, microwavesOvens, kitchenAppliances, waterDispensers, fans, heaters, airPurifiers, sewingMachines, irons,
                sofaChairs, bedsWardrobes, tablesDining, officeFurniture, homeDecoration, lighting, paintingMirrors, rugsCarpets, curtainsBlinds,
                kitchenEssentials, homeEssentials, bathroomAccs, gardenOutdoor, toolsEquipment, homeDiy
            );
            await SaveChangesAsync();

            // Seed Attributes
            CategoryAttributes.AddRange(
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Brand", "selection", mobilePhones.Id) { IsRequired = true, Options = "[\"Apple\",\"Samsung\",\"Xiaomi\",\"Infinix\",\"Tecno\",\"Vivo\",\"Oppo\",\"Realme\",\"OnePlus\",\"Google\",\"Huawei\",\"Other\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "RAM", "selection", mobilePhones.Id)   { IsRequired = true, Options = "[\"2GB\",\"4GB\",\"6GB\",\"8GB\",\"12GB\",\"16GB\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Storage", "selection", mobilePhones.Id) { IsRequired = true, Options = "[\"32GB\",\"64GB\",\"128GB\",\"256GB\",\"512GB\",\"1TB\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Warranty", "selection", mobilePhones.Id) { Options = "[\"No Warranty\",\"1-6 Months\",\"6-12 Months\",\"More than 1 Year\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Brand", "text", tablets.Id)           { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Storage", "selection", tablets.Id)    { Options = "[\"32GB\",\"64GB\",\"128GB\",\"256GB\",\"512GB\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Screen Size", "text", tablets.Id),
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Brand", "text", smartWatches.Id)      { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Heart Rate Monitor", "selection", smartWatches.Id) { Options = "[\"Yes\",\"No\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Brand", "text", computers.Id)         { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "RAM", "selection", computers.Id)      { Options = "[\"4GB\",\"8GB\",\"16GB\",\"32GB\",\"64GB\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Processor", "text", computers.Id),
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Make", "text", cars.Id)               { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Model Year", "number", cars.Id)       { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Fuel Type", "selection", cars.Id)     { Options = "[\"Petrol\",\"Diesel\",\"Electric\",\"Hybrid\",\"CNG\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "KM Driven", "number", cars.Id),
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Size", "selection", clothes.Id)       { IsRequired = true, Options = "[\"XS\",\"S\",\"M\",\"L\",\"XL\",\"XXL\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Gender", "selection", clothes.Id)     { Options = "[\"Men\",\"Women\",\"Unisex\",\"Kids\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Seating Capacity", "number", sofaChairs.Id) { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Material", "selection", sofaChairs.Id) { Options = "[\"Wood\",\"Fabric\",\"Leather\",\"Metal\",\"Other\"]" },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Material", "text", kitchenEssentials.Id) { IsRequired = true },
                new CategoryAttribute(Guid.NewGuid().ToString("N"), "Brand", "text", kitchenEssentials.Id)
            );
            await SaveChangesAsync();
        }

        // 3. Seed Users
        var hasher = new Microsoft.AspNetCore.Identity.PasswordHasher<User>();
        if (!await Users.AnyAsync())
        {
            var adminUser = new User(Guid.NewGuid().ToString("N"), "admin@example.com")   { Name = "Admin User",   Role = UserRole.Admin, LtpBalance = 5000, PhoneNumber = "+921112223333", TrustScore = 100 };
            adminUser.PasswordHash = hasher.HashPassword(adminUser, "admin123");
            var userA = new User(Guid.NewGuid().ToString("N"), "userA@example.com")       { Name = "Ali Raza",     Role = UserRole.User,  LtpBalance = 2500, PhoneNumber = "+923001234567", TrustScore = 90 };
            userA.PasswordHash = hasher.HashPassword(userA, "user123");
            var userB = new User(Guid.NewGuid().ToString("N"), "userB@example.com")       { Name = "Sara Khan",    Role = UserRole.User,  LtpBalance = 1800, PhoneNumber = "+923219876543", TrustScore = 85 };
            userB.PasswordHash = hasher.HashPassword(userB, "user123");
            var userC = new User(Guid.NewGuid().ToString("N"), "userC@example.com")       { Name = "Hamza Malik",  Role = UserRole.User,  LtpBalance = 3200, PhoneNumber = "+923337654321", TrustScore = 95 };
            userC.PasswordHash = hasher.HashPassword(userC, "user123");
            var bannedUser = new User(Guid.NewGuid().ToString("N"), "banned@example.com") { Name = "Banned User",  Role = UserRole.User,  LtpBalance = 500,  PhoneNumber = "+925555555555", IsBanned = true, TrustScore = 20 };
            bannedUser.PasswordHash = hasher.HashPassword(bannedUser, "user123");

            // Make sure ALL 5 users are added!
            Users.AddRange(adminUser, userA, userB, userC, bannedUser);
            await SaveChangesAsync();
        }

        // 4. Seed Items
        var itemCount = await Items.CountAsync();
        if (itemCount < 10)
        {
            if (itemCount > 0)
            {
                ItemAttributeValues.RemoveRange(ItemAttributeValues);
                Items.RemoveRange(Items);
                await SaveChangesAsync();
            }

            var uAdmin  = (await Users.FirstAsync(u => u.Email == "admin@example.com")).Id;
            var uA      = (await Users.FirstAsync(u => u.Email == "userA@example.com")).Id;
            var uB      = (await Users.FirstAsync(u => u.Email == "userB@example.com")).Id;
            var uC      = (await Users.FirstAsync(u => u.Email == "userC@example.com")).Id;
            var pPunjab = (await Provinces.FirstAsync(p => p.Name == "Punjab")).Id;
            var pSindh  = (await Provinces.FirstAsync(p => p.Name == "Sindh")).Id;
            var pKpk    = (await Provinces.FirstAsync(p => p.Name == "KPK")).Id;

            // Helper to get Category Id
            async Task<string> C(string name) => (await Categories.AsNoTracking().FirstAsync(c => c.Name == name)).Id;

            var itemsToSeed = new List<Item>
            {
                // Tech
                new(Guid.NewGuid().ToString("N"), "iPhone 15 Pro Max 256GB",        "Barely used iPhone 15 Pro Max in Natural Titanium. Original box and accessories.", "[\"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800\"]", await C("Mobile Phones"),         "Like New", uAdmin) { LtpValue = 1800, ProvinceId = pPunjab, Location = "Gulberg III, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Samsung Galaxy S24 Ultra",        "Samsung S24 Ultra 12GB/256GB with S-Pen. Phantom Black. 6 months old.",           "[\"https://images.unsplash.com/photo-1706439120032-9c2ead6e2a34?w=800\"]", await C("Mobile Phones"),         "Good",     uA)     { LtpValue = 1400, ProvinceId = pSindh,  Location = "DHA Phase 6, Karachi" },
                new(Guid.NewGuid().ToString("N"), "iPad Pro M2 11-inch 128GB",       "Apple iPad Pro M2 11-inch WiFi+Cellular. Apple Pencil 2 included.",               "[\"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800\"]", await C("Tablets"),               "Like New", uB)     { LtpValue = 1100, ProvinceId = pPunjab, Location = "F-7, Islamabad" },
                new(Guid.NewGuid().ToString("N"), "Apple Watch Series 9 45mm",       "Apple Watch Series 9 GPS 45mm Midnight. Extra bands included.",                   "[\"https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800\"]", await C("Smart Watches"),         "Like New", uC)     { LtpValue = 550,  ProvinceId = pKpk,    Location = "University Town, Peshawar" },
                new(Guid.NewGuid().ToString("N"), "AirPods Pro 2nd Generation",      "Apple AirPods Pro 2nd gen MagSafe case. Perfect audio. 3 months old.",            "[\"https://images.unsplash.com/photo-1633591019878-45a04d7a2e21?w=800\"]", await C("Accessories"),           "Like New", uAdmin) { LtpValue = 350,  ProvinceId = pPunjab, Location = "Model Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "MacBook Air M2 8GB/512GB",        "MacBook Air M2 2022 Silver. 8GB RAM, 512GB SSD. Perfect for dev work.",           "[\"https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800\"]", await C("Computers & Accessories"), "Good", uA)     { LtpValue = 1300, ProvinceId = pSindh,  Location = "Clifton, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Dell XPS 15 i7 32GB",             "Dell XPS 15 9530 i7-13700H, 32GB, 1TB SSD, RTX 4060. Barely used.",              "[\"https://images.unsplash.com/photo-1593642632599-e2b9e9c56dc3?w=800\"]", await C("Computers & Accessories"), "Like New", uB)  { LtpValue = 1600, ProvinceId = pPunjab, Location = "Bahria Town, Rawalpindi" },
                new(Guid.NewGuid().ToString("N"), "Samsung 65\" Neo QLED 4K TV",     "Samsung 65-inch Neo QLED 4K Smart TV. Wall mount included.",                      "[\"https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800\"]", await C("Televisions & Accessories"), "Like New", uC) { LtpValue = 900,  ProvinceId = pPunjab, Location = "Defence, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Sony WH-1000XM5 Headphones",      "Sony XM5 noise-cancelling headphones in Midnight Black. 2 months old.",           "[\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800\"]", await C("Video-Audios"),           "Like New", uAdmin) { LtpValue = 280,  ProvinceId = pKpk,    Location = "Hayatabad, Peshawar" },
                new(Guid.NewGuid().ToString("N"), "PlayStation 5 Disc Edition",       "PS5 Disc Edition. 2 controllers + Spider-Man 2, GOW Ragnarok, FIFA 24.",         "[\"https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800\"]", await C("Games & Entertainment"),  "Good",     uA)     { LtpValue = 750,  ProvinceId = pSindh,  Location = "Gulshan-e-Iqbal, Karachi" },
                
                // Cameras & Power
                new(Guid.NewGuid().ToString("N"), "Sony A7 IV Full Frame Mirrorless", "Sony Alpha A7 IV body. Under 5000 shutter count. Excellent for photo/video.",    "[\"https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800\"]", await C("Cameras & Accessories"),  "Like New", uB)     { LtpValue = 1500, ProvinceId = pPunjab, Location = "Johar Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "APC Smart-UPS 1500VA",             "APC Smart-UPS 1500VA LCD 230V. New batteries 6 months ago.",                     "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Generators, UPS & Power Solutions"), "Good", uC) { LtpValue = 200,  ProvinceId = pSindh,  Location = "PECHS, Karachi" },
                
                // Vehicles & Bikes
                new(Guid.NewGuid().ToString("N"), "Toyota Corolla GLI 2020",          "Corolla GLI 2020. 1.3L, 45,000 km. Excellent condition, company maintained.",    "[\"https://images.unsplash.com/photo-1549399542-7d3b2a5a87c4?w=800\"]", await C("Cars"),                   "Good",     uAdmin) { LtpValue = 5000, ProvinceId = pPunjab, Location = "Allama Iqbal Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Honda Civic RS Turbo 2022",        "Civic RS Turbo 2022. 1.5L VTEC Turbo. 25,000 km. Platinum White Pearl.",        "[\"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800\"]", await C("Cars"),                   "Like New", uA)     { LtpValue = 7500, ProvinceId = pSindh,  Location = "Bahria Town, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Suzuki Swift 2021 on Installments","Swift 1.2 Hatchback 2021. Low down payment option. 60,000 km.",                  "[\"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800\"]", await C("Cars on Installments"),   "Good",     uB)     { LtpValue = 2800, ProvinceId = pPunjab, Location = "Satellite Town, Rawalpindi" },
                new(Guid.NewGuid().ToString("N"), "Toyota Hiace Grand Cabin 2019",    "Hiace Grand Cabin 2019. 13-seater diesel. Used for school van.",                  "[\"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800\"]", await C("Buses, Vans & Trucks"),   "Good",     uC)     { LtpValue = 6000, ProvinceId = pKpk,    Location = "Ring Road, Peshawar" },
                new(Guid.NewGuid().ToString("N"), "CNG Rickshaw 2020",                "CNG Rickshaw 2020. Low mileage, good condition. Ideal for transport.",            "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Other Vehicles"),          "Good",     uAdmin) { LtpValue = 800,  ProvinceId = pPunjab, Location = "Faisalabad" },
                new(Guid.NewGuid().ToString("N"), "Honda CD 70 2023",                 "CD 70 2023. Only 8,000 km. Black. New condition, regularly serviced.",            "[\"https://images.unsplash.com/photo-1558618047-f0ae79b0ad73?w=800\"]", await C("Bikes & Motorcycles"),    "Like New", uA)     { LtpValue = 180,  ProvinceId = pSindh,  Location = "North Nazimabad, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Trek Marlin 7 Mountain Bike 2022", "Trek Marlin 7 MTB. Size Medium. 27.5-inch wheels. Excellent for trails.",        "[\"https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=800\"]", await C("Bicycles"),               "Good",     uB)     { LtpValue = 220,  ProvinceId = pPunjab, Location = "Gulberg, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Unique Power 70cc Scooty 2022",    "70cc automatic scooty. Perfect for ladies. Low mileage.",                         "[\"https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800\"]", await C("Scooty & Scooters"),      "Like New", uC)     { LtpValue = 120,  ProvinceId = pKpk,    Location = "Abbottabad" },
                new(Guid.NewGuid().ToString("N"), "Chingchi Rickshaw Loader 2021",    "3-wheel loader 2021. Diesel. Good for small businesses. 15,000 km.",             "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Rickshaw & Chingchi"),    "Good",     uAdmin) { LtpValue = 350,  ProvinceId = pSindh,  Location = "Hyderabad" },
                new(Guid.NewGuid().ToString("N"), "Polaris Sportsman 450 ATV 2020",   "Polaris 450 ATV. Farm & off-road use. Good condition with spare parts.",          "[\"https://images.unsplash.com/photo-1558618047-3c8c76ca7d00?w=800\"]", await C("ATV & Quads"),            "Good",     uA)     { LtpValue = 900,  ProvinceId = pKpk,    Location = "Swat Valley" },
                
                // Parts & Care
                new(Guid.NewGuid().ToString("N"), "Toyota Corolla Bumper Set 2018-21","Original Toyota front & rear bumper set. Pearl White. Perfect condition.",       "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Spare Parts"),            "Like New", uB)     { LtpValue = 80,   ProvinceId = pPunjab, Location = "Shahdara, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Meguiar's Premium Car Care Kit",   "Complete car care kit: wax, polish, clay bar, microfiber cloths. Barely used.",  "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Car Care"),               "Like New", uC)     { LtpValue = 30,   ProvinceId = pSindh,  Location = "Defence, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Pioneer 9\" Car Touchscreen",      "Pioneer AVH-Z9250BT Android Auto & Apple CarPlay. Perfect working condition.",   "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Cars Accessories"),       "Like New", uAdmin) { LtpValue = 150,  ProvinceId = pPunjab, Location = "Township, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Honda CD 70 Chrome Panel Set",     "Complete chrome side panel decoration for Honda CD 70. New and unused.",         "[\"https://images.unsplash.com/photo-1558618047-f0ae79b0ad73?w=800\"]", await C("Bikes Accessories"),      "New",      uA)     { LtpValue = 15,   ProvinceId = pKpk,    Location = "Peshawar Cantt" },
                new(Guid.NewGuid().ToString("N"), "Motul 7100 4T 10W40 Oil (4L)",    "Motul full synthetic motorcycle oil 4L. Original sealed.",                       "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Bike Care"),              "New",      uB)     { LtpValue = 12,   ProvinceId = pPunjab, Location = "Multan" },
                new(Guid.NewGuid().ToString("N"), "Castrol GTX 20W50 Motor Oil x4",  "4 cans Castrol GTX 20W50 motor oil. Bulk lot. Unopened original.",               "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Oil & Lubricants"),       "New",      uC)     { LtpValue = 25,   ProvinceId = pSindh,  Location = "Korangi, Karachi" },

                // Lifestyle & Clothes
                new(Guid.NewGuid().ToString("N"), "Branded Gents Suit Bundle x5",    "5 branded men formal suits (Bonanza, Cross). Sizes M-L. Barely worn.",           "[\"https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800\"]", await C("Clothes"),               "Like New", uAdmin) { LtpValue = 120,  ProvinceId = pPunjab, Location = "Cavalry Ground, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Nike Air Max 270 Size 10 US",      "Nike Air Max 270 Black/White. US Size 10. Worn twice. Original box.",             "[\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800\"]", await C("Footwear"),               "Like New", uA)     { LtpValue = 85,   ProvinceId = pSindh,  Location = "Saddar, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Samsonite 75cm Hardshell Trolley","Samsonite Cosmolite 3.0 75cm spinner Silver. 1 trip used.",                      "[\"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800\"]", await C("Bags"),                   "Like New", uB)     { LtpValue = 180,  ProvinceId = pPunjab, Location = "Bahria Town Phase 4, Rawalpindi" },
                new(Guid.NewGuid().ToString("N"), "Casio G-Shock GA-2100 Casioak",   "Casio G-Shock all black. New with original packaging. Never worn.",              "[\"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800\"]", await C("Watches"),               "New",      uC)     { LtpValue = 75,   ProvinceId = pKpk,    Location = "Mardan" },
                new(Guid.NewGuid().ToString("N"), "Bridal Lehenga Set Full Size M",  "Premium bridal lehenga + dupatta + blouse. Red & gold embroidery. Worn once.",   "[\"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800\"]", await C("Wedding"),               "Like New", uAdmin) { LtpValue = 250,  ProvinceId = pPunjab, Location = "Wapda Town, Lahore" },

                // Personal Care & Jewellery
                new(Guid.NewGuid().ToString("N"), "Charlotte Tilbury Makeup Bundle", "CT pillow talk bundle: lipstick, liner, eye shadow. Original & unused.",         "[\"https://images.unsplash.com/photo-1631214524020-3c69b4bef469?w=800\"]", await C("Makeup"),                "New",      uA)     { LtpValue = 90,   ProvinceId = pSindh,  Location = "Clifton, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Dyson Supersonic Hair Dryer",     "Dyson Supersonic Fuchsia/Nickel. Used 5 times. All attachments included.",       "[\"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800\"]", await C("Skin & Hair"),           "Like New", uB)     { LtpValue = 300,  ProvinceId = pPunjab, Location = "DHA Phase 1, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Dior Sauvage EDP 100ml Sealed",   "Dior Sauvage EDP 100ml factory sealed. 100% authentic. Purchased from abroad.",  "[\"https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=800\"]", await C("Fragrance"),             "New",      uC)     { LtpValue = 120,  ProvinceId = pSindh,  Location = "PECHS, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Bath & Body Works 10-piece Set",  "BBW gift set: body lotions, shower gels, hand soaps. Sealed.",                   "[\"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800\"]", await C("Bath & Body"),           "New",      uAdmin) { LtpValue = 55,   ProvinceId = pPunjab, Location = "Gulberg V, Lahore" },
                new(Guid.NewGuid().ToString("N"), "22K Gold Bridal Necklace Set",    "Pure 22K gold necklace + earrings + tikka. 55 grams total.",                     "[\"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800\"]", await C("Jewellery"),             "Like New", uA)     { LtpValue = 2200, ProvinceId = pSindh,  Location = "Tariq Road, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Gucci GG Marmont Sunglasses",     "Gucci cat-eye sunglasses in black. Authentic with case. Worn twice.",             "[\"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800\"]", await C("Fashion Accessories"),   "Like New", uB)     { LtpValue = 180,  ProvinceId = pPunjab, Location = "Model Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Jewellery Making Kit 500pcs",     "Complete jewellery making kit: 500 beads, wires, clasps, pliers. Barely used.",  "[\"https://images.unsplash.com/photo-1569401988-a0e1ff534d72?w=800\"]", await C("DIY Jewellery"),         "Like New", uC)     { LtpValue = 20,   ProvinceId = pKpk,    Location = "Abbottabad" },

                // Kids & Baby
                new(Guid.NewGuid().ToString("N"), "Kids Designer Clothes Bundle 5-6","10 branded kids clothes (H&M, Zara Kids). Age 5-6. Excellent condition.",        "[\"https://images.unsplash.com/photo-1471286174890-9c112ac6be2f?w=800\"]", await C("Kids Clothing"),         "Like New", uAdmin) { LtpValue = 40,   ProvinceId = pPunjab, Location = "Garden Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Kids School Bag + Stationery",    "High-quality school backpack with full stationery set.",                          "[\"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800\"]", await C("Kids Accessories"),      "Like New", uA)     { LtpValue = 18,   ProvinceId = pSindh,  Location = "Federal B Area, Karachi" },
                new(Guid.NewGuid().ToString("N"), "LEGO Technic Land Rover Defender","LEGO 42110 - 2573 pieces. Complete and 100% intact.",                             "[\"https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800\"]", await C("Toys"),                  "Like New", uB)     { LtpValue = 95,   ProvinceId = pPunjab, Location = "Wapda Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Chicco Baby Stroller 3-in-1",     "Chicco Trio Feel travel system (stroller + car seat + carry cot). 8 months old.", "[\"https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800\"]", await C("Baby Gear"),             "Good",     uC)     { LtpValue = 120,  ProvinceId = pSindh,  Location = "DHA City, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Kids Study Table + Chair",        "Height-adjustable kids study table + ergonomic chair. Blue. Used 1 year.",       "[\"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\"]", await C("Kids Furniture"),        "Good",     uAdmin) { LtpValue = 35,   ProvinceId = pPunjab, Location = "Allama Iqbal Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Kids Electric Ride-On BMW Car",   "BMW-style kids 12V ride-on car. Remote control, MP3 player. Age 3-7.",           "[\"https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800\"]", await C("Kids Vehicles"),         "Good",     uA)     { LtpValue = 60,   ProvinceId = pSindh,  Location = "Gulshan-e-Iqbal, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Kids Outdoor Swing + Slide Set",  "Plastic swing and slide combo. For ages 2-8. Slight sun fading only.",           "[\"https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=800\"]", await C("Swings & Slides"),       "Good",     uB)     { LtpValue = 45,   ProvinceId = pPunjab, Location = "Johar Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Baby Bath Tub + Accessories Kit", "Baby bathing set: tub, thermometer, towel, shampoo cup, seat. Near new.",        "[\"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800\"]", await C("Bath & Diapers"),        "Like New", uC)     { LtpValue = 22,   ProvinceId = pKpk,    Location = "Nowshera" },

                // Hobbies & Recreation
                new(Guid.NewGuid().ToString("N"), "CSS/UPSC Prep Books Bundle 25pcs","25 books covering all CSS/UPSC subjects. Excellent condition with notes.",        "[\"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800\"]", await C("Books & Magazines"),     "Good",     uAdmin) { LtpValue = 50,   ProvinceId = pPunjab, Location = "Satellite Town, Rawalpindi" },
                new(Guid.NewGuid().ToString("N"), "Yonex Badminton Racket Set",      "2x Yonex Nanoflare 700 + 3 tubes shuttlecocks. Excellent condition.",             "[\"https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800\"]", await C("Sports Equipment"),      "Like New", uA)     { LtpValue = 80,   ProvinceId = pSindh,  Location = "Nazimabad, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Olympic Barbell + 100kg Plates",  "Olympic 7ft barbell + 100kg plates. Used 1 year. Great for home gym.",            "[\"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800\"]", await C("Gym & Fitness"),         "Good",     uB)     { LtpValue = 160,  ProvinceId = pPunjab, Location = "Walled City, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Yamaha F310 Acoustic Guitar",     "Yamaha F310 full-size guitar + bag, picks, capo. Great for beginners.",           "[\"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800\"]", await C("Musical Instruments"),   "Good",     uC)     { LtpValue = 65,   ProvinceId = pKpk,    Location = "Mansehra" },
                new(Guid.NewGuid().ToString("N"), "Decathlon 4-Person Camping Tent", "Quechua 4-man tent. Used 3 times. Water resistant, easy setup.",                  "[\"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800\"]", await C("Camping & Hiking"),      "Like New", uAdmin) { LtpValue = 55,   ProvinceId = pPunjab, Location = "Jhelum" },
                new(Guid.NewGuid().ToString("N"), "1992 World Cup Cricket Memorabilia","Rare: signed balls, photos, match programs from 1992 World Cup.",               "[\"https://images.unsplash.com/photo-1540747913346-19212a4b423c?w=800\"]", await C("Collectables"),          "Good",     uA)     { LtpValue = 200,  ProvinceId = pSindh,  Location = "Saddar, Karachi" },
                
                // Arts & Crafts
                new(Guid.NewGuid().ToString("N"), "Arteza Acrylic Paint Set 72 colors","Professional 72-color acrylic paint set, 22ml tubes. Half used.",              "[\"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800\"]", await C("Arts & Crafts"),         "Good",     uB)     { LtpValue = 30,   ProvinceId = pPunjab, Location = "Gulberg, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Cricut Explore Air 2 Cutter",     "Cricut Explore Air 2 + mat bundle, vinyl rolls, tools. 6 months old.",           "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Crafts & DIY Supplies"), "Good",     uC)     { LtpValue = 110,  ProvinceId = pSindh,  Location = "DHA Phase 8, Karachi" },
                
                // Home Appliances
                new(Guid.NewGuid().ToString("N"), "Dawlance Inverter Fridge 16 cu.ft","Dawlance Inverter Refrigerator 16 cu.ft. Excellent cooling. 2 years old.",      "[\"https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800\"]", await C("Refrigerators & Freezers"), "Good", uAdmin) { LtpValue = 350,  ProvinceId = pPunjab, Location = "Faisalabad City" },
                new(Guid.NewGuid().ToString("N"), "Gree 1.5 Ton Inverter AC",        "Gree 1.5 Ton Inverter AC. 3 years old, recently serviced.",                      "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("AC & Coolers"),           "Good",     uA)     { LtpValue = 280,  ProvinceId = pSindh,  Location = "Korangi, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Haier Front Load Washer 8kg",     "Haier 8kg front-load washing machine. 1400 RPM, Wi-Fi. 2 years old.",            "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Washing Machines & Dryers"), "Good", uB) { LtpValue = 220,  ProvinceId = pPunjab, Location = "DHA Phase 2, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Dawlance Microwave Oven 30L",     "Dawlance 30L microwave with grill. 900W. Excellent condition.",                   "[\"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800\"]", await C("Microwaves & Ovens"),    "Good",     uC)     { LtpValue = 80,   ProvinceId = pKpk,    Location = "Risalpur" },
                new(Guid.NewGuid().ToString("N"), "Philips Air Fryer HD9252 4.1L",   "Philips Essential Air Fryer 4.1L. Rapid Air tech. 1 year old.",                  "[\"https://images.unsplash.com/photo-1565183997392-2f6f122e5912?w=800\"]", await C("Kitchen Appliances"),    "Like New", uAdmin) { LtpValue = 90,   ProvinceId = pPunjab, Location = "Valencia Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Kenwood Hot & Cold Water Dispenser","Kenwood water dispenser + fridge cabinet. 2 years old. Fully functional.",     "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Water Dispensers"),      "Good",     uA)     { LtpValue = 70,   ProvinceId = pSindh,  Location = "North Karachi" },
                new(Guid.NewGuid().ToString("N"), "Usha 56\" Ceiling Fan w/ Remote", "Usha ceiling fan 56-inch with remote. Energy saver. 1 year old.",                "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Fans"),                   "Like New", uB)     { LtpValue = 35,   ProvinceId = pPunjab, Location = "Gujranwala" },
                new(Guid.NewGuid().ToString("N"), "Cannon Electric Geyser 10 Gallon","Cannon 10-gallon electric geyser with thermostat. 2 years old.",                 "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Heaters & Geysers"),     "Good",     uC)     { LtpValue = 45,   ProvinceId = pKpk,    Location = "Haripur" },
                new(Guid.NewGuid().ToString("N"), "Dyson Pure Cool TP04 Air Purifier","Dyson TP04 tower fan + air purifier. Captures 99.97% of particles.",             "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Air Purifiers & Humidifiers"), "Like New", uAdmin) { LtpValue = 280, ProvinceId = pPunjab, Location = "Bahria Orchard, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Singer Heavy Duty Sewing Machine", "Singer 4452 heavy duty. 32 stitches, 1100 SPM. 2 years old.",                   "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Sewing Machines"),       "Good",     uA)     { LtpValue = 95,   ProvinceId = pSindh,  Location = "Liaquatabad, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Philips PerfectCare Steam Iron",  "Philips PerfectCare Elite steam generator. 6 bar, 120g/min. Like new.",           "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Irons & Steamers"),      "Like New", uB)     { LtpValue = 55,   ProvinceId = pPunjab, Location = "Cantt, Lahore" },

                // Furniture & Decor
                new(Guid.NewGuid().ToString("N"), "7-Seater L-Shape Sofa (Fabric)",  "7-seater L-shaped sofa dark grey fabric. 2 years old. No damage.",               "[\"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800\"]", await C("Sofa & Chairs"),         "Good",     uC)     { LtpValue = 400,  ProvinceId = pSindh,  Location = "Gulshan-e-Hadeed, Karachi" },
                new(Guid.NewGuid().ToString("N"), "King Size Bed + 6-Door Wardrobe", "Solid wood king bed + matching wardrobe. Walnut finish. 3 years old.",            "[\"https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800\"]", await C("Beds & Wardrobes"),      "Good",     uAdmin) { LtpValue = 600,  ProvinceId = pPunjab, Location = "Sabzazar, Lahore" },
                new(Guid.NewGuid().ToString("N"), "6-Seater Dining Table + Chairs",  "Solid wood 6-seater dining table + padded chairs. Honey oak. 2 years old.",      "[\"https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800\"]", await C("Tables & Dining"),       "Good",     uA)     { LtpValue = 350,  ProvinceId = pSindh,  Location = "North Nazimabad, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Herman Miller Aeron Chair",       "Herman Miller Aeron Size B. Fully adjustable. Excellent lumbar support.",         "[\"https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800\"]", await C("Office Furniture"),      "Good",     uB)     { LtpValue = 350,  ProvinceId = pPunjab, Location = "I-8, Islamabad" },
                new(Guid.NewGuid().ToString("N"), "Boho Macrame Wall Hangings x5",   "5 large handmade macrame wall hangings. Natural cotton thread.",                  "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Home Decoration"),       "Like New", uC)     { LtpValue = 40,   ProvinceId = pKpk,    Location = "Mingora, Swat" },
                new(Guid.NewGuid().ToString("N"), "Philips Hue Smart Lighting Kit",  "Philips Hue White & Colour kit: bridge + 4 bulbs. Works perfectly.",             "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Lighting"),              "Like New", uAdmin) { LtpValue = 120,  ProvinceId = pPunjab, Location = "Johar Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Ornate Gold Frame Mirror 48x36",  "Large ornate gold frame wall mirror 48x36 inches. Excellent condition.",          "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Painting & Mirrors"),    "Like New", uA)     { LtpValue = 85,   ProvinceId = pSindh,  Location = "Gulshan-e-Iqbal, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Persian Hand-Knotted Carpet 8x10","Authentic Persian wool carpet in red/navy. 8x10 ft.",                             "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Rugs & Carpets"),        "Good",     uB)     { LtpValue = 450,  ProvinceId = pPunjab, Location = "Model Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Blackout Curtains 4-panel 8ft",   "4-panel blackout curtain set dark charcoal. 8 feet tall. Used 1 year.",           "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Curtains & Blinds"),     "Like New", uC)     { LtpValue = 30,   ProvinceId = pSindh,  Location = "PECHS, Karachi" },

                // Household Tools & DIY
                new(Guid.NewGuid().ToString("N"), "Prestige Pressure Cooker Set x3", "Prestige cooker set: 2L, 3L, 5L stainless steel. Barely used.",                  "[\"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800\"]", await C("Kitchen Essentials"),    "Like New", uAdmin) { LtpValue = 45,   ProvinceId = pPunjab, Location = "Township, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Dyson V11 Cordless Vacuum",       "Dyson V11 Absolute cordless vacuum. All attachments. 1.5 years old.",             "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Home Essentials"),       "Good",     uA)     { LtpValue = 280,  ProvinceId = pSindh,  Location = "Defence, Karachi" },
                new(Guid.NewGuid().ToString("N"), "TOTO Washlet C200 Bidet Seat",    "TOTO electric bidet toilet seat. Elongated. Remote control.",                     "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Bathroom Accessories"),  "Like New", uB)     { LtpValue = 150,  ProvinceId = pPunjab, Location = "Bahria Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Weber Spirit II E-310 Gas Grill", "Weber Spirit II 3-burner propane grill. Used 5 times. Perfect condition.",        "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Garden & Outdoor"),      "Like New", uC)     { LtpValue = 220,  ProvinceId = pSindh,  Location = "Clifton, Karachi" },
                new(Guid.NewGuid().ToString("N"), "Bosch 18V Pro Tool Kit 5-piece",  "Bosch 18V combo: drill, circular saw, jigsaw, reciprocating saw, impact driver.", "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Tools & DIY Equipment"), "Like New", uAdmin) { LtpValue = 280,  ProvinceId = pPunjab, Location = "Shalimar Town, Lahore" },
                new(Guid.NewGuid().ToString("N"), "Tile Cutter + Grout Pro Set",     "Professional 36-inch tile cutter + grout, spacers, adhesive. 1 project used.",   "[\"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800\"]", await C("Home DIY & Renovations"), "Good", uA)     { LtpValue = 60,   ProvinceId = pSindh,  Location = "Surjani Town, Karachi" }
            };

            // To avoid EF Core MERGE batch constraint errors, save each item individually!
            foreach (var item in itemsToSeed)
            {
                Items.Add(item);
                await SaveChangesAsync();
            }
        }

        // 5. Seed Messages
        if (!await Messages.AnyAsync())
        {
            var mA = (await Users.FirstAsync(u => u.Email == "userA@example.com")).Id;
            var mB = (await Users.FirstAsync(u => u.Email == "userB@example.com")).Id;
            var mC = (await Users.FirstAsync(u => u.Email == "userC@example.com")).Id;
            var mD = (await Users.FirstAsync(u => u.Email == "admin@example.com")).Id;
            Messages.AddRange(
                new Message(Guid.NewGuid().ToString("N"), mA, mB, "Hey Sara! Is your MacBook Air still available?")         { CreatedAt = DateTime.UtcNow.AddHours(-5) },
                new Message(Guid.NewGuid().ToString("N"), mB, mA, "Hi Ali! Yes it is. What are you offering in exchange?")   { CreatedAt = DateTime.UtcNow.AddHours(-4).AddMinutes(-50) },
                new Message(Guid.NewGuid().ToString("N"), mA, mB, "I have an iPhone 15 Pro Max 256GB. Interested?")          { CreatedAt = DateTime.UtcNow.AddHours(-4).AddMinutes(-45) },
                new Message(Guid.NewGuid().ToString("N"), mB, mA, "Sounds fair! Can we meet in Gulberg to inspect items?")   { CreatedAt = DateTime.UtcNow.AddHours(-4) },
                new Message(Guid.NewGuid().ToString("N"), mA, mB, "Absolutely, Saturday at 4pm works for me!")               { CreatedAt = DateTime.UtcNow.AddHours(-3).AddMinutes(-30) },
                new Message(Guid.NewGuid().ToString("N"), mC, mD, "Hi Admin, I need help verifying my account.")             { CreatedAt = DateTime.UtcNow.AddHours(-2) },
                new Message(Guid.NewGuid().ToString("N"), mD, mC, "Hello Hamza! Send your CNIC details to proceed.")         { CreatedAt = DateTime.UtcNow.AddHours(-1).AddMinutes(-45) },
                new Message(Guid.NewGuid().ToString("N"), mB, mC, "Hamza, interested in swapping PS5 for my Samsung TV?")   { CreatedAt = DateTime.UtcNow.AddMinutes(-30) },
                new Message(Guid.NewGuid().ToString("N"), mC, mB, "Interesting! Can you add some LTP to balance it out?")   { CreatedAt = DateTime.UtcNow.AddMinutes(-20) }
            );
            await SaveChangesAsync();
        }

        // 6. Seed Trades, Offers, Reviews, Disputes, Notifications
        if (!await Trades.AnyAsync())
        {
            var tAdmin = (await Users.FirstAsync(u => u.Email == "admin@example.com")).Id;
            var tA     = (await Users.FirstAsync(u => u.Email == "userA@example.com")).Id;
            var tB     = (await Users.FirstAsync(u => u.Email == "userB@example.com")).Id;
            var tC     = (await Users.FirstAsync(u => u.Email == "userC@example.com")).Id;

            var iphone  = await Items.AsNoTracking().FirstOrDefaultAsync(i => i.Title.Contains("iPhone 15 Pro Max"));
            var macbook = await Items.AsNoTracking().FirstOrDefaultAsync(i => i.Title.Contains("MacBook Air M2"));
            var ps5     = await Items.AsNoTracking().FirstOrDefaultAsync(i => i.Title.Contains("PlayStation 5"));
            var tv      = await Items.AsNoTracking().FirstOrDefaultAsync(i => i.Title.Contains("Samsung 65"));
            var laptop  = await Items.AsNoTracking().FirstOrDefaultAsync(i => i.Title.Contains("Dell XPS 15"));

            if (macbook != null)
            {
                // Trade 1: Completed
                var t1 = new Trade(Guid.NewGuid().ToString("N"), tA, tAdmin, macbook.Id)
                    { Status = TradeStatus.Completed, CompletedAt = DateTime.UtcNow.AddDays(-5), CreatedAt = DateTime.UtcNow.AddDays(-10), UpdatedAt = DateTime.UtcNow.AddDays(-5) };
                Trades.Add(t1);
                await SaveChangesAsync();

                TradeEvents.AddRange(
                    new TradeEvent(Guid.NewGuid().ToString("N"), t1.Id, TradeStatus.Pending)    { ActorId = tA,     Note = "Trade initiated",               CreatedAt = DateTime.UtcNow.AddDays(-10) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t1.Id, TradeStatus.Accepted)   { FromStatus = TradeStatus.Pending,    ActorId = tAdmin, Note = "Seller accepted",       CreatedAt = DateTime.UtcNow.AddDays(-9) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t1.Id, TradeStatus.InProgress) { FromStatus = TradeStatus.Accepted,   ActorId = tA,     Note = "Items shipped",         CreatedAt = DateTime.UtcNow.AddDays(-7) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t1.Id, TradeStatus.Completed)  { FromStatus = TradeStatus.InProgress, ActorId = tAdmin, Note = "Seller confirmed receipt", CreatedAt = DateTime.UtcNow.AddDays(-5) }
                );
                await SaveChangesAsync();

                var o1 = new Offer(Guid.NewGuid().ToString("N"), t1.Id, tA)
                    { Status = OfferStatus.Accepted, OfferedLtp = 200, Message = "Swapping iPhone 15 Pro Max + 200 LTP for your MacBook Air M2.", ExpiresAt = DateTime.UtcNow.AddDays(-8), CreatedAt = DateTime.UtcNow.AddDays(-10) };
                if (iphone != null) o1.OfferedItemId = iphone.Id;
                Offers.Add(o1);
                await SaveChangesAsync();

                if (iphone != null) { OfferItems.Add(new OfferItem(Guid.NewGuid().ToString("N"), o1.Id, iphone.Id)); await SaveChangesAsync(); }

                Reviews.AddRange(
                    new Review(Guid.NewGuid().ToString("N"), 5, tA, tAdmin) { TradeId = t1.Id, Comment = "Excellent swap! Item exactly as described. Highly recommended!", CreatedAt = DateTime.UtcNow.AddDays(-5) },
                    new Review(Guid.NewGuid().ToString("N"), 5, tAdmin, tA) { TradeId = t1.Id, Comment = "Great trader, professional and communicative throughout.", CreatedAt = DateTime.UtcNow.AddDays(-4) }
                );
                Notifications.AddRange(
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.TradeUpdate, "Your trade for MacBook Air M2 is complete!", tA)     { Read = true,  CreatedAt = DateTime.UtcNow.AddDays(-5) },
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.TradeUpdate, "Your trade for MacBook Air M2 is complete!",   tAdmin) { Read = false, CreatedAt = DateTime.UtcNow.AddDays(-5) }
                );
                await SaveChangesAsync();
            }

            if (ps5 != null && tv != null)
            {
                // Trade 2: Accepted/Active
                var t2 = new Trade(Guid.NewGuid().ToString("N"), tB, tC, tv.Id)
                    { Status = TradeStatus.Accepted, CreatedAt = DateTime.UtcNow.AddDays(-2), UpdatedAt = DateTime.UtcNow.AddDays(-1) };
                Trades.Add(t2);
                await SaveChangesAsync();

                TradeEvents.AddRange(
                    new TradeEvent(Guid.NewGuid().ToString("N"), t2.Id, TradeStatus.Pending)  { ActorId = tB, Note = "Trade initiated",    CreatedAt = DateTime.UtcNow.AddDays(-2) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t2.Id, TradeStatus.Accepted) { FromStatus = TradeStatus.Pending, ActorId = tC, Note = "Seller accepted", CreatedAt = DateTime.UtcNow.AddDays(-1) }
                );
                var o2 = new Offer(Guid.NewGuid().ToString("N"), t2.Id, tB)
                    { Status = OfferStatus.Accepted, OfferedLtp = 150, OfferedItemId = ps5.Id, Message = "PS5 + 150 LTP for your Samsung 65\" TV.", ExpiresAt = DateTime.UtcNow.AddDays(3), CreatedAt = DateTime.UtcNow.AddDays(-2) };
                Offers.Add(o2);
                await SaveChangesAsync();

                OfferItems.Add(new OfferItem(Guid.NewGuid().ToString("N"), o2.Id, ps5.Id));
                Notifications.AddRange(
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.OfferReceived, "Sara Khan sent an offer for your Samsung TV!", tC) { Read = false, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.OfferAccepted, "Your offer for Samsung TV was accepted!", tB) { Read = false, CreatedAt = DateTime.UtcNow.AddDays(-1) }
                );
                await SaveChangesAsync();
            }

            if (laptop != null)
            {
                // Trade 3: Disputed
                var t3 = new Trade(Guid.NewGuid().ToString("N"), tC, tA, laptop.Id)
                    { Status = TradeStatus.Disputed, CreatedAt = DateTime.UtcNow.AddDays(-15), UpdatedAt = DateTime.UtcNow.AddDays(-3) };
                Trades.Add(t3);
                await SaveChangesAsync();

                TradeEvents.AddRange(
                    new TradeEvent(Guid.NewGuid().ToString("N"), t3.Id, TradeStatus.Pending)    { ActorId = tC, Note = "Trade initiated",     CreatedAt = DateTime.UtcNow.AddDays(-15) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t3.Id, TradeStatus.Accepted)   { FromStatus = TradeStatus.Pending,    ActorId = tA, Note = "Seller accepted", CreatedAt = DateTime.UtcNow.AddDays(-14) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t3.Id, TradeStatus.InProgress) { FromStatus = TradeStatus.Accepted,   ActorId = tC, Note = "Items in transit", CreatedAt = DateTime.UtcNow.AddDays(-10) },
                    new TradeEvent(Guid.NewGuid().ToString("N"), t3.Id, TradeStatus.Disputed)   { FromStatus = TradeStatus.InProgress, ActorId = tC, Note = "Buyer raised dispute", CreatedAt = DateTime.UtcNow.AddDays(-3) }
                );
                Disputes.Add(new Dispute(Guid.NewGuid().ToString("N"), "Item received has cracked screen not disclosed in listing.", tC)
                    { TradeId = t3.Id, ReportedUserId = tA, Status = DisputeStatus.UnderReview, Evidence = "Photos of cracked screen vs listing photos.", CreatedAt = DateTime.UtcNow.AddDays(-3) });
                Notifications.AddRange(
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.DisputeUpdate, "A dispute has been opened on your trade. Admin will review shortly.", tA)     { Read = false, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.DisputeUpdate, "Your dispute has been submitted and is under review.", tC)                     { Read = true,  CreatedAt = DateTime.UtcNow.AddDays(-3) },
                    new Notification(Guid.NewGuid().ToString("N"), NotificationType.Info,          "New dispute: Dell XPS 15 trade requires your review.", tAdmin)                 { Read = false, CreatedAt = DateTime.UtcNow.AddDays(-3) }
                );
                await SaveChangesAsync();
            }
        }

        // 7. Seed Suggestions
        if (!await Suggestions.AnyAsync())
        {
            var sA = (await Users.FirstAsync(u => u.Email == "userA@example.com")).Id;
            var sB = (await Users.FirstAsync(u => u.Email == "userB@example.com")).Id;
            Suggestions.AddRange(
                new Suggestion(Guid.NewGuid().ToString("N"), "Category",  "Agricultural Equipment",        sA) { IsApproved = false, CreatedAt = DateTime.UtcNow.AddDays(-7) },
                new Suggestion(Guid.NewGuid().ToString("N"), "Category",  "Solar Energy Equipment",         sB) { IsApproved = false, CreatedAt = DateTime.UtcNow.AddDays(-3) },
                new Suggestion(Guid.NewGuid().ToString("N"), "Attribute", "Warranty Period (Electronics)", sA) { IsApproved = true,  CreatedAt = DateTime.UtcNow.AddDays(-14) },
                new Suggestion(Guid.NewGuid().ToString("N"), "Category",  "Pet Supplies & Accessories",     sB) { IsApproved = false, CreatedAt = DateTime.UtcNow.AddDays(-1) }
            );
            await SaveChangesAsync();
        }

        // 8. Seed general Notifications
        if (await Notifications.CountAsync() < 5)
        {
            var nA = (await Users.FirstAsync(u => u.Email == "userA@example.com")).Id;
            var nB = (await Users.FirstAsync(u => u.Email == "userB@example.com")).Id;
            var nD = (await Users.FirstAsync(u => u.Email == "admin@example.com")).Id;
            Notifications.AddRange(
                new Notification(Guid.NewGuid().ToString("N"), NotificationType.Info,       "Welcome to SwapIt! Complete your profile to increase your trust score.", nA) { Read = true,  CreatedAt = DateTime.UtcNow.AddDays(-30) },
                new Notification(Guid.NewGuid().ToString("N"), NotificationType.SmartMatch, "Smart Match: 3 items found matching your Samsung Galaxy S24 Ultra!",     nA) { Read = false, CreatedAt = DateTime.UtcNow.AddHours(-6) },
                new Notification(Guid.NewGuid().ToString("N"), NotificationType.ItemView,   "Your listing 'Yamaha F310 Guitar' received 15 new views today!",         nB) { Read = false, CreatedAt = DateTime.UtcNow.AddHours(-3) },
                new Notification(Guid.NewGuid().ToString("N"), NotificationType.NewMessage, "New message from Ali Raza about your MacBook Air M2 listing.",           nB) { Read = true,  CreatedAt = DateTime.UtcNow.AddHours(-5) },
                new Notification(Guid.NewGuid().ToString("N"), NotificationType.Info,       "Admin report: 12 trades completed, 2 disputes resolved this month.",     nD) { Read = false, CreatedAt = DateTime.UtcNow.AddHours(-1) }
            );
            await SaveChangesAsync();
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
