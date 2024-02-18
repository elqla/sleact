import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoryToType1647063094878 implements MigrationInterface {
  name = 'categoryToType1647063094878';

  // 실제 수행할 작업
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  // 롤백할 작업
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
