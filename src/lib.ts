type Method = "get" | "post" | "put" | "patch" | "delete";
type RequestFn = (
    req: Request,
    res: typeof Response
) => Response | Promise<Response>;

export class Bunny {
    routes: Record<Method, Record<string, RequestFn>> = {
        get: {},
        post: {},
        put: {},
        patch: {},
        delete: {},
    };

    port = process.env.PORT || 8080;
    methods: Method[] = ["get", "post", "put", "patch", "delete"];

    constructor() {}

    get(path: string, fn: RequestFn) {
        this.routes["get"][path] = fn;
    }
    post(path: string, fn: RequestFn) {
        this.routes["post"][path] = fn;
    }
    put(path: string, fn: RequestFn) {
        this.routes["put"][path] = fn;
    }
    patch(path: string, fn: RequestFn) {
        this.routes["patch"][path] = fn;
    }
    delete(path: string, fn: RequestFn) {
        this.routes["delete"][path] = fn;
    }

    listen(port: string | number, fn: () => void) {
        this.port = port;
        const parsing = this.parseRequest;
        Bun.serve({
            fetch(req) {
                return parsing(req);
            },
            port,
        });
        fn();
    }

    parseRequest = (req: Request): Response | Promise<Response> => {
        const path = this.parsePath(req.url);
        const method = req.method.toLowerCase() as Method;

        try {
            return this.routes[method][path](req, Response);
        } catch {
            return Response.json({
                error: true,
                message: `path ${path} not found`,
                method,
            });
        }
    };

    parsePath(url: string) {
        const pathRegex = /^https?:\/\/[^/]+(\/[^?#]*)/;
        const matches = url.match(pathRegex);
        const path = matches?.at(1) || "";
        return path;
    }
}

export const bunny = () => new Bunny();
