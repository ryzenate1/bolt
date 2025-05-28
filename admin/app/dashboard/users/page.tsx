"use client";

import { useEffect, useState, useCallback } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Eye, Loader2, Search, Edit2, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link'; // For future detail view

const SERVER_API_URL = 'http://localhost:5001/api';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string; // "customer" or "admin"
  createdAt: string;
  updatedAt: string;
  loyaltyPoints?: number;
  loyaltyTier?: string;
}

const userRoles = ["customer", "admin"];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // States for managing edit user role modal (simplified example)
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${SERVER_API_URL}/users`); // Assuming this endpoint exists
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Error fetching users: ${res.statusText}` }));
        throw new Error(errData.message);
      }
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Fetching Users", description: err.message, variant: "destructive" });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditRoleClick = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (!editingUser || !selectedRole || selectedRole === editingUser.role) {
      setIsRoleModalOpen(false);
      toast({title: "No change", description: "User role is already set to this value."}) 
      return;
    }
    setIsUpdatingRole(true);
    try {
      const res = await fetch(`${SERVER_API_URL}/users/${editingUser.id}/role`, { // Assuming this endpoint
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: `Failed to update role: ${res.statusText}`}));
        throw new Error(errData.message);
      }
      const updatedUser = await res.json();
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast({ title: "User Role Updated", description: `${editingUser.name}'s role changed to ${updatedUser.role}.` });
      setIsRoleModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      toast({ title: "Role Update Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const filteredUsers = users
    .filter(user => 
      roleFilter === "all" || !roleFilter ? true : user.role === roleFilter
    )
    .filter(user => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phoneNumber.toLowerCase().includes(searchLower)
      );
    });
  
  if (loading && users.length === 0 && !error) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="User Management"
        description="View and manage platform users."
        // Optional: Add button for creating users if needed
        // buttonLabel="Add New User" 
        // onClick={() => { /* Open create user modal/form */ }}
      />

      <Card>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b mb-4">
            <Input
              type="search"
              placeholder="Search by Name, Email, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              icon={<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger><SelectValue placeholder="Filter by Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {userRoles.map(role => (
                  <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
             <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>Error loading users: {error}</span>
            </div>
          )}

          {filteredUsers.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 py-8">No users found matching your criteria.</p>
          )}

          {filteredUsers.length > 0 && (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email / Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Loyalty Tier</TableHead>
                    <TableHead className="text-right">Loyalty Points</TableHead>
                    <TableHead>Joined On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <div>{user.email}</div>
                        <div className="text-xs text-muted-foreground">{user.phoneNumber}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{user.loyaltyTier || 'N/A'}</TableCell>
                      <TableCell className="text-right">{user.loyaltyPoints || 0}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditRoleClick(user)} className="mr-2">
                            <Edit2 size={14} className="mr-1"/> Edit Role
                        </Button>
                        {/* <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/users/${user.id}`}> 
                            <Eye size={16} className="mr-1" /> View Details
                          </Link>
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      {/* Modal for Editing User Role (Simplified Example) */} 
      {isRoleModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Edit Role for {editingUser.name}</h3>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  {userRoles.map(role => (
                    <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={() => { setIsRoleModalOpen(false); setEditingUser(null);}} disabled={isUpdatingRole}>
                  Cancel
                </Button>
                <Button onClick={handleRoleUpdate} disabled={isUpdatingRole || selectedRole === editingUser.role}>
                  {isUpdatingRole ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Role"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 