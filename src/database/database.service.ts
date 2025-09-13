import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Check if database connection is healthy
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.dataSource.isInitialized) {
        return false;
      }
      
      // Test query to ensure database is responding
      await this.dataSource.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }

  /**
   * Get database connection info
   */
  getConnectionInfo(): any {
    const { host, port, database, username } = this.dataSource.options as any;
    return {
      host,
      port,
      database,
      username,
      isInitialized: this.dataSource.isInitialized,
      driverType: this.dataSource.driver.options.type,
    };
  }

  /**
   * Execute raw SQL query (use with caution)
   */
  async executeRawQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.dataSource.query(query, parameters);
    } catch (error) {
      this.logger.error('Raw query execution failed:', error);
      throw error;
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<any> {
    try {
      const stats = await this.dataSource.query(`
        SELECT 
          schemaname as schema_name,
          tablename as table_name,
          n_tup_ins as inserts,
          n_tup_upd as updates,
          n_tup_del as deletes,
          n_live_tup as live_tuples,
          n_dead_tup as dead_tuples
        FROM pg_stat_user_tables 
        ORDER BY schemaname, tablename;
      `);
      
      return stats;
    } catch (error) {
      this.logger.error('Failed to get database stats:', error);
      throw error;
    }
  }

  /**
   * Run database migrations programmatically
   */
  async runMigrations(): Promise<void> {
    try {
      await this.dataSource.runMigrations();
      this.logger.log('Migrations completed successfully');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Revert the last migration
   */
  async revertLastMigration(): Promise<void> {
    try {
      await this.dataSource.undoLastMigration();
      this.logger.log('Last migration reverted successfully');
    } catch (error) {
      this.logger.error('Migration revert failed:', error);
      throw error;
    }
  }

  /**
   * Get pending migrations
   */
  async getPendingMigrations(): Promise<any[]> {
    try {
      return await this.dataSource.showMigrations();
    } catch (error) {
      this.logger.error('Failed to get pending migrations:', error);
      throw error;
    }
  }
}