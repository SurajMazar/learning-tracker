import vine from '@vinejs/vine'
import DatabaseConstant from '../../constants/database.constant.js'
export const CreateCourseContentRequest = vine.compile(
  vine.object({
    files: vine
      .array(
        vine.file({
          size: '20mb',
          extnames: [
            'jpg',
            'png',
            'webp',
            'doc',
            'docx',
            'pdf',
            'xlsm',
            'xls',
            'xlsx',
            'xlt',
            'csv',
            'ppt',
            'zip',
          ],
        })
      )
      .nullable()
      .optional(),
    title: vine.string().maxLength(300),
    description: vine.string().maxLength(7000).nullable().optional(),
    course_id: vine.number().exists(async (db, value) => {
      const courseContent = await db.from(DatabaseConstant.COURSES).where('id', value).first()
      return !!courseContent
    }),
  })
)
