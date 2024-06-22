DROP TABLE IF EXISTS guilds_subscriptions;

DROP TABLE panel_interactions;

DROP TABLE panels;

DROP TABLE users;

DROP TABLE guild_modules;

DROP TABLE guilds;

DROP TABLE modules;

DROP TABLE IF EXISTS sessions;

CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE
  public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    discord_id VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(255) DEFAULT NULL,
    username VARCHAR(255) NOT NULL,
    discriminator VARCHAR(255) NOT NULL,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NULL,
    created_at timestamp
    with
      time zone NOT NULL DEFAULT now (),
      updated_at timestamp
    with
      time zone NOT NULL DEFAULT now ()
  );

CREATE TRIGGER update_timestamp BEFORE
UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

CREATE TABLE
  public.guilds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    guild_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    bot BOOL NOT NULL DEFAULT false,
    plan VARCHAR(255) NOT NULL DEFAULT 'free',
    owner VARCHAR(50) NOT NULL,
    created_at timestamp
    with
      time zone NOT NULL DEFAULT now (),
      updated_at timestamp
    with
      time zone NOT NULL DEFAULT now ()
  );

CREATE TRIGGER update_timestamp BEFORE
UPDATE ON guilds FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

CREATE INDEX idx_guilds_guildid ON guilds (guild_id);

CREATE TABLE
  public.modules (
    module_id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    active BOOL NOT NULL DEFAULT false
  );

CREATE INDEX idx_modules_name ON modules (name);

CREATE TABLE
  public.guild_modules (
    guild_id VARCHAR(255),
    module_id UUID,
    is_active BOOL NOT NULL DEFAULT false,
    config JSONB NULL,
    FOREIGN KEY (guild_id) REFERENCES public.guilds (guild_id),
    FOREIGN KEY (module_id) REFERENCES public.modules (module_id)
  );

CREATE TABLE
  public.guilds_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    guild_id VARCHAR(255),
    subscription_id VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NULL,
    cancel_at_period_end BOOL NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    FOREIGN KEY (guild_id) REFERENCES public.guilds (guild_id),
    created_at timestamp
    with
      time zone NOT NULL DEFAULT now (),
      updated_at timestamp
    with
      time zone NOT NULL DEFAULT now ()
  );

CREATE TRIGGER update_timestamp BEFORE
UPDATE ON guilds_subscriptions FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

CREATE TABLE
  public.panels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(50) NULL,
    guild_id VARCHAR(255),
    message VARCHAR(255) NULL,
    channel_id VARCHAR(255) NULL,
    FOREIGN KEY (guild_id) REFERENCES public.guilds (guild_id)
  );

CREATE TABLE
  public.panel_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(50) NULL,
    parent_id VARCHAR(50) NULL,
    panel_id UUID NULL,
    emoji VARCHAR(100) NULL,
    style INT2 NULL,
    FOREIGN KEY (panel_id) REFERENCES public.panels (id)
  );

CREATE TABLE
  public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    session_id VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    data JSONB DEFAULT NULL,
    created_at timestamp
    with
      time zone NOT NULL DEFAULT now (),
      updated_at timestamp
    with
      time zone NOT NULL DEFAULT now ()
  );

CREATE TRIGGER update_timestamp BEFORE
UPDATE ON sessions FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);

CREATE TABLE
  public.pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    allow_multiple BOOLEAN NOT NULL DEFAULT false,
    end_at timestamp DEFAULT NULL,
    guild_id VARCHAR(255),
    choices VARCHAR(100)[] NOT NULL DEFAULT ARRAY[]::VARCHAR[],
    message_id VARCHAR(100) DEFAULT NULL,
    channel_id VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (guild_id) REFERENCES public.guilds (guild_id),
    created_at timestamp
    with
      time zone NOT NULL DEFAULT now (),
      updated_at timestamp
    with
      time zone NOT NULL DEFAULT now ()
  );

CREATE TRIGGER update_timestamp BEFORE
UPDATE ON pools FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);


CREATE TABLE public.pools_voters (
  user_id VARCHAR(100) NOT NULL,
  pool_id UUID NOT NULL,
  choice VARCHAR(255)[] NOT NULL,

  FOREIGN KEY (pool_id) REFERENCES public.pools (id) ON DELETE CASCADE
);


INSERT INTO
  public.modules (name, active)
VALUES
  ('bot', false),
  ('captcha', true),
  ('logging', true),
  ('ticket', true),
  ('command', true),
  ('scanner', true),
  ('counterRaid', true);