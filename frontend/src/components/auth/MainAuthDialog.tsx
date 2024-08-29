// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import useAuth from '@/hooks/useAuth';
// import { useState } from 'react';
// export enum AuthDialog {
//   login = 'login',
//   signup = 'signup',
// }

// function LoginDialog() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const { login } = useAuth();
//   const [authDialog, setAuthDialog] = useState<string>(AuthDialog.login);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setErrorMessage('Email and Password fields are required');
//       return;
//     }

//     console.log(99);
//     login(email, password);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="link">Login/Signup</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Login</DialogTitle>
//             <DialogDescription></DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="email" className="text-right">
//                 Email
//               </Label>
//               <Input
//                 type="email"
//                 id="email"
//                 placeholder="lwin@gmail.com"
//                 className="col-span-3"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="password" className="text-right">
//                 Password
//               </Label>
//               <Input
//                 type="password"
//                 id="password"
//                 placeholder="password"
//                 className="col-span-3"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {errorMessage && (
//               <div className="mt-4 text-red-700">{errorMessage}</div>
//             )}
//             {/* <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="username" className="text-right">
//               Username
//             </Label>
//             <Input id="username" placeholder="Lwin" className="col-span-3" />
//           </div> */}
//           </div>
//           <DialogFooter>
//             <Button type="submit">Login</Button>
//           </DialogFooter>
//         </form>
//         <Button
//           variant="link"
//           className="text-center text-xs text-gray-500 underline"
//           onClick={() => {
//             setAuthDialog(AuthDialog.signup);
//           }}
//         >
//           Create new account
//         </Button>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default LoginDialog;

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
export enum AuthDialog {
  login = 'login',
  signup = 'signup',
}

function MainAuthDialog() {
  const [authDialog, setAuthDialog] = useState<string>(AuthDialog.login);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">Login/Signup</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {authDialog === AuthDialog.login ? (
          <Login setAuthDialog={setAuthDialog} />
        ) : (
          <Signup setAuthDialog={setAuthDialog} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default MainAuthDialog;
