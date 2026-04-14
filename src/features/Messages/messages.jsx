import { useState, useEffect } from 'react';
import { Container, Title, Stack, Group, TextInput, Button, Card, Text, Avatar, ScrollArea, Textarea, ActionIcon, Center, Loader } from '@mantine/core';
import { IconSearch, IconSend, IconPlus } from '@tabler/icons-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { notifications } from '@mantine/notifications';

export default function Messages() {
  const [allUsers, setAllUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load all users for quick messaging
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== user.uid); // Exclude self
      setAllUsers(users);
      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  // Load messages for selected user
  useEffect(() => {
    if (!selectedUser?.id || !user?.uid) return;

    // Create a deterministic conversation ID
    const conversationId = [user.uid, selectedUser.id].sort().join('_');

    const messagesQuery = query(
      collection(db, 'messages', conversationId, 'chats'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [selectedUser?.id, user?.uid]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    setSendingMessage(true);

    try {
      // Create a deterministic conversation ID
      const conversationId = [user.uid, selectedUser.id].sort().join('_');

      await addDoc(collection(db, 'messages', conversationId, 'chats'), {
        senderId: user.uid,
        senderName: user.displayName || user.email.split('@')[0],
        recipientId: selectedUser.id,
        content: newMessage,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Send message error:', error);
      notifications.show({
        title: 'Failed to send',
        message: error.message,
        color: 'red'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredUsers = allUsers.filter(u =>
    u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <Center mt="xl">
          <Loader />
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group grow align="flex-start" style={{ minHeight: '70vh' }}>
        {/* Users List */}
        <Stack gap="md" style={{ maxWidth: '300px', borderRight: '1px solid #ddd', paddingRight: '12px' }}>
          <Title order={3}>Messages</Title>
          <TextInput
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            leftSection={<IconSearch size="1rem" />}
          />

          {filteredUsers.length === 0 ? (
            <Text c="dimmed" size="sm">No users found</Text>
          ) : (
            <Stack gap="sm">
              {filteredUsers.map((u) => (
                <Card
                  key={u.id}
                  padding="sm"
                  onClick={() => setSelectedUser(u)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedUser?.id === u.id ? '#e7f5ff' : '#fff',
                    border: selectedUser?.id === u.id ? '2px solid #339af0' : '1px solid #ddd'
                  }}
                >
                  <Group gap="sm">
                    <Avatar color="blue" radius="xl">{u.displayName?.[0] || 'U'}</Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>{u.displayName || u.email}</Text>
                      <Text size="xs" c="dimmed">{u.email}</Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>

        {/* Chat Area */}
        {selectedUser ? (
          <Stack gap="md" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Title order={3}>{selectedUser.displayName || selectedUser.email}</Title>

            <ScrollArea style={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', padding: '12px', minHeight: '400px' }}>
              {messages.length === 0 ? (
                <Center style={{ height: '100%' }}>
                  <Text c="dimmed">No messages yet. Start the conversation!</Text>
                </Center>
              ) : (
                <Stack gap="md">
                  {messages.map((msg) => (
                    <Group key={msg.id} justify={msg.senderId === user.uid ? 'flex-end' : 'flex-start'}>
                      <Card
                        padding="sm"
                        style={{
                          maxWidth: '70%',
                          backgroundColor: msg.senderId === user.uid ? '#339af0' : '#f1f3f5',
                          color: msg.senderId === user.uid ? '#fff' : '#000'
                        }}
                      >
                        <Text size="sm">{msg.content}</Text>
                        <Text size="xs" c={msg.senderId === user.uid ? 'rgba(255,255,255,0.7)' : 'dimmed'}>
                          {msg.timestamp?.toDate?.()?.toLocaleTimeString() || 'Sending...'}
                        </Text>
                      </Card>
                    </Group>
                  ))}
                </Stack>
              )}
            </ScrollArea>

            <Group>
              <Textarea
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                minRows={2}
                style={{ flex: 1 }}
              />
              <ActionIcon
                color="blue"
                variant="filled"
                size="lg"
                onClick={handleSendMessage}
                loading={sendingMessage}
              >
                <IconSend size="1.2rem" />
              </ActionIcon>
            </Group>
          </Stack>
        ) : (
          <Container style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text c="dimmed">Select a user to start messaging</Text>
          </Container>
        )}
      </Group>
    </Container>
  );
}
