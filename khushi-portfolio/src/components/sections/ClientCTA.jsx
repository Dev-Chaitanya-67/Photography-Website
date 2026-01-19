import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, UserCheck } from 'lucide-react';

// Accept toggleLogin as a prop
const ClientCTA = ({ toggleLogin }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('currentUser');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleClick = () => {
    if (user) {
      // User is logged in -> Go to Dashboard
      navigate('/dashboard');
    } else {
      // User is NOT logged in -> Open Login Modal
      toggleLogin(); 
    }
  };

  return (
    <section className="client-cta-wrap reveal">
      <div className="client-cta-content">
        
        <div className="cta-icon-box">
           <Lock size={32} color="#fff" />
        </div>

        <h2>Get Personalized Album</h2>
        <p>
          Access your exclusive, high-definition event gallery securely. 
          Relive your moments in cinematic quality.
        </p>

        <button className="cta-btn" onClick={handleClick}>
           {/* Button always looks inviting */}
           Enter My Gallery <ArrowRight size={18} />
        </button>

      </div>
    </section>
  );
};

export default ClientCTA;