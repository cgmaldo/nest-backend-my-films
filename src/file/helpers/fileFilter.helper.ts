import { TypeFileExtension } from "../interfaces/TypeFilesExtension.interface";

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    /*
    file contendrá las siguientes propiedades:
      fieldname: 'file',
      originalname: '349d8f80-192b-46d6-a903-f5a8e098b46d.jpeg',
      encoding: '7bit',
      mimetype: 'image/jpeg'
    */
    if (!file) return callback(new Error('File in empty'), false);
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = TypeFileExtension;
    if (validExtensions.includes(fileExtension)) {
        callback(null, true);
    }
    callback(null, false);
}