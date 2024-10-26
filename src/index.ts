// #region Inicialização do SNS e Handler
import { SNS } from 'aws-sdk';
import { S3Event, Context } from 'aws-lambda';
import { processS3Event } from './s3Processor';

const sns = new SNS();

export const handler = async (event: S3Event, context: Context): Promise<void> => {
  try {
    await processS3Event(event, sns);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao processar evento do S3:', error.message);
    } else {
      console.error('Erro desconhecido ao processar evento do S3');
    }
    throw error;
  }
};
// #endregion
