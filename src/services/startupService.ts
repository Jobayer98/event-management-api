import { organizerService } from '../api/v1/services/organizerService';
import { logger } from '../config';

export class StartupService {
  /**
   * Initialize application on startup
   */
  static async initialize(): Promise<void> {
    try {
      logger.info('🚀 Initializing application...');

      // Create default admin organizer
      await organizerService.createDefaultAdmin();

      logger.info('✅ Application initialization completed');
    } catch (error: any) {
      logger.error('❌ Application initialization failed:', error);
      throw error;
    }
  }
}

export default StartupService;