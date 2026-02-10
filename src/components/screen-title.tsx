export function ScreenTitle({
    title,
    subtitle,
}: {
    title: string;
    subtitle?: string;
}) {
    return (
        <header className="mb-6">
            {subtitle ? <p className="text-sm font-medium text-muted-foreground">{subtitle}</p> : null}
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        </header>
    );
}
