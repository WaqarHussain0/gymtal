import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useMemo, } from "react";


interface IMemberTable {
    members: any[]
}
const MemberTable: React.FC<IMemberTable> = ({ members }) => {


    const columns = useMemo(() => [{
        label: "Name",
    },
    {
        label: "Email",
    },

    {
        label: "Phone",
    },

    {
        label: "Membership Plan",
    },

    {
        label: "Actions",
    }], [])
    return (

        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>

                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns
                                .map((column) => (
                                    <TableHead key={column.label}>{column.label}</TableHead>
                                ))}
                        </TableRow>
                    </TableHeader>


                    <TableBody>
                        {members.length > 0 ? (
                            members.map((member ) => (
                                <TableRow key={member   ._id}>
                                    <TableCell>{member?.name}</TableCell>
                                    <TableCell>{member?.email}</TableCell>
                                    <TableCell>{member?.phone}</TableCell>
                                    <TableCell>{member?.plan?.name}</TableCell>
                                    
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    );
};

export default MemberTable;