'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGoogle, FaTwitter, FaGithub } from 'react-icons/fa';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult } from 'firebase/auth';
import Image from 'next/image';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  // Firebase email/password authentication
  const [signInWithEmailAndPassword, user, loading, firebaseError] =
    useSignInWithEmailAndPassword(auth);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  // Handle Google Sign-In with Popup
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In successful:', result.user);
      router.push('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      console.error('Google Sign-In Error:', error.message);
      setError(error.message);
    }
  };

  // Handle email/password sign-in
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res?.user) {
        console.log('User signed in:', res.user);
        setEmail('');
        setPassword('');
        router.push('/dashboard');
      } else {
        setError('Sign-in failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Sign-in Error:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 relative">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover">
        <source src="/videos/IA.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-3xl shadow-2xl rounded-3xl p-10 relative transform transition-transform duration-500 ease-in-out scale-100 hover:scale-105">
        <h2 className="text-center text-3xl font-bold mb-8 text-white">
          Welcome Back
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-400 transition duration-200"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white placeholder-gray-400 transition duration-200"
            required
          />
          <button
            type="submit"
            className="mt-6 border border-white text-white px-6 py-2 rounded-lg font-semibold hover:text-indigo-700 hover:bg-white hover:text-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center my-4 text-gray-300">or sign in with:</div>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 border flex gap-2 bg-white border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
            onClick={handleGoogleSignIn}
          
          >
            <img className='w-6 h-6' src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"></img>
            <span>Sign In with Google</span>

          </button>
          
        </div>
        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-white hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
