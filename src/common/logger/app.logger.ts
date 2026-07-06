import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

function serializeMessage(message: unknown): string {
  if (message instanceof Error) {
    return message.stack ?? message.message;
  }
  if (typeof message === 'object' && message !== null) {
    try {
      return JSON.stringify(message, Object.getOwnPropertyNames(message), 2);
    } catch {
      return String(message);
    }
  }
  return String(message);
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  log(message: unknown, context?: string) {
    super.log(JSON.stringify({ level: 'log', message: serializeMessage(message), context, timestamp: new Date().toISOString() }), context);
  }

  error(message: unknown, trace?: string, context?: string) {
    super.error(JSON.stringify({ level: 'error', message: serializeMessage(message), trace, context, timestamp: new Date().toISOString() }), trace, context);
  }

  warn(message: unknown, context?: string) {
    super.warn(JSON.stringify({ level: 'warn', message: serializeMessage(message), context, timestamp: new Date().toISOString() }), context);
  }

  debug(message: unknown, context?: string) {
    super.debug(JSON.stringify({ level: 'debug', message: serializeMessage(message), context, timestamp: new Date().toISOString() }), context);
  }

  verbose(message: unknown, context?: string) {
    super.verbose(JSON.stringify({ level: 'verbose', message: serializeMessage(message), context, timestamp: new Date().toISOString() }), context);
  }

  getLogLevels(): LogLevel[] {
    return ['log', 'error', 'warn', 'debug', 'verbose'];
  }
}
