using Mapster;
using SwapIt.Application.Features.Auth.Commands.Login;
using SwapIt.Application.Features.Auth.Commands.Register;
using SwapIt.Application.Features.Auth.Dtos;
using SwapIt.Application.Features.Disputes.Dtos;
using SwapIt.Application.Features.Items.Dtos;
using SwapIt.Application.Features.Notifications.Dtos;
using SwapIt.Application.Features.Offers.Commands.CreateOffer;
using SwapIt.Application.Features.Offers.Commands.DecideOffer;
using SwapIt.Application.Features.Offers.Dtos;
using SwapIt.Application.Features.Reviews.Dtos;
using SwapIt.Application.Features.Trades.Commands.CreateTrade;
using SwapIt.Application.Features.Trades.Dtos;
using SwapIt.Core.Entities;

namespace SwapIt.Application.Mappings;

public static class MapsterConfig
{
    public static void RegisterMappings()
    {
        TypeAdapterConfig<RegisterRequestDto, RegisterCommand>.NewConfig();
        TypeAdapterConfig<LoginRequestDto, LoginCommand>.NewConfig();
        TypeAdapterConfig<CreateOfferRequestDto, CreateOfferCommand>.NewConfig();
        TypeAdapterConfig<OfferDecisionRequestDto, DecideOfferCommand>.NewConfig();
        TypeAdapterConfig<CreateTradeRequestDto, CreateTradeCommand>.NewConfig();
        TypeAdapterConfig<User, AuthUserDto>.NewConfig();
        TypeAdapterConfig<Offer, OfferResponseDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString().ToUpperInvariant())
            .Map(dest => dest.ItemIds, src => src.Items.Select(x => x.ItemId).ToList());
        TypeAdapterConfig<TradeEvent, TradeEventDto>
            .NewConfig()
            .Map(dest => dest.FromStatus, src => src.FromStatus.HasValue ? src.FromStatus.Value.ToString().ToUpperInvariant() : null)
            .Map(dest => dest.ToStatus, src => src.ToStatus.ToString().ToUpperInvariant());
        TypeAdapterConfig<Trade, TradeResponseDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString().ToUpperInvariant())
            .Map(dest => dest.Lifecycle, src => src.Lifecycle.OrderBy(x => x.CreatedAt));
        TypeAdapterConfig<Dispute, DisputeResponseDto>
            .NewConfig()
            .Map(dest => dest.Status, src => src.Status.ToString().ToUpperInvariant());
        TypeAdapterConfig<Notification, NotificationResponseDto>
            .NewConfig()
            .Map(dest => dest.Type, src => src.Type.ToString().ToUpperInvariant());
        TypeAdapterConfig<Review, ReviewResponseDto>.NewConfig();

        TypeAdapterConfig<Item, ItemResponseDto>
            .NewConfig()
            .Map(dest => dest.OwnerName, src => src.Owner.Name)
            .Map(dest => dest.OwnerTrustScore, src => src.Owner.TrustScore)
            .Map(dest => dest.Status, src => src.Status.ToString().ToUpperInvariant())
            .Map(dest => dest.Images, src => MapsterConfig.ParseImages(src.Images));
    }

    private static string[] ParseImages(string json)
    {
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<string[]>(json) ?? [];
        }
        catch
        {
            return [];
        }
    }
}
