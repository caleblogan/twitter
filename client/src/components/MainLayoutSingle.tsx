import { twMerge } from "tailwind-merge"

export default function MainLayoutSingle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
    return <main className={twMerge("max-w-[598px] flex flex-col m-auto", className)}>
        {children}
    </main >
}
