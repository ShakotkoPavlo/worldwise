import { useCities } from "../context/CitiesContext";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";

import styles from "./CountryList.module.css";

function CountryList() {
  const { cities, loading } = useCities();

  if (loading) return <Spinner />;

  if (!cities.length)
    return <Message message="No countries found. Add some!" />;

  const countries = cities.reduce((acc, city) => {
    if (!acc.find((c) => c.country === city.country)) {
      acc.push({ country: city.country, emoji: city.emoji });
    }

    return acc;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem key={index} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
