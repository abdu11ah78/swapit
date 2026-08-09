BEGIN TRANSACTION;

-- Categories
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Categories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Categories] (
        [Id] nvarchar(64) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [Icon] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
    );
END

-- Provinces
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Provinces]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Provinces] (
        [Id] nvarchar(64) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Provinces] PRIMARY KEY ([Id])
    );
END

-- Users PhoneNumber
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Users]') AND name = N'PhoneNumber')
BEGIN
    ALTER TABLE [Users] ADD [PhoneNumber] nvarchar(max) NULL;
END

-- Items Columns
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Items]') AND name = N'Category')
BEGIN
    ALTER TABLE [Items] DROP COLUMN [Category];
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Items]') AND name = N'CategoryId')
BEGIN
    ALTER TABLE [Items] ADD [CategoryId] nvarchar(64) NOT NULL DEFAULT '';
END

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Items]') AND name = N'ProvinceId')
BEGIN
    ALTER TABLE [Items] ADD [ProvinceId] nvarchar(64) NULL;
END

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[Items]') AND name = N'Location')
BEGIN
    ALTER TABLE [Items] ALTER COLUMN [Location] nvarchar(max) NULL;
END

-- CategoryAttributes
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[CategoryAttributes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [CategoryAttributes] (
        [Id] nvarchar(64) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [Type] nvarchar(50) NOT NULL,
        [Options] nvarchar(max) NULL,
        [IsRequired] bit NOT NULL,
        [CategoryId] nvarchar(64) NOT NULL,
        CONSTRAINT [PK_CategoryAttributes] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_CategoryAttributes_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE CASCADE
    );
END

-- Suggestions
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Suggestions]') AND type in (N'U'))
BEGIN
    CREATE TABLE [Suggestions] (
        [Id] nvarchar(64) NOT NULL,
        [Type] nvarchar(50) NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [IsApproved] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UserId] nvarchar(64) NOT NULL,
        CONSTRAINT [PK_Suggestions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Suggestions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
END

-- ItemAttributeValues
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[ItemAttributeValues]') AND type in (N'U'))
BEGIN
    CREATE TABLE [ItemAttributeValues] (
        [Id] nvarchar(64) NOT NULL,
        [ItemId] nvarchar(64) NOT NULL,
        [AttributeId] nvarchar(64) NOT NULL,
        [Value] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ItemAttributeValues] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ItemAttributeValues_CategoryAttributes_AttributeId] FOREIGN KEY ([AttributeId]) REFERENCES [CategoryAttributes] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_ItemAttributeValues_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE
    );
END

-- Indexes & Foreign Keys
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Items_CategoryId' AND object_id = OBJECT_ID(N'[Items]'))
BEGIN
    CREATE INDEX [IX_Items_CategoryId] ON [Items] ([CategoryId]);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Items_ProvinceId' AND object_id = OBJECT_ID(N'[Items]'))
BEGIN
    CREATE INDEX [IX_Items_ProvinceId] ON [Items] ([ProvinceId]);
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = N'FK_Items_Categories_CategoryId')
BEGIN
    ALTER TABLE [Items] ADD CONSTRAINT [FK_Items_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE NO ACTION;
END

IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = N'FK_Items_Provinces_ProvinceId')
BEGIN
    ALTER TABLE [Items] ADD CONSTRAINT [FK_Items_Provinces_ProvinceId] FOREIGN KEY ([ProvinceId]) REFERENCES [Provinces] ([Id]) ON DELETE SET NULL;
END

-- Record Migration
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20260501151834_TaxonomyScriptOnly')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260501151834_TaxonomyScriptOnly', N'10.0.5');
END

COMMIT;
