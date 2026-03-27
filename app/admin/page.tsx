"use client";

import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  adminListProducts,
  adminListClients,
  adminListInquiries,
  fetchBlogs,
  adminListProductCategories,
} from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    clients: 0,
    inquiries: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminListProducts("").catch(() => []),
      adminListProductCategories().catch(() => []),
      adminListClients("").catch(() => []),
      adminListInquiries({}).catch(() => ({} as any)),
      fetchBlogs({}).catch(() => []),
    ]).then(([prodRes, catRes, clientRes, inqRes, blogRes]) => {
      if (!mounted) return;
      setStats({
        products: Array.isArray(prodRes) ? prodRes.length : 0,
        categories: Array.isArray(catRes) ? catRes.length : 0,
        clients: Array.isArray(clientRes) ? clientRes.length : 0,
        inquiries: inqRes.stats?.all || (inqRes.data ? inqRes.data.length : 0),
        blogs: Array.isArray(blogRes) ? blogRes.length : 0,
      });
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <AdminShell title="Admin Dashboard" activeTab={"" as any}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome to the Technical Aid Administration Area.</p>

        {loading ? (
          <div className="animate-pulse flex gap-4 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 w-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Products" value={stats.products} href="/admin/products" />
            <StatCard label="Categories" value={stats.categories} href="/admin/product-categories" />
            <StatCard label="Technical Clients" value={stats.clients} href="/admin/clients" />
            <StatCard label="Inquiries" value={stats.inquiries} href="/admin/inquiries" />
            <StatCard label="Blogs Published" value={stats.blogs} href="/admin/blogs" />
            <StatCard label="Testimonials" value="View" href="/admin/testimonials" />
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-[var(--text)]">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             <Link href="/admin/products" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">Add New Product</span>
               <span className="text-gray-400">→</span>
             </Link>
             <Link href="/admin/product-categories" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">Manage Categories</span>
               <span className="text-gray-400">→</span>
             </Link>
             <Link href="/admin/blogs" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">Write Blog Post</span>
               <span className="text-gray-400">→</span>
             </Link>
             <Link href="/admin/clients" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">Manage Clients</span>
               <span className="text-gray-400">→</span>
             </Link>
             <Link href="/admin/testimonials" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">Manage Testimonials</span>
               <span className="text-gray-400">→</span>
             </Link>
             <Link href="/admin/inquiries" className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
               <span className="font-medium text-gray-700">View Inquiries</span>
               <span className="text-gray-400">→</span>
             </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, href }: { label: string, value: string | number, href: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all group">
      <p className="text-sm font-medium text-gray-500 mb-1 group-hover:text-[var(--gold)] transition-colors">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </Link>
  );
}
