import { createContext } from "react"
import type { ReactNode } from "react"

export const BookmarkContext = createContext<any>({})

export function BookmarkProvider({children}:{children:ReactNode}){
    async function uploadFiles(pdfFile:File, imageFile:File) {
        const formData = new FormData()
        formData.append('pdf', pdfFile)
        formData.append('watermark', imageFile)

        const response = await fetch('http://127.0.0.1:8000/watermark/pdf', {
            method: 'POST',
            body: formData
        })
        if (!response.ok){
            throw new Error('Upload Failed')
        }

        return await response.blob()
    }

    return(
        <BookmarkContext.Provider value={{ uploadFiles }}>
            {children}
        </BookmarkContext.Provider>
    )
}
