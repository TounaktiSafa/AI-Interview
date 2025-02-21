'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

import { auth } from '../firebase/config';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  
  // ✅ Listen for authentication state changes and redirect to dashboard if logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard'); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In Success:', result.user);
      router.push('/dashboard'); // ✅ Redirect to dashboard after successful login
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      setFormError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(form.email, form.password);
      if (newUser) {
        setSuccessMessage('Account created successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (e) {
      console.error(e.message);
      setFormError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-4xl bg-gray-50 shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="absolute inset-0 bg-indigo-600 w-full h-full" style={{ clipPath: 'ellipse(100% 90% at 0% 50%)' }}></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-bold">Welcome!</h2>
            <p className="text-sm text-gray-200 mt-2 max-w-xs">
              Create a new account and start your journey today! <br />
              Let the adventure begin
            </p>
            <br></br>
            <p>Do You have an account?</p>
            <Link href="/sign-in">
              <button className="mt-6 border border-white text-white px-6 py-2 rounded-lg font-semibold hover:text-indigo-600 hover:bg-white transition">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>

        <div className="w-1/2 p-10 bg-gray-50 rounded-r-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-3">Create Account</h2>
          {successMessage && (
            <div className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4">
              <span className="font-bold">Success: </span> {successMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            {formError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{formError}</div>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
              disabled={loading} 
            >
              {loading ? 'Signing Up...' : 'SIGN UP'} 
            </button>
          
    <button 
     type="button"
     onClick={handleGoogleSignUp}
    className="px-4 py-2 border flex gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
        <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
        <span>Sign Up with Google</span>
    </button>
            {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{error.message}</div>} 
          </form>
        </div>
      </div>
    </div>
  );
}
