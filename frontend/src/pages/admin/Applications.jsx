import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Users,
  Shield,
  UserCheck,
  GraduationCap,
  RefreshCw,
  Eye,
  X,
  FolderGit2,
  Code2,
  ExternalLink,
  Mail,
  Building,
  Phone,
  Calendar,
  Award,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const ROLES = ["Student", "Mentor", "Admin"];

function getUsers(response) {
  const data = response?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.users)) return data.users;
  return [];
}

function errorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Request failed."
  );
}

function getProfileUrl(handleOrUrl, baseUrl) {
  if (!handleOrUrl) return null;
  if (handleOrUrl.startsWith("http://") || handleOrUrl.startsWith("https://")) {
    return handleOrUrl;
  }
  return `${baseUrl}${handleOrUrl}`;
}

function RoleIcon({ role }) {
  if (role === "Admin") return <Shield size={16} />;
  if (role === "Mentor") return <UserCheck size={16} />;
  return <GraduationCap size={16} />;
}

// Helper to extract nested properties from User or attached Application object
function getValue(user, ...keys) {
  if (!user) return null;
  for (const key of keys) {
    const parts = key.split(".");
    let val = user;
    for (const part of parts) {
      val = val?.[part];
    }
    if (val !== undefined && val !== null && val !== "") return val;
  }
  return null;
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get("/users");
      setUsers(getUsers(response));
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesSearch =
        !query ||
        user.fullname?.toLowerCase().includes(query) ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.universityId?.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const changeRole = async (userId, role) => {
    setUpdatingId(userId);
    try {
      const response = await API.patch(`/users/${userId}/role`, { role });

      setUsers((current) =>
        current.map((user) =>
          user._id === userId ? { ...user, role } : user
        )
      );

      setToast({
        message: response.data?.message || "User role updated successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const userId = userToDelete._id;
    setDeletingId(userId);

    try {
      const response = await API.delete(`/users/${userId}`);

      setUsers((current) => current.filter((user) => user._id !== userId));

      setToast({
        message: response.data?.message || "User deleted successfully.",
        type: "success",
      });
      setUserToDelete(null);
    } catch (error) {
      setToast({
        message: errorMessage(error),
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const countRole = (role) => users.filter((user) => user.role === role).length;

  return (
    <>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Confirmation Modal for Deletion */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-[#062a5c]">
                Confirm Account Deletion
              </h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Are you sure you want to delete the account for{" "}
              <span className="font-bold text-slate-800">
                {userToDelete.fullname || userToDelete.name || userToDelete.email}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deletingId === userToDelete._id}
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingId === userToDelete._id}
                onClick={confirmDeleteUser}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {deletingId === userToDelete._id && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black text-xl">
                  {(
                    getValue(selectedUser, "fullname", "name") || "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#062a5c]">
                    {getValue(selectedUser, "fullname", "name") || "Unnamed User"}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Mail size={12} /> {selectedUser.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Account Overview */}
              <div>
                <h4 className="text-xs uppercase font-black text-slate-400 mb-3 tracking-wider">
                  Account Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Role
                    </p>
                    <p className="text-sm font-bold text-[#062a5c] flex items-center gap-1.5 mt-1">
                      <RoleIcon role={selectedUser.role} />
                      {selectedUser.role}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Status
                    </p>
                    <span
                      className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        getValue(selectedUser, "status", "applicationStatus") === "approved"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {getValue(selectedUser, "status", "applicationStatus") || "pending"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Batch
                    </p>
                    <p className="text-sm font-bold text-[#062a5c] mt-1">
                      {getValue(selectedUser, "assignedBatch.name", "appliedBatch.name", "batch.name") || "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coding & Platform Profiles */}
              <div>
                <h4 className="text-xs uppercase font-black text-slate-400 mb-3 tracking-wider">
                  Coding Profiles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* LeetCode */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <Code2 size={15} /> LeetCode
                      </span>
                      {getProfileUrl(
                        getValue(selectedUser, "leetcodeHandle", "leetcodeAccount", "leetcodeUsername", "leetcode", "profile.leetcodeHandle", "application.leetcodeHandle"),
                        "https://leetcode.com/u/"
                      ) && (
                        <a
                          href={getProfileUrl(
                            getValue(selectedUser, "leetcodeHandle", "leetcodeAccount", "leetcodeUsername", "leetcode", "profile.leetcodeHandle", "application.leetcodeHandle"),
                            "https://leetcode.com/u/"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-[#08ad81]"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#062a5c] mt-2 truncate">
                      {getValue(selectedUser, "leetcodeHandle", "leetcodeAccount", "leetcodeUsername", "leetcode", "profile.leetcodeHandle", "application.leetcodeHandle") || "Not provided"}
                    </p>
                  </div>

                  {/* Codeforces */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                        <Award size={15} /> Codeforces
                      </span>
                      {getProfileUrl(
                        getValue(selectedUser, "codeforcesHandle", "codeforcesAccount", "codeforcesUsername", "codeforces", "profile.codeforcesHandle", "application.codeforcesHandle"),
                        "https://codeforces.com/profile/"
                      ) && (
                        <a
                          href={getProfileUrl(
                            getValue(selectedUser, "codeforcesHandle", "codeforcesAccount", "codeforcesUsername", "codeforces", "profile.codeforcesHandle", "application.codeforcesHandle"),
                            "https://codeforces.com/profile/"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-[#08ad81]"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#062a5c] mt-2 truncate">
                      {getValue(selectedUser, "codeforcesHandle", "codeforcesAccount", "codeforcesUsername", "codeforces", "profile.codeforcesHandle", "application.codeforcesHandle") || "Not provided"}
                    </p>
                  </div>

                  {/* GitHub */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <FolderGit2 size={15} /> GitHub
                      </span>
                      {getProfileUrl(
                        getValue(selectedUser, "githubUsername", "githubAccount", "github", "profile.githubUsername", "application.githubUsername"),
                        "https://github.com/"
                      ) && (
                        <a
                          href={getProfileUrl(
                            getValue(selectedUser, "githubUsername", "githubAccount", "github", "profile.githubUsername", "application.githubUsername"),
                            "https://github.com/"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-[#08ad81]"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#062a5c] mt-2 truncate">
                      {getValue(selectedUser, "githubUsername", "githubAccount", "github", "profile.githubUsername", "application.githubUsername") || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Details */}
              <div>
                <h4 className="text-xs uppercase font-black text-slate-400 mb-3 tracking-wider">
                  Academic & Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-slate-400 font-medium">University ID</p>
                    <p className="font-bold text-[#062a5c]">
                      {getValue(selectedUser, "universityId", "profile.universityId", "application.universityId") || "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-slate-400 font-medium flex items-center gap-1">
                      <Building size={13} /> Department / Major
                    </p>
                    <p className="font-bold text-[#062a5c]">
                      {getValue(selectedUser, "department", "major", "profile.department", "application.department") || "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-slate-400 font-medium flex items-center gap-1">
                      <Phone size={13} /> Phone Number
                    </p>
                    <p className="font-bold text-[#062a5c]">
                      {getValue(selectedUser, "phoneNumber", "phone", "profile.phone", "application.phone") || "N/A"}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <p className="text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={13} /> Joined Date
                    </p>
                    <p className="font-bold text-[#062a5c]">
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-right">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 rounded-xl bg-[#062a5c] text-white text-xs font-bold hover:bg-[#082247] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500 mt-1">
            Search users, manage roles and remove accounts.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ["All Users", users.length, Users],
            ["Students", countRole("Student"), GraduationCap],
            ["Mentors", countRole("Mentor"), UserCheck],
            ["Admins", countRole("Admin"), Shield],
          ].map(([title, value, Icon]) => (
            <div
              key={title}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400">
                    {title}
                  </p>
                  <p className="text-2xl font-black text-[#062a5c] mt-1">
                    {value}
                  </p>
                </div>
                <Icon size={20} className="text-[#08ad81]" />
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or university ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-[#08c98b] text-sm"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm"
          >
            <option value="All">All Roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-[#08ad81]" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Batch</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#e8faf5] text-[#08ad81] grid place-items-center font-black">
                            {(
                              getValue(user, "fullname", "name") || "U"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-[#062a5c]">
                              {getValue(user, "fullname", "name") || "Unnamed"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {user.email}
                            </p>
                            {getValue(user, "universityId", "profile.universityId") && (
                              <p className="text-[10px] text-slate-400">
                                ID: {getValue(user, "universityId", "profile.universityId")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[#08ad81]">
                            {updatingId === user._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <RoleIcon role={user.role} />
                            )}
                          </span>

                          <select
                            value={user.role}
                            disabled={updatingId === user._id}
                            onChange={(e) =>
                              changeRole(user._id, e.target.value)
                            }
                            className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold bg-white disabled:opacity-50"
                          >
                            {ROLES.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            getValue(user, "status", "applicationStatus") === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {getValue(user, "status", "applicationStatus") || "pending"}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="text-xs font-bold text-slate-600">
                          {getValue(user, "assignedBatch.name", "appliedBatch.name", "batch.name") || "Unassigned"}
                        </p>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedUser(user)}
                            className="p-2 rounded-lg text-slate-400 hover:text-[#08ad81] hover:bg-[#e8faf5] transition-colors"
                            title="View full details"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === user._id}
                            onClick={() => setUserToDelete(user)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}