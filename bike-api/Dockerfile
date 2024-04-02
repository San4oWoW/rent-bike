FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["bike-api/bike-api/bike-api.csproj", "bike-api/"]
COPY ["bike-api/Domain/Domain.csproj", "Domain/"]
COPY ["bike-api/EFCore/EFCore.csproj", "EFCore/"]
RUN dotnet restore "bike-api/bike-api.csproj"
COPY . .
WORKDIR "/src/bike-api/bike-api"
RUN dotnet build "bike-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "bike-api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "bike-api.dll"]
