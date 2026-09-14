import type { Metadata } from "next";
import { ProceduresTemplate } from "@/features/dashboard/modules/procedures";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Procedimientos");

export const ProceduresPage = () => {
    return (<ProceduresTemplate />)
}

export default ProceduresPage;
