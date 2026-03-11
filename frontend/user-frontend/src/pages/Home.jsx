import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {/* Futuristic Hero Section */}
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1', background: 'linear-gradient(to right, #38bdf8, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0px 4px 20px rgba(56,189,248,0.3))' }}>
            Take Control of Your <br /> Personal Data
          </h1>
          <p style={{ fontSize: '1.3rem', color: 'var(--text-color)', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            DataChain empowers you to securely store, manage, and control 
            access to your personal documents using real decentralized blockchain technology.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', borderRadius: '50px' }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Glassmorphism Features Section */}
      <section style={{ padding: '6rem 2rem', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Why Choose DataChain?</h2>
            <p style={{ fontSize: '1.2rem', color: '#64748b' }}>Built on blockchain technology for true data ownership</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Secure Storage', description: 'Your data is encrypted and stored on IPFS, a decentralized network' },
              { title: 'Full Ownership', description: 'You have complete control over who accesses your personal data' },
              { title: 'Immutable History', description: 'All access requests are recorded on the blockchain forever' },
              { title: 'Permission Control', description: 'Grant or revoke access to your documents anytime' },
              { title: 'Digital Wallet', description: 'Manage all your documents in one futuristic secure dashboard' },
              { title: 'Transparent', description: 'Complete visibility into who accessed your data and when' }
            ].map((feature, index) => (
              <div key={index} className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(129,140,248,0.2))', border: '1px solid rgba(56,189,248,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(56,189,248,0.2)' }}>
                  <div style={{ width: '24px', height: '24px', backgroundColor: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 15px #38bdf8' }}></div>
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>{feature.title}</h3>
                <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Layer */}
      <section style={{ padding: '6rem 2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1e293b' }}>How It Works</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '4rem' }}>Simple, secure, and transparent process</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', position: 'relative' }}>
            {[
              { step: '1', title: 'Upload Document', desc: 'Securely upload your documents to IPFS' },
              { step: '2', title: 'Blockchain Verification', desc: 'Document hash is stored on blockchain' },
              { step: '3', title: 'Manage Access', desc: 'Control who can view your documents' },
              { step: '4', title: 'Audit Trail', desc: 'Track all access requests on blockchain' }
            ].map((item, index) => (
              <div key={index} style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(15, 23, 42, 0.8)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1.5rem', border: '2px solid #38bdf8', boxShadow: '0 0 20px rgba(56,189,248,0.3)', backdropFilter: 'blur(10px)' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1e293b' }}>{item.title}</h3>
                <p style={{ color: '#64748b' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer / CTA padding */}
      <div style={{ height: '100px' }}></div>
    </div>
  );
};

export default Home;