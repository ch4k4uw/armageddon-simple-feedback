import { MigrationInterface, QueryRunner } from "typeorm";

export class default1671995764669 implements MigrationInterface {
    name = 'default1671995764669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" text PRIMARY KEY NOT NULL, "code" text NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "author" text NOT NULL, "authorName" text NOT NULL, "expires" integer NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" text PRIMARY KEY NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "created" integer NOT NULL, "topicId" text)`);
        await queryRunner.query(`CREATE TABLE "temporary_jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_aae3510d9857f2eb79c7ffa8001" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jw-refresh-token"("id", "removed", "created", "updated", "userId") SELECT "id", "removed", "created", "updated", "userId" FROM "jw-refresh-token"`);
        await queryRunner.query(`DROP TABLE "jw-refresh-token"`);
        await queryRunner.query(`ALTER TABLE "temporary_jw-refresh-token" RENAME TO "jw-refresh-token"`);
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"), CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "role") SELECT "userId", "login", "role" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
        await queryRunner.query(`CREATE TABLE "temporary_feedback" ("id" text PRIMARY KEY NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "created" integer NOT NULL, "topicId" text, CONSTRAINT "FK_0757c5b400f6d2e77e655a366a8" FOREIGN KEY ("topicId") REFERENCES "topic" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_feedback"("id", "rating", "reason", "created", "topicId") SELECT "id", "rating", "reason", "created", "topicId" FROM "feedback"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`ALTER TABLE "temporary_feedback" RENAME TO "feedback"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" RENAME TO "temporary_feedback"`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" text PRIMARY KEY NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "created" integer NOT NULL, "topicId" text)`);
        await queryRunner.query(`INSERT INTO "feedback"("id", "rating", "reason", "created", "topicId") SELECT "id", "rating", "reason", "created", "topicId" FROM "temporary_feedback"`);
        await queryRunner.query(`DROP TABLE "temporary_feedback"`);
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "role") SELECT "userId", "login", "role" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
        await queryRunner.query(`ALTER TABLE "jw-refresh-token" RENAME TO "temporary_jw-refresh-token"`);
        await queryRunner.query(`CREATE TABLE "jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "jw-refresh-token"("id", "removed", "created", "updated", "userId") SELECT "id", "removed", "created", "updated", "userId" FROM "temporary_jw-refresh-token"`);
        await queryRunner.query(`DROP TABLE "temporary_jw-refresh-token"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "jw-refresh-token"`);
    }

}
