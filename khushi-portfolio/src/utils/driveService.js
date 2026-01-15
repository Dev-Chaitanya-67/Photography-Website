// src/utils/driveService.js

// 1. Get API Key from Environment Variables
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

// --- THE SUPER CLEANER ---
const extractDriveId = (input) => {
  if (!input) return "";
  if (typeof input !== 'string') return "";

  // 1. Remove any surrounding quotes or whitespace
  let clean = input.trim().replace(/^["']|["']$/g, '');

  // 2. Try to find the ID inside a URL
  const urlMatch = clean.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
  }

  // 3. If it looks like a URL but no '/folders/', maybe it's just the ID?
  if (clean.length > 20 && !clean.includes('http')) {
      return clean;
  }

  return clean; 
};

export const fetchPhotosFromDrive = async (rawInput) => {
  const folderId = extractDriveId(rawInput);
  
  if (!folderId || folderId.includes('http')) {
      console.warn("Invalid Folder ID:", folderId);
      return [];
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,thumbnailLink,webContentLink)&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        console.error("GOOGLE API ERROR:", data);
        return [];
    }

    if (data.files) {
      return data.files.map(file => ({
            id: file.id,
            name: file.name,
            url: file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s1600') : file.webContentLink
      }));
    }
    return [];
  } catch (error) {
    console.error("Network Error:", error);
    return [];
  }
};

export const fetchPortfolioCategories = async (masterFolderId) => {
  const masterId = extractDriveId(masterFolderId);
  if (!masterId) return [];

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${masterId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (!data.files) return [];

    const categories = await Promise.all(
        data.files.map(async (folder) => {
            const photos = await fetchPhotosFromDrive(folder.id);
            return {
                id: folder.id,
                name: folder.name,
                photos: photos
            };
        })
    );

    return categories;
  } catch (error) {
    console.error("Category Error:", error);
    return [];
  }
};