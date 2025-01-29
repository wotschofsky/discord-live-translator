import { PostHog } from 'posthog-node';

import env from '../env';

const client = env.POSTHOG_API_KEY
  ? new PostHog(env.POSTHOG_API_KEY, {
      host: env.POSTHOG_HOST
    })
  : null;

export const trackEvent = (
  source: { userId: string; guildId: string },
  event: { name: string; properties: Record<string, any> }
) => {
  if (!client) return;

  client.capture({
    distinctId: source.userId,
    groups: { guild: source.guildId },
    event: event.name,
    properties: event.properties,
    disableGeoip: true
  });
};

export const flushEvents = () => {
  if (!client) return;

  client.shutdown();
};
