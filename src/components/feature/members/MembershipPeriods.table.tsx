"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useState } from "react";
import RenewMembershipDialog from "./RenewMembership.dialog";
import TextElement from "@/components/common/TextElement";

interface IMembershipPeriodTableProps {
  userId: string;
  membershipPeriods: any[];
}

const MembershipPeriodTable: React.FC<IMembershipPeriodTableProps> = ({
  membershipPeriods,
  userId,
}) => {
  const [showRenewMembershipDialog, setShowRenewMembershipDialog] =
    useState<boolean>(false);
  const handleCloseDialog = useCallback(
    () => setShowRenewMembershipDialog((prev) => !prev),
    [],
  );
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Membership Periods
          <Button size="sm" onClick={handleCloseDialog}>
            Renew Membership
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {membershipPeriods && membershipPeriods.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membershipPeriods.map((period: any) => (
                <TableRow key={period._id?.toString()}>
                  <TableCell>
                    {new Date(period.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(period.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{period?.createdBy?.name}</TableCell>
                  <TableCell>
                    {new Date(period.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <TextElement as="p" className="text-center">
            No membership periods found
          </TextElement>
        )}
      </CardContent>

      <RenewMembershipDialog
        userId={userId}
        open={showRenewMembershipDialog}
        onClose={handleCloseDialog}
      />
    </Card>
  );
};

export default MembershipPeriodTable;
