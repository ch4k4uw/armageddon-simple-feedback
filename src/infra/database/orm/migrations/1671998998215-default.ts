import { MigrationInterface, QueryRunner } from "typeorm";

export class default1671998998215 implements MigrationInterface {
    name = 'default1671998998215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "role") SELECT "userId", "login", "role" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_d3f88b5a5f2c916eedb9c114260" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_d3f88b5a5f2c916eedb9c114260" UNIQUE ("userId"), CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "UQ_d3f88b5a5f2c916eedb9c114260" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, "password" text NOT NULL, CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "role", "password") SELECT "userId", "login", "role", "password" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "role") SELECT "userId", "login", "role" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
    }

}
