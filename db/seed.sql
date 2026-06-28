-- Seed data for Midtune D1 database
-- Insert the initial demo tracks.

INSERT OR IGNORE INTO tracks (id, title, author, release_date, bpm, duration, duration_sec, moods, tuning, audio_url, downloads) VALUES
  ('drowning-in-my-own-wave', 'drowning in my own wave', 'L RMN', '2024-08-27', 92, '3:42', 222, '["melancholy","nostalgic"]', 'G', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 1248),
  ('kitchen-light-at-2am', 'kitchen light at 2am', 'L RMN', '2024-06-14', 78, '2:58', 178, '["quiet","lonely"]', 'C', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 892),
  ('porch-letters', 'porch letters', 'L RMN', '2023-09-03', 104, '4:11', 251, '["bittersweet","warm"]', 'E', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 2103),
  ('blue-hour-on-the-overpass', 'blue hour on the overpass', 'L RMN', '2023-04-18', 84, '5:03', 303, '["dreamy","melancholy"]', 'D', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 651),
  ('grocery-store-parking-lot', 'grocery store parking lot', 'L RMN', '2022-11-22', 96, '3:21', 201, '["nostalgic","lonely"]', 'E', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 1577),
  ('yearbook-photo', 'yearbook photo', 'L RMN', '2022-05-09', 132, '2:44', 164, '["bittersweet","energetic"]', 'A', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 988),
  ('screen-door-summer', 'screen door summer', 'L RMN', '2021-07-30', 72, '4:48', 288, '["warm","dreamy"]', 'G', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 432),
  ('first-snow-no-jacket', 'first snow, no jacket', 'L RMN', '2021-01-12', 88, '3:30', 210, '["melancholy","cold"]', 'D', 'https://files.listune.app/drowning%20in%20my%20own%20wave.wav', 1820);
