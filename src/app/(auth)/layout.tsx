import Row from "@/components/common/Row";
import TextElement from "@/components/common/TextElement";
import { Dumbbell } from "lucide-react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <Row className="w-full bg-blue-900 h-screen flex-col gap-6 justify-center items-center px-3 md:px-0">
            <div className="w-full flex items-center justify-center flex-col">
                <div className="size-14 rounded-lg bg-white/10 flex items-center justify-center">
                    <Dumbbell className="size-8 text-primary-foreground" />
                </div>
                <TextElement as="h1" className="font-heading text-4xl font-bold text-primary-foreground">
                    Gymtal
                </TextElement>

                <TextElement as="p" className="text-primary-foreground/60">
                    Gym Management
                </TextElement>
            </div>



            <div className="w-full flex items-center justify-center">
                {children}
            </div>
        </Row>
    )
}