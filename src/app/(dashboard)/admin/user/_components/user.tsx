"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";

export default function UserManagement() {
  const supabase = createClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*", {
          count: "exact",
        })
        .order("created_at");

      if (error) {
        toast.error("Get User Data Failed", {
          description: error.message,
        });
      }

      return data;
    },
  });

  const filteredData = useMemo(() => {
    // mapping untuk baris
    return (users || []).map((user, index) => {
      // mapping untuk column
      return [
        index + 1,
        user.id,
        user.name,
        user.role,
        "", // action
      ];
    });
  }, [users]);

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full flex-col justify-between gap-2 lg:flex-row">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Input placeholder="Search by Name" />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Create</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Table */}
      <DataTable
        header={HEADER_TABLE_USER}
        isLoading={isLoading}
        data={filteredData}
      />
    </div>
  );
}
