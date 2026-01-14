import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// 1. Download Single Image
export const downloadSingleImage = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, filename); // Uses the name passed to it
  } catch (error) {
    console.error("Download failed:", error);
    window.open(url, '_blank');
  }
};

// 2. Download All as Zip
export const downloadAllImages = async (photos, eventName) => {
  const zip = new JSZip();
  // Create a folder inside the zip
  const folderName = eventName.replace(/\s+/g, '_') || 'My_Memories';
  const folder = zip.folder(folderName);

  const fetchBlob = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return response.blob();
  };

  const promises = photos.map(async (photo) => {
    try {
      const blob = await fetchBlob(photo.url);
      // USE ORIGINAL FILENAME
      folder.file(photo.name, blob); 
    } catch (err) {
      console.warn("Could not zip image:", photo.name);
    }
  });

  await Promise.all(promises);

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${folderName}_Gallery.zip`);
};