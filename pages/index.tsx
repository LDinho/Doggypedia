import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Search from "../components/Search";
import Image from 'next/image';

import styles from '../styles/Home.module.css';

const url = `https://dog.ceo/api/breeds/image/random/50`;
const allBreedsUrl = `https://dog.ceo/api/breeds/list/all`;
const NUMOFIMAGESPERPAGE = 20;

export default function Home() {
  const [pageNumber, setPageNumber] = useState(1);
  const [breeds, setBreeds] = useState({});
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    // Create a scoped async function in the hook
    async function fetchRandomImages() {
      try {
        const res = await fetch(url);
        // getting the dog images
        const data  = await res.json();
        const dogImages = data.message;
        // console.log('dogImages', dogImages);
        setDogs(dogImages);

      } catch (err) {
        console.error(err);
      }
    }

    async function fetchBreeds() {
      try {
        const res = await fetch(allBreedsUrl);
        // getting all breed images
        const data  = await res.json();
        const allBreeds = data.message;
        setBreeds(allBreeds);

      } catch (err) {
        console.error(err);
      }
    }
    // Execute created functions directly
    fetchRandomImages();
    fetchBreeds();

  },[])

  const alphabetArray = Object.keys(breeds).reduce((acc, breed) => {
    const firstLetter = breed[0];
    if (acc.indexOf(firstLetter) === -1) {
      return [...acc, firstLetter];
    }
    return acc;
  }, []);

  const breedsArrayForSearch = Object.keys(breeds).reduce((acc, breed) => {
    const subBreeds = breeds[breed];
    const breedCapitalized = `${breed[0].toUpperCase()}${breed.slice(1)}`;

    const hasSubBreeds = subBreeds.length > 0;

    if (hasSubBreeds) {
      const subBreedsPlusBreed = subBreeds.map((subBreed) => `${subBreed[0].toUpperCase()}${subBreed.slice(1)} ${breedCapitalized}`);
     return [...acc, breedCapitalized, ...subBreedsPlusBreed]
    }

    return [...acc, breedCapitalized];   // acc.concat(breed)

  }, []);

  const maxNumOfImages = NUMOFIMAGESPERPAGE * pageNumber;
  const shouldShowButton = dogs.length > maxNumOfImages;

  const handleLoadMore = () => {
    setPageNumber(prevState => prevState + 1);
  }

  return (

    <div className={styles.container}>
      <Header />
      <Search breedsArrayForSearch={breedsArrayForSearch} />

      <main className={styles.main}>
        <div className={styles.alphabetContainer}>
          {
            alphabetArray.map((letter, index) => (
                <a className={styles.alphabetLink} href={`/${letter}`} key={index}>
                  {letter.toUpperCase()}
                </a>
            ))
          }
        </div>

        <section className={styles.imageGalleryContainer}>

          {
            dogs.slice(0, maxNumOfImages).map((dogUrl, index) => {

              const subBreedAndBreedName = dogUrl.split('breeds')[1].split('/')[1].replace('-', " ")
                  .split(" ").reverse().map(word => word[0].toUpperCase() + word.slice(1))
                  .join(" ").split(" ").join(' ');

              const subBreedAndBreedNameArray = subBreedAndBreedName.split(' ');

              // get url path to /breed  or /breed/subbreed for <Link href>
              const urlPath = subBreedAndBreedNameArray.length === 2 ?
                  `/${subBreedAndBreedNameArray[1].toLowerCase()}/${subBreedAndBreedNameArray[0].toLowerCase()}` : `/${subBreedAndBreedNameArray[0].toLowerCase()}`;

              return (
                <Link href={urlPath} key={index}>
                  <a>
                    <div className={styles.imageWrapper}>
                      <Image
                          className={styles.galleryItem}
                          src={dogUrl}
                          alt={`${subBreedAndBreedName} photo`}
                          width={500}
                          height={500}
                      />
                      <h2>{subBreedAndBreedName}</h2>
                    </div>
                  </a>
                </Link>
            )})
          }
        </section>
        {
          shouldShowButton &&
          (<button className={styles.button} onClick={handleLoadMore}>
            Load More
          </button>)
        }
      </main>

      <footer className={styles.footer}>
        <a
          href="/"
          target=""
          rel=""
        >
          Doggypedia
        </a>
      </footer>
    </div>
  )
}
