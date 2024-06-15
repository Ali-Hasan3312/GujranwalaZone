// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
export {};
// cloudinary.config({ 
//     cloud_name: "dv0yscnct", 
//     api_key: "261695339612612", 
//     api_secret: "r3c4pLGX_9zOJkeJfru8CaB7ohY"
//   });
// const uploadOnCloudinary = async (localFilePath:Express.Multer.File | undefined) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         //console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath)
//         return response;
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }
//   const deleteImageFromCloudinary = async (public_Id) => {
//     try {
//       if(!public_Id){
//         return null;
//       }
//       cloudinary.uploader.destroy(public_Id,{resource_type: 'image' } )
//     } catch (error) {
//       console.log(`Error while deleting files ${error}`);
//       return null;
//     }
//   };
// export {uploadOnCloudinary, deleteImageFromCloudinary};
