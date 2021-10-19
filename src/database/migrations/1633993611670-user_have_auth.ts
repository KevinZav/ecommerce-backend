import {MigrationInterface, QueryRunner} from "typeorm";

export class userHaveAuth1633993611670 implements MigrationInterface {
    name = 'userHaveAuth1633993611670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "auth_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_32ddc1ae708e8261a870a6eb3e6" UNIQUE ("auth_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_32ddc1ae708e8261a870a6eb3e6" FOREIGN KEY ("auth_id") REFERENCES "authentications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_32ddc1ae708e8261a870a6eb3e6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_32ddc1ae708e8261a870a6eb3e6"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "auth_id"`);
    }

}
