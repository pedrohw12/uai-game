import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { useState } from "react";

export default function LoginHeader() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (error) {
      alert("Login failed: " + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="md:flex md:items-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-1 mb-1 md:mb-0 outline-none bg-gray-500/40 w-full rounded mr-2 text-white"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="p-1 mb-1 md:mb-0 outline-none w-full bg-gray-500/40 rounded mr-2 text-white"
        required
      />
      <button
        type="submit"
        className="p-1 px-2
                        w-full md:w-auto text-purple-dark font-medium bg-another-green rounded"
      >
        Login
      </button>
    </form>
  );
}
