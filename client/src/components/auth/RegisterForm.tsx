/**
 * @author Arman Hazrati
 * Registration form component
 */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth';
import { UserPlus, Loader2 } from 'lucide-react';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    role: z.enum(['BUSINESS', 'CUSTOMER']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((state) => state.register);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password, data.role);
      toast.success('Registration successful!');
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...registerField('name')}
          type="text"
          id="name"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...registerField('email')}
          type="email"
          id="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Account Type
        </label>
        <select
          {...registerField('role')}
          id="role"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="BUSINESS">Business</option>
        </select>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...registerField('password')}
          type="password"
          id="password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...registerField('confirmPassword')}
          type="password"
          id="confirmPassword"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </button>
    </form>
  );
}
