import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
    name = 'InitialMigration1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create producers table
        await queryRunner.query(`
            CREATE TABLE "producers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "document" character varying(14) NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_producers_document" UNIQUE ("document"),
                CONSTRAINT "PK_producers" PRIMARY KEY ("id")
            )
        `);

        // Create farms table
        await queryRunner.query(`
            CREATE TABLE "farms" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying(100) NOT NULL,
                "city" character varying(100) NOT NULL,
                "state" character varying(2) NOT NULL,
                "total_area_hectares" numeric(10,2) NOT NULL,
                "arable_area_hectares" numeric(10,2) NOT NULL,
                "vegetation_area_hectares" numeric(10,2) NOT NULL,
                "producer_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_farms" PRIMARY KEY ("id")
            )
        `);

        // Create planted_crops table
        await queryRunner.query(`
            CREATE TABLE "planted_crops" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "crop_name" character varying(100) NOT NULL,
                "harvest_season" character varying(100) NOT NULL,
                "farm_id" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_planted_crops" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "farms" 
            ADD CONSTRAINT "FK_farms_producer_id" 
            FOREIGN KEY ("producer_id") 
            REFERENCES "producers"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "planted_crops" 
            ADD CONSTRAINT "FK_planted_crops_farm_id" 
            FOREIGN KEY ("farm_id") 
            REFERENCES "farms"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_farms_producer_id" ON "farms" ("producer_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_planted_crops_farm_id" ON "planted_crops" ("farm_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_producers_document" ON "producers" ("document")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_producers_document"`);
        await queryRunner.query(`DROP INDEX "IDX_planted_crops_farm_id"`);
        await queryRunner.query(`DROP INDEX "IDX_farms_producer_id"`);

        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "planted_crops" DROP CONSTRAINT "FK_planted_crops_farm_id"`);
        await queryRunner.query(`ALTER TABLE "farms" DROP CONSTRAINT "FK_farms_producer_id"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "planted_crops"`);
        await queryRunner.query(`DROP TABLE "farms"`);
        await queryRunner.query(`DROP TABLE "producers"`);
    }
} 