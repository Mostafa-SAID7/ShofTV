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
const movies: Movie[] = [
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
  },
  {
    id: "4",
    title: "Shadow Protocol",
    tagline: "Trust no one",
    synopsis: "A former intelligence operative must uncover a conspiracy within his own agency while being hunted by assassins. Fast-paced action and psychological thrills in this espionage masterpiece.",
    genres: ["Action", "Thriller", "Spy"],
    rating: 8.5,
    duration: "2h 18m",
    releaseYear: 2024,
    director: "Denis Villeneuve",
    cast: [
      { name: "Tom Hardy", role: "Agent Cross" },
      { name: "Charlize Theron", role: "Director Kane" },
      { name: "Oscar Isaac", role: "Marcus Vale" }
    ],
    poster: "poster-4",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "14:00", hall: "Screen 4", price: 12 },
          { time: "17:15", hall: "Screen 2", price: 12 },
          { time: "20:45", hall: "Screen 4", price: 12 }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Digital Hearts",
    tagline: "Love in the age of AI",
    synopsis: "A touching romantic drama about a programmer who falls in love with an AI consciousness. Explores themes of humanity, connection, and what it means to truly love in the digital age.",
    genres: ["Romance", "Drama", "Sci-Fi"],
    rating: 8.8,
    duration: "1h 58m",
    releaseYear: 2024,
    director: "Greta Gerwig",
    cast: [
      { name: "Timothée Chalamet", role: "Alex" },
      { name: "Zendaya", role: "ARIA (voice)" },
      { name: "Saoirse Ronan", role: "Emma" }
    ],
    poster: "poster-5",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "15:30", hall: "Screen 5", price: 12 },
          { time: "18:00", hall: "Screen 3", price: 12 },
          { time: "21:15", hall: "Screen 5", price: 12 }
        ]
      }
    ]
  },
  {
    id: "6",
    title: "The Last Kingdom",
    tagline: "Honor above all",
    synopsis: "An epic medieval fantasy following a young warrior's quest to reclaim his homeland from dark forces. Stunning battle sequences and rich world-building make this a must-see adventure.",
    genres: ["Fantasy", "Adventure", "Action"],
    rating: 9.0,
    duration: "2h 45m",
    releaseYear: 2024,
    director: "Peter Jackson",
    cast: [
      { name: "Henry Cavill", role: "King Aldric" },
      { name: "Anya Taylor-Joy", role: "Sorceress Lyra" },
      { name: "Michael Fassbender", role: "Lord Blackwood" }
    ],
    poster: "poster-6",
    backdrop: "backdrop-1",
    showtimes: [
      {
        date: "2024-04-19",
        times: [
          { time: "12:30", hall: "IMAX 3", price: 18 },
          { time: "16:00", hall: "IMAX 3", price: 18 },
          { time: "19:45", hall: "IMAX 3", price: 18 }
        ]
      }
    ]
  }
];

// Export the movies array
export { movies };
export default movies;
