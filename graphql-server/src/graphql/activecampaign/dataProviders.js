import IsEmail from "isemail";
import { UserInputError, ApolloError } from "apollo-server";

export const subscribe = async (context, contactEmail) => {
  try {
    if (!IsEmail.validate(contactEmail)) {
      throw new context.activeCampaign.InvalidEmail();
    }
    return await context.activeCampaign.subscribe(contactEmail);
  } catch (err) {
    if (err instanceof context.activeCampaign.InvalidEmail) {
      throw new UserInputError("Invalid email", {
        email: contactEmail
      });
    } else {
      throw new ApolloError("Subscription failed", "SUBSCRIPTION_FAILED");
    }
  }
};
