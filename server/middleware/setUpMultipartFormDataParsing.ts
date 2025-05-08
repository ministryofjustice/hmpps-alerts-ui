import { Router, ErrorRequestHandler } from 'express'
import multer, { MulterError } from 'multer'
import { FLASH_KEY__VALIDATION_ERRORS } from '../utils/constants'

export default function setUpMultipartFormDataParsing(): Router {
  const router = Router({ mergeParams: true })
  const maxUploadSize = 1024 * 1024 // 1MB
  const upload = multer({ dest: 'uploads/', limits: { fileSize: maxUploadSize } })

  router.use(upload.single('file'))
  router.use(uploadedFileTooLargeHandler)

  return router
}

const uploadedFileTooLargeHandler: ErrorRequestHandler = (err: Error, req, res, next): void => {
  if (!(err instanceof MulterError) && (err as MulterError).code !== 'LIMIT_FILE_SIZE') return next(err)

  req.flash(
    FLASH_KEY__VALIDATION_ERRORS,
    JSON.stringify({
      file: ['The selected file must be smaller than 1MB'],
    }),
  )
  return res.redirect(req.get('Referrer') || '/')
}
