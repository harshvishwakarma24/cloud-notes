export const initialProfile = {
  name: 'Harsh Vishwakarma',
  email: 'harsh@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  isLoggedIn: true,
  notesCount: 128,
  spacesCount: 6,
  daysActive: 89,
};

export const initialTasks = [
  { id: 't1', text: 'Review PRD', completed: false },
  { id: 't2', text: 'Prepare presentation', completed: false },
  { id: 't3', text: 'Read for 30 minutes', completed: false },
];

export const initialNotes = [
  {
    id: 'n1',
    title: "Today's thoughts 🌿",
    content: `Some days are for rushing, and some days are for remembering what truly matters.

Today, I choose clarity over noise.

Creativity is not about being perfect creates lifetizing it ton everything. It's mable to stand instantly ranges head and prevestions about authenticity.

Creativity is not about being perfect.

It's about perfection, standing negotiations and different perspectives.

Creativity it as remes as you allow it to be.`,
    space: 'Journal',
    pinned: true,
    bookmarkColor: '#c89f65',
    updatedAt: 'Just now',
    createdAt: 'Today',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    tags: ['Journal', 'Reflections', 'Mindfulness'],
  },
  {
    id: 'n2',
    title: 'Project Aurora',
    content: 'Ideas for the new AI feature and peaceful interface components.',
    space: 'Personal',
    pinned: true,
    bookmarkColor: '#a38a5b',
    color: '#f4ede2',
    updatedAt: 'Today at 10:00 AM',
    createdAt: 'Today',
  },
  {
    id: 'n3',
    title: 'Personal Journal',
    content: 'Grateful for the little things, quiet mornings, and a fresh cup of green tea.',
    space: 'Journal',
    pinned: true,
    bookmarkColor: '#b26848',
    color: '#f7f1e5',
    updatedAt: 'Yesterday',
    createdAt: 'Yesterday',
  },
  {
    id: 'n4',
    title: 'Book Notes',
    content: 'The Art of Slow Living — Finding calmness in a fast-paced world.',
    space: 'Ideas',
    pinned: true,
    bookmarkColor: '#8a9a7b',
    color: '#f3f0e6',
    updatedAt: '2 days ago',
    createdAt: '2 days ago',
  },
  {
    id: 'n5',
    title: 'Travel Plans',
    content: 'A journey of a thousand miles begins with a single step. Planning Kyoto autumn retreat.',
    space: 'Personal',
    pinned: false,
    bookmarkColor: '#e0c896',
    color: '#eef3e8',
    updatedAt: 'Today',
    createdAt: 'Today',
  },
  {
    id: 'n6',
    title: 'UI Inspiration',
    content: 'Light, shadow, texture and emotion. Natural paper gradients and serene watercolor banners.',
    space: 'Work',
    pinned: false,
    bookmarkColor: '#d69e7e',
    color: '#f8f2e9',
    updatedAt: 'Yesterday',
    createdAt: 'Yesterday',
  },
  {
    id: 'n7',
    title: 'Recipes',
    content: 'Homemade pasta, with fresh basil, olive oil, roasted garlic, and cherry tomatoes.',
    space: 'Personal',
    pinned: false,
    bookmarkColor: '#c48b6c',
    color: '#f6f2eb',
    updatedAt: '2 days ago',
    createdAt: '2 days ago',
  },
  {
    id: 'n8',
    title: 'Random Thoughts',
    content: 'Little notes from random mysteries. Observation is the doorway to understanding.',
    space: 'Ideas',
    pinned: false,
    bookmarkColor: '#b0a080',
    color: '#f5f0e8',
    updatedAt: '2 days ago',
    createdAt: '2 days ago',
  },
  {
    id: 'n9',
    title: 'Meeting Notes',
    content: 'Meeting Notes regarding Cloud Notes AI Companion feature and design polish.',
    space: 'Work',
    pinned: false,
    bookmarkColor: '#7a8c78',
    color: '#f0ede4',
    updatedAt: 'Today at 10:00 AM',
    createdAt: 'Today',
  },
  {
    id: 'n10',
    title: 'Learning Plan',
    content: 'Study design systems, typography hierarchy, and thoughtful micro-interactions.',
    space: 'College',
    pinned: false,
    bookmarkColor: '#a08560',
    color: '#f3eee2',
    updatedAt: 'Yesterday',
    createdAt: 'Yesterday',
  },
];

export const searchSuggestions = [
  'notes with ideas',
  'journal from last week',
  'meeting notes',
  'inspiration',
  'travel plans',
  'book notes',
  'personal development',
];
