import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, CheckCircle, Clock, Save, ShieldAlert, LogOut } from 'lucide-react';
import { getAllUsers, updateUserField, loginUser } from '../firebase/services';
import '../styles/global.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState(null); // Stores the logged-in admin
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // 1. Check Session on Load
  useEffect(() => {
    const session = localStorage.getItem('adminSession');
    if (session) {
      const user = JSON.parse(session);
      // Double check role just to be safe
      if (user.role === 'admin') {
          setAdminUser(user);
          refreshData(); // Load data immediately if already logged in
      }
    }
  }, []);

  // 2. Fetch Data (Only called if Admin is valid)
  const refreshData = async () => {
    setLoading(true);
    const realUsers = await getAllUsers();
    setUsers(realUsers);
    setLoading(false);
  };

  // 3. ADMIN LOGIN HANDLER
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setError('');

    const result = await loginUser(email, password);

    if (result.success) {
        const user = result.user;
        
        // SECURITY CHECK: Is this user actually an Admin?
        if (user.role === 'admin') {
            setAdminUser(user);
            localStorage.setItem('adminSession', JSON.stringify(user)); // Save Admin Session
            refreshData(); // Fetch the table data
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

  // ... (Keep handleToggleBooking, handleFolderChange, handleSaveFolder exactly as before) ...
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

  // --- RENDER LOGIN SCREEN (If not logged in) ---
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

            {error && (
                <div style={{background:'rgba(144,46,56,0.2)', border:'1px solid var(--accent)', color:'#ffcccc', padding:'10px', borderRadius:'6px', fontSize:'0.8rem', textAlign:'center'}}>
                    {error}
                </div>
            )}

            <button className="form-btn" disabled={loginLoading}>
                {loginLoading ? 'Verifying...' : 'Log In'}
            </button>
        </form>
      </div>
    );
  }

  // --- RENDER DASHBOARD (If Logged In) ---
  return (
    <div className="page-container">
      <div className="max-w-wrapper">
        
        {/* Header */}
        <div className="admin-header">
            <div>
                <h1 className="hero-heading" style={{marginBottom:'0', fontSize:'2.5rem'}}>Control Room</h1>
                <div style={{display:'flex', alignItems:'center', gap:'10px', color:'#666', marginTop:'5px'}}>
                    <span style={{fontSize:'0.8rem', background:'#222', padding:'2px 8px', borderRadius:'4px'}}>LOGGED IN AS ADMIN</span>
                    <button onClick={handleLogout} style={{background:'none', border:'none', color:'#902e38', cursor:'pointer', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'4px'}}>
                        <LogOut size={12}/> Logout
                    </button>
                </div>
            </div>
            <button onClick={refreshData} className="refresh-btn" title="Refresh Data">
                <RefreshCw size={18} className={loading ? 'spinner' : ''} />
            </button>
        </div>

        {/* The Glass Table */}
        <div className="table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Client Details</th>
                        <th>Drive Folder ID</th>
                        <th style={{textAlign:'center'}}>Status</th>
                        <th style={{textAlign:'right'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="4" style={{textAlign:'center', padding:'2rem', color:'#666'}}>
                                No users found or database is empty.
                            </td>
                        </tr>
                    )}
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td>
                                <div style={{fontWeight:'bold'}}>{user.name}</div>
                                <div style={{fontSize:'0.75rem', color:'#666'}}>{user.email}</div>
                                {/* Show Role Tag if they are also admin */}
                                {user.role === 'admin' && <span style={{fontSize:'0.6rem', background:'var(--accent)', padding:'2px 4px', borderRadius:'2px', color:'white'}}>ADMIN</span>}
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
                                    <button 
                                        onClick={() => handleSaveFolder(user.uid, user.folderId)}
                                        style={{background:'none', border:'none', cursor:'pointer', color:'#444'}}
                                        title="Save ID"
                                    >
                                        <Save size={16} />
                                    </button>
                                </div>
                            </td>
                            
                            <td style={{textAlign:'center'}}>
                                {user.hasBooking ? (
                                    <span className="status-badge booked"><CheckCircle size={12} /> BOOKED</span>
                                ) : (
                                    <span className="status-badge pending"><Clock size={12} /> PENDING</span>
                                )}
                            </td>

                            <td style={{textAlign:'right'}}>
                                <button 
                                    onClick={() => handleToggleBooking(user.uid, user.hasBooking)}
                                    className={`action-btn ${user.hasBooking ? 'revoke' : 'approve'}`}
                                >
                                    {user.hasBooking ? 'Revoke' : 'Approve'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;