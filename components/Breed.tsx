import React, {useEffect, useState} from 'react';
import styles from '../styles/Home.module.css';
import DogImage from "./DogImage";

const NUMOFIMAGESPERPAGE = 20;

export default function Breed({ breed, showDivider=false }) {

    const [pageNumber, setPageNumber] = useState(1);
    const [breedImages, setBreedImages] = useState([])

    useEffect(() => {
        async function fetchBreedImages() {
            const randomBreedUrl =
                `https://dog.ceo/api/breed/${breed}/images/random/100`
            try {
                const res = await fetch(randomBreedUrl);
                // getting breed images
                const data  = await res.json();
                const images = data.message;
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

    const maxNumOfImages = NUMOFIMAGESPERPAGE * pageNumber;
    const shouldShowButton = breedImages.length > maxNumOfImages;

    const handleLoadMore = () => {
        setPageNumber(prevState => prevState + 1);
    }

    return (
        <>
            <a href={`/${breed}`}>
                <h2>
                    {breed[0].toUpperCase() + breed.slice(1)}
                </h2>
            </a>
            <section className={styles.imageGalleryContainer}>
                {
                    breedImages.slice(0, maxNumOfImages).map((imageUrl, index) => {
                        const subBreedName = imageUrl.split('breeds')[1].split('/')[1]
                            .replace('-', " ").split(" ")[1];
                        const subBreedFormattedName = subBreedName ? subBreedName[0].toUpperCase() + subBreedName.slice(1) : '';
                        const urlPath = subBreedFormattedName ? `/${breed}/${subBreedFormattedName.toLowerCase()}` : ''
                        return (
                            <DogImage key={index}
                                      urlPath={urlPath}
                                      dogUrl={imageUrl}
                                      labelText={subBreedFormattedName}
                                      alt={`${breed} photo`}
                            />
                        )})
                }
            </section>
            {
                shouldShowButton &&
                (<button className={styles.button} onClick={handleLoadMore}>
                    Load More
                </button>)
            }
            {

                showDivider && <hr className={styles.hr}/>

            }
        </>
    )
}
