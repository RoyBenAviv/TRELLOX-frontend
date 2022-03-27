import axios from 'axios';
import { httpService } from './http.service';

axios.defaults.withCredentials = true

export const boardService = {
    query,
    getBoardById,
    removeBoard,
    updateBoard
};

async function query() {
    return await httpService.get('board')
}

async function getBoardById(boardId) {
    return await httpService.get(`board/${boardId}`)
}

async function removeBoard(boardId) {
    return await httpService.delete(`board/${boardId}`)
}

async function updateBoard(board) {
    if (board._id) {
        return await httpService.put(`board/${board._id}`, board)
    } 
    else {
        return await httpService.post('board', board)
    }
}