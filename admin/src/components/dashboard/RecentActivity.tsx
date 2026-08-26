const activity=["New order received — #LW-1024","New customer registered","Product stock updated"];
export function RecentActivity(){return <div className="rounded-xl border bg-white p-6"><h2 className="font-semibold">Recent Activity</h2><div className="mt-5 space-y-4">{activity.map(item=><p key={item} className="text-sm text-gray-700">{item}</p>)}</div></div>;}
