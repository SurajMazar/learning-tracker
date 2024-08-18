import vine from '@vinejs/vine'

export const AddVideoCourseContentRequest = vine.compile(
  vine.object({
    video_file: vine.file({
      size: '500mb',
      extnames: ['mp4', 'mov'],
    }),
    title: vine.string().maxLength(300),
    description: vine.string().maxLength(7000).nullable().optional(),
  })
)
