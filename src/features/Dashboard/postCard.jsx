import { Card, Text, Group, Avatar, Button, ActionIcon, Menu, rem, Tooltip, Textarea, Collapse } from '@mantine/core';
import { IconHeart, IconMessageCircle, IconShare, IconDots, IconTrash, IconSend } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, setDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { notifications } from '@mantine/notifications';

export default function PostCard({ post, canDelete }) {
  const [userLikesCount, setUserLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const { user } = useAuth();
  
  const { authorName, author, content, timestamp, imageUrl, id, authorId, hashtags } = post;
  const authorLabel = authorName || author || 'Anonymous';
  const timestampLabel = timestamp?.toDate
    ? timestamp.toDate().toLocaleString()
    : typeof timestamp === 'string'
      ? timestamp
      : 'Just now';

  useEffect(() => {
    if (!user?.uid || !authorId) return;
    
    // Check if user is following this author
    const followRef = doc(db, `users/${user.uid}/following/${authorId}`);
    const unsubscribe = onSnapshot(followRef, (snap) => {
      setIsFollowing(snap.exists());
    });
    return unsubscribe;
  }, [user?.uid, authorId]);

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

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setCommenting(true);
    try {
      await addDoc(collection(db, `posts/${id}/comments`), {
        authorId: user.uid,
        authorName: user.displayName || user.email.split('@')[0],
        content: newComment,
        timestamp: serverTimestamp(),
      });
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      notifications.show({
        title: 'Comment failed',
        message: 'Please try again.',
        color: 'red'
      });
    } finally {
      setCommenting(false);
    }
  };

  const handleFollow = async () => {
    if (user?.uid === authorId) return; // Can't follow yourself
    setFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await deleteDoc(doc(db, `users/${user.uid}/following/${authorId}`));
        await updateDoc(doc(db, `users/${authorId}`), {
          followersCount: (post.followersCount || 0) - 1
        });
      } else {
        // Follow
        await setDoc(doc(db, `users/${user.uid}/following/${authorId}`), { followedAt: serverTimestamp() });
        await updateDoc(doc(db, `users/${authorId}`), {
          followersCount: (post.followersCount || 0) + 1
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Follow failed',
        message: 'Please try again.',
        color: 'red'
      });
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <Card padding="lg" radius="md" withBorder mb="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Group gap="sm">
            <Avatar color="socialIndigo" radius="xl">{authorLabel?.[0] || 'U'}</Avatar>
            <div>
              <Text fw={500} size="sm">{authorLabel}</Text>
              <Text size="xs" c="dimmed">{timestampLabel}</Text>
            </div>
          </Group>
          <Group>
            {user?.uid !== authorId && (
              <Button
                size="xs"
                variant={isFollowing ? "default" : "filled"}
                color="blue"
                onClick={handleFollow}
                loading={followLoading}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
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

      {hashtags && hashtags.length > 0 && (
        <Group gap="xs" py="sm">
          {hashtags.map((tag) => (
            <Button key={tag} size="xs" variant="light" color="cyan">
              {tag}
            </Button>
          ))}
        </Group>
      )}

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
            <ActionIcon variant="subtle" color="gray" radius="xl" size="lg" onClick={() => setShowComments(!showComments)}>
              <IconMessageCircle size="1.2rem" />
            </ActionIcon>
          </Tooltip>
          <ActionIcon variant="subtle" color="gray" radius="xl" size="lg">
            <IconShare size="1.2rem" />
          </ActionIcon>
        </Group>
      </Card.Section>

      <Collapse in={showComments || undefined}>
        <Card.Section inheritPadding py="xs">
          {comments.map((comment) => (
            <div key={comment.id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <Group gap="xs" align="flex-start">
                <Avatar size="sm" color="blue">{comment.authorName?.[0] || 'U'}</Avatar>
                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>{comment.authorName || 'Anonymous'}</Text>
                  <Text size="sm">{comment.content}</Text>
                  <Text size="xs" c="dimmed">
                    {comment.timestamp?.toDate?.()?.toLocaleString() || 'Just now'}
                  </Text>
                </div>
              </Group>
            </div>
          ))}
          <Group mt="sm">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.currentTarget.value)}
              size="xs"
              minRows={1}
              style={{ flex: 1 }}
            />
            <ActionIcon
              onClick={handleComment}
              loading={commenting}
              disabled={!newComment.trim()}
              color="blue"
              variant="filled"
            >
              <IconSend size="1rem" />
            </ActionIcon>
          </Group>
        </Card.Section>
      </Collapse>
    </Card>
  );
}
