// "use client";

// import { useLogin } from "../hooks/useAuth";
// import { useRouter } from "next/navigation";

// export default function LoginForm() {
//   const { mutate, isPending } = useLogin();
//   const router = useRouter();

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const form = new FormData(e.currentTarget);

//     mutate(
//       {
//         email: form.get("email") as string,
//         password: form.get("password") as string,
//       },
//       {
//         onSuccess: (res: any) => {
//           console.log(" LOGIN RESPONSE:", res);

//           const user = res.data?.data?.user || res.data?.user;

//           if (!user) {
//             console.error("USER NOT FOUND", res);
//             return;
//           }

//           // window.location.href = `/${user.username}`;
//           // router.push("/profile/");
//           router.push("/home");
          
//         },
//       }
//     );
//   };

//   return (
//     // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 px-4">
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#BFE4FF] px-4">
//       {/* Glass Card */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl space-y-6"
//       >
//         {/* Title */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold Beau Rivage">MatchMaker</h1>
//           <p className="text-white/70 text-sm mt-1">
//             Login to continue your journey
//           </p>
//         </div>

//         {/* Email */}
//         <input
//           name="email"
//           placeholder="Email"
//           className="w-full px-4 py-3 rounded-xl bg-black/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
//         />

//         {/* Password */}
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           className="w-full px-4 py-3 rounded-xl bg-black/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
//         />

//         {/* Login Button */}
//         <button
//           className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition duration-200"
//         >
//           {isPending ? "Logging in..." : "Login"}
//         </button>

//         {/* Divider */}
//         <div className="flex items-center gap-2 text-white/50 text-sm">
//           <div className="flex-1 h-px bg-white/20"></div>
//           OR
//           <div className="flex-1 h-px bg-white/20"></div>
//         </div>

//         {/* Register Button */}
        
//         <button
//           type="button"
//           onClick={() => router.push("/register")}
//           className="w-full py-3 rounded-xl bg-black/30 text-white font-medium hover:bg-black/50 transition"
//         >
//           Create Account
//         </button>
        
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react"; // Added useState
import { useLogin } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Stops event bubbling

    // Explicitly call the mutation with state values
    mutate({
      email: email.trim(),
      password: password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] via-[#EAF6FF] to-[#BFE4FF] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl space-y-6"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold">MatchMaker</h1>
          <p className="text-white/70 text-sm mt-1">
            Login to continue your journey
          </p>
        </div>

        {/* Changed to type="email" and added value/onChange */}
        <input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl bg-black/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
          required
        />

        {/* Added value/onChange */}
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl bg-black/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
          required
        />

        {/* Explicitly set type="submit" */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition duration-200 disabled:opacity-50"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center gap-2 text-white/50 text-sm">
          <div className="flex-1 h-px bg-white/20"></div>
          OR
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/register")}
          className="w-full py-3 rounded-xl bg-black/30 text-white font-medium hover:bg-black/50 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}