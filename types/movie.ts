export type Movie = {
    id: string;
    title: string;
    genres: string[] | string;
    rating: number;
    thumbnail: string;
    commentId: string;
    isMasterPiece: boolean;
};
