export interface Template {
    name: string,
    plugins?: string[],
    html? : string,
    css?: string,
    javascript?: string,
    processed?: true,
    params?: Object
}

export interface Plugin {
    name: string,
    tag: string
}

