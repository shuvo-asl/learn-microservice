export interface ServiceConfig {
    path: string;
    url: string;
    pathRewrite?: { [key: string]: string };
    name: string;
    timeout?: number;
}

export interface ProxyErrorResponse {
    status: number;
    message: string;
    timestamp: string;
}