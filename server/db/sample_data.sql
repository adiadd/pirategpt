-- Sample data for the PirateGPT chat database

-- Insert sample users
INSERT INTO users (id, username, email, preferences) 
VALUES 
  ('user_1', 'luffy_fan', 'luffy@example.com', '{"theme":"dark","notifications":true}'),
  ('user_2', 'zoro_lover', 'zoro@example.com', '{"theme":"light","notifications":false}'),
  ('user_3', 'sanji_cook', 'sanji@example.com', '{"theme":"dark","notifications":true}');

-- Insert sample conversations
INSERT INTO conversations (id, user_id, title, created_at, updated_at) 
VALUES 
  ('conv_1', 'user_1', 'One Piece Timeline Questions', unixepoch('2023-12-01'), unixepoch('2023-12-01')),
  ('conv_2', 'user_1', 'Devil Fruit Powers', unixepoch('2023-12-05'), unixepoch('2023-12-05')),
  ('conv_3', 'user_2', 'Zoro''s Swords History', unixepoch('2023-12-10'), unixepoch('2023-12-10'));

-- Insert sample messages
INSERT INTO messages (id, conversation_id, role, content, created_at, vector_search_query, chapters_referenced) 
VALUES 
  ('msg_1', 'conv_1', 'user', 'When did Luffy first use Gear 2?', unixepoch('2023-12-01 10:00:00'), 'Luffy Gear 2 first appearance', '[348, 349]'),
  ('msg_2', 'conv_1', 'assistant', 'Luffy first used Gear Second in Chapter 348 during the Enies Lobby arc against Blueno. He revealed this technique after realizing the CP9 agents were too strong for his normal abilities.', unixepoch('2023-12-01 10:00:05'), NULL, '[348, 349]'),
  
  ('msg_3', 'conv_1', 'user', 'What about Gear 3?', unixepoch('2023-12-01 10:01:30'), 'Luffy Gear 3 first appearance', '[403, 404]'),
  ('msg_4', 'conv_1', 'assistant', 'Luffy first used Gear Third in Chapter 403 during his fight with Rob Lucci at Enies Lobby. He inflates his bones to increase his attacking power at the cost of mobility.', unixepoch('2023-12-01 10:01:35'), NULL, '[403, 404]'),
  
  ('msg_5', 'conv_2', 'user', 'How many types of Devil Fruits exist?', unixepoch('2023-12-05 15:30:00'), 'Devil Fruit types', '[385, 440]'),
  ('msg_6', 'conv_2', 'assistant', 'There are three main types of Devil Fruits in One Piece: Paramecia (which give the user superhuman physical abilities), Zoan (which allow the user to transform into an animal), and Logia (which allow the user to create, control, and transform into a natural element).', unixepoch('2023-12-05 15:30:05'), NULL, '[385, 440]'),
  
  ('msg_7', 'conv_3', 'user', 'Tell me about Zoro''s three swords', unixepoch('2023-12-10 18:00:00'), 'Zoro three swords names history', '[97, 650]'),
  ('msg_8', 'conv_3', 'assistant', 'Zoro''s three swords have changed throughout the series. Currently, he wields: 1) Wado Ichimonji - his first named sword that belonged to Kuina, 2) Sandai Kitetsu - a cursed blade he acquired in Loguetown, and 3) Enma - a blade that once belonged to Kozuki Oden, which he received in Wano in exchange for Shusui.', unixepoch('2023-12-10 18:00:05'), NULL, '[97, 650, 954]');

-- Insert sample manga references
INSERT INTO manga_references (id, message_id, chapter_id, relevance_score, content_snippet, created_at)
VALUES
  ('ref_1', 'msg_2', '348', 0.92, 'Luffy: "Gear Second!" The steam begins to rise from his body as he prepares to fight Blueno.', unixepoch('2023-12-01 10:00:05')),
  ('ref_2', 'msg_2', '349', 0.85, 'Luffy explains that he developed Gear Second by observing CP9''s Soru technique.', unixepoch('2023-12-01 10:00:05')),
  
  ('ref_3', 'msg_4', '403', 0.91, 'Luffy demonstrates Gear Third for the first time: "Gear Third! Bone Balloon!"', unixepoch('2023-12-01 10:01:35')),
  ('ref_4', 'msg_4', '404', 0.87, 'Luffy uses Gear Third''s giant fist to attack Rob Lucci.', unixepoch('2023-12-01 10:01:35')),
  
  ('ref_5', 'msg_6', '385', 0.74, 'Explanation of Devil Fruit types during the Enies Lobby arc.', unixepoch('2023-12-05 15:30:05')),
  ('ref_6', 'msg_6', '440', 0.78, 'Further explanation about Devil Fruits when discussing Blackbeard''s unusual abilities.', unixepoch('2023-12-05 15:30:05')),
  
  ('ref_7', 'msg_8', '97', 0.68, 'Zoro obtains Sandai Kitetsu and Yubashiri in Loguetown.', unixepoch('2023-12-10 18:00:05')),
  ('ref_8', 'msg_8', '650', 0.79, 'References to Shusui, which Zoro acquired on Thriller Bark.', unixepoch('2023-12-10 18:00:05')),
  ('ref_9', 'msg_8', '954', 0.95, 'Zoro exchanges Shusui for Enma in Wano Country.', unixepoch('2023-12-10 18:00:05')); 