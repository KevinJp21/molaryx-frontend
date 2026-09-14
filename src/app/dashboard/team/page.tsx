import type { Metadata } from "next";
import { TeamTemplate } from "@/features/dashboard";
import { buildAppPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAppPageMetadata("Equipo");

export const TeamPage = () => {
    return (
        <TeamTemplate />
    )
}

export default TeamPage;