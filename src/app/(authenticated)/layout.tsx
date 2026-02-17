import Navbar from "@/common-components/Navbar";
import Row from "@/common-components/Row";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Row className="w-full h-screen">
            <Navbar className="w-64 h-full" />

            <Row className="flex-col items-start flex-1 bg-slate-100 h-full p-4 overflow-y-auto">

                {children}
            </Row>
        </Row>
    );
}

export default Layout;