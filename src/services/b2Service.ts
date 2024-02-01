// b2Service.ts
import { B2 } from 'b2';

export function createB2Service(accountId: string, applicationKey: string) {
  const b2 = B2({ accountId, applicationKey });

  async function uploadFile(bucketName: string, fileName: string, fileContents: string, contentType: string) {
    await b2.authorize();
    return b2.uploadFile({
      fileName,
      bucket: bucketName,
      body: fileContents,
      contentType,
    });
  }

  return {
    uploadFile,
  };
}
