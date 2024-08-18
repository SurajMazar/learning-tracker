import vine from '@vinejs/vine'

const CourseCreateValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    description: vine.string().maxLength(1000).optional(),
    thumbnail: vine
      .file({
        size: '5mb',
        extnames: ['jpg', 'png', 'webp'],
      })
      .optional(),
  })
)

export default CourseCreateValidator
