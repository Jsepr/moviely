// import { addDays, format } from 'date-fns';
// import moviesJSON from './movies.json';
// import { kv } from "@vercel/kv";

// export async function load() {
// 	const movies = moviesJSON as Record<string, any>[];

//   const todaysDate = new Date();

//   Promise.all(movies.map(async (movie, index) => {
//     const key = format(addDays(todaysDate, index), 'yyyy-MM-dd');
//     const value = JSON.stringify(movie);
//     await kv.set(key, value);
//   }))

// 	return { movies };
// }
