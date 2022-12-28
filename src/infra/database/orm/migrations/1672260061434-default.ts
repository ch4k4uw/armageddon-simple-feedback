import { MigrationInterface, QueryRunner } from "typeorm";

export class default1672260061434 implements MigrationInterface {
    name = 'default1672260061434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "password" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" text PRIMARY KEY NOT NULL, "code" text NOT NULL, "title" text NOT NULL, "lowerTitle" text NOT NULL, "description" text NOT NULL, "lowerDescription" text NOT NULL, "author" text NOT NULL, "authorName" text NOT NULL, "expires" integer NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_fd5f72b33525473c6539094a95" ON "topic" ("code") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad18d6e9dc6c7e5be32f4b2ace" ON "topic" ("lowerTitle") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5bfa73441b7e1d253da5b0459" ON "topic" ("lowerDescription") `);
        await queryRunner.query(`CREATE INDEX "IDX_0eb4cfef2069a14d4db9a4638f" ON "topic" ("created") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f3ef52f7844ea6581dd393424" ON "topic" ("lowerTitle", "lowerDescription") `);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" text PRIMARY KEY NOT NULL, "topicId" text NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "lowerReason" text NOT NULL, "created" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_dd171b09e0e3c8e7a31453b016" ON "feedback" ("rating") `);
        await queryRunner.query(`CREATE INDEX "IDX_39932af13cd5ff2f000d3147f4" ON "feedback" ("lowerReason") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655" ON "feedback" ("created") `);
        await queryRunner.query(`CREATE INDEX "IDX_7faa88fd336dd60b0d92497179" ON "feedback" ("rating", "lowerReason") `);
        await queryRunner.query(`CREATE TABLE "temporary_jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar, CONSTRAINT "FK_aae3510d9857f2eb79c7ffa8001" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jw-refresh-token"("id", "removed", "created", "updated", "userId") SELECT "id", "removed", "created", "updated", "userId" FROM "jw-refresh-token"`);
        await queryRunner.query(`DROP TABLE "jw-refresh-token"`);
        await queryRunner.query(`ALTER TABLE "temporary_jw-refresh-token" RENAME TO "jw-refresh-token"`);
        await queryRunner.query(`CREATE TABLE "temporary_credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "password" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"), CONSTRAINT "FK_51dc2344d47cea3102674c64963" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_credential"("userId", "login", "password", "role") SELECT "userId", "login", "password", "role" FROM "credential"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`ALTER TABLE "temporary_credential" RENAME TO "credential"`);
        await queryRunner.query(`DROP INDEX "IDX_dd171b09e0e3c8e7a31453b016"`);
        await queryRunner.query(`DROP INDEX "IDX_39932af13cd5ff2f000d3147f4"`);
        await queryRunner.query(`DROP INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655"`);
        await queryRunner.query(`DROP INDEX "IDX_7faa88fd336dd60b0d92497179"`);
        await queryRunner.query(`CREATE TABLE "temporary_feedback" ("id" text PRIMARY KEY NOT NULL, "topicId" text NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "lowerReason" text NOT NULL, "created" integer NOT NULL, CONSTRAINT "FK_0757c5b400f6d2e77e655a366a8" FOREIGN KEY ("topicId") REFERENCES "topic" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_feedback"("id", "topicId", "rating", "reason", "lowerReason", "created") SELECT "id", "topicId", "rating", "reason", "lowerReason", "created" FROM "feedback"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`ALTER TABLE "temporary_feedback" RENAME TO "feedback"`);
        await queryRunner.query(`CREATE INDEX "IDX_dd171b09e0e3c8e7a31453b016" ON "feedback" ("rating") `);
        await queryRunner.query(`CREATE INDEX "IDX_39932af13cd5ff2f000d3147f4" ON "feedback" ("lowerReason") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655" ON "feedback" ("created") `);
        await queryRunner.query(`CREATE INDEX "IDX_7faa88fd336dd60b0d92497179" ON "feedback" ("rating", "lowerReason") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_7faa88fd336dd60b0d92497179"`);
        await queryRunner.query(`DROP INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655"`);
        await queryRunner.query(`DROP INDEX "IDX_39932af13cd5ff2f000d3147f4"`);
        await queryRunner.query(`DROP INDEX "IDX_dd171b09e0e3c8e7a31453b016"`);
        await queryRunner.query(`ALTER TABLE "feedback" RENAME TO "temporary_feedback"`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" text PRIMARY KEY NOT NULL, "topicId" text NOT NULL, "rating" integer NOT NULL, "reason" text NOT NULL, "lowerReason" text NOT NULL, "created" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "feedback"("id", "topicId", "rating", "reason", "lowerReason", "created") SELECT "id", "topicId", "rating", "reason", "lowerReason", "created" FROM "temporary_feedback"`);
        await queryRunner.query(`DROP TABLE "temporary_feedback"`);
        await queryRunner.query(`CREATE INDEX "IDX_7faa88fd336dd60b0d92497179" ON "feedback" ("rating", "lowerReason") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655" ON "feedback" ("created") `);
        await queryRunner.query(`CREATE INDEX "IDX_39932af13cd5ff2f000d3147f4" ON "feedback" ("lowerReason") `);
        await queryRunner.query(`CREATE INDEX "IDX_dd171b09e0e3c8e7a31453b016" ON "feedback" ("rating") `);
        await queryRunner.query(`ALTER TABLE "credential" RENAME TO "temporary_credential"`);
        await queryRunner.query(`CREATE TABLE "credential" ("userId" varchar PRIMARY KEY NOT NULL, "login" text NOT NULL, "password" text NOT NULL, "role" integer NOT NULL, CONSTRAINT "REL_51dc2344d47cea3102674c6496" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "credential"("userId", "login", "password", "role") SELECT "userId", "login", "password", "role" FROM "temporary_credential"`);
        await queryRunner.query(`DROP TABLE "temporary_credential"`);
        await queryRunner.query(`ALTER TABLE "jw-refresh-token" RENAME TO "temporary_jw-refresh-token"`);
        await queryRunner.query(`CREATE TABLE "jw-refresh-token" ("id" text PRIMARY KEY NOT NULL, "removed" boolean NOT NULL, "created" integer NOT NULL, "updated" integer NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "jw-refresh-token"("id", "removed", "created", "updated", "userId") SELECT "id", "removed", "created", "updated", "userId" FROM "temporary_jw-refresh-token"`);
        await queryRunner.query(`DROP TABLE "temporary_jw-refresh-token"`);
        await queryRunner.query(`DROP INDEX "IDX_7faa88fd336dd60b0d92497179"`);
        await queryRunner.query(`DROP INDEX "IDX_b6bbab6ba1bc3e1d6a483c4655"`);
        await queryRunner.query(`DROP INDEX "IDX_39932af13cd5ff2f000d3147f4"`);
        await queryRunner.query(`DROP INDEX "IDX_dd171b09e0e3c8e7a31453b016"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP INDEX "IDX_9f3ef52f7844ea6581dd393424"`);
        await queryRunner.query(`DROP INDEX "IDX_0eb4cfef2069a14d4db9a4638f"`);
        await queryRunner.query(`DROP INDEX "IDX_d5bfa73441b7e1d253da5b0459"`);
        await queryRunner.query(`DROP INDEX "IDX_ad18d6e9dc6c7e5be32f4b2ace"`);
        await queryRunner.query(`DROP INDEX "IDX_fd5f72b33525473c6539094a95"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "credential"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "jw-refresh-token"`);
    }

}
