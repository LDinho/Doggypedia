import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Image from 'next/image';
import styles from "../../styles/Home.module.css";
import DogImage from "../../components/DogImage";

const NUMOFIMAGESPERPAGE = 20;

export default function SubBreed() {

    const [subBreeds, setSubBreeds] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);

    const router = useRouter();
    // renamed breedOrLetter to simply breed,
    // because when we route to this path we'd use the breed name
    const { breedOrLetter:breed, subbreed } = router.query;

    useEffect(() => {
        async function fetchSubBreedImages() {
            const subBreedUrl = `https://dog.ceo/api/breed/${breed}/${subbreed}/images/random/100`;
            try {
                const res = await fetch(subBreedUrl);
                // getting subBreed images
                const data  = await res.json();
                const subBreedImages = data.message;
                setSubBreeds(subBreedImages);

            } catch (err) {
                console.error(err);
            }
        }
        if (subbreed) {
            fetchSubBreedImages();
        }

    },[subbreed])

    if (!subbreed || !breed) return null;

    const subBreedCapitalized = subbreed[0].toUpperCase() + subbreed.slice(1)
    const breedCapitalized = breed[0].toUpperCase() + breed.slice(1)

    const maxNumOfImages = NUMOFIMAGESPERPAGE * pageNumber;
    const shouldShowButton = subBreeds.length > maxNumOfImages;

    const handleLoadMore = () => {
        setPageNumber(prevState => prevState + 1);
    }

    return (
        <>
            <Header />
            <h2 className={styles.subBreedTitle} >
                {`${subBreedCapitalized} ${breedCapitalized}`}
            </h2>

            <section className={styles.imageGalleryContainer}>
                {
                    subBreeds.slice(0, maxNumOfImages).map((subBreedUrl, index) => {

                        const subBreedAndBreedName = subBreedUrl.split('breeds')[1].split('/')[1].replace('-', " ")
                            .split(" ").reverse().map(word => word[0].toUpperCase() + word.slice(1))
                            .join(" ").split(" ").join(' ');

                        return (
                            <DogImage key={index}
                                      dogUrl={subBreedUrl}
                                      alt={`${subBreedAndBreedName} photo`}
                            />

                        )})
                }
            </section>
            {
                shouldShowButton &&
                (
                    <div className={styles.buttonWrapper}>
                        <button className={styles.button} onClick={handleLoadMore}>
                            Load More
                        </button>
                    </div>
                )
            }
            <footer className={styles.footer}>
                <a
                    href="/"
                    target=""
                    rel=""
                >
                    Doggypedia
                </a>
            </footer>
        </>
    )
}
