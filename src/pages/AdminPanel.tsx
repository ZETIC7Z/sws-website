import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield, Users, Trash2, Edit2, RefreshCw, Search, X, LogOut,
  UserCheck, AlertTriangle, Crown, ChevronRight, Database
} from "lucide-react";
import { getApiUrl } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Member {
  _id: string;
  username: string;
  email: string;
  accountId: string;
  firstName: string;
  lastName: string;
  role: string;
  isProfileComplete: boolean;
  createdAt: string;
  lastActive: string;
  chapter: string;
  profileImage?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [stats, setStats] = useState({ total: 0, online: 0 });

  // Edit states
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editChapter, setEditChapter] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editIsProfileComplete, setEditIsProfileComplete] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Guard: must be admin
  useEffect(() => {
    const token = localStorage.getItem("sws_token");
    const userRaw = localStorage.getItem("sws_user");
    if (!token || !userRaw) { navigate("/login"); return; }
    const user = JSON.parse(userRaw);
    if (user.role !== "admin") { navigate("/dashboard"); return; }
    fetchMembers();
    fetchStats();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("sws_token")!;
      const res = await fetch(getApiUrl("/api/admin/members"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data.members || []);
    } catch (err: any) {
      setError(err.message || "Failed to load members");
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl("/api/members/stats"));
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
  };

  const handleDelete = async (member: Member) => {
    setDeletingId(member._id);
    setError("");
    try {
      const token = localStorage.getItem("sws_token")!;
      const res = await fetch(getApiUrl(`/api/admin/members/${member._id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setMembers(prev => prev.filter(m => m._id !== member._id));
      setSuccessMsg(`Account @${member.username} removed successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchStats();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
    setDeletingId(null);
    setConfirmDelete(null);
  };

  const handleEditOpen = (member: Member) => {
    setEditingMember(member);
    setEditUsername(member.username);
    setEditEmail(member.email);
    setEditFirstName(member.firstName || "");
    setEditLastName(member.lastName || "");
    setEditChapter(member.chapter || "");
    setEditRole(member.role);
    setEditIsProfileComplete(member.isProfileComplete);
    setEditError("");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setEditLoading(true);
    setEditError("");
    try {
      const token = localStorage.getItem("sws_token")!;
      const res = await fetch(getApiUrl(`/api/admin/members/${editingMember._id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          firstName: editFirstName,
          lastName: editLastName,
          role: editRole,
          chapter: editChapter,
          isProfileComplete: editIsProfileComplete
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // Update members list
      setMembers(prev => prev.map(m => m._id === editingMember._id ? { ...m, ...data.member } : m));
      setSuccessMsg(`Account @${editUsername} updated successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setEditingMember(null);
      fetchStats();
    } catch (err: any) {
      setEditError(err.message || "Failed to update member");
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sws_token");
    localStorage.removeItem("sws_user");
    navigate("/");
  };

  const filtered = members.filter(m =>
    m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.accountId?.includes(searchQuery)
  );

  const isOnline = (lastActive: string) => {
    if (!lastActive) return false;
    return Date.now() - new Date(lastActive).getTime() < 5 * 60 * 1000;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Header */}
          <div className="scroll-panel rounded-xl ornate-border p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center">
                  <Crown size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold text-primary text-glow-gold uppercase tracking-widest">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-muted-foreground">SWS Skeptrons — Chapter Management</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all text-xs font-heading font-bold uppercase tracking-wider text-muted-foreground"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Members", value: stats.total, icon: Users, color: "text-primary" },
              { label: "Online Now", value: stats.online, icon: UserCheck, color: "text-green-400" },
              { label: "Admin Accounts", value: members.filter(m => m.role === "admin").length, icon: Crown, color: "text-yellow-400" },
              { label: "Incomplete Profiles", value: members.filter(m => !m.isProfileComplete).length, icon: AlertTriangle, color: "text-orange-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="scroll-panel rounded-xl ornate-border p-4 text-center">
                <Icon size={20} className={`${color} mx-auto mb-2`} />
                <p className={`font-heading text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Messages */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400 text-center">
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Member List */}
          <div className="scroll-panel rounded-xl ornate-border overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-primary/20 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Database size={16} className="text-primary" />
                <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-primary">
                  Registered Members ({filtered.length})
                </h2>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search members..."
                    className="w-full sm:w-56 pl-8 pr-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <button
                  onClick={fetchMembers}
                  className="p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-all"
                  title="Refresh"
                >
                  <RefreshCw size={14} className="text-primary" />
                </button>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-muted-foreground mt-3">Loading members...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Users size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No members found</p>
              </div>
            ) : (
              <div className="divide-y divide-primary/10">
                {filtered.map((member, idx) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 overflow-hidden flex items-center justify-center">
                        {member.profileImage
                          ? <img src={member.profileImage} className="w-full h-full object-cover" />
                          : <span className="text-primary font-bold text-sm">{member.username[0].toUpperCase()}</span>
                        }
                      </div>
                      {isOnline(member.lastActive) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-heading text-sm font-bold text-foreground">@{member.username}</p>
                        {member.role === "admin" && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            Admin
                          </span>
                        )}
                        {!member.isProfileComplete && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Incomplete
                          </span>
                        )}
                        {isOnline(member.lastActive) && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-heading font-bold uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                            Online
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{member.email}</p>
                      <p className="text-[10px] font-mono text-primary/70">
                        ID: {member.accountId} · {member.chapter || "SWS Skeptrons"}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:block text-right flex-shrink-0">
                      <p className="text-[10px] text-muted-foreground">Joined</p>
                      <p className="text-[11px] text-foreground font-mono">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Edit */}
                      <button
                        onClick={() => handleEditOpen(member)}
                        className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 hover:border-primary/50 transition-all"
                        title="Edit account"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setConfirmDelete(member)}
                        disabled={member.role === "admin"}
                        className="w-8 h-8 rounded-lg border border-red-500/30 bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title={member.role === "admin" ? "Cannot delete admin" : "Delete account"}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
      <Footer />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
            <motion.div
              className="relative z-10 w-full max-w-sm scroll-panel rounded-xl ornate-border overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-foreground">Confirm Deletion</h3>
                    <p className="text-[11px] text-muted-foreground">This action cannot be undone</p>
                  </div>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
                  <p className="text-sm text-foreground">Remove <span className="text-red-400 font-bold">@{confirmDelete.username}</span> from MongoDB?</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{confirmDelete.email} · ID: {confirmDelete.accountId}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-xs font-heading font-bold uppercase border border-border rounded-lg hover:bg-primary/10 transition-all text-muted-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    disabled={deletingId === confirmDelete._id}
                    className="flex-1 py-2.5 text-xs font-heading font-bold uppercase bg-red-500/90 text-white rounded-lg border border-red-500/50 hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deletingId === confirmDelete._id
                      ? <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                      : <><Trash2 size={13} /> Delete</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Member Modal */}
      <AnimatePresence>
        {editingMember && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingMember(null)} />
            <motion.div
              className="relative z-10 w-full max-w-md scroll-panel rounded-xl ornate-border overflow-hidden"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 border-b border-primary/20 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <Shield size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-bold text-foreground">Edit Member Account</h3>
                      <p className="text-[10px] text-muted-foreground">ID: {editingMember.accountId}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingMember(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                </div>

                {editError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 text-center">
                    {editError}
                  </div>
                )}

                <form onSubmit={handleEditSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Username</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={e => setEditUsername(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={e => setEditEmail(e.target.value)}
                        required
                        className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">First Name</label>
                      <input
                        type="text"
                        value={editFirstName}
                        onChange={e => setEditFirstName(e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Last Name</label>
                      <input
                        type="text"
                        value={editLastName}
                        onChange={e => setEditLastName(e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Chapter</label>
                    <input
                      type="text"
                      value={editChapter}
                      onChange={e => setEditChapter(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Role</label>
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 text-xs bg-[hsl(20,15%,8%)] border border-border rounded-lg focus:outline-none focus:border-primary/50 text-foreground"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      <input
                        type="checkbox"
                        id="isProfileComplete"
                        checked={editIsProfileComplete}
                        onChange={e => setEditIsProfileComplete(e.target.checked)}
                        className="w-4 h-4 rounded border-border bg-[hsl(20,15%,8%)] text-primary focus:ring-primary/50"
                      />
                      <label htmlFor="isProfileComplete" className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground cursor-pointer select-none">Profile Complete</label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-primary/10">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="flex-1 py-2 text-xs font-heading font-bold uppercase border border-border rounded-lg hover:bg-primary/10 transition-all text-muted-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 py-2 text-xs font-heading font-bold uppercase bg-primary text-primary-foreground rounded-lg border border-primary/50 hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {editLoading
                        ? <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                        : "Save Changes"
                      }
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
