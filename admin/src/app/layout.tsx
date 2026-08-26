import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
export const metadata:Metadata={title:"LuxeWear Admin",description:"LuxeWear administration dashboard"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="flex min-h-screen"><Sidebar/><div className="flex min-w-0 flex-1 flex-col"><AdminHeader/><main className="flex-1 p-6">{children}</main></div></div></body></html>;}
