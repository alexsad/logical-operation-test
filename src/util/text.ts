const camel2SeparateCase = (text: string) => {
    return text
        .substring(text.lastIndexOf('/')+1)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

export {camel2SeparateCase};