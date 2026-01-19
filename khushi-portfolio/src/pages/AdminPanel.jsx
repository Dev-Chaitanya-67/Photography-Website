import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, CheckCircle, Clock, Save, ShieldAlert, LogOut, Mail, Users, MessageSquare, Calendar, Package, Plus, Edit2, Eye, EyeOff, X, Check, Trash2, Star, Zap, User, Camera, Phone, Smartphone, Instagram } from 'lucide-react';
import { getAllUsers, updateUserField, loginUser, getInquiries, updateInquiryStatus, getAllPackages, savePackage, togglePackageHidden, getArtistProfile, saveArtistProfile } from '../firebase/services';
import '../styles/global.css';

// Feature Helper List
const FEATURES_LIST = [
    { label: "Candid Photography", id: "candid" },
    { label: "Traditional Video", id: "trad_vid" },
    { label: "Cinematic Highlights", id: "cinematic" },
    { label: "Drone Coverage", id: "drone" },
    { label: "Instagram Reels", id: "reels" },
    { label: "Raw Data Delivery", id: "raw" },
];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  // Package Editor State
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('clients'); // 'clients', 'inquiries', 'packages', 'content'
  const [userFilter, setUserFilter] = useState('all'); 
  
  // Content / Artist State
  const [artistData, setArtistData] = useState({ name: '', photo: '' });

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);


  // 2. Fetch Data
  const refreshData = async () => {
    setLoading(true);
    // Fetch Users
    const realUsers = await getAllUsers();
    setUsers(realUsers);
    
    // Fetch Inquiries
    const msgs = await getInquiries();
    setInquiries(msgs);
    
    // Fetch Packages
    const pkgs = await getAllPackages();
    // Sort packages: Basic < Pro < Elite based on price or name conventions
    // Simple custom sort order
    const order = { 'basic': 1, 'pro': 2, 'elite': 3 };
    const sorted = pkgs.sort((a,b) => (order[a.id] || 99) - (order[b.id] || 99));
    setPackages(sorted);

    // Fetch Artist Profile
    const artist = await getArtistProfile();
    if (artist) setArtistData(artist);

    setLoading(false);
  };

  // 1. Check Session on Load
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const user = JSON.parse(session);
      if (user.role === 'admin') {
          setAdminUser(user);
          refreshData(); 
      }
    }
  }, []);

  // 3. ADMIN LOGIN HANDLER
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    const result = await loginUser(email, password);

    if (result.success) {
        const user = result.user;
        if (user.role === 'admin') {
            setAdminUser(user);
            localStorage.setItem('adminSession', JSON.stringify(user));
            refreshData();
        } else {
            setError("Access Denied: You do not have Admin privileges.");
        }
    } else {
        setError("Invalid Admin Credentials.");
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
      localStorage.removeItem('adminSession');
      setAdminUser(null);
      setUsers([]);
      setEmail('');
      setPassword('');
  };

  // --- ACTIONS ---
  const handleToggleBooking = async (uid, currentStatus) => {
    const newStatus = !currentStatus;
    setUsers(users.map(u => u.uid === uid ? { ...u, hasBooking: newStatus } : u));
    await updateUserField(uid, 'hasBooking', newStatus);
  };

  const handleFolderChange = (e, uid) => {
    const newVal = e.target.value;
    setUsers(users.map(u => u.uid === uid ? { ...u, folderId: newVal } : u));
  };

  const handleSaveFolder = async (uid, newFolderId) => {
    const success = await updateUserField(uid, 'folderId', newFolderId);
    if (success) alert("Folder ID Saved!");
  };

  const markInquiryRead = async (id, currentStatus) => {
      if (currentStatus === 'read') return;
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'read' } : i));
      await updateInquiryStatus(id, 'read');
  };

  const markInquiryContacted = async (id) => {
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status: 'contacted' } : i));
      await updateInquiryStatus(id, 'contacted');
  };

  // --- PACKAGE ACTIONS ---
  const handleInitializeDefaults = async () => {
      if (!window.confirm("Initialize default packages? This will add Basic, Pro, and Elite.")) return;
      setLoading(true);
      
      const defaults = [
          { 
              name: "Basic", price: "₹15k", prevPrice: "", desc: "Perfect for intimate celebrations.", id: "basic",
              features: [
                  { label: "Candid Photography", included: true },
                  { label: "Traditional Video", included: true },
                  { label: "Cinematic Highlights", included: false },
                  { label: "Drone Coverage", included: false },
                  { label: "Premium Photobook", included: false },
                  { label: "Instagram Reels", included: false },
                  { label: "Raw Data Delivery", included: false }
              ]
          },
          { 
              name: "Pro", price: "₹55k", prevPrice: "₹65k", desc: "Our most loved cinematic experience.", id: "pro", isPopular: true, isFeatured: true,
              features: [
                  { label: "Candid Photography", included: true },
                  { label: "Traditional Video", included: true },
                  { label: "Cinematic Highlights", included: true },
                  { label: "Drone Coverage", included: true },
                  { label: "Premium Photobook", included: true },
                  { label: "Instagram Reels", included: true },
                  { label: "Raw Data Delivery", included: false }
              ]
          },
          { 
              name: "Elite", price: "₹85k", prevPrice: "₹1L", desc: "The complete royal treatment.", id: "elite",
              features: [
                  { label: "Candid Photography", included: true },
                  { label: "Traditional Video", included: true },
                  { label: "Cinematic Highlights", included: true },
                  { label: "Drone Coverage", included: true },
                  { label: "Premium Photobook", included: true },
                  { label: "Instagram Reels", included: true },
                  { label: "Raw Data Delivery", included: true }
              ]
          }
      ];
      
      for (const p of defaults) { await savePackage(p); }
      refreshData();
  };

  const handleEditPackage = (pkg) => {
      if (pkg) {
          // Normalization for legacy data support
          let features = [];
          
          if (Array.isArray(pkg.features)) {
              features = pkg.features;
          } else if (pkg.features && typeof pkg.features === 'object') {
              // Convert old object format to new array format
              features = FEATURES_LIST.map(f => ({
                  label: f.label,
                  included: !!pkg.features[f.id]
              }));
          } else {
              // Default if missing
              features = FEATURES_LIST.map(f => ({ label: f.label, included: false }));
          }

          setEditingPkg({ ...pkg, features });
      } else {
          // New Package
          setEditingPkg({ 
            name: '', price: '', prevPrice: '', desc: '', 
            features: FEATURES_LIST.map(f => ({ label: f.label, included: false })) 
          });
      }
      setEditorOpen(true);
  };

  const handleSavePackage = async (e) => {
      e.preventDefault();
      const result = await savePackage(editingPkg);
      if (result.success) {
          setEditorOpen(false);
          refreshData();
      } else {
          alert('Error saving package: ' + result.message);
      }
  };

  const handleToggleHide = async (pkg) => {
      await togglePackageHidden(pkg.id, pkg.isHidden);
      refreshData();
  };

  const handleFeatureToggle = (index) => {
      const newFeatures = [...editingPkg.features];
      newFeatures[index].included = !newFeatures[index].included;
      setEditingPkg({ ...editingPkg, features: newFeatures });
  };

  const handleDeleteFeature = (index) => {
      const newFeatures = [...editingPkg.features];
      newFeatures.splice(index, 1);
      setEditingPkg({ ...editingPkg, features: newFeatures });
  };

  const handleAddFeature = () => {
      if (!newFeatureText.trim()) return;
      const newFeatures = [...(editingPkg.features || []), { label: newFeatureText, included: true }];
      setEditingPkg({ ...editingPkg, features: newFeatures });
      setNewFeatureText("");
  };

  // --- ARTIST ACTIONS ---
  const handleSaveArtist = async (e) => {
      e.preventDefault();
      const res = await saveArtistProfile(artistData);
      if (res.success) {
          alert("Artist Profile Updated!");
      } else {
          alert("Error: " + res.message);
      }
  };
    
  // --- RENDER LOGIN SCREEN ---
  if (!adminUser) {
    return (
      <div className="page-container" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh'}}>
        <form onSubmit={handleAdminLogin} className="admin-login-box">
            <div style={{display:'flex', justifyContent:'center', marginBottom:'10px'}}>
                 <ShieldAlert size={40} color="var(--accent)" />
            </div>
            <h2 style={{fontFamily:'var(--font-head)', color:'white', textAlign:'center', fontSize:'1.6rem'}}>
                Admin Login
            </h2>
            <input 
              type="email" 
              className="form-input" 
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="error-box">{error}</div>}
            <button className="form-btn" disabled={loginLoading}>
                {loginLoading ? 'Verifying...' : 'Log In'}
            </button>
        </form>
      </div>
    );
  }

  // --- RENDER DASHBOARD ---
  return (
    <div className="page-container">
      <div className="max-w-wrapper">
        
        {/* Header */}
        <div className="admin-header">
            <div>
                <h1 className="hero-heading" style={{marginBottom:'0', fontSize:'2.5rem'}}>Control Room</h1>
                <div style={{display:'flex', alignItems:'center', gap:'15px', color:'#666', marginTop:'10px'}}>
                    <span style={{fontSize:'0.8rem', background:'#222', padding:'4px 10px', borderRadius:'4px'}}>ADMIN</span>
                    <button onClick={handleLogout} className="logout-btn"><LogOut size={12}/> Logout</button>
                </div>
            </div>
            <button onClick={refreshData} className="refresh-btn">
                <RefreshCw size={18} className={loading ? 'spinner' : ''} />
            </button>
        </div>

        {/* Stats Strip */}
        <div className="stats-strip-admin">
            <div className="stat-box">
                <Users size={24} color="#666" />
                <div>
                   <h3>{users.length}</h3>
                   <p>Total Users</p>
                </div>
            </div>
            <div className="stat-box">
                <MessageSquare size={24} color="#666" />
                <div>
                   <h3>{inquiries.filter(i => i.status === 'new').length}</h3>
                   <p>New Inquiries</p>
                </div>
            </div>
            <div className="stat-box">
                <Calendar size={24} color="#666" />
                <div>
                   <h3>{users.filter(u => u.hasBooking).length}</h3>
                   <p>Active Bookings</p>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
            <button 
                className={`admin-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
            >
                Users & Clients
            </button>
            <button 
                className={`admin-tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
                onClick={() => setActiveTab('inquiries')}
            >
                Inquiries & Messages
            </button>
            <button 
                className={`admin-tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
                onClick={() => setActiveTab('packages')}
            >
                Packages & Pricing
            </button>
            <button 
                className={`admin-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
                onClick={() => setActiveTab('content')}
            >
                Artist & Content
            </button>
        </div>

        {/* --- FILTERS (Only for Clients Tab) --- */}
        {activeTab === 'clients' && (
            <div className="filter-bar">
                <span style={{color:'#666', fontSize:'0.9rem', marginRight:'10px'}}>Filter By:</span>
                <button 
                    className={`filter-chip ${userFilter === 'all' ? 'active' : ''}`} 
                    onClick={() => setUserFilter('all')}
                >
                    All Users
                </button>
                <button 
                    className={`filter-chip ${userFilter === 'booked' ? 'active' : ''}`} 
                    onClick={() => setUserFilter('booked')}
                >
                    <CheckCircle size={14} style={{marginRight:'5px'}}/> Booked
                </button>
                <button 
                    className={`filter-chip ${userFilter === 'pending' ? 'active' : ''}`} 
                    onClick={() => setUserFilter('pending')}
                >
                    <Clock size={14} style={{marginRight:'5px'}}/> Pending
                </button>
                <button 
                    className={`filter-chip ${userFilter === 'admin' ? 'active' : ''}`} 
                    onClick={() => setUserFilter('admin')}
                >
                    <Lock size={14} style={{marginRight:'5px'}}/> Admins
                </button>
            </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="table-wrapper">
            
            {/* CLIENTS TABLE */}
            {activeTab === 'clients' && (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Client Details</th>
                            <th>Drive Folder ID</th>
                            <th style={{textAlign:'center'}}>Selections</th>
                            <th style={{textAlign:'center'}}>Status</th>
                            <th style={{textAlign:'right'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter(u => {
                                if (userFilter === 'all') return true;
                                if (userFilter === 'booked') return u.hasBooking;
                                if (userFilter === 'pending') return !u.hasBooking;
                                if (userFilter === 'admin') return u.role === 'admin';
                                return true;
                            })
                            .length === 0 && <tr><td colSpan="5" className="empty-state">No users match this filter.</td></tr>}
                        
                        {users
                             .filter(u => {
                                if (userFilter === 'all') return true;
                                if (userFilter === 'booked') return u.hasBooking;
                                if (userFilter === 'pending') return !u.hasBooking;
                                if (userFilter === 'admin') return u.role === 'admin';
                                return true;
                            })
                            .map((user) => (
                            <tr key={user.uid}>
                                <td>
                                    <div style={{fontWeight:'bold', color:'white', fontSize:'1rem'}}>{user.name}</div>
                                    <div style={{fontSize:'0.8rem', color:'#888', marginTop:'2px'}}>{user.email}</div>
                                    {user.role === 'admin' && <span className="admin-badge"><Lock size={8} style={{marginRight:'3px'}}/> ADMIN</span>}
                                </td>
                                <td>
                                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                                        <input 
                                            type="text" 
                                            className="folder-input" 
                                            value={user.folderId || ''} 
                                            onChange={(e) => handleFolderChange(e, user.uid)}
                                            placeholder="Paste ID..."
                                        />
                                        <button onClick={() => handleSaveFolder(user.uid, user.folderId)} className="icon-btn-save" title="Save">
                                            <Save size={16} />
                                        </button>
                                    </div>
                                </td>
                                <td style={{textAlign:'center'}}>
                                    {user.favorites ?.length > 0 ? (
                                        <div className="fav-count">
                                           <span>{user.favorites.length}</span>
                                           <small>Selected</small>
                                        </div>
                                    ) : <span className="dash">·</span>}
                                </td>
                                <td style={{textAlign:'center'}}>
                                    {user.hasBooking ? 
                                        <span className="status-badge booked"><CheckCircle size={14} /> Booked</span> : 
                                        <span className="status-badge pending"><Clock size={14} /> Pending</span>
                                    }
                                </td>
                                <td style={{textAlign:'right'}}>
                                    <button 
                                        onClick={() => handleToggleBooking(user.uid, user.hasBooking)}
                                        className={`toggle-btn ${user.hasBooking ? 'on' : 'off'}`}
                                        title={user.hasBooking ? 'Click to Revoke' : 'Click to Approve'}
                                    >
                                        <div className="toggle-circle"></div>
                                        <span className="toggle-label">{user.hasBooking ? 'Active' : 'Allow'}</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* INQUIRIES TABLE */}
            {activeTab === 'inquiries' && (
                <table className="admin-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Sender Details</th>
                        <th>Event Info</th>
                        <th>Message</th>
                        <th style={{textAlign:'right'}}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {inquiries.length === 0 && <tr><td colSpan="5" className="empty-state">No inquiries yet.</td></tr>}
                    {inquiries.map((inq) => (
                        <tr key={inq.id} className={inq.status === 'new' ? 'new-row' : ''}>
                            <td style={{fontSize:'0.8rem', color:'#888', whiteSpace:'nowrap'}}>
                                {new Date(inq.submittedAt).toLocaleDateString()}
                            </td>
                            <td>
                                <div style={{fontWeight:'bold'}}>{inq.name}</div>
                                <div style={{fontSize:'0.75rem', color:'#666'}}>{inq.email}</div>
                                <div style={{fontSize:'0.75rem', color:'#666'}}>{inq.phone}</div>
                            </td>
                            <td>
                                <div style={{color:'var(--accent)'}}>{inq.eventType}</div>
                                <div style={{fontSize:'0.75rem', color:'#888'}}>{inq.date}</div>
                            </td>
                            <td style={{color:'#ccc', maxWidth:'300px'}}>
                                <p style={{lineHeight:'1.4', fontSize:'0.9rem'}}>{inq.message}</p>
                            </td>
                            <td style={{textAlign:'right'}}>
                                <div style={{display:'flex', gap:'5px', justifyContent:'flex-end'}}>
                                    {inq.status !== 'contacted' && (
                                        <button onClick={() => markInquiryContacted(inq.id)} className="action-btn approve" style={{fontSize:'0.7rem'}}>
                                            Mark Contacted
                                        </button>
                                    )}
                                    {inq.status === 'new' && (
                                        <button onClick={() => markInquiryRead(inq.id, inq.status)} className="action-btn" style={{background:'#333', fontSize:'0.7rem'}}>
                                            Mark Read
                                        </button>
                                    )}
                                    {inq.status === 'contacted' && <span className="status-badge booked">DONE</span>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {/* --- PACKAGES TAB --- */}
            {activeTab === 'packages' && (
                <div className="packages-section" style={{marginTop:'30px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                        <h3 style={{color:'#fff', fontWeight:'lighter', fontSize:'1.5rem'}}>Manage Packages</h3>
                        
                        {packages.length === 0 && (
                            <button 
                                className="form-btn" 
                                style={{width:'auto', padding:'10px 20px', margin:0, fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'8px'}}
                                onClick={handleInitializeDefaults}
                            >
                                <Plus size={16} /> Initialize Defaults
                            </button>
                        )}
                    </div>

                    <div className="packages-admin-grid">
                        {packages.map(pkg => (
                            <div key={pkg.id} className={`admin-pkg-card ${pkg.isHidden ? 'opacity-50' : ''}`}>
                                <div className="pkg-header">
                                    <h4 className="pkg-name">{pkg.name}</h4>
                                    <div style={{display:'flex', alignItems:'baseline', gap:'8px'}}>
                                        <span className="pkg-price" style={{color: 'var(--accent)'}}>{pkg.price}</span>
                                        {pkg.prevPrice && <span style={{textDecoration:'line-through', fontSize:'0.8rem', color:'#666'}}>{pkg.prevPrice}</span>}
                                    </div>
                                </div>
                                <div style={{height:'1px', background:'#222', margin:'10px 0'}}></div>
                                
                                {/* Feature Snapshot (First 3) */}
                                <div style={{display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'20px'}}>
                                    {(Array.isArray(pkg.features) ? pkg.features : []).filter(f => f.included).slice(0, 4).map((f, i) => (
                                        <span key={i} style={{fontSize:'0.65rem', padding:'2px 8px', background:'#222', borderRadius:'4px', color:'#aaa'}}>
                                            {f.label}
                                        </span>
                                    ))}
                                    {(Array.isArray(pkg.features) ? pkg.features : []).filter(f => f.included).length > 4 && 
                                        <span style={{fontSize:'0.65rem', padding:'2px 8px', color:'#666'}}>+more</span>
                                    }
                                </div>

                                <div className="pkg-actions">
                                    <button onClick={() => handleEditPackage(pkg)} className="edit-btn">
                                        <Edit2 size={14}/> Edit
                                    </button>
                                    <button onClick={() => handleToggleHide(pkg)} className="hide-btn" title={pkg.isHidden ? "Show" : "Hide"}>
                                        {pkg.isHidden ? <Eye size={14}/> : <EyeOff size={14}/>}
                                        {pkg.isHidden ? ' Show' : ' Hide'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- ARTIST & CONTENT TAB --- */}
            {activeTab === 'content' && (
                <div style={{marginTop:'30px', maxWidth:'600px'}}>
                    <h3 style={{color:'#fff', fontWeight:'lighter', fontSize:'1.5rem', marginBottom:'20px'}}>Artist Profile</h3>
                    
                    <div className="glass-card" style={{padding:'30px'}}>
                        <form onSubmit={handleSaveArtist}>
                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><User size={16}/> Artist Name</label>
                                <input 
                                    type="text" className="form-input" 
                                    value={artistData.name} 
                                    onChange={e => setArtistData({...artistData, name: e.target.value})}
                                    placeholder="e.g. Abhi Wagh"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><Camera size={16}/> Artist Photo URL</label>
                                <input 
                                    type="text" className="form-input" 
                                    value={artistData.photo} 
                                    onChange={e => setArtistData({...artistData, photo: e.target.value})}
                                    placeholder="https://... (Image URL)"
                                />
                                <small style={{color:'#666', display:'block', marginTop:'5px'}}>
                                    For now, please convert your image to a URL (e.g. using Drive or Imgur) and paste it here.
                                </small>
                            </div>

                            {/* Contact Info */}
                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><Phone size={16}/> Phone Number</label>
                                <input 
                                    type="text" className="form-input" 
                                    value={artistData.phone || ''} 
                                    onChange={e => setArtistData({...artistData, phone: e.target.value})}
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><Smartphone size={16}/> WhatsApp Number (No +)</label>
                                <input 
                                    type="text" className="form-input" 
                                    value={artistData.whatsapp || ''} 
                                    onChange={e => setArtistData({...artistData, whatsapp: e.target.value})}
                                    placeholder="e.g. 919876543210"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><Mail size={16}/> Email Address</label>
                                <input 
                                    type="email" className="form-input" 
                                    value={artistData.email || ''} 
                                    onChange={e => setArtistData({...artistData, email: e.target.value})}
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label style={{display:'flex', alignItems:'center', gap:'10px'}}><Instagram size={16}/> Instagram Link</label>
                                <input 
                                    type="text" className="form-input" 
                                    value={artistData.instagram || ''} 
                                    onChange={e => setArtistData({...artistData, instagram: e.target.value})}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>

                            {artistData.photo && (
                                <div style={{width:'100px', height:'100px', borderRadius:'50%', overflow:'hidden', margin:'20px 0', border:'2px solid var(--accent)'}}>
                                    <img src={artistData.photo} alt="Preview" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                </div>
                            )}

                            <button className="form-btn">
                                <Save size={16} style={{display:'inline', marginRight:'8px'}}/> Save Profile
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- EDITOR MODAL --- */}
            {isEditorOpen && (
                <div className="modal-overlay">
                    <div className="editor-modal glass-card">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                            <h3 style={{fontFamily:'var(--font-head)'}}>{editingPkg.id ? `Edit ${editingPkg.name}` : 'New Package'}</h3>
                            <button onClick={() => setEditorOpen(false)} style={{background:'none', border:'none', color:'#666', cursor:'pointer'}}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSavePackage}>
                            <div className="editor-grid">
                                <div className="form-group">
                                    <label>Package Name</label>
                                    <input 
                                        type="text" className="form-input" value={editingPkg.name} 
                                        onChange={e => setEditingPkg({...editingPkg, name: e.target.value})} required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price (e.g. ₹55k)</label>
                                    <input 
                                        type="text" className="form-input" value={editingPkg.price} 
                                        onChange={e => setEditingPkg({...editingPkg, price: e.target.value})} required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Prev Price (Optional)</label>
                                    <input 
                                        type="text" className="form-input" value={editingPkg.prevPrice || ''} 
                                        onChange={e => setEditingPkg({...editingPkg, prevPrice: e.target.value})} placeholder="₹60k"
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Subtitle / Description</label>
                                    <textarea 
                                        className="form-input" rows="2" value={editingPkg.desc}
                                        onChange={e => setEditingPkg({...editingPkg, desc: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            {/* --- OPTIONS --- */}
                            <div style={{display:'flex', gap:'20px', marginBottom:'20px'}}>
                                <div 
                                    className={`option-chip ${editingPkg.isPopular ? 'active-pop' : ''}`}
                                    onClick={() => setEditingPkg({...editingPkg, isPopular: !editingPkg.isPopular})}
                                >
                                    <Zap size={16} /> Most Wanted (Popular Badge)
                                </div>
                                <div 
                                    className={`option-chip ${editingPkg.isFeatured ? 'active-feat' : ''}`} 
                                    onClick={() => setEditingPkg({...editingPkg, isFeatured: !editingPkg.isFeatured})}
                                >
                                    <Star size={16} /> Highlighted (Featured)
                                </div>
                            </div>

                            {/* FEATURE MANAGER */}
                            <div style={{margin:'20px 0', borderTop:'1px solid #222', paddingTop:'15px'}}>
                                <label style={{display:'block', marginBottom:'10px', fontSize:'0.8rem', color:'#888'}}>FEATURES LIST</label>
                                
                                {/* Add New Feature Input */}
                                <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="Add new feature..." 
                                        value={newFeatureText}
                                        onChange={(e) => setNewFeatureText(e.target.value)}
                                        style={{margin:0}}
                                    />
                                    <button type="button" onClick={handleAddFeature} className="action-btn" style={{background:'var(--accent)', minWidth:'40px'}}>
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Scrollable Feature List */}
                                <div className="feature-scroll-list">
                                    {(editingPkg.features || []).map((feat, idx) => (
                                        <div key={idx} className="feature-row-item">
                                            {/* Left click behavior: Toggle included */}
                                            <div 
                                                style={{display:'flex', alignItems:'center', gap:'12px', flex:1, cursor:'pointer'}} 
                                                onClick={() => handleFeatureToggle(idx)}
                                            >
                                                <div className={`checkbox-custom ${feat.included ? 'checked' : ''}`}>
                                                    {feat.included && <Check size={12} color="white" />}
                                                </div>
                                                <span style={{
                                                    color: feat.included ? 'white' : '#666', 
                                                    fontSize: '0.9rem',
                                                    textDecoration: feat.included ? 'none' : 'line-through'
                                                }}>
                                                    {feat.label}
                                                </span>
                                            </div>

                                            {/* Right delete button */}
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteFeature(idx); }} 
                                                title="Delete Permanently"
                                                style={{background:'none', border:'none', color:'#444', cursor:'pointer', padding:'5px', display:'flex'}}
                                                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                                                onMouseOut={(e) => e.currentTarget.style.color = '#444'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="form-btn">Save Package</button>
                        </form>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;