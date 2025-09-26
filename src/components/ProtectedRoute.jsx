import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ uid: parsedUser.uid, email: parsedUser.email });
        setUserRole(parsedUser.role);
        setLoading(false);
        return; 
      } catch (e) {
        console.warn('Failed to parse user from localStorage', e);
      }
    }

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserRole(userData.role);
          } else {
            setUserRole(null);
          }
          setUser(firebaseUser);
        } catch (err) {
          setUserRole(null);
          setUser(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && userRole !== requiredRole) {
    console.warn(`🚫 Access denied. Required role: ${requiredRole}, but got: ${userRole}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
