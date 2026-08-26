import { StatCard } from "@/components/dashboard/StatCard";
import { SalesPlaceholder } from "@/components/dashboard/SalesPlaceholder";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
const stats=[["Total Revenue","$24,580","+12.5%"],["Orders","428","+8.2%"],["Customers","1,284","+14.3%"],["Products","386","+5.1%"]];
export default function DashboardPage(){return <div><div><h1 className="text-2xl font-bold">Dashboard</h1><p className="mt-1 text-sm text-gray-500">Overview of your fashion store.</p></div><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(s=><StatCard key={s[0]} title={s[0]} value={s[1]} change={s[2]}/>)}</div><div className="mt-6 grid gap-6 lg:grid-cols-3"><div className="rounded-xl border bg-white p-6 lg:col-span-2"><h2 className="font-semibold">Sales Overview</h2><SalesPlaceholder/></div><RecentActivity/></div></div>;}
