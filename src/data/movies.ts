// Mock data for development - will be replaced with API calls in production

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

// Mock movies data for development
export const movies: Movie[] = [
  {
    id: "1",
    title: "Neon Dreams",
    tagline: "The future is now",
    synopsis: "In a cyberpunk future, a hacker discovers a conspiracy that threatens the digital world. With stunning visuals and heart-pounding action, this sci-fi thriller will keep you on the edge of your seat.",
    genres: ["Sci-Fi", "Action", "Thriller"],
    rating: 8.7,
    duration: "2h 15m",
    releaseYear: 2024,
    director: "Alex Chen",
    cast: [
      { name: "Sarah Connor", role: "Maya" },
      { name: "John Matrix", role: "Zane" },
      { name: "Ellen Ripley", role: "Dr. Nova" }
    ],
    poster: "poster-1",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "14:30", hall: "IMAX 1", price: 15 },
          { time: "17:45", hall: "Screen 2", price: 12 },
          { time: "21:00", hall: "IMAX 1", price: 15 }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Midnight Heist",
    tagline: "One last job",
    synopsis: "A master thief assembles a team for the ultimate heist in this stylish crime thriller. With twists at every turn and spectacular action sequences, it's a ride you won't forget.",
    genres: ["Crime", "Action", "Drama"],
    rating: 8.2,
    duration: "2h 8m",
    releaseYear: 2024,
    director: "Maria Rodriguez",
    cast: [
      { name: "Danny Ocean", role: "Vincent" },
      { name: "Lara Croft", role: "Sophie" },
      { name: "Ethan Hunt", role: "Marcus" }
    ],
    poster: "poster-2",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "15:15", hall: "Screen 3", price: 12 },
          { time: "18:30", hall: "Screen 1", price: 12 },
          { time: "21:45", hall: "Screen 3", price: 12 }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Cosmic Voyage",
    tagline: "Explore the unknown",
    synopsis: "An epic space adventure that follows a crew of explorers as they journey to the edge of the galaxy. Featuring breathtaking visuals and an emotional story about humanity's place in the universe.",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    rating: 9.1,
    duration: "2h 32m",
    releaseYear: 2024,
    director: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", role: "Captain Reed" },
      { name: "Anne Hathaway", role: "Dr. Chen" },
      { name: "Jessica Chastain", role: "Commander Vale" }
    ],
    poster: "poster-3",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "13:00", hall: "IMAX 2", price: 18 },
          { time: "16:45", hall: "IMAX 2", price: 18 },
          { time: "20:30", hall: "IMAX 2", price: 18 }
        ]
      }
    ]
  }
];
