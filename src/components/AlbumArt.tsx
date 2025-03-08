"use client";
import React, { useState, useEffect } from "react";
import { fetchLastfmData } from "@/app/api/music/lastfm";

interface Props {
    mbid?: string;
}

const AlbumArt: React.FC<Props> = ({ mbid }) => {
    const [albumArt, setAlbumArt] = useState("/images/albumart.png");

    useEffect(() => {
        let isMounted = true; // 최신 요청인지 확인

        setAlbumArt("/images/albumart.png"); // mbid 변경 시 초기화

        if (!mbid) {
            console.log("mbid 값이 없음. 대체 이미지 사용.");
            return;
        }

        const getAlbumArt = async () => {
            try {
                const data = await fetchLastfmData("album.getInfo", {
                    mbid: mbid,
                    autocorrect: 1,
                });

                if (isMounted && data?.album?.image?.[1]?.["#text"]) {
                    setAlbumArt(data.album.image[1]["#text"]);
                }
            } catch (error) {
                console.error("앨범 아트 가져오기 오류:", error);
            }
        };

        getAlbumArt();

        return () => {
            isMounted = false; // 비동기 응답이 늦게 도착해도 무시
        };
    }, [mbid]);

    return (
        <div>
            <img
                src={albumArt}
                alt="Album Art"
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
            />
        </div>
    );
};

export default AlbumArt;
