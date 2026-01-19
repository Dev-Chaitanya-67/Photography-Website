import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Lock, User, Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';
import '../../styles/global.css';
import { loginUser, registerUser, resetUserPassword } from '../../firebase/services';

// ADD 'onLoginSuccess' HERE
const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  
  // MODES: 'login', 'register', 'forgot'
  const [view, setView] = useState('login'); 
  
  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); // For Reset Link sent
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- HANDLERS ---

  const handleLoginRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }

    let result = null;

    if (view === 'register') {
      result = await registerUser(name, email, password);
    } else {
      result = await loginUser(email, password);
    }

    if (result.success) {
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      if (onLoginSuccess) onLoginSuccess(result.user);
      resetAndClose();
      navigate('/dashboard');
    } else {
      handleFirebaseError(result.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!email) {
        setError("Please enter your email first.");
        setLoading(false);
        return;
    }

    const result = await resetUserPassword(email);
    
    if (result.success) {
        setSuccessMsg("Reset link sent! Check your inbox.");
    } else {
        handleFirebaseError(result.message);
    }
    setLoading(false);
  };

  // Helper to interpret Firebase errors
  const handleFirebaseError = (msg) => {
      if (msg.includes("auth/user-not-found")) setError("No account found with this email.");
      else if (msg.includes("auth/wrong-password")) setError("Incorrect password.");
      else if (msg.includes("auth/email-already-in-use")) setError("Email already registered.");
      else if (msg.includes("auth/invalid-credential")) setError("Invalid email or password.");
      else setError(msg);
  };

  const resetAndClose = () => {
      onClose();
      // Reset states slightly after close animation
      setTimeout(() => {
          setView('login');
          setName('');
          setEmail('');
          setPassword('');
          setError('');
          setSuccessMsg('');
          setShowPassword(false);
      }, 300);
  };

  // --- RENDER HELPERS ---

  // 1. FORGOT PASSWORD VIEW
  if (view === 'forgot') {
      return (
        <div className="modal open">
            <div className="modal-content">
                <button onClick={resetAndClose} className="close-modal-btn"><X size={20} /></button>
                
                <div onClick={() => { setView('login'); setError(''); setSuccessMsg(''); }} className="back-link">
                    <ArrowLeft size={14} /> Back to Login
                </div>

                <div style={{display:'flex', justifyContent:'center', marginBottom:'15px'}}>
                    <div style={{width:'50px', height:'50px', background:'rgba(144,46,56,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                        <Mail size={24} color="var(--accent)" />
                    </div>
                </div>

                <h2 style={{fontFamily:'var(--font-head)', fontSize:'1.5rem', marginBottom:'0.5rem', color:'white'}}>
                    Reset Password
                </h2>
                <p style={{color:'#666', fontSize:'0.9rem', marginBottom:'2rem'}}>
                    Enter your email to receive a reset link.
                </p>

                <form onSubmit={handleForgotPassword}>
                    <input 
                        type="email" 
                        className="form-input" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    {error && <p style={{color:'#902e38', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'0.75rem'}}>{error}</p>}
                    {successMsg && <p style={{color:'#4ade80', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'0.75rem'}}>{successMsg}</p>}

                    <button type="submit" className="form-btn" disabled={loading || successMsg}>
                        {loading ? <Loader2 className="spinner" size={20}/> : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  // 2. LOGIN / REGISTER VIEW
  return (
    <div className="modal open">
      <div className="modal-content">
        <button onClick={resetAndClose} className="close-modal-btn">
          <X size={20} />
        </button>

        <div style={{display:'flex', justifyContent:'center', marginBottom:'15px'}}>
            <div style={{width:'50px', height:'50px', background:'rgba(144,46,56,0.1)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                {view === 'register' ? <User size={24} color="var(--accent)" /> : <Lock size={24} color="var(--accent)" />}
            </div>
        </div>

        <h2 style={{fontFamily:'var(--font-head)', fontSize:'1.5rem', marginBottom:'0.5rem', color:'white'}}>
            {view === 'register' ? 'Create Account' : 'Welcome Back!'}
        </h2>
        <p style={{color:'#666', fontSize:'0.9rem', marginBottom:'2rem'}}>
            {view === 'register' ? 'Register to view your gallery' : 'Enter your credentials to view'}
        </p>

        <form onSubmit={handleLoginRegister}>
            {/* NAME (Register Only) */}
            {view === 'register' && (
              <div style={{marginBottom:'1rem'}}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* EMAIL */}
            <input 
              type="email" 
              className="form-input" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            {/* PASSWORD WITH SHOW/HIDE TOGGLE */}
            <div className="password-wrapper" style={{marginBottom: view === 'login' ? '10px' : '1rem'}}>
                <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-input" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{marginBottom:0}}
                    required
                />
                <button 
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1" // Skip tab focus
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* FORGOT PASSWORD LINK (Login Only) */}
            {view === 'login' && (
                <div style={{textAlign:'right'}}>
                    <span onClick={() => { setView('forgot'); setError(''); }} className="forgot-pass-link">
                        Forgot Password?
                    </span>
                </div>
            )}
            
            {error && <p style={{color:'#902e38', fontSize:'0.75rem', fontWeight:'bold', marginBottom:'0.75rem'}}>{error}</p>}

            <button type="submit" className="form-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={20}/> : (view === 'register' ? 'Sign Up' : 'View Gallery')}
            </button>
        </form>
        
        {/* TOGGLE LOGIN/REGISTER */}
        <p style={{marginTop:'1.5rem', fontSize:'0.8rem', color:'#888'}}>
            {view === 'register' ? "Already have an account?" : "Don't have an account?"} 
            <span 
              onClick={() => { setView(view === 'register' ? 'login' : 'register'); setError(''); }}
              style={{color:'var(--accent)', fontWeight:'bold', cursor:'pointer', marginLeft:'5px'}}
            >
              {view === 'register' ? 'Login' : 'Register'}
            </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;