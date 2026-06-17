import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Field = ({ label, id, type, icon: Icon, value, onChange, error, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-yellow-400 bg-white'}`}>
      <Icon className="text-gray-400 text-lg shrink-0" />
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="flex-1 outline-none bg-transparent text-sm text-gray-900"
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-black text-black">b</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Login to your blinkit account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Email"
              id="email"
              type="email"
              icon={HiOutlineMail}
              value={form.email}
              onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((er) => ({ ...er, email: '' })); }}
              error={errors.email}
              placeholder="you@example.com"
            />
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-yellow-400 bg-white'}`}>
                <HiOutlineLockClosed className="text-gray-400 text-lg shrink-0" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); setErrors((er) => ({ ...er, password: '' })); }}
                  placeholder="Your password"
                  className="flex-1 outline-none bg-transparent text-sm text-gray-900"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="text-gray-400 hover:text-gray-700">
                  {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3.5 rounded-xl transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 font-bold hover:underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
