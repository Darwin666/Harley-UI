export function file2Base64(file) {
  return new Promise((resolve, reject) => {
    if (!window.FileReader) {
      reject(new Error("Your browser does not support FileReader API!"));
    }
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = () => {
      reject(new Error("Failed in reading file!"));
    };
  });
}

export function compressImage(fileObj) {
  return new Promise((resolve) => {
    try {
      const image = new Image();
      image.src = URL.createObjectURL(fileObj);
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      image.onload = function () {
        let quality = 0.7;
        let origin = Math.max(this.width, this.height);
        let targetWidth = 0;
        let targetHeight = 0;
        if (origin < 400) {
          targetWidth = this.width;
          targetHeight = this.height;
        } else if (origin < 3400) {
          let target = 0;
          target = Math.round(origin / 2 + 200);
          targetWidth = Math.round((this.width * target) / origin);
          targetHeight = Math.round((this.height * target) / origin);
        } else {
          let maxWidth = 1600;
          let maxHeight = 1600;
          let originWidth = this.width;
          let originHeight = this.height;
          targetWidth = maxWidth;
          targetHeight = maxHeight;
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.drawImage(this, 0, 0, targetWidth, targetHeight);
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        let newFile = base64ToBlob(dataUrl);
        resolve(newFile);
      };
    } catch (e) {
      resolve(fileObj);
    }
  });
}

export function base64ToBlob(dataurl) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function beforeUpload(
  file,
  callback,
  toBase64Flag,
  compressFlag = true
) {
  let newFile = null;
  try {
    if (compressFlag) {
      newFile = await compressImage(file);
    }
  } catch (e) {
    newFile = file;
  }
  if (callback) {
    let result = true;
    let base64Str = null;
    if (toBase64Flag) {
      try {
        base64Str = await file2Base64(newFile);
        base64Str = base64Str.replace("data:image/jpeg;base64,", "");
      } catch (e) {
        base64Str = "";
      }
    }
    try {
      result = await callback(newFile, base64Str);
    } catch (e) {
      result = false;
    }
    if (result === false) {
      return false;
    }
  }
  return newFile;
}
