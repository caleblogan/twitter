CREATE TABLE IF NOT EXISTS Users (
  id VARCHAR(36) PRIMARY KEY,
  name  TEXT NOT NULL,
  username VARCHAR(20) NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Posts (
  id VARCHAR(36) PRIMARY KEY,
  text VARCHAR(140) NOT NULL,
  user_id VARCHAR(36) REFERENCES Users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Comments (
  id VARCHAR(36) PRIMARY KEY,
  text VARCHAR(140) NOT NULL,
  post_id VARCHAR(36) REFERENCES Posts(id) NOT NULL,
  parent_comment_id VARCHAR(36) REFERENCES Comments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Posts_Likes (
  user_id VARCHAR(36) REFERENCES Users(id) NOT NULL,
  post_id VARCHAR(36) REFERENCES Posts(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS Comments_Likes (
  user_id VARCHAR(36) REFERENCES Users(id) NOT NULL,
  comment_id VARCHAR(36) REFERENCES Comments(id) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (user_id, comment_id)
);


CREATE TABLE IF NOT EXISTS Retweets (
  post_id VARCHAR(36) REFERENCES Posts(id) ON DELETE CASCADE,
  user_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (post_id, user_id)
);
CREATE INDEX "idx_retweets_post_id" ON Retweets(post_id);
CREATE INDEX "idx_retweets_user_id" ON Retweets(user_id);

CREATE TABLE IF NOT EXISTS Followers (
  follower_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
  followee_id VARCHAR(36) REFERENCES Users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Primary Key (follower_id, followee_id)
);
CREATE INDEX "idx_followers_follower_id" ON Followers(follower_id);
CREATE INDEX "idx_followers_followee_id" ON Followers(followee_id);

/* PG Session Middleware */
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");
/* End PG Session Middleware */