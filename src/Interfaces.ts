export interface Template {
    name: string,
    plugins?: string[],
    html? : string,
    css?: string,
    javascript?: string,
    processed?: true,
    params?: Object,
    fileName?: string,
    customPath?: string,
    customName?: string,
}

export interface Plugin {
    name: string,
    tag: string,
    src?: string
}

