import { SignInButton, SignedIn , SignUpButton, SignedOut, SignOutButton} from "@clerk/nextjs";
import Header from "@/app/(root)/_components/Header";
import RootLayout from "./layout";
import { Layout } from "lucide-react";
import RoomID from "./RoomID/page";

export default function Home() {
  return (<RoomID/>);
}
