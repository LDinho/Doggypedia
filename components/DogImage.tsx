import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import Heart from "./Heart.svg";
import styles from "../styles/Home.module.css";

function MaybeLink({ urlPath, children }) {
    if (!urlPath) {
        return <>{children}</>
    }

    return (
        <Link href={urlPath}>
            <a>
                {children}
            </a>
        </Link>
    )
}

type Props = {
    urlPath?:string;
    dogUrl:string;
    labelText?:string;
    alt:string;
}

export default function DogImage({ urlPath, dogUrl, labelText, alt }:Props) {
    const [isLiked, setIsLiked] = useState(false);

    const getImageID = (url) => {
        const splitUrlArray = url.split('/');
        return splitUrlArray[splitUrlArray.length - 1].replace('.jpg', '');
    }
    const dogImageID = getImageID(dogUrl);

    // Because of the server-side-rendering of Next.js, cannot access the window object
    // so we use useEffect since it is client-side code
    useEffect(() => {
        const isDogImageLiked = localStorage.getItem(dogImageID);
        const isLikedLocalStorage = isDogImageLiked !== null
            ? JSON.parse(isDogImageLiked)
            : false;
        setIsLiked(isLikedLocalStorage);
    }, []);

    return (
            <div className={styles.dogImageContainer}>
                <MaybeLink urlPath={urlPath}>
                    <div className={styles.imageWrapper}>
                        <Image
                            className={styles.galleryItem}
                            src={dogUrl}
                            alt={alt}
                            width={500}
                            height={500}
                        />
                        {
                           labelText &&
                           (<h2>{labelText}</h2>)

                        }
                    </div>
                </MaybeLink>
                <button className={styles.likeButton}
                        onClick={() => {
                            setIsLiked( (prevState) => {
                                window.localStorage.setItem(dogImageID, JSON.stringify(!prevState));
                                return !prevState

                            });
                        }}
                >

                <div className={styles.svgContainer}>
                    <Heart fill={ isLiked ? 'red': '#fff' }
                           stroke='#272727'
                           strokeWidth='3px'
                    />
                </div>
                </button>
            </div>
    )
}
