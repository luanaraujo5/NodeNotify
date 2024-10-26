import { SNS } from 'aws-sdk';
import { S3Event } from 'aws-lambda';

// #region Função para processar o evento do S3
export const processS3Event = async (event: S3Event, sns: SNS): Promise<void> => {
  try {
    const record = event.Records[0];
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const eventName = record.eventName;

    // Definir mensagem a ser enviada de acordo com o tipo de evento
    const message = eventName.startsWith('ObjectCreated')
      ? `NodeNotify | Um novo arquivo foi adicionado: ${objectKey} no bucket ${bucketName}.`
      : eventName.startsWith('ObjectRemoved')
      ? `NodeNotify | Um arquivo foi removido: ${objectKey} do bucket ${bucketName}.`
      : `NodeNotify | O arquivo: ${objectKey} no bucket ${bucketName} foi modificado. Tipo de evento: ${eventName}`;

    // Publicar mensagem no SNS
    await sns.publish({ Message: message, TopicArn: process.env.TOPIC_ARN }).promise();
  } catch (error) {
    console.error('Erro ao processar evento do S3 ou ao publicar no SNS:', error instanceof Error ? error.message : 'Erro desconhecido');
    throw error;
  }
};
// #endregion
