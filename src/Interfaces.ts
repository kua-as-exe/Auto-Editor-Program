export interface Template {
    name: string,
    plugins?: string[],
    html? : string,
    css?: string,
    javascript?: string,
    processed?: true,
    params?: Object | any,
    fileName?: string,
    customPath?: string,
    customName?: string,
    customMainTemplate?: string
}

export interface Plugin {
    name: string,
    tag: string,
    src?: string
}

