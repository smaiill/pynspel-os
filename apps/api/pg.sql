DROP TABLE IF EXISTS guilds_subscriptions; DROP TABLE panel_interactions; DROP TABLE panels; DROP TABLE users; DROP TABLE guild_modules; DROP TABLE guilds; DROP TABLE modules; DROP TABLE IF EXISTS sessions;

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  discord_id VARCHAR(255) NOT NULL UNIQUE,
  avatar VARCHAR(255) DEFAULT NULL,
  username VARCHAR(255) NOT NULL,
  discriminator VARCHAR(255) NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  customer_id VARCHAR(255) NULL
);


CREATE TABLE public.guilds (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  bot BOOL NOT NULL DEFAULT false,
  plan VARCHAR(255) NOT NULL DEFAULT 'free',
  owner VARCHAR(50) NOT NULL
);

CREATE INDEX idx_guilds_guildid ON guilds(guild_id);

CREATE TABLE public.modules (
  module_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  active BOOL NOT NULL DEFAULT false
);

CREATE INDEX idx_modules_name ON modules(name);

CREATE TABLE public.guild_modules (
  guild_id VARCHAR(255),
  module_id INT,
  is_active BOOL NOT NULL DEFAULT false,
  config JSONB NULL,
  FOREIGN KEY (guild_id) REFERENCES public.guilds(guild_id),
  FOREIGN KEY (module_id) REFERENCES public.modules(module_id)
);

CREATE TABLE public.guilds_subscriptions (
  id SERIAL PRIMARY KEY,
  guild_id VARCHAR(255),
  subscription_id VARCHAR(255) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NULL,
  cancel_at_period_end BOOL NOT NULL DEFAULT false,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  FOREIGN KEY (guild_id) REFERENCES public.guilds(guild_id)
);

CREATE TABLE public.panels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NULL,
  guild_id VARCHAR(255),
  message VARCHAR(255) NULL,
  channel_id VARCHAR(255) NULL,
  FOREIGN KEY (guild_id) REFERENCES public.guilds(guild_id)
);

CREATE TABLE public.panel_interactions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NULL,
  parent_id VARCHAR(50) NULL,
  panel_id INT NULL,
  emoji VARCHAR(100) NULL,
  style INT2 NULL,
  FOREIGN KEY (panel_id) REFERENCES public.panels(id)
);

CREATE TABLE public.sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  data JSONB DEFAULT NULL
);


