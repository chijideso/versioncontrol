import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { Title, Card, Button, Textarea, Stack, Container, Group, Loader, Center } from '@mantine/core';
import PostCard from './PostCard';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Listen for Real-time Updates
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    
    // onSnapshot keeps the UI synced with the database automatically
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // 2. Add a New Post to Firestore
  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      await addDoc(collection(db, "posts"), {
        author: "User Name", // Later: replace with auth.currentUser.displayName
        content: newPostContent,
        likes: 0,
        timestamp: serverTimestamp(), // Best practice: use server time, not local
      });
      setNewPostContent('');
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <Container size="sm">
      <Stack>
        <Title order={2}>Your Feed</Title>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Textarea 
            placeholder="Share something with the world..." 
            minRows={3} 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.currentTarget.value)}
          />
          <Group justify="flex-end" mt="sm">
            <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
              Post
            </Button>
          </Group>
        </Card>

        {loading ? (
          <Center mt="xl"><Loader color="blue" /></Center>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              author={post.author}
              timestamp={post.timestamp?.toDate().toLocaleString() || "Just now"}
              content={post.content}
              initialLikes={post.likes}
            />
          ))
        )}
      </Stack>
    </Container>
  );
}