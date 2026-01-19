// src/utils/driveService.js

// 1. Get API Key from Environment Variables
const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;

// --- CACHE HELPER FUNCTIONS ---
// We use sessionStorage so data persists while the user browses, but clears on tab close.
const CACHE_PREFIX = 'khushi_cache_';
const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour

const getFromCache = (key) => {
  try {
    const item = window.sessionStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    const now = new Date().getTime();

    // Check if expired
    if (now > parsed.expiry) {
      window.sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch (err) {
    return null;
  }
};

const saveToCache = (key, data) => {
  try {
    const now = new Date().getTime();
    const item = {
      data: data,
      expiry: now + CACHE_DURATION,
    };
    window.sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch (err) {
    console.warn("Storage quota exceeded or disabled", err);
  }
};

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

  // 1. CHECK CACHE
  const cached = getFromCache(`photos_${folderId}`);
  if (cached) {
    console.log(`[Cache Hit] Photos for ${folderId}`);
    return cached;
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
      const mappedFiles = data.files.map(file => ({
            id: file.id,
            name: file.name,
            url: file.thumbnailLink ? file.thumbnailLink.replace('=s220', '=s1600') : file.webContentLink
      }));

      // 2. SAVE TO CACHE
      saveToCache(`photos_${folderId}`, mappedFiles);
      return mappedFiles;
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

  // 1. CHECK CACHE
  const cached = getFromCache(`cats_${masterId}`);
  if (cached) {
      console.log(`[Cache Hit] Categories for ${masterId}`);
      return cached;
  }

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

    // 2. SAVE TO CACHE
    saveToCache(`cats_${masterId}`, categories);

    return categories;
  } catch (error) {
    console.error("Category Error:", error);
    return [];
  }
};