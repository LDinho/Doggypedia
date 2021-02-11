import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

// Typescript
type Props = {
    breedsArrayForSearch:string[];
}

export default function Search({breedsArrayForSearch}:Props) {
    const [query, setQuery] = useState('');

    const onChange = (e) => {
        const { value } = e.target;
        setQuery(value);
    }

    const searchResults = breedsArrayForSearch.filter((breed) => {
        return breed.toLowerCase().includes(query.toLowerCase());
    })

    return (
        <>
            <form className={styles.form} onSubmit={() => {}}>
                <input className={styles.input} type="text"
                       aria-label="Search breed or sub-breed"
                       name="query"
                       placeholder="search breed"
                       value={query}
                       onChange={onChange}
                />
                {
                    query &&
                    <div className={styles.searchDropdown}>
                        {
                            searchResults.map((breed) => {
                                const breedArray = breed.toLowerCase().split(' ');

                                const hasSubBreed = breedArray.length === 2;
                                const href = hasSubBreed ? `${breedArray[1]}/${breedArray[0]}` : `${breedArray[0]}`

                                return (
                                    <Link href={href} key={breed}>
                                        <a className={styles.dropdownItem}>
                                            {breed}
                                        </a>
                                    </Link>

                                )
                            })
                        }
                    </div>
                }
            </form>
        </>
    )
}
