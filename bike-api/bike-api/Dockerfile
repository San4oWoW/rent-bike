#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY bike-api/bike-api.csproj bike-api/
COPY Domain/Domain.csproj Domain/
COPY EFCore/EFCore.csproj EFCore/
COPY Nuget.Config .
RUN dotnet restore "bike-api/bike-api.csproj" --configfile Nuget.Config
COPY . .
WORKDIR "/src/bike-api"
RUN dotnet build "bike-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "bike-api.csproj" -c Release -o /app/publish /p:UseAppHost=true

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT dotnet bike-api.dll