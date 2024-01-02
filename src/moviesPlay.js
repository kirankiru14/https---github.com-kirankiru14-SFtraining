import { movies, languages, countries, genres } from '../data/movies.js';
import { hindiMovies } from '../data/hindiMovies.js';
import { castData } from '../data/castData.js';

export const getCounts = () => {
  const counts = {};
  counts.movies = movies.length;
  counts.hindiMovies = hindiMovies.length;
  counts.languages = languages.length;
  counts.countries = countries.length;
  counts.genres = genres.length;
  counts.castData = castData.length;

  return counts;
}

export { movies, languages, countries, genres } from '../data/movies.js';
export { hindiMovies } from '../data/hindiMovies.js';
export { castData } from '../data/castData.js';