export function toSafePath(paths: string[]) {

    if (!paths || paths.length === 0) return;

    const items = paths.map(i => {

        if (!i) return '';

        i = cleanPath(i)

        return i
    })
    
    const path = items.filter(Boolean).join('')

    return cleanPath(path)
}

export function cleanPath(path: string) {

    if(!path) return path

    path = path.trim().replace(/\\/g, '/').replace(/\/\//g, '/')

    if (path === '/') return path

    if (!path.startsWith('/')) {

        path = '/' + path
    }

    if (path.endsWith('/')) {

        path = path.substring(0, path.length - 1)
    }

    return path
}