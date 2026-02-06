import { useCities } from "../context/CitiesContext";
import CityItem from "./CityItem";
import Message from "./Message";
import Spinner from "./Spinner";

import styles from "./CityList.module.css";

function CityList() {
  const { cities, loading } = useCities();

  if (loading) return <Spinner />;

  if (!cities.length) return <Message message="No cities found. Add some!" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
}

export default CityList;
