export interface ResponseAPI {
    success?: boolean;
    message?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?:    any;
    errors?:  null;
}