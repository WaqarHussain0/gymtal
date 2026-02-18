import Row from "@/components/common/Row";
import TextElement from "@/components/common/TextElement";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <Row className="w-full bg-[#C9FFDE] h-screen flex-col gap-6 justify-center items-center">
            <div className="w-full flex items-center justify-center flex-col">
                <TextElement as="h1">
                    FitLedger
                </TextElement>

                <TextElement as="p">
                    Gym Management
                </TextElement>
            </div>



            <div className="w-full flex items-center justify-center">
                {children}
            </div>
        </Row>
    )
}