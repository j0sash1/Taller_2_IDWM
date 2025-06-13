
export interface Product {
    id?:          number;
    name:         string;
    description?: string;
    price:        number;
    category?:    string;
    urls:         string[];
    stock?:       number;
    brand?:       string;
    publicId?:    null;
    isActive?:    boolean;
    condition?:   number;
}