import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const InputRow = ({ label, id, type = 'text', icon: Icon, value, onChange, error, extra }) => (
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
      />
      {extra}
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const setField = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-black text-black">b</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join blinkit for fast grocery delivery</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputRow label="Full Name" id="name" icon={HiOutlineUser} value={form.name} onChange={setField('name')} error={errors.name} />
            <InputRow label="Email" id="email" type="email" icon={HiOutlineMail} value={form.email} onChange={setField('email')} error={errors.email} />
            <InputRow
              label="Password"
              id="password"
              type={showPass ? 'text' : 'password'}
              icon={HiOutlineLockClosed}
              value={form.password}
              onChange={setField('password')}
              error={errors.password}
              extra={
                <button type="button" onClick={() => setShowPass((v) => !v)} className="text-gray-400 hover:text-gray-700">
                  {showPass ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              }
            />
            <InputRow
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              icon={HiOutlineLockClosed}
              value={form.confirmPassword}
              onChange={setField('confirmPassword')}
              error={errors.confirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3.5 rounded-xl transition-colors disabled:opacity-70 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-600 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
