"use client";

import { useState, useEffect } from "react";
import {
    Users,
    FileText,
    BarChart,
    Key,
    TrendingUp,
    Activity,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [range, setRange] = useState("7d");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/stats?range=${range}`);
                const data = await res.json();
                if (res.ok) {
                    setStats(data);
                } else {
                    console.error("API Error:", data.error);
                }
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [range]);

    if (loading && !stats) return <div className="p-8 text-slate-500 animate-pulse">Loading dashboard statistics...</div>;

    const summaryItems = [
        { label: "Total Users", value: stats?.summary?.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Forms", value: stats?.summary?.totalForms, icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Total Submissions", value: stats?.summary?.totalSubmissions, icon: BarChart, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Active API Keys", value: stats?.summary?.totalApiKeys, icon: Key, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
                    <p className="text-slate-500">Global platform health and usage metrics.</p>
                </div>
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                    {["7d", "30d", "90d"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${range === r
                                ? "bg-slate-900 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            Last {r.replace("d", "")} Days
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryItems.map((item) => (
                    <Card key={item.label} className="border-none shadow-sm ring-1 ring-slate-200 overflow-hidden relative group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                                <div className={`${item.bg} ${item.color} p-2 rounded-lg`}>
                                    <item.icon className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-2xl font-bold">{item.value?.toLocaleString()}</div>
                                {item.label === "Total Submissions" && (
                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                        <TrendingUp className="h-2 w-2" /> Live
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Usage Chart Placeholder (Simulated visually) */}
                <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                        <div>
                            <CardTitle className="text-base font-bold">Submission Volume Over Time</CardTitle>
                            <CardDescription className="text-xs">Incoming data trends across all forms.</CardDescription>
                        </div>
                        <Activity className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[240px] w-full flex items-end gap-2 px-2 pb-4 pt-4 border-b border-l border-slate-100 relative">
                            {/* Simple visual bar chart using data */}
                            {stats?.charts?.dailySubmissions?.length > 0 ? (
                                stats.charts.dailySubmissions.map((day: any, i: number) => {
                                    const maxCount = Math.max(...stats.charts.dailySubmissions.map((d: any) => d.count), 1);
                                    const height = (day.count / maxCount) * 100;
                                    return (
                                        <div
                                            key={i}
                                            className="bg-blue-500/80 rounded-t-sm flex-1 min-w-[4px] relative group"
                                            style={{ height: `${Math.max(height, 5)}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {day.count} sub
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                                    No data available for this range
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between mt-2 px-1">
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{range === "7d" ? "7 Days Ago" : range === "30d" ? "30 Days Ago" : "90 Days Ago"}</span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Today</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Users List */}
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Top Active Users</CardTitle>
                        <CardDescription className="text-xs">Based on submission volume in range.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats?.topUsers?.length > 0 ? (
                                stats.topUsers.map((user: any) => (
                                    <div key={user.id} className="flex items-center">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="ml-4 space-y-0.5">
                                            <p className="text-sm font-medium leading-none text-slate-900">{user.name || "Anonymous User"}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{user.email}</p>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {user.submission_count}
                                            <ArrowUpRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-10 text-slate-400 text-sm">No active users found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
