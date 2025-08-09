import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchTmdbData = async (endpoint: string, params: Record<string, any> = {}) => {
    try {
        const queryParams = new URLSearchParams({
            api_key: API_KEY || '',
            ...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)])),
        });

        const response = await axios.get(`${BASE_URL}/${endpoint}?${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response && response.data) {
            return response.data;
        } else {
            console.error('API 응답 오류: response 또는 response.data 없음');
            return null;
        }
    } catch (error: any) {
        console.error('TMDB API 요청 오류:', error);
        if (error.response && error.response.data) {
            console.log('서버 응답 데이터:', error.response.data);
        }
        throw error;
    }
};

// 시리즈 검색 API
export const searchSeries = async (query: string) => {
    try {
        const results = await fetchTmdbData('search/tv', { query });
        if (results && results.results) {
            return results.results.map((seriesData: any) => ({
                name: seriesData.name,
                poster_path: seriesData.poster_path,
            }));
        }
        return [];
    } catch (error) {
        console.error('시리즈 검색 오류:', error);
        return [];
    }
};

// 시리즈 상세 조회 API
export const getSeriesDetails = async (seriesId: number) => {
    return await fetchTmdbData(`tv/${seriesId}`, {});
};

// 썸네일 이미지 URL API
export const getSeriesPosterUrl = (posterPath: string, size: string = 'w500') => {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};