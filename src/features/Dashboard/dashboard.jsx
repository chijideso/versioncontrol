import { useEffect, useState } from 'react';
import { db, auth, storage } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Title, Card, Button, Textarea, Stack, Container, Group, Loader, Center, FileInput } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PostCard from './postCard.jsx';
// This import will now work once you run the npm install command
import { notifications } from '@mantine/notifications';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !image) return;

    setUploading(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "posts"), {
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        authorEmail: user.email,
        content: newPostContent,
        imageUrl,
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
      });

      // SUCCESS NOTIFICATION
      notifications.show({
        title: 'Post shared!',
        message: 'Your post is now live on the feed.',
        color: 'green'
      });

      setNewPostContent('');
      setImage(null);
    } catch (error) {
      notifications.show({
        title: 'Post Failed',
        message: 'Please try again. Error: ' + error.message,
        color: 'red'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container size="sm">
      <Stack>
        <Title order={2}>Your Feeds</Title>
        
        <Card padding="lg" radius="md" withBorder>
          <Textarea 
            placeholder="Share something with the world..." 
            minRows={3} 
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.currentTarget.value)}
          />
          <Group justify="space-between" mt="sm">
            <FileInput
              label="Add image"
              placeholder="Choose image"
              value={image}
              onChange={setImage}
              accept="image/*"
              leftSection={<IconUpload size="1rem" />}
              clearable
            />
            <Button 
              onClick={handleCreatePost} 
              disabled={(!newPostContent.trim() && !image) || uploading}
              loading={uploading}
              leftSection={<IconUpload size="1rem" />}
            >
              Post
            </Button>
          </Group>
        </Card>

        {loading ? (
          <Center mt="xl"><Loader /></Center>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id}
              post={post}
              canDelete={post?.authorId === user?.uid}
            />
          ))
        )}
      </Stack>
    </Container>
  );
}