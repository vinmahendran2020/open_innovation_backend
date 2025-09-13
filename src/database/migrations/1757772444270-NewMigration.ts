import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1757772444270 implements MigrationInterface {
    name = 'NewMigration1757772444270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "air_quality" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "date" date NOT NULL, "time" TIME NOT NULL, "co_gt" double precision NOT NULL, "pt08_s1_co" double precision NOT NULL, "nmhc_gt" double precision NOT NULL, "c6h6_gt" double precision NOT NULL, "pt08_s2_nmhc" double precision NOT NULL, "nox_gt" double precision NOT NULL, "pt08_s3_nox" double precision NOT NULL, "no2_gt" double precision NOT NULL, "pt08_s4_no2" double precision NOT NULL, "pt08_s5_o3" double precision NOT NULL, "t" double precision NOT NULL, "rh" double precision NOT NULL, "ah" double precision NOT NULL, CONSTRAINT "PK_a6610ad4c60b148aebb53530b37" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "air_quality"`);
    }

}
