import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from "next/image";

function MaybeLink({breed, subBreedFormattedName, children}) {
    if (!subBreedFormattedName) {
        return <>{children}</>
    }

    return (
        <Link href={`/${breed}/${subBreedFormattedName.toLowerCase()}`}>
            <a>
                {children}
            </a>
        </Link>
    )
}

export default function Breed({ breed }) {

    const [breedImages, setBreedImages] = useState([])

    useEffect(() => {
        async function fetchBreedImages() {
            const randomBreedUrl =
                `https://dog.ceo/api/breed/${breed}/images/random/20`
            try {
                const res = await fetch(randomBreedUrl);
                // getting breed images
                const data  = await res.json();
                const images = data.message;
                console.log('breedImages', images);
                setBreedImages(images);

            } catch (err) {
                console.error(err);
            }
        }
        if (breed) {
            fetchBreedImages();
        }

    },[breed])

    if (!breed) return null;

    return (
        <>
            <a href={`/${breed}`}>
                <h2>
                    {breed[0].toUpperCase() + breed.slice(1)}
                </h2>
            </a>
            <section className={styles.imageGalleryContainer}>
                {
                    breedImages.map((imageUrl, index) => {
                        const subBreedName = imageUrl.split('breeds')[1].split('/')[1]
                            .replace('-', " ").split(" ")[1];
                        const subBreedFormattedName = subBreedName ? subBreedName[0].toUpperCase() + subBreedName.slice(1) : '';
                        return (
                            <MaybeLink breed={breed} subBreedFormattedName={subBreedFormattedName} key={index}>
                                <div className={styles.imageWrapper} >
                                    <Image
                                        className={styles.galleryItem}
                                        src={imageUrl}
                                        alt={`${breed} photo`}
                                        width={500}
                                        height={500}
                                    />
                                    {
                                        subBreedFormattedName &&
                                        (
                                            <h2>{subBreedFormattedName}</h2>
                                        )
                                    }
                                </div>
                            </MaybeLink>
                        )})
                }
            </section>
        </>
    )
}
