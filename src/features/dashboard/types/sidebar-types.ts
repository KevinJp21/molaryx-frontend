export type TUserPermission = {
    module: string;
    codes: string[];
}

type SidebarPermissionRule = {
    module?: TUserPermission['module'];
};

type SidebarItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    permission?: SidebarPermissionRule;
};

export type SidebarSection = {
    title: string;
    items: SidebarItem[];
};
