import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, LogOut, Camera, Edit2, Save } from 'lucide-react';
import '../styles/global.css';
import { updateUserField } from '../firebase/services'; // <--- Connect to Firebase
import Breadcrumb from '../components/ui/Breadcrumb';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // To show loading state

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '' 
  });

  useEffect(() => {
    const sessionData = localStorage.getItem('currentUser');
    if (sessionData) {
      const userData = JSON.parse(sessionData);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '+91 98765 43210' // Default if not in DB
      });
    }
  }, [navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleSave = async () => {
    setIsSaving(true);

    // 1. Update Name in Firebase
    const nameUpdate = await updateUserField(user.uid, 'name', formData.name);
    
    // 2. Update Phone in Firebase (We reuse the generic field updater)
    const phoneUpdate = await updateUserField(user.uid, 'phone', formData.phone);

    if (nameUpdate && phoneUpdate) {
        // 3. Update Local Storage (So the session stays fresh without re-login)
        const updatedUser = { ...user, name: formData.name, phone: formData.phone };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // 4. Update UI State
        setUser(updatedUser);
        setIsEditing(false);
        alert("Profile Updated Successfully!");
    } else {
        alert("Failed to update profile. Please try again.");
    }
    
    setIsSaving(false);
  };

  return (
    <div className="page-container" style={{paddingTop:'100px', minHeight:'100vh'}}>
      <div className="max-w-wrapper">
        
        <Breadcrumb pageName="My Profile" />

        {/* PROFILE HEADER CARD */}
        <div className="profile-header-card">
        
            <div className="profile-info">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="profile-name" style={{color:'white', fontSize:'1.6rem', fontWeight:'bold', padding:'10px 0'}}>{user.name}</h1>
                    <span className="profile-badge">MEMBER</span>
                </div>
                <p className="profile-email">{user.email}</p>
            </div>

            <button onClick={handleLogout} className="logout-btn-outline">
                <LogOut size={16} /> Log Out
            </button>
        </div>

        <div className="profile-grid">
            
            {/* LEFT: PERSONAL DETAILS */}
            <div className="profile-section-card">
                <div className="section-header">
                    <h3>Personal Details</h3>
                    
                    {/* ACTION BUTTON (Edit vs Save) */}
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)} 
                        className={`profile-action-btn ${isEditing ? 'save' : 'edit'}`}
                        disabled={isSaving}
                    >
                        {isEditing ? (
                            <>
                                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Changes'}
                            </>
                        ) : (
                            <>
                                <Edit2 size={14} /> Edit Profile
                            </>
                        )}
                    </button>
                </div>

                <div className="details-list">
                    {/* Full Name */}
                    <div className="detail-item">
                        <User size={18} className="detail-icon" />
                        <div className="detail-content">
                            <label>Full Name</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="edit-input" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            ) : (
                                <div className="detail-value">{user.name}</div>
                            )}
                        </div>
                    </div>

                    {/* Email (Read Only) */}
                    <div className="detail-item">
                        <Mail size={18} className="detail-icon" />
                        <div className="detail-content">
                            <label>Email Address</label>
                            <div className="detail-value" style={{opacity:0.7}}>{user.email}</div>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="detail-item">
                        <Phone size={18} className="detail-icon" />
                        <div className="detail-content">
                            <label>Phone Number</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="edit-input" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            ) : (
                                <div className="detail-value">{formData.phone}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: BOOKING HISTORY (Connected to Real 'hasBooking' status) */}
            <div className="profile-section-card">
                <div className="section-header">
                    <h3>Booking History</h3>
                </div>

                <div className="bookings-list">
                    {/* Active Booking - Checks Real DB Status */}
                    {user.hasBooking ? (
                        <div className="booking-item active">
                            <div className="booking-icon">
                                <Calendar size={20} color="var(--accent)" />
                            </div>
                            <div className="booking-details">
                                <h4>{user.eventName || "Wedding Photography"}</h4>
                                <p>Status: <span className="text-green-400 font-bold">Confirmed</span></p>
                            </div>
                            <div className="booking-action">
                                <button className="small-btn" onClick={() => navigate('/dashboard')}>View</button>
                            </div>
                        </div>
                    ) : (
                         <div className="empty-bookings">
                            <p>No active bookings found.</p>
                            <button className="small-link" onClick={() => navigate('/packages')}>Book a Package</button>
                         </div>
                    )}

                    {/* Past Dummy Booking (Static for visual filler) */}
                    <div className="booking-item">
                        <div className="booking-icon" style={{background:'#222'}}>
                            <CheckCircle size={20} color="#666" />
                        </div>
                        <div className="booking-details">
                            <h4 style={{color:'#888'}}>Pre-Wedding Shoot</h4>
                            <p>Jan 2024 • Completed</p>
                        </div>
                        <div className="booking-action">
                           <span className="invoice-tag">Invoice</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

// Helper Icon
const CheckCircle = ({size, color}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default UserProfile;