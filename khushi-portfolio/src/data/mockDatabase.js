export const mockUsers = [
  {
    id: 1, // Added IDs for easier management
    email: "rahul@gmail.com",
    password: "123",
    name: "Rahul & Anjali",
    eventName: "The Royal Wedding",
    folderId: "folder_1",
    hasBooking: true, 
    photos: [
      "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600",
      "https://images.unsplash.com/photo-1545912452-8ea1d64fd747?q=80&w=600",
    ]
  },
  {
    id: 2,
    email: "neha@gmail.com",
    password: "123",
    name: "Neha & Amit",
    eventName: "Baby Shower",
    folderId: "folder_2",
    hasBooking: true, 
    photos: [] 
  }
];

export const checkLogin = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};

export const registerUser = (name, email, password) => {
  if (mockUsers.find(u => u.email === email)) {
    return { success: false, message: "User already exists." };
  }

  const newUser = {
    id: Date.now(), // Generate simple ID
    email,
    password,
    name,
    eventName: "Welcome Guest",
    folderId: "new_user",
    hasBooking: false,
    photos: [] 
  };

  mockUsers.push(newUser);
  return { success: true, user: newUser };
};

/* --- NEW ADMIN POWERS --- */

// 1. Get everyone
export const getAllUsers = () => {
  return [...mockUsers]; // Return a copy
};

// 2. Toggle Booking Status (The "Approve" Button)
export const toggleBookingStatus = (email) => {
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    user.hasBooking = !user.hasBooking; // Flip true/false
    return true;
  }
  return false;
};

// 3. Update Folder ID (New Admin Power)
export const updateUserFolder = (email, newFolderId) => {
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    user.folderId = newFolderId;
    return true;
  }
  return false;
};