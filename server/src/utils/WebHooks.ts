import { Request, Response } from "express";
import { Webhook } from "svix";
import { User } from "../models/Users.model";

interface WebhookEvent {
  data: {
    id: string;
    first_name: string;
    last_name: string;
  };
  type: string;
}

export async function Webhooks(req: Request, res: Response) {
  try {
    const payloadString = req.body.toString();
    const svixHeaders = {
      "webhook-id": req.headers["webhook-id"] as string,
      "webhook-timestamp": req.headers["webhook-timestamp"] as string,
      "webhook-signature": req.headers["webhook-signature"] as string,
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY!);
    const evt: WebhookEvent = wh.verify(
      payloadString,
      svixHeaders
    ) as WebhookEvent;
    const { id, ...attributes } = evt.data;
    // Handle the webhooks
    const eventType = evt.type;
    if (eventType === "user.created") {
      console.log(`User ${id} was ${eventType}`);

      const firstName = attributes.first_name;
      const lastName = attributes.last_name;

      const user = new User({
        clerkUserId: id,
        firstName: firstName,
        lastName: lastName,
      });

      await user.save();
      console.log("User saved to database");
    }
    res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
