import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Image from 'next/image';

import styles from '../styles/Home.module.css';

const url = `https://dog.ceo/api/breeds/image/random/20`;
const allBreedsUrl = `https://dog.ceo/api/breeds/list/all`;

export default function Home() {
  const [breeds, setBreeds] = useState({});
  const [dogs, setDogs] = useState([]);
  const [alphabetArray, setAlphabetArray] = useState([]);

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
        console.log('allBreeds', allBreeds);
        setBreeds(allBreeds);

        const alphabetArray = Object.keys(allBreeds).reduce((acc, breed) => {
          const firstLetter = breed[0];
          if (acc.indexOf(firstLetter) === -1) {
            return [...acc, firstLetter];
          }
          return acc;
        }, []);
        setAlphabetArray(alphabetArray);

      } catch (err) {
        console.error(err);
      }
    }
    // Execute created functions directly
    fetchRandomImages();
    fetchBreeds();

  },[])

  return (

    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Doggypedia
        </h1>

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
            dogs.map((dogUrl, index) => {

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
