import { QueryRunner, TableColumn, TableIndex, TableForeignKey } from 'typeorm';

/**
 * Utility class for common migration operations
 */
export class MigrationUtils {
  /**
   * Create a timestamp column with default value
   */
  static createTimestampColumn(name: string, defaultValue: string = 'CURRENT_TIMESTAMP'): TableColumn {
    return new TableColumn({
      name,
      type: 'timestamp',
      default: defaultValue,
    });
  }

  /**
   * Create an auto-increment primary key column
   */
  static createPrimaryKeyColumn(name: string = 'id'): TableColumn {
    return new TableColumn({
      name,
      type: 'int',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'increment',
    });
  }

  /**
   * Create a UUID primary key column
   */
  static createUuidPrimaryKeyColumn(name: string = 'id'): TableColumn {
    return new TableColumn({
      name,
      type: 'uuid',
      isPrimary: true,
      isGenerated: true,
      generationStrategy: 'uuid',
    });
  }

  /**
   * Create a foreign key column
   */
  static createForeignKeyColumn(name: string, type: string = 'int'): TableColumn {
    return new TableColumn({
      name,
      type,
    });
  }

  /**
   * Create a standard foreign key constraint
   */
  static createForeignKey(
    columnName: string,
    referencedTable: string,
    referencedColumn: string = 'id',
    onDelete: 'RESTRICT' | 'CASCADE' | 'SET NULL' = 'RESTRICT',
  ): TableForeignKey {
    return new TableForeignKey({
      columnNames: [columnName],
      referencedTableName: referencedTable,
      referencedColumnNames: [referencedColumn],
      onDelete,
      name: `FK_${columnName.toUpperCase()}_${referencedTable.toUpperCase()}`,
    });
  }

  /**
   * Create a standard index
   */
  static createIndex(tableName: string, columnNames: string[], isUnique: boolean = false): TableIndex {
    const indexName = `IDX_${tableName.toUpperCase()}_${columnNames.join('_').toUpperCase()}`;
    return new TableIndex({
      name: indexName,
      columnNames,
      isUnique,
    });
  }

  /**
   * Safely add column if it doesn't exist
   */
  static async addColumnIfNotExists(
    queryRunner: QueryRunner,
    tableName: string,
    column: TableColumn,
  ): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const existingColumn = table?.findColumnByName(column.name);
    
    if (!existingColumn) {
      await queryRunner.addColumn(tableName, column);
    }
  }

  /**
   * Safely drop column if it exists
   */
  static async dropColumnIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    columnName: string,
  ): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const existingColumn = table?.findColumnByName(columnName);
    
    if (existingColumn) {
      await queryRunner.dropColumn(tableName, columnName);
    }
  }

  /**
   * Safely create index if it doesn't exist
   */
  static async createIndexIfNotExists(
    queryRunner: QueryRunner,
    tableName: string,
    index: TableIndex,
  ): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const existingIndex = table?.indices.find(i => i.name === index.name);
    
    if (!existingIndex) {
      await queryRunner.createIndex(tableName, index);
    }
  }

  /**
   * Safely drop index if it exists
   */
  static async dropIndexIfExists(
    queryRunner: QueryRunner,
    tableName: string,
    indexName: string,
  ): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    const existingIndex = table?.indices.find(i => i.name === indexName);
    
    if (existingIndex) {
      await queryRunner.dropIndex(tableName, indexName);
    }
  }

  /**
   * Execute SQL with error handling and logging
   */
  static async executeSql(
    queryRunner: QueryRunner,
    sql: string,
    description?: string,
  ): Promise<any> {
    try {
      if (description) {
        console.log(`Executing: ${description}`);
      }
      return await queryRunner.query(sql);
    } catch (error) {
      console.error(`Failed to execute SQL${description ? ` (${description})` : ''}: ${sql}`);
      throw error;
    }
  }

  /**
   * Create audit columns (createdAt, updatedAt, createdBy, updatedBy)
   */
  static createAuditColumns(includeUserFields: boolean = false): TableColumn[] {
    const columns = [
      new TableColumn({
        name: 'createdAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    ];

    if (includeUserFields) {
      columns.push(
        new TableColumn({
          name: 'createdBy',
          type: 'int',
          isNullable: true,
        }),
        new TableColumn({
          name: 'updatedBy',
          type: 'int',
          isNullable: true,
        }),
      );
    }

    return columns;
  }
}