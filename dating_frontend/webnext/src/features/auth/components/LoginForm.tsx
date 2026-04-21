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
//           console.log("🔥 LOGIN RESPONSE:", res);

//           const user = res.data?.data?.user || res.data?.user;

//           if (!user) {
//             console.error("❌ USER NOT FOUND", res);
//             return;
//           }

//           // 🔥 SAFE REDIRECT
//           window.location.href = `/${user.username}`;
//         },
//       }
//     );
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 space-y-4">
//       <input name="email" placeholder="Email" className="input w-full" />

//       <input
//         name="password"
//         type="password"
//         placeholder="Password"
//         className="input w-full"
//       />

//       <button className="btn w-full">
//         {isPending ? "Logging in..." : "Login"}
//       </button>

//       <button
//         type="button"
//         onClick={() => router.push("/register")}
//         className="btn w-full bg-gray-200 text-black"
//       >
//         Create Account
//       </button>
//     </form>
//   );
// }



"use client";

import { useLogin } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    mutate(
      {
        email: form.get("email") as string,
        password: form.get("password") as string,
      },
      {
        onSuccess: (res: any) => {
          console.log("🔥 LOGIN RESPONSE:", res);

          const user = res.data?.data?.user || res.data?.user;

          if (!user) {
            console.error("❌ USER NOT FOUND", res);
            return;
          }

          window.location.href = `/${user.username}`;
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 px-4">
      
      {/* Glass Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl space-y-6"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back ❤️</h1>
          <p className="text-white/70 text-sm mt-1">
            Login to continue your journey
          </p>
        </div>

        {/* Email */}
        <input
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
        />

        {/* Login Button */}
        <button
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition duration-200"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <div className="flex-1 h-px bg-white/20"></div>
          OR
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Register Button */}
        
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