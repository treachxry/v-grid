export function getPropertyName<T>(selector: (obj: T) => any): string {
    const handler: ProxyHandler<any> = {
        get: (_, prop) => prop
    };

    const proxy = new Proxy({}, handler);

    return selector(proxy) as string;
}