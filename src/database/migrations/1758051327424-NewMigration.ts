import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1758051327424 implements MigrationInterface {
  name = 'NewMigration1758051327424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "air_quality" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" date NOT NULL, "time" TIME NOT NULL, "co_gt" double precision NOT NULL, "pt08_s1_co" double precision NOT NULL, "nmhc_gt" double precision NOT NULL, "c6h6_gt" double precision NOT NULL, "pt08_s2_nmhc" double precision NOT NULL, "nox_gt" double precision NOT NULL, "pt08_s3_nox" double precision NOT NULL, "no2_gt" double precision NOT NULL, "pt08_s4_no2" double precision NOT NULL, "pt08_s5_o3" double precision NOT NULL, "t" double precision NOT NULL, "rh" double precision NOT NULL, "ah" double precision NOT NULL, CONSTRAINT "PK_a6610ad4c60b148aebb53530b37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5d09e0e3c5617d5514506d20e9" ON "air_quality" ("date", "time") `,
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW air_quality_daily AS SELECT
        DATE(date) AS day,
        AVG(co_gt) AS avg_co,
        AVG(nox_gt) AS avg_nox,
        AVG(no2_gt) AS avg_no2,
        AVG(c6h6_gt) AS avg_c6h6,
        AVG(t) AS avg_temp,
        AVG(rh) AS avg_rh,
        AVG(ah) AS avg_ah
        FROM air_quality
        GROUP BY DATE(date);`,
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW air_quality_weekly AS
        SELECT
        DATE_TRUNC('week', date) AS week,
        AVG(co_gt) AS avg_co,
        AVG(nox_gt) AS avg_nox,
        AVG(no2_gt) AS avg_no2,
        AVG(c6h6_gt) AS avg_c6h6,
        AVG(t) AS avg_temp,
        AVG(rh) AS avg_rh,
        AVG(ah) AS avg_ah
        FROM air_quality
        GROUP BY DATE_TRUNC('week', date)`,
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW air_quality_monthly AS
        SELECT
        DATE_TRUNC('month', date) AS month,
        AVG(co_gt) AS avg_co,
        AVG(nox_gt) AS avg_nox,
        AVG(no2_gt) AS avg_no2,
        AVG(c6h6_gt) AS avg_c6h6,
        AVG(t) AS avg_temp,
        AVG(rh) AS avg_rh,
        AVG(ah) AS avg_ah
        FROM air_quality
        GROUP BY DATE_TRUNC('month', date)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP MATERIALIZED VIEW "air_quality_monthly"`);
    await queryRunner.query(`DROP MATERIALIZED VIEW "air_quality_weekly"`);
    await queryRunner.query(`DROP MATERIALIZED VIEW "air_quality_daily"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5d09e0e3c5617d5514506d20e9"`,
    );
    await queryRunner.query(`DROP TABLE "air_quality"`);
  }
}
