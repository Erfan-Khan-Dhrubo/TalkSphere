import React, { useEffect, useState } from "react";
import backendApi from "../../utilities/axios";
import toast from "react-hot-toast";
import {
  Users as UsersIcon,
  Mail,
  Shield,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Ban,
} from "lucide-react";

interface UserActivity {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePic?: string;
  isBanned: boolean;
  createdAt: string;
  totalPosts: number;
  totalUpvotes: number;
  totalDownvotes: number;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await backendApi.get("/users");
      setUsers(res.data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <UsersIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">All Users</h1>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-center">Posts</th>
                <th className="px-4 py-3 text-center">Upvotes</th>
                <th className="px-4 py-3 text-center">Downvotes</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined:{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </div>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold">{user.totalPosts}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-600">
                        {user.totalUpvotes}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-600" />
                      <span className="font-semibold text-red-600">
                        {user.totalDownvotes}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {user.isBanned ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center justify-center gap-1">
                        <Ban className="w-3 h-3" />
                        Banned
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.reduce((sum, user) => sum + user.totalPosts, 0)}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Banned Users</p>
              <p className="text-2xl font-bold text-red-600">
                {users.filter((user) => user.isBanned).length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
