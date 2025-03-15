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

// 영화 검색 API
export const searchMovie = async (query: string) => {
    try {
        const results = await fetchTmdbData('search/movie', { query });
        if (results && results.results) {
            return results.results.map((movieData: any) => ({
                title: movieData.title,
                poster_path: movieData.poster_path,
            }));
        }
        return [];
    } catch (error) {
        console.error('영화 검색 오류:', error);
        return [];
    }
};

// 영화 상세 조회 API
export const getMovieDetails = async (movieId: number) => {
    return await fetchTmdbData(`movie/${movieId}`, {});
};

// 포스터 이미지 URL API
export const getMoviePosterUrl = (posterPath: string, size: string = 'w500') => {
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
};