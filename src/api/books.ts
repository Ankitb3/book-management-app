import axios from "axios";

const URL = import.meta.env.VITE_LOCALHOST_URL;

export const getBooks=async ()=>{
    const res = await axios.get(URL);
    return res.data

}


interface Book {
    id?: string;
    title: string;
    author: string;
    [key: string]: any;
}

export const addBook = async (book: Book): Promise<any> => {
    return axios.post(URL, book);
}



export const updateBook = async (
    id: String,
    book: Book
) => {
    return axios.put(`${URL}/${id}`, book);
}


export interface DeleteBookParams {
    id: string;
}

export const deleteBook = async (id: String) => {
    return axios.delete(`${URL}/${id}`);
}