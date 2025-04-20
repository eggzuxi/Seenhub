import axios from 'axios';

const REST_API_KEY: string = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
const BASE_URL = 'https://dapi.kakao.com/v3/search/book';

export const fetchKakaoData = async (endpoint: string, params: Record<string, any> = {}) => {
    try {
        const queryParams = new URLSearchParams({
            ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
        });

        const response = await axios.get(`${BASE_URL}/${endpoint}?${queryParams}`, {
            headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`,
            },
        });

        if (response && response.data) {
            return response.data;
        } else {
            console.error('카카오 API 응답 오류: response 또는 response.data 없음');
            return null;
        }
    } catch (error: any) {
        console.error('카카오 API 요청 오류:', error);
        if (error.response && error.response.data) {
            console.log('서버 응답 데이터:', error.response.data);
        }
        throw error;
    }
};

// 도서 검색 API
export const searchBook = async (query: string) => {
    try {
        const results = await fetchKakaoData('', { target: 'title', query });
        if (results && results.documents) {
            return results.documents.map((bookData: any) => ({
                title: bookData.title,
                thumbnail: bookData.thumbnail,
                authors: bookData.authors,
                publisher: bookData.publisher,
            }));
        }
        return [];
    } catch (error) {
        console.error('도서 검색 오류:', error);
        return [];
    }
};