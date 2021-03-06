import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Breed from '../components/Breed';
import styles from "../styles/Home.module.css";

const allBreedsUrl = `https://dog.ceo/api/breeds/list/all`;

export default function BreedOrLetter() {
    const router = useRouter();
    const { breedOrLetter } = router.query;

    const isLetter = breedOrLetter && breedOrLetter.length === 1;

    const [breeds, setBreeds] = useState({});
    const [alphabetArray, setAlphabetArray] = useState([]);

    const filteredBreeds = Object.keys(breeds).filter((breed) => breed[0] === breedOrLetter);

    useEffect(() => {
        async function fetchBreeds() {
            try {
                const res = await fetch(allBreedsUrl);
                // getting all breeds
                const data  = await res.json();
                const allBreeds = data.message;
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
        fetchBreeds();

    },[])

    return (

        <>
            <div className={styles.container}>
                <Header />

                <main className={styles.main}>
                    <div className={styles.alphabetContainer}>
                        {
                            alphabetArray.map((letter, index) => {
                                let aTagStyling = '';
                                if (typeof breedOrLetter === "string") {
                                    aTagStyling = letter.toLowerCase() === breedOrLetter.toLowerCase() ? styles.alphabetLinkActive : styles.alphabetLink;
                                }
                                return (
                                    <a className={aTagStyling} href={`/${letter}`} key={index}>
                                        {letter.toUpperCase()}
                                    </a>
                                )
                            })
                        }
                    </div>

                    {
                        isLetter ?

                            (<>
                                {
                                    filteredBreeds.map((breed, index) => <Breed breed={breed} key={index} showDivider={true}/>)
                                }
                            </>)

                            :

                            (<Breed breed={ breedOrLetter } />)
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

        </>
    )
}

