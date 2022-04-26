import { Connection, QueryRunner } from 'typeorm';

export const runTransaction = async <T>(
  connection: Connection,
  runnable: (qr: QueryRunner) => Promise<T>,
): Promise<T | undefined> => {
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  try {
    await queryRunner.startTransaction();
    const result = await runnable(queryRunner);
    await queryRunner.commitTransaction();

    return result;
  } catch (e) {
    await queryRunner.rollbackTransaction();
    throw e;
  } finally {
    await queryRunner.release();
  }
  return undefined;
};
