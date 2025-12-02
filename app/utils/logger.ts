/**
 * Centralized logging utility for production-ready error handling
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  userId?: string | number;
  action?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private log(level: LogLevel, message: string, context?: LogContext | Error) {
    // In production, send to monitoring service
    if (this.isProduction) {
      // TODO: Integrate with monitoring service like Sentry, LogRocket, etc.
      // this.sendToMonitoringService(level, message, context);
      return;
    }

    // In development, log to console
    if (this.isDevelopment) {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

      switch (level) {
        case 'error':
          console.error(formattedMessage, context);
          break;
        case 'warn':
          console.warn(formattedMessage, context);
          break;
        case 'info':
          console.info(formattedMessage, context);
          break;
        case 'debug':
          console.debug(formattedMessage, context);
          break;
      }
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | LogContext) {
    this.log('error', message, error);
  }

  debug(message: string, context?: LogContext) {
    // Only log debug messages in development
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  // Helper method for API errors
  apiError(endpoint: string, error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string }, status?: number }, message?: string };
    const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Unknown API error';
    this.error(`API Error [${endpoint}]: ${errorMessage}`, {
      action: endpoint,
      metadata: {
        status: axiosError?.response?.status,
        data: axiosError?.response?.data,
      }
    });
  }

  // Helper method for form validation errors
  validationError(formName: string, errors: Record<string, string[]>) {
    this.warn(`Validation failed for ${formName}`, {
      action: `${formName}_validation`,
      metadata: errors
    });
  }
}

export const logger = new Logger();