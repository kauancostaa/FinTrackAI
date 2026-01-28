// Shared/Extensions/ServiceCollectionExtensions.cs
using Amazon;
using Amazon.SQS;
using FinTrackAI.Shared.RabbitMQ;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinTrackAI.Shared.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMessagingServices(this IServiceCollection services, IConfiguration configuration)
        {
            // AWS SQS
            services.AddSingleton<IAmazonSQS>(sp =>
            {
                var region = configuration["AWS:SQS:Region"];
                return new AmazonSQSClient(RegionEndpoint.GetBySystemName(region));
            });
            
            services.AddScoped<IMessageService, SqsMessageService>();
            
            // RabbitMQ
            services.AddSingleton<IRabbitMQService, RabbitMQService>();
            
            return services;
        }
    }
}
