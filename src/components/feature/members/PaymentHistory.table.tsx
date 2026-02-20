import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface IPaymentHistoryTableProps {
    paymentTransactions: any[];
    membershipPeriods: any[];
}


const PaymentHistoryTable: React.FC<IPaymentHistoryTableProps> = ({ paymentTransactions, membershipPeriods }) => {
    return (
        <Card className="w-full">

            <CardHeader>

                <CardTitle>Payment History</CardTitle>


            </CardHeader>
            <CardContent>
                {paymentTransactions && paymentTransactions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Paid Via</TableHead>
                                <TableHead>Membership Period</TableHead>
                                <TableHead>Received By</TableHead>
                                <TableHead>Payment Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paymentTransactions.map((txn: any) => (
                                <TableRow key={txn._id}>
                                    <TableCell>{txn.amount}</TableCell>
                                    <TableCell>{txn.paymentMethod}</TableCell>
                                    <TableCell>
                                        {membershipPeriods.find((p: any) => p._id === txn.membershipPeriodId)
                                            ? `${new Date(
                                                membershipPeriods.find((p: any) => p._id === txn.membershipPeriodId)
                                                    .startDate
                                            ).toLocaleDateString()} - ${new Date(
                                                membershipPeriods.find((p: any) => p._id === txn.membershipPeriodId)
                                                    .endDate
                                            ).toLocaleDateString()}`
                                            : "-"}
                                    </TableCell>
                                    <TableCell>{txn.receivedBy.name}</TableCell>
                                    <TableCell>{new Date(txn.paymentDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>No payment transactions found</p>
                )}
            </CardContent>
        </Card>
    )
}

export default PaymentHistoryTable;