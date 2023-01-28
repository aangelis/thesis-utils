import * as Minio from 'minio';
// https://github.com/minio/minio-js/issues/769

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST || "",
  port: parseInt(process.env.MINIO_PORT || ''),
  useSSL: process.env.MINIO_USESSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "",
  secretKey: process.env.MINIO_SECRET_KEY || ""
});
