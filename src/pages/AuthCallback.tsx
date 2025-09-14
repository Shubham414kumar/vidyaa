import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Read the token from the URL
    const token = searchParams.get('token');

    if (token) {
      // Save the token to localStorage
      localStorage.setItem('authToken', token);
      
      // --- MODIFIED: Redirect to the dashboard ---
      window.location.href = '/dashboard'; 
    } else {
      // If no token is found, go back to the login page with an error
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Finalizing login, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;