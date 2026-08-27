import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Trash2,
  Users,
  Shield,
  UserCheck,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const ROLES = [
  "Student",
  "Mentor",
  "Admin",
];

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

function RoleIcon({ role }) {
  if (role === "Admin") {
    return <Shield size={16} />;
  }

  if (role === "Mentor") {
    return <UserCheck size={16} />;
  }

  return <GraduationCap size={16} />;
}

export default function UserManagement() {
  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState("All");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    updatingId,
    setUpdatingId,
  ] = useState(null);

  const [
    deletingId,
    setDeletingId,
  ] = useState(null);

  const [
    toast,
    setToast,
  ] = useState(null);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const response =
        await API.get(
          "/users"
        );

      setUsers(
        getUsers(response)
      );
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesRole =
            roleFilter === "All" ||
            user.role ===
              roleFilter;

          const matchesSearch =
            !query ||
            user.fullname
              ?.toLowerCase()
              .includes(query) ||
            user.name
              ?.toLowerCase()
              .includes(query) ||
            user.email
              ?.toLowerCase()
              .includes(query) ||
            user.universityId
              ?.toLowerCase()
              .includes(query);

          return (
            matchesRole &&
            matchesSearch
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
    ]);

  const changeRole = async (
    userId,
    role
  ) => {
    setUpdatingId(userId);

    try {
      const response =
        await API.patch(
          `/users/${userId}/role`,
          {
            role,
          }
        );

      setUsers(
        (current) =>
          current.map(
            (user) =>
              user._id ===
              userId
                ? {
                    ...user,
                    role,
                  }
                : user
          )
      );

      setToast({
        message:
          response.data?.message ||
          "User role updated successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (
    userId
  ) => {
    setDeletingId(userId);

    try {
      const response =
        await API.delete(
          `/users/${userId}`
        );

      setUsers(
        (current) =>
          current.filter(
            (user) =>
              user._id !==
              userId
          )
      );

      setToast({
        message:
          response.data?.message ||
          "User deleted successfully.",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          errorMessage(error),
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const countRole = (
    role
  ) =>
    users.filter(
      (user) =>
        user.role === role
    ).length;

  return (
    <>
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() =>
          setToast(null)
        }
      />

      <div className="space-y-6">

        <div>
          <h2 className="text-2xl font-black text-[#062a5c]">
            User Management
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Search users, manage roles and remove accounts.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-3
          "
        >
          {[
            [
              "All Users",
              users.length,
              Users,
            ],
            [
              "Students",
              countRole(
                "Student"
              ),
              GraduationCap,
            ],
            [
              "Mentors",
              countRole(
                "Mentor"
              ),
              UserCheck,
            ],
            [
              "Admins",
              countRole(
                "Admin"
              ),
              Shield,
            ],
          ].map(
            ([
              title,
              value,
              Icon,
            ]) => (
              <div
                key={title}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                "
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

                  <Icon
                    size={20}
                    className="text-[#08ad81]"
                  />
                </div>
              </div>
            )
          )}
        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            p-4
            flex
            flex-col
            md:flex-row
            gap-3
          "
        >
          <div className="relative flex-1">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-3
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search by name, email or university ID..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                border
                border-slate-200
                rounded-xl
                outline-none
                focus:border-[#08c98b]
                text-sm
              "
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
            className="
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              bg-white
              text-sm
            "
          >
            <option value="All">
              All Roles
            </option>

            {ROLES.map(
              (role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={loadUsers}
            className="
              px-4
              py-2.5
              rounded-xl
              border
              border-slate-200
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-bold
            "
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
          "
        >
          {loading ? (
            <div className="p-10 text-center text-slate-400">
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
                    <th className="text-left p-4">
                      User
                    </th>

                    <th className="text-left p-4">
                      Role
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Batch
                    </th>

                    <th className="text-right p-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredUsers.map(
                    (user) => (
                      <tr
                        key={
                          user._id
                        }
                        className="hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                w-10
                                h-10
                                rounded-full
                                bg-[#e8faf5]
                                text-[#08ad81]
                                grid
                                place-items-center
                                font-black
                              "
                            >
                              {(
                                user.fullname ||
                                user.name ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-bold text-[#062a5c]">
                                {user.fullname ||
                                  user.name ||
                                  "Unnamed"}
                              </p>

                              <p className="text-xs text-slate-400">
                                {user.email}
                              </p>

                              {user.universityId && (
                                <p className="text-[10px] text-slate-400">
                                  ID:{" "}
                                  {
                                    user.universityId
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#08ad81]">
                              <RoleIcon
                                role={
                                  user.role
                                }
                              />
                            </span>

                            <select
                              value={
                                user.role
                              }
                              disabled={
                                updatingId ===
                                user._id
                              }
                              onChange={(e) =>
                                changeRole(
                                  user._id,
                                  e.target.value
                                )
                              }
                              className="
                                border
                                border-slate-200
                                rounded-lg
                                px-2
                                py-1.5
                                text-xs
                                font-bold
                                bg-white
                              "
                            >
                              {ROLES.map(
                                (
                                  role
                                ) => (
                                  <option
                                    key={
                                      role
                                    }
                                    value={
                                      role
                                    }
                                  >
                                    {
                                      role
                                    }
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`
                              px-2.5
                              py-1
                              rounded-full
                              text-[10px]
                              font-black
                              ${
                                user.status ===
                                "approved"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }
                            `}
                          >
                            {
                              user.status ||
                              "pending"
                            }
                          </span>
                        </td>

                        <td className="p-4">
                          <p className="text-xs font-bold text-slate-600">
                            {user.assignedBatch?.name ||
                              user.appliedBatch?.name ||
                              "Unassigned"}
                          </p>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            type="button"
                            disabled={
                              deletingId ===
                              user._id
                            }
                            onClick={() =>
                              deleteUser(
                                user._id
                              )
                            }
                            className="
                              p-2
                              rounded-lg
                              text-slate-400
                              hover:text-red-600
                              hover:bg-red-50
                              disabled:opacity-40
                            "
                            title="Delete user"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}