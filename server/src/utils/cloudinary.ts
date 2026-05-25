import cloudinary from '../config/cloudinary.js';

interface UploadResult {
  public_id: string;
  secure_url: string;
}

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = 'propertist'
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
            return;
          }
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
        }
      )
      .end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
