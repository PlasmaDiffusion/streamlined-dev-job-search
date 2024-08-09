public static class Logger
{
    static ILogger<Program>? logger;

    static Logger()
    {
        // create a logger factory
        var loggerFactory = LoggerFactory.Create(
            builder => builder
                        // add console as logging target
                        .AddConsole()
                        // add debug output as logging target
                        .AddDebug()
                        // set minimum level to log
                        .SetMinimumLevel(LogLevel.Debug)
        );
        logger = loggerFactory.CreateLogger<Program>();
    }

    public enum LogTypes
    {
        LOG,
        DEBUG,
        INFO,
        WARNING,
        ERROR,
        CRITICAL
    }

    public static void Log(string message, LogTypes type = LogTypes.INFO)
    {
        if (logger != null)
        {
            switch (type)
            {
                case LogTypes.LOG:
                    logger.LogTrace(message);
                    break;
                case LogTypes.DEBUG:
                    logger.LogDebug(message);
                    break;
                case LogTypes.INFO:
                    logger.LogInformation(message);
                    break;
                case LogTypes.WARNING:
                    logger.LogWarning(message);
                    break;
                case LogTypes.ERROR:
                    logger.LogError(message);
                    break;
                case LogTypes.CRITICAL:
                    logger.LogCritical(message);
                    break;
            }
        }

    }
}