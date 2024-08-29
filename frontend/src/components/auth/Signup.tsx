import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { AuthDialog } from './MainAuthDialog';
import { Toaster } from '@/components/ui/toaster';

interface SignupProps {
  setAuthDialog: React.Dispatch<React.SetStateAction<string>>;
}

const Signup = ({ setAuthDialog }: SignupProps) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setpasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !passwordConfirm) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    signup(name, email, password, passwordConfirm);
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <DialogHeader className="mb-4">
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Lwin"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="lwin@gmail.com"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="password"
              className="col-span-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="passwordConfirm" className="text-right">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="passwordConfirm"
              placeholder="confirm password"
              className="col-span-3"
              value={passwordConfirm}
              onChange={(e) => setpasswordConfirm(e.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <div className="mt-4 text-red-700">{errorMessage}</div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Sign up</Button>
        </DialogFooter>
      </form>
      <Button
        variant="link"
        className="text-center text-xs text-gray-500 underline"
        onClick={() => {
          setAuthDialog(AuthDialog.login);
        }}
      >
        Login to existing account
      </Button>
    </>
  );
};

export default Signup;
