export interface Movie {
  id: string;
  title: string;
  tagline: string;
  synopsis: string;
  genres: string[];
  rating: number;
  duration: string;
  releaseYear: number;
  director: string;
  cast: { name: string; role: string }[];
  poster: string;
  backdrop: string;
  showtimes: { date: string; times: { time: string; hall: string; price: number }[] }[];
}

export const GENRES = [
  "All", "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Animation", "Thriller", "Adventure"
];

export const movies: Movie[] = [
  {
    id: "1",
    title: "Neon Horizon",
    tagline: "The future is closer than you think",
    synopsis: "In a world where reality and virtual existence collide, one hacker must navigate both dimensions to save humanity from a rogue AI that threatens to merge the two worlds permanently.",
    genres: ["Sci-Fi", "Action", "Thriller"],
    rating: 8.7,
    duration: "2h 22m",
    releaseYear: 2026,
    director: "Aria Chen",
    cast: [
      { name: "Marcus Webb", role: "Kai" },
      { name: "Luna Park", role: "Echo" },
      { name: "Devon Cross", role: "Architect" },
      { name: "Zara Knight", role: "Nova" },
    ],
    poster: "poster-1",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "14:30", hall: "IMAX 1", price: 18 }, { time: "18:00", hall: "Standard 3", price: 12 }, { time: "21:30", hall: "IMAX 1", price: 18 }] },
      { date: "2026-03-07", times: [{ time: "15:00", hall: "Standard 2", price: 12 }, { time: "19:00", hall: "IMAX 1", price: 18 }] },
    ],
  },
  {
    id: "2",
    title: "Amber Skies",
    tagline: "Love finds its way home",
    synopsis: "Two strangers connected by a shared melody find each other across continents, only to discover that their pasts are more intertwined than they ever imagined.",
    genres: ["Romance", "Drama"],
    rating: 7.9,
    duration: "1h 58m",
    releaseYear: 2026,
    director: "Sofia Morales",
    cast: [
      { name: "Elena Vasquez", role: "Clara" },
      { name: "James Okonkwo", role: "Daniel" },
    ],
    poster: "poster-2",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "16:00", hall: "Standard 1", price: 12 }, { time: "20:00", hall: "Standard 2", price: 12 }] },
    ],
  },
  {
    id: "3",
    title: "The Hollow",
    tagline: "Some doors should stay closed",
    synopsis: "A family inherits a sprawling Victorian mansion, only to discover its walls hold terrifying secrets that grow stronger with every night they stay.",
    genres: ["Horror", "Thriller"],
    rating: 7.4,
    duration: "1h 47m",
    releaseYear: 2026,
    director: "Nathan Voss",
    cast: [
      { name: "Sarah Mitchell", role: "Helen" },
      { name: "Rory Graham", role: "Thomas" },
    ],
    poster: "poster-3",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "21:00", hall: "Standard 4", price: 12 }, { time: "23:30", hall: "Standard 4", price: 10 }] },
    ],
  },
  {
    id: "4",
    title: "Sky Wanderers",
    tagline: "Adventure is out there — way out there",
    synopsis: "A misfit crew of flying creatures embarks on an epic quest across floating islands to find the legendary Storm Crystal before their world crumbles.",
    genres: ["Animation", "Adventure"],
    rating: 8.3,
    duration: "1h 42m",
    releaseYear: 2026,
    director: "Yuki Tanaka",
    cast: [
      { name: "Chris Pratt", role: "Zephyr (voice)" },
      { name: "Awkwafina", role: "Pip (voice)" },
    ],
    poster: "poster-4",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "11:00", hall: "Standard 1", price: 10 }, { time: "14:00", hall: "IMAX 1", price: 16 }] },
    ],
  },
  {
    id: "5",
    title: "Best Laid Plans",
    tagline: "Nothing goes according to plan",
    synopsis: "Four old college friends reunite for a weekend getaway that spirals into a series of increasingly absurd misadventures involving a stolen yacht and an angry llama.",
    genres: ["Comedy"],
    rating: 7.1,
    duration: "1h 38m",
    releaseYear: 2026,
    director: "Tanya Briggs",
    cast: [
      { name: "Dave Kim", role: "Rick" },
      { name: "Amy Pascal", role: "Jordan" },
    ],
    poster: "poster-5",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "13:00", hall: "Standard 2", price: 12 }, { time: "17:30", hall: "Standard 3", price: 12 }] },
    ],
  },
  {
    id: "6",
    title: "Iron Resolve",
    tagline: "Heroes are forged in fire",
    synopsis: "Based on true events, a band of soldiers must hold a critical bridge against overwhelming odds during the final days of a devastating conflict.",
    genres: ["Action", "Drama"],
    rating: 8.5,
    duration: "2h 35m",
    releaseYear: 2026,
    director: "Robert Jansen",
    cast: [
      { name: "Tom Hardy", role: "Sgt. Cole" },
      { name: "Florence Pugh", role: "Medic Walsh" },
    ],
    poster: "poster-6",
    backdrop: "backdrop-1",
    showtimes: [
      { date: "2026-03-06", times: [{ time: "15:00", hall: "IMAX 1", price: 18 }, { time: "20:00", hall: "IMAX 1", price: 18 }] },
    ],
  },
];
