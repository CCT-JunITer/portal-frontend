
interface FileResponse {
  fileName: string;
  result: string | ArrayBuffer | null | undefined;
  error: DOMException | null | undefined;
}

export const readFile = (file: File) => {
  return new Promise<FileResponse>(function(resolve, reject) {
    const reader = new FileReader();
    reader.onloadend = function(e) {
      resolve({
        fileName: file.name,
        result: e.target?.result,
        error: e.target?.error
      });
    };
    reader.onerror = function (e) {
      reject(e);
    }
    reader.readAsDataURL(file);
  });
}
