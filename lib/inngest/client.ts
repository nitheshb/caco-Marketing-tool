import { EventSchemas, Inngest } from "inngest";

// Create a new client, providing a unique name identifier.
// This is used to route events to the correct app within the Inngest UI.
export const inngest = new Inngest({
  id: "agent-elephant-automation",
  schemas: new EventSchemas().fromRecord<{
    "social.post.scheduled": {
      data: {
        eventId: string;
      };
    };
  }>(),
});
