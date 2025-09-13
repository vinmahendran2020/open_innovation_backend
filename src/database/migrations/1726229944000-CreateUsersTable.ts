import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateUsersTable1726229944000 implements MigrationInterface {
  name = 'CreateUsersTable1726229944000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'phoneNumber',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true, // ifNotExists
    );

    // Create index on email for better query performance
    await queryRunner.createIndex(
      'users',
      new Index('IDX_USERS_EMAIL', ['email']),
    );

    // Create index on isActive for filtering active users
    await queryRunner.createIndex(
      'users',
      new Index('IDX_USERS_IS_ACTIVE', ['isActive']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes first
    await queryRunner.dropIndex('users', 'IDX_USERS_IS_ACTIVE');
    await queryRunner.dropIndex('users', 'IDX_USERS_EMAIL');
    
    // Drop the table
    await queryRunner.dropTable('users');
  }
}