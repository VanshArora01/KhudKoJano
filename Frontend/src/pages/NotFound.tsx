import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '120px 24px 80px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '4rem',
        color: 'var(--accent-gold)',
        marginBottom: '12px'
      }}>
        404
      </h1>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.5rem',
        color: 'var(--text-primary)',
        marginBottom: '16px'
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        marginBottom: '32px',
        maxWidth: '400px',
        lineHeight: 1.7
      }}>
        The stars couldn't guide us to this page. It may have moved or doesn't exist.
      </p>
      <Link to="/" className="btn-primary">
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
