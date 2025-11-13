import logger, { logError, logPerformance } from '../config/logger';

/**
 * Performance monitoring decorator for async functions
 */
export function measurePerformance(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    try {
      const result = await originalMethod.apply(this, args);
      const duration = Date.now() - start;
      logPerformance(`${target.constructor.name}.${propertyKey}`, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      logError(`Error in ${target.constructor.name}.${propertyKey}`, error as Error, { duration });
      throw error;
    }
  };

  return descriptor;
}

/**
 * Measure execution time of a function
 */
export async function measureExecutionTime<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logPerformance(operation, duration);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logError(`Error in ${operation}`, error as Error, { duration });
    throw error;
  }
}

/**
 * System health metrics
 */
export interface SystemMetrics {
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  timestamp: string;
}

/**
 * Get current system metrics
 */
export function getSystemMetrics(): SystemMetrics {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  return {
    uptime: process.uptime(),
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
      total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
    },
    cpu: {
      user: Math.round(cpuUsage.user / 1000), // microseconds to milliseconds
      system: Math.round(cpuUsage.system / 1000),
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Log system metrics periodically
 */
export function startMetricsLogging(intervalMinutes: number = 15) {
  const interval = intervalMinutes * 60 * 1000;

  setInterval(() => {
    const metrics = getSystemMetrics();
    logger.info('System Metrics', metrics);

    // Warn if memory usage is high
    if (metrics.memory.percentage > 80) {
      logger.warn('High memory usage detected', {
        percentage: metrics.memory.percentage,
        used: `${metrics.memory.used}MB`,
        total: `${metrics.memory.total}MB`,
      });
    }
  }, interval);

  // Log initial metrics
  logger.info('Metrics logging started', { intervalMinutes });
  const initialMetrics = getSystemMetrics();
  logger.info('Initial System Metrics', initialMetrics);
}

/**
 * Request tracking for monitoring
 */
export class RequestTracker {
  private static requests: Map<string, number> = new Map();
  private static errors: Map<string, number> = new Map();

  static trackRequest(endpoint: string, statusCode: number) {
    const key = `${endpoint}:${statusCode}`;
    this.requests.set(key, (this.requests.get(key) || 0) + 1);

    if (statusCode >= 400) {
      this.errors.set(endpoint, (this.errors.get(endpoint) || 0) + 1);
    }
  }

  static getStats() {
    return {
      totalRequests: Array.from(this.requests.values()).reduce((a, b) => a + b, 0),
      totalErrors: Array.from(this.errors.values()).reduce((a, b) => a + b, 0),
      requestsByEndpoint: Object.fromEntries(this.requests),
      errorsByEndpoint: Object.fromEntries(this.errors),
    };
  }

  static reset() {
    this.requests.clear();
    this.errors.clear();
  }

  static logStats() {
    const stats = this.getStats();
    logger.info('Request Statistics', stats);
  }
}

/**
 * Start periodic stats logging
 */
export function startStatsLogging(intervalMinutes: number = 30) {
  const interval = intervalMinutes * 60 * 1000;

  setInterval(() => {
    RequestTracker.logStats();
  }, interval);

  logger.info('Stats logging started', { intervalMinutes });
}
