import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

export const fetchLastfmData = async (method: string, params: { mbid:string; [key: string]: any }) => {
    try {

        const queryParams = new URLSearchParams({
            method,
            api_key: API_KEY || '',
            format: 'json',
            ...params,
        });

        const response = await axios.get(`${BASE_URL}?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response && response.data) {
            return response.data;
        } else {
            console.error('API 응답 오류: response 또는 response.data 없음');
            return null; // 또는 적절한 오류 처리
        }
    } catch (error: any) {
        console.error('Last.fm API 요청 오류:', error);
        if (error.response && error.response.data) {
            console.log('서버 응답 데이터:', error.response.data);
        }
        throw error;
    }
};