import { Card, Text, Group, Avatar, Button, ActionIcon, Menu, rem, Tooltip } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconShare, IconDots, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { notifications } from '@mantine/notifications';

export default function PostCard({ post, canDelete }) {
  const [userLikesCount, setUserLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  
  const { author, content, timestamp, imageUrl, id, authorId } = post;

  useEffect(() => {
    if (!id) return;
    // Likes count listener (expand for production)
    const likesQuery = query(collection(db, `posts/${id}/likes`));
    const unsubscribeLikes = onSnapshot(likesQuery, (snapshot) => {
      setUserLikesCount(snapshot.size);
    });
    // Comments listener
    const commentsQuery = query(collection(db, `posts/${id}/comments`), orderBy('timestamp', 'desc'));
    const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => {
      unsubscribeLikes();
      unsubscribeComments();
    };
  }, [id]);

  const toggleLike = async () => {
    try {
      const likesRef = doc(db, `posts/${id}/likes/${user.uid}`);
      await setDoc(likesRef, { userId: user.uid });
    } catch (error) {
      notifications.show({
        title: 'Like failed',
        message: 'Please try again.',
        color: 'red'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, `posts/${id}`));
    } catch (error) {
      notifications.show({
        title: 'Delete failed',
        message: 'Please try again.',
        color: 'red'
      });
    }
  };

  return (
    <Card padding="lg" radius="md" withBorder mb="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group gap="sm">
            <Avatar color="socialIndigo" radius="xl">{author?.[0] || 'U'}</Avatar>
            <div>
              <Text fw={500} size="sm">{author || "Anonymous"}</Text>
              <Text size="xs" c="dimmed">{timestamp?.toDate().toLocaleString() || "Just now"}</Text>
            </div>
          </Group>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item color="orange">Edit Post</Menu.Item>
              {canDelete && <Menu.Item color="red" onClick={handleDelete}>Delete Post</Menu.Item>}
              <Menu.Item color="red">Report Post</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>

      {imageUrl && (
        <Card.Section>
          <img src={imageUrl} alt="Post image" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.375rem' }} />
        </Card.Section>
      )}

      <Text size="sm" py="md">
        {content}
      </Text>

      <Card.Section inheritPadding py="xs">
        <Group mt="sm" gap="xs">
          <Button 
            variant="light" 
            color="socialOrange"
            leftSection={<IconHeart size="1rem" fill={userLikesCount > 0 ? 'currentColor' : 'none'} />}
            onClick={toggleLike}
            radius="xl"
            size="compact-sm"
          >
            {userLikesCount} Likes
          </Button>
          <Tooltip label={`${comments.length} comments`}>
            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
              <IconMessageCircle size="1.2rem" />
            </ActionIcon>
          </Tooltip>
          <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
            <IconShare size="1.2rem" />
          </ActionIcon>
        </Group>
      </Card.Section>
    </Card>
  );
}
