import env from '#start/env'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    minio: services.s3({
      credentials: {
        accessKeyId: env.get('MINIO_KEY'),
        secretAccessKey: env.get('MINIO_SECRET'),
      },
      region: env.get('MINIO_REGION'),
      bucket: env.get('MINIO_BUCKET'),
      visibility: 'public',
      endpoint: env.get('MINIO_URL'),
      forcePathStyle: env.get('MINIO_USE_PATH_STYLE_ENDPOINT'),
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
