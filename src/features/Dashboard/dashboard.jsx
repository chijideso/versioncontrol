import { useEffect, useState } from 'react';
import { db, auth, storage } from '../../lib/firebase';
import {
  collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  Title, Card, Button, Textarea, Stack, Container,
  Group, Loader, Center, FileInput, Text, Anchor, TextInput
} from '@mantine/core';
import { IconUpload, IconSearch } from '@tabler/icons-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import PostCard from './postCard.jsx';
import { notifications } from '@mantine/notifications';
import { extractHashtags } from '../Feed/feedUtils.jsx';

const PREVIEW_LIMIT = 5; // how many posts to show before "View All"

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!user) {
      notifications.show({ title: 'Authentication Required', message: 'Please log in to post.', color: 'red' });
      return;
    }
    if (!newPostContent.trim() && !image) return;
    setUploading(true);
    try {
      console.log('Creating post...', { user: user.uid, newPostContent, image });
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
        console.log('Image uploaded:', imageUrl);
      }

      const postData = {
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        authorEmail: user.email,
        content: newPostContent,
        hashtags: extractHashtags(newPostContent),
        imageUrl,
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
      };
      console.log('Post data:', postData);
      await addDoc(collection(db, "posts"), postData);
      console.log('Post added to Firestore');

      notifications.show({ title: 'Post shared!', message: 'Your post is now live.', color: 'green' });
      setNewPostContent('');
      setImage(null);
    } catch (error) {
      console.error('Post creation failed:', error);
      notifications.show({ title: 'Post Failed', message: error.message, color: 'red' });
    } finally {
      setUploading(false);
    }
  };

  const handleSeedFeed = async () => {
    const samplePosts = [
      {
        authorId: 'sample-user-1',
        authorName: 'Alice Johnson',
        authorEmail: 'alice@example.com',
        content: 'Just finished a great hike in the mountains! The views were breathtaking. 🏔️',
        imageUrl: '',
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
      },
      {
        authorId: 'sample-user-2',
        authorName: 'Bob Smith',
        authorEmail: 'bob@example.com',
        content: 'Excited to share my latest project! Check out this new app I built. 🚀',
        imageUrl: '',
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
      },
      {
        authorId: 'sample-user-3',
        authorName: 'Charlie Brown',
        authorEmail: 'charlie@example.com',
        content: 'Coffee and coding – the perfect combo for a productive morning. ☕💻',
        imageUrl: '',
        likes: 0,
        comments: [],
        timestamp: serverTimestamp(),
      },
    ];

    try {
      for (const post of samplePosts) {
        await addDoc(collection(db, "posts"), post);
      }
      notifications.show({ title: 'Feed Seeded!', message: 'Sample posts added to your feed.', color: 'green' });
    } catch (error) {
      notifications.show({ title: 'Seeding Failed', message: error.message, color: 'red' });
    }
  };

  const visiblePosts = viewAll ? posts : posts.slice(0, PREVIEW_LIMIT);
  const filteredPosts = searchQuery
    ? posts.filter(post =>
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.authorName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visiblePosts;

  return (
    <Container size="sm">
      <Stack>
        <Title order={2}>Your Feed</Title>

        <TextInput
          placeholder="Search posts or users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<IconSearch size="1rem" />}
          size="md"
        />

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
          <>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                canDelete={post?.authorId === user?.uid}
              />
            ))}

            {/* View All / Show Less */}
            {!searchQuery && posts.length > PREVIEW_LIMIT && (
              <Center>
                <Anchor
                  component="button"
                  onClick={() => setViewAll(!viewAll)}
                  size="sm"
                  fw={500}
                >
                  {viewAll ? 'Show less' : `View all ${posts.length} posts`}
                </Anchor>
              </Center>
            )}

            {posts.length === 0 && !searchQuery && (
              <Card padding="lg" radius="md" withBorder>
                <Text c="dimmed" size="sm">
                  No posts yet. Share your first update to start the conversation.
                </Text>
                <Text c="dimmed" size="xs" mt="8px">
                  Or seed the feed with sample posts to see how it looks.
                </Text>
                <Button
                  onClick={handleSeedFeed}
                  variant="light"
                  color="indigo"
                  mt="md"
                  fullWidth
                >
                  Seed Sample Feed
                </Button>
              </Card>
            )}

            {searchQuery && filteredPosts.length === 0 && (
              <Center mt="xl">
                <Text c="dimmed">No posts match your search.</Text>
              </Center>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}