import vine from '@vinejs/vine'

export const AddFileCourseContentRequest = vine.compile(
  vine.object({
    files: vine
      .array(
        vine.file({
          size: '10mb',
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
      .maxLength(1),
  })
)
