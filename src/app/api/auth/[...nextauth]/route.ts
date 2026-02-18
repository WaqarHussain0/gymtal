import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // import from the separate file

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
